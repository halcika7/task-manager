import { decodeJwt } from 'jose';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { SESSION_SECRET_KEY } from '@/shared/constants';
import { httpClient } from '@/shared/lib/http-client';

interface LoginResponse {
  id: string;
  email: string;
  name: string | null;
  accessToken: string;
  refreshToken: string;
  role: string;
}

export default {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', optional: true },
        password: { label: 'Password', type: 'password', optional: true },
        token: { label: 'Token', type: 'text', optional: true },
        refresh_token: { label: 'Refresh Token', type: 'text', optional: true },
        user: { label: 'User', type: 'text', optional: true },
      },
      async authorize(credentials) {
        // Handle Google OAuth callback data
        if (
          credentials?.token &&
          credentials?.refresh_token &&
          credentials?.user
        ) {
          const userData =
            typeof credentials.user === 'string'
              ? JSON.parse(credentials.user)
              : credentials.user;

          return {
            ...userData,
            token: credentials.token,
            refresh_token: credentials.refresh_token,
          };
        }

        // Handle regular credentials login
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await httpClient.post<LoginResponse>('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          if (!response.data) return null;

          const { accessToken, refreshToken, ...userData } = response.data;

          return {
            ...userData,
            token: accessToken,
            refresh_token: refreshToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (!user && token) {
        const decodedToken = decodeJwt((token as Record<string, string>).token);

        if (!decodedToken || !decodedToken.exp) {
          token.user = null;
          token.error = 'RefreshTokenError';

          return token;
        }

        const tokenExpiration = decodedToken.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExp = tokenExpiration - currentTime;

        // Refresh if token has less than 5 minutes left
        if (timeUntilExp < 500 && token?.refresh_token) {
          const response = await httpClient.refreshToken(
            token.refresh_token as string,
            false
          );
          if (!response?.accessToken) {
            token.user = null;
            token.error = 'RefreshTokenError';

            return token;
          }

          token.token = response.accessToken;
          token.refresh_token = response.refreshToken;

          if (token.user) {
            (token.user as Record<string, string>).token = response.accessToken;
            (token.user as Record<string, string>).refresh_token =
              response.refreshToken;
          } else {
            token.user = {
              token: response.accessToken,
              refresh_token: response.refreshToken,
              role: token.role,
              id: token.sub,
              email: token.email,
              name: token.name,
            };
          }

          return token;
        }
      }

      if (user) {
        token.token = user.token;
        token.refresh_token = user.refresh_token;
        token.role = user.role;
        token.user = user;
      }

      token.token =
        (token.user as Record<string, string>)?.token || token.token;
      token.refresh_token =
        (token.user as Record<string, string>)?.refresh_token ||
        token.refresh_token;

      return token;
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token.user as any;
      session.token = token.token as string;
      session.refresh_token = token.refresh_token as string;
      session.error = token.error as string | undefined;

      return session;
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: SESSION_SECRET_KEY,
} satisfies NextAuthConfig;

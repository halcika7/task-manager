import type { User as DefaultUser } from 'next-auth';
declare module 'next-auth' {
  interface AdapterUser {
    id?: string | number;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified?: boolean;
    role?: string;
  }

  interface User {
    token: string;
    refresh_token: string;
    user: AdapterUser;
    emailVerified?: boolean;
    role?: string;
  }

  interface DefaultSession {
    user?: AdapterUser & DefaultUser;
    expires: ISODateString;
  }

  interface Session extends DefaultSession {
    token: string;
    refresh_token: string;
    error?: string;
  }

  interface JWT {
    token: string;
    refresh_token?: string;
    error?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    token: string;
    refresh_token?: string;
    error?: string;
    role?: string;
  }
}

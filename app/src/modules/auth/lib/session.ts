'use server';

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';
import type { User } from '@/modules/users/types/user.type';
import { SESSION_SECRET_KEY } from '@/shared/constants';

export type Session = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

const secretKey = SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionObject = {
  httpOnly: boolean;
  secure: boolean;
  expires: Date;
  sameSite: 'lax' | 'none' | 'strict';
  path: string;
  session: string;
};

export async function getSessionObject(
  payload: Session
): Promise<SessionObject> {
  const expiredAt = new Date(Date.now() + 15 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10min')
    .sign(encodedKey);

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiredAt,
    sameSite: 'lax',
    path: '/',
    session,
  };
}

export async function createSession(payload: Session) {
  const { session, ...rest } = await getSessionObject(payload);

  const cookieStore = await cookies();

  cookieStore.set('session', session, rest);

  return {
    session,
    ...rest,
  };
}

export async function getSession(withRedirect = true) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;

  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify<Session>(cookie, encodedKey, {
      algorithms: ['HS256'],
    });

    return payload;
  } catch {
    if (withRedirect) redirect('/auth/login');
    return null;
  }
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: Omit<Session, 'user'>) {
  const cookieStore = await cookies();

  if (!accessToken || !refreshToken) {
    cookieStore.set('session', '', { maxAge: 0 });
    return null;
  }

  const cookie = cookieStore.get('session')?.value;

  if (!cookie) return null;

  const { payload } = await jwtVerify<Session>(cookie, encodedKey);

  if (!payload) throw new Error('Session not found');

  // Create a new session with updated tokens
  const { session, ...sessionOptions } = await getSessionObject({
    user: payload.user,
    accessToken,
    refreshToken,
  });

  // Set the cookie directly
  cookieStore.set('session', session, sessionOptions);

  return {
    user: payload.user,
    accessToken,
    refreshToken,
  };
}

export async function shouldRefreshToken() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;

  if (!cookie) {
    return {
      isLoggedIn: false,
      shouldRefresh: false,
    };
  }

  const { payload } = await jwtVerify<Session>(cookie, encodedKey, {
    algorithms: ['HS256'],
  });

  const currentTime = new Date();
  const expiredAt = new Date((payload.exp || 0) * 1000);

  const timeLeft = expiredAt.getTime() - currentTime.getTime();
  const minutesLeft = timeLeft / (1000 * 60);

  return {
    isLoggedIn: true,
    shouldRefresh: minutesLeft < 5,
  };
}

export async function updateSession(user: User) {
  const session = await getSession();

  if (!session) return;

  await createSession({
    user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

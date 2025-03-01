import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSession } from '@/modules/auth/lib/session';
import type { User, UserRole } from '@/modules/users/types/user.type';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const userId = searchParams.get('userId');
  const name = searchParams.get('name');
  const role = searchParams.get('role');

  if (!accessToken || !refreshToken || !userId || !name || !role) {
    throw new Error('Google OAuth Failed!');
  }

  const sessionObject = await createSession({
    user: {
      id: userId,
      name: name,
      role: role as UserRole,
    } as User,
    accessToken,
    refreshToken,
  });

  const rsp = NextResponse.redirect(new URL('/dashboard', req.url));

  if (sessionObject) {
    rsp.cookies.set('session', sessionObject.session, sessionObject);
    rsp.headers.set('Set-Cookie', rsp.cookies.toString());
  }

  return rsp;
}

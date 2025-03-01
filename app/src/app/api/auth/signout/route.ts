import { type NextRequest, NextResponse } from 'next/server';

import { deleteSession } from '@/modules/auth/lib/session';
import type { User } from '@/modules/users/types/user.type';
import { httpClient } from '@/shared/lib/http-client';

export async function POST(_: NextRequest) {
  const rsp = NextResponse.json({ message: 'Logged out' });
  await httpClient.post<User>(`/auth/logout`);
  await deleteSession();

  return rsp;
}

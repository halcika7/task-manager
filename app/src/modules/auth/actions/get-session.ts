'use server';

import { auth } from '@/modules/auth/lib';

export async function getSession() {
  return auth();
}

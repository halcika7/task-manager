'use server';

import { signOut } from '@/modules/auth/lib';
import { httpClient } from '@/shared/lib/http-client';

export async function logoutAction() {
  await signOut();
  await httpClient.post('/auth/logout');
}

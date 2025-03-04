'use server';

import type { Session } from 'next-auth';
import { unstable_update } from '@/modules/auth/lib';

export const updateSession = async (
  data: Partial<Session> | { user: Partial<Session['user']> }
) => {
  await unstable_update(data);
};

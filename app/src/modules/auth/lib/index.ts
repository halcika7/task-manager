import NextAuth from 'next-auth';
import config from '@/modules/auth/lib/config';

export const { handlers, signIn, signOut, auth, unstable_update } =
  NextAuth(config);

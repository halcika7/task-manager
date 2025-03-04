'use server';

import { cookies } from 'next/headers';

import { auth } from '@/modules/auth/lib';
import { config } from '@/modules/i18n/utils/config';
import type { Locale } from '@/modules/i18n/utils/types';
import type { User } from '@/modules/users/types/user.type';

export async function getUserLocale() {
  const session = await auth();
  const cookie = (await cookies()).get(config.localeCookieName);
  return (
    (session?.user as unknown as User)?.locale ??
    cookie?.value ??
    config.defaultLocale
  );
}

export async function setLocaleCookie(locale: Locale) {
  (await cookies()).set(config.localeCookieName, locale);
}

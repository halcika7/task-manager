'use server';

import { cookies } from 'next/headers';

import { getSession } from '@/modules/auth/lib/session';
import { config } from '@/modules/i18n/utils/config';
import type { Locale } from '@/modules/i18n/utils/types';

export async function getUserLocale() {
  const session = await getSession();
  const cookie = (await cookies()).get(config.localeCookieName);
  return session?.user.locale ?? cookie?.value ?? config.defaultLocale;
}

export async function setLocaleCookie(locale: Locale) {
  (await cookies()).set(config.localeCookieName, locale);
}

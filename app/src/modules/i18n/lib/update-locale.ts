'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/modules/auth/lib';
import { setLocaleCookie } from '@/modules/i18n/lib/locale-cookie';
import type { Locale } from '@/modules/i18n/utils/types';
import { httpClient } from '@/shared/lib/http-client';

export async function updateLocale(locale: Locale) {
  const session = await auth();

  if (session?.user) {
    await httpClient.patch('/user/locale', { locale });
  }

  await setLocaleCookie(locale);
  revalidatePath('/', 'layout');
}

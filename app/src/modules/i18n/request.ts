import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '@/modules/i18n/lib/locale-cookie';
import { getMessagesForLocale } from '@/modules/i18n/lib/messages';
import { routing } from '@/modules/i18n/routing';
import type { Locale } from '@/modules/i18n/utils/types';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale) {
    locale = await getUserLocale();
  }

  if (!routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await getMessagesForLocale(locale),
  };
});

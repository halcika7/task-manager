import deepmerge from 'deepmerge';
import { config } from '@/modules/i18n/utils/config';
import type { Messages } from '@/modules/i18n/utils/types';

export const importLocale = async (locale: string): Promise<Messages> => {
  return (await import(`../translations/${locale}.json`)).default as Messages;
};

export const getMessagesForLocale = async (
  locale: string
): Promise<Messages> => {
  const localeMessages = await importLocale(locale);
  if (locale === config.defaultLocale) {
    return localeMessages;
  }
  const defaultLocaleMessages = await importLocale(config.defaultLocale);
  return deepmerge(defaultLocaleMessages, localeMessages);
};

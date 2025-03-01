import { LOCALE_COOKIE_NAME } from '@/shared/constants';

export const config = {
  locales: ['en', 'fr', 'de', 'bs'],
  defaultLocale: 'en',
  localeCookieName: LOCALE_COOKIE_NAME || 'NEXT_LOCALE',
} as const;

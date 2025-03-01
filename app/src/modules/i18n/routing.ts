import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

import { config } from '@/modules/i18n/utils/config';

export const routing = defineRouting({
  locales: config.locales,
  defaultLocale: config.defaultLocale,
  localeCookie: {
    name: config.localeCookieName,
  },
  localePrefix: 'always',
  localeDetection: true,
  pathnames: {
    '/': {
      en: '/',
      bs: '/',
      fr: '/',
      de: '/',
    },
    '/auth/login': {
      en: '/auth/login',
      bs: '/autentifikacija/prijava',
      fr: '/authentification/connexion',
      de: '/authentifizierung/einloggen',
    },
    '/auth/register': {
      en: '/auth/register',
      bs: '/autentifikacija/registracija',
      fr: '/authentification/inscription',
      de: '/authentifizierung/registrierung',
    },
    '/auth/forgot-password': {
      en: '/auth/forgot-password',
      bs: '/autentifikacija/zaboravljena-lozinka',
      fr: '/authentification/mot-de-passe-oublie',
      de: '/authentifizierung/passwort-vergessen',
    },
    '/auth/reset-password': {
      en: '/auth/reset-password',
      bs: '/autentifikacija/reset-lozinka',
      fr: '/authentification/réinitialiser-mot-de-passe',
      de: '/authentifizierung/passwort-zurücksetzen',
    },
    '/dashboard': {
      en: '/dashboard',
      bs: '/kontrolna-ploča',
      fr: '/tableau-de-bord',
      de: '/dashboard',
    },
    '/dashboard/[taskId]': {
      en: '/dashboard/[taskId]',
      bs: '/kontrolna-ploča/[taskId]',
      fr: '/tableau-de-bord/[taskId]',
      de: '/dashboard/[taskId]',
    },
    '/dashboard/users': {
      en: '/dashboard/users',
      bs: '/kontrolna-ploča/korisnici',
      fr: '/tableau-de-bord/utilisateurs',
      de: '/dashboard/benutzer',
    },
    '/dashboard/profile': {
      en: '/dashboard/profile',
      bs: '/kontrolna-ploča/profil',
      fr: '/tableau-de-bord/profil',
      de: '/dashboard/profil',
    },
    '/dashboard/activity-logs': {
      en: '/dashboard/activity-logs',
      bs: '/kontrolna-ploča/aktivnosti',
      fr: '/tableau-de-bord/activités',
      de: '/dashboard/aktivitäten',
    },
  },
});

export const {
  Link: LocaleLink,
  redirect: localeRedirect,
  usePathname: useLocalePathname,
  useRouter: useLocaleRouter,
} = createNavigation(routing);

export type LocaleLinkProps = Parameters<typeof LocaleLink>[0];

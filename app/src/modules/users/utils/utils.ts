import { UserRole } from '@/modules/users/types/user.type';

export const roles = [
  { label: 'users.roles.admin', value: UserRole.ADMIN },
  { label: 'users.roles.user', value: UserRole.USER },
];

export const locales = [
  { label: 'locale.en', value: 'en' },
  { label: 'locale.fr', value: 'fr' },
  { label: 'locale.de', value: 'de' },
  { label: 'locale.bs', value: 'bs' },
];

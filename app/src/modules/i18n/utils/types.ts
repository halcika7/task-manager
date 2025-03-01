import type messages from '@/modules/i18n/translations/en.json';
import type { config } from '@/modules/i18n/utils/config';

export type Messages = typeof messages;

export type Locale = (typeof config)['locales'][number];

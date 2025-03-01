'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { updateLocale } from '@/modules/i18n/lib/update-locale';
import { useLocalePathname, useLocaleRouter } from '@/modules/i18n/routing';
import { config } from '@/modules/i18n/utils/config';
import type { Locale } from '@/modules/i18n/utils/types';
import LocaleSwitchTrigger from '@/shared/components/locale-switch/locale-switch-trigger';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

const { locales } = config;

type Props = Readonly<{
  className?: string;
}>;

export default function LocaleSwitch({ className }: Props) {
  const localeRouter = useLocaleRouter();
  const localePathname = useLocalePathname();
  const currentLocale = useLocale();
  const searchParams = useSearchParams();
  const params = useParams();
  const [value, setValue] = useState<string>(currentLocale);
  const t = useTranslations('locale');

  const handleChange = async (newValue: string) => {
    setValue(newValue);

    await updateLocale(newValue as Locale);

    localeRouter.replace(
      {
        pathname: localePathname,
        params: params as { taskId: string },
        query: Object.fromEntries(searchParams),
      },
      { locale: newValue }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <LocaleSwitchTrigger />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={value} onValueChange={handleChange}>
          {locales.map(locale => {
            return (
              <DropdownMenuRadioItem key={locale} value={locale}>
                {t(locale)}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

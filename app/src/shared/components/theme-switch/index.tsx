'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import ThemeSwitchTrigger from '@/shared/components/theme-switch/theme-switch-trigger';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

type Props = Readonly<{
  className?: string;
}>;

export default function ThemeSwitch({ className }: Props) {
  const { setTheme } = useTheme();
  const t = useTranslations('main.themeSwitch');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <ThemeSwitchTrigger />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          {t('light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          {t('dark')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          {t('system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

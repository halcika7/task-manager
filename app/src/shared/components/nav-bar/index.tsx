'use client';

import dynamic from 'next/dynamic';

import { useTranslations } from 'next-intl';
import { LocaleLink } from '@/modules/i18n/routing';
import type { User } from '@/modules/users/types/user.type';
import LocaleSwitchTrigger from '@/shared/components/locale-switch/locale-switch-trigger';
import MobileNavTrigger from '@/shared/components/nav-bar/mobile-nav/trigger';
import NavWrapper from '@/shared/components/nav-bar/nav-wrapper';
import UserNav from '@/shared/components/nav-bar/user-nav';
import ThemeSwitchTrigger from '@/shared/components/theme-switch/theme-switch-trigger';
import { Button } from '@/shared/components/ui/button';

const MobileNav = dynamic(
  () => import('@/shared/components/nav-bar/mobile-nav'),
  {
    ssr: false,
    loading: () => <MobileNavTrigger />,
  }
);

const LocaleSwitch = dynamic(
  () => import('@/shared/components/locale-switch'),
  {
    ssr: false,
    loading: () => <LocaleSwitchTrigger />,
  }
);

const ThemeSwitch = dynamic(() => import('@/shared/components/theme-switch'), {
  ssr: false,
  loading: () => <ThemeSwitchTrigger />,
});

type Props = Readonly<{
  user?: User | null;
}>;

export default function NavBar({ user }: Props) {
  const t = useTranslations('main.nav');
  return (
    <NavWrapper>
      <div className="flex items-center gap-2">
        <MobileNav user={user} />
        <LocaleLink
          href="/"
          className="text-xl font-bold tracking-tighter md:text-2xl"
        >
          TaskFlow
        </LocaleLink>
      </div>

      <nav className="hidden items-center gap-6 md:flex">
        <LocaleLink
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {t('features')}
        </LocaleLink>
        <LocaleLink
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {t('pricing')}
        </LocaleLink>
        <LocaleLink
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {t('about')}
        </LocaleLink>
        <LocaleLink
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {t('contact')}
        </LocaleLink>
      </nav>

      <div className="flex items-center gap-2">
        <LocaleSwitch />
        <ThemeSwitch />
        {user ? (
          <UserNav user={user} />
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <LocaleLink href="/auth/login">
              <Button variant="ghost" className="w-fit justify-start">
                {t('signIn')}
              </Button>
            </LocaleLink>
            <LocaleLink href="/auth/register">
              <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white transition-all hover:shadow-lg hover:shadow-purple-500/25 dark:from-purple-500 dark:via-pink-500 dark:to-purple-500">
                {t('getStarted')}
              </Button>
            </LocaleLink>
          </div>
        )}
      </div>
    </NavWrapper>
  );
}

'use client';

import { m } from 'motion/react';
import { useTranslations } from 'next-intl';

import type { LocaleLinkProps } from '@/modules/i18n/routing';
import { LocaleLink } from '@/modules/i18n/routing';
import type { User } from '@/modules/users/types/user.type';
import MobileNavTrigger from '@/shared/components/nav-bar/mobile-nav/trigger';
import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { cn } from '@/shared/utils/cn';

const navItems = [
  { href: '#features', label: 'features' },
  { href: '#pricing', label: 'pricing' },
  { href: '#about', label: 'about' },
  { href: '#contact', label: 'contact' },
] as const;

type Props = Readonly<{
  user?: User | null;
}>;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function MobileNav({ user }: Props) {
  const t = useTranslations('main.nav');
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MobileNavTrigger />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-background/80 flex w-full flex-col backdrop-blur-xl sm:max-w-sm"
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-2xl font-bold">{t('menu')}</SheetTitle>
        </SheetHeader>
        <nav className="flex-1 space-y-2">
          <m.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col space-y-2 px-2 pb-4"
          >
            {navItems.map(({ href, label }) => (
              <m.div key={href} variants={item}>
                <SheetClose asChild>
                  <LocaleLink
                    href={href as LocaleLinkProps['href']}
                    className={cn(
                      'group hover:bg-accent flex items-center rounded-lg px-4 py-3 text-lg transition-all',
                      'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className="relative">
                      {t(label)}
                      <span className="bg-foreground absolute -bottom-1 left-0 h-[2px] w-0 transition-all group-hover:w-full" />
                    </span>
                  </LocaleLink>
                </SheetClose>
              </m.div>
            ))}
          </m.div>

          {!user && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-auto space-y-4 border-t px-4 py-6"
            >
              <SheetClose asChild>
                <LocaleLink href="/auth/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-center text-base"
                  >
                    {t('signIn')}
                  </Button>
                </LocaleLink>
              </SheetClose>
              <SheetClose asChild>
                <LocaleLink href="/auth/register" className="block">
                  <Button className="relative w-full justify-center overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-base text-white transition-all before:absolute before:inset-0 before:-z-10 before:translate-y-full before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-pink-600 before:transition-transform hover:shadow-lg hover:shadow-purple-500/25 hover:before:translate-y-0 dark:from-purple-500 dark:via-pink-500 dark:to-purple-500">
                    {t('getStarted')}
                  </Button>
                </LocaleLink>
              </SheetClose>
            </m.div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

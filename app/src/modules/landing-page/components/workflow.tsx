'use client';

import { m } from 'motion/react';
import { useTranslations } from 'next-intl';

import { LocaleLink } from '@/modules/i18n/routing';
import { Button } from '@/shared/components/ui/button';

const items = [
  {
    key: 'taskAnalytics',
    icon: (
      <svg
        className="h-5 w-5 text-purple-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    key: 'teamCollaboration',
    icon: (
      <svg
        className="h-5 w-5 text-pink-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    key: 'customWorkflows',
    icon: (
      <svg
        className="h-5 w-5 text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
];

const textInitial = { opacity: 0, y: 20 };
const textAnimate = { opacity: 1, y: 0 };
const textTransition = { duration: 1 };
const viewport = { once: true, margin: '-100px' };

const buttonTransition = { duration: 0.5, delay: 0.6 };

export default function Workflow() {
  const t = useTranslations('home.cta');
  return (
    <section className="bg-background relative mx-auto flex min-h-[40rem] max-w-5xl items-center justify-center overflow-hidden px-4 py-20">
      <div className="bg-background pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background)))]" />
      <div className="relative z-10 mx-auto w-full">
        <div className="text-center">
          <m.div
            initial={textInitial}
            whileInView={textAnimate}
            transition={textTransition}
            viewport={viewport}
          >
            <h2 className="from-foreground via-foreground/80 to-foreground mx-auto max-w-2xl bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              {t('title')}
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg md:text-xl">
              {t('description')}
            </p>
          </m.div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((feature, idx) => (
            <m.div
              key={feature.key}
              initial={textInitial}
              whileInView={textAnimate}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={viewport}
              className="group border-border from-background to-card dark:from-card dark:to-card/80 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 shadow-lg"
            >
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  {feature.icon}
                  <h3 className="text-foreground text-xl font-semibold">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {t(`features.${feature.key}.description`)}
                </p>
              </div>
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-purple-800/20" />
            </m.div>
          ))}
        </div>

        <m.div
          initial={textInitial}
          whileInView={textAnimate}
          transition={buttonTransition}
          viewport={viewport}
          className="mt-12 flex justify-center"
        >
          <LocaleLink href="/auth/register">
            <Button
              size="lg"
              className="cursor-pointer bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-lg text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 dark:from-purple-500 dark:via-pink-500 dark:to-purple-500"
            >
              {t('getStarted')}
            </Button>
          </LocaleLink>
        </m.div>
      </div>
    </section>
  );
}

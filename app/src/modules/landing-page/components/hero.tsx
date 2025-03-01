'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import { LocaleLink } from '@/modules/i18n/routing';
import { Button } from '@/shared/components/ui/button';

const SparklesCore = dynamic(
  () => import('@/shared/components/ui/sparkles').then(mod => mod.SparklesCore),
  { ssr: false }
);

export default function Hero() {
  const t = useTranslations('home.hero');
  return (
    <section className="bg-background relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="relative z-10 w-full px-4">
        <div className="text-center">
          <h1 className="from-foreground via-foreground/80 to-foreground bg-gradient-to-r bg-clip-text text-6xl font-bold text-transparent sm:text-7xl md:text-8xl lg:text-9xl">
            {t('title')}
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-500 dark:to-purple-400">
              {t('subtitle')}
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center text-lg md:text-xl">
            {t('description')}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="cursor-pointer bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-lg text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 dark:from-purple-500 dark:via-pink-500 dark:to-purple-500"
            >
              <LocaleLink href="/auth/register">{t('getStarted')}</LocaleLink>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-background/80 text-foreground hover:text-foreground cursor-pointer border-2 border-purple-500/50 text-lg backdrop-blur-sm transition-all hover:scale-105 hover:border-purple-500 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <LocaleLink href="/auth/login">{t('signIn')}</LocaleLink>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={40}
          className="h-full w-full"
        />
      </div>
    </section>
  );
}

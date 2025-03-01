'use client';

import { XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useLocaleRouter } from '@/modules/i18n/routing';
import { Button } from '@/shared/components/ui/button';

function NotFound() {
  const router = useLocaleRouter();
  const t = useTranslations('globalError.notFound');

  return (
    <main className="relative container min-h-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed">
            <XCircle className="text-muted-foreground h-10 w-10" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            {t('description')}
          </p>
          <div className="mt-6 flex gap-2">
            <Button onClick={() => router.back()} variant="outline">
              {t('buttonGoBack')}
            </Button>
            <Button
              onClick={() => router.push('/', { scroll: true })}
              variant="default"
            >
              {t('buttonGoHome')}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFound;

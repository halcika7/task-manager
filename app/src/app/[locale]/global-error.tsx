'use client';

import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/shared/components/ui/button';

type Props = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function GlobalError({ error, reset }: Props) {
  const t = useTranslations('globalError.error');
  const locale = useLocale();

  return (
    <html lang={locale}>
      <body className="bg-background">
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
                {error.message}
              </p>
              <div className="mt-6 flex gap-2">
                <Button onClick={() => reset()} variant="outline">
                  {t('buttonTryAgain')}
                </Button>
                <Link href="/" prefetch>
                  <Button variant="default">{t('buttonGoHome')}</Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

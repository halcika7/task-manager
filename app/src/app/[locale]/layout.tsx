import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { config } from '@/modules/i18n/utils/config';
import type { Locale } from '@/modules/i18n/utils/types';

export function generateStaticParams() {
  return config.locales.map(locale => ({ locale }));
}

type Props = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  if (!config.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

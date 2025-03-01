import { getLocale } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';

import { getSession } from '@/modules/auth/lib/session';
import { AuthProvider } from '@/modules/auth/provider/auth.provider';
import { Toaster } from '@/shared/components/ui/sonner';
import FramerProvider from '@/shared/provider/framer.provider';
import { MediaQueryProvider } from '@/shared/provider/media-query.provider';
import ReactQueryProvider from '@/shared/provider/react-query.provider';
import { ThemeProvider } from '@/shared/provider/theme.provider';

import '@/styles/globals.css';

type Props = Readonly<{
  children: ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ReactQueryProvider>
          <MediaQueryProvider>
            <NuqsAdapter>
              <NextTopLoader color="var(--color-primary)" />
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <AuthProvider session={session?.user}>
                  <FramerProvider>{children}</FramerProvider>
                  <Toaster />
                </AuthProvider>
              </ThemeProvider>
            </NuqsAdapter>
          </MediaQueryProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

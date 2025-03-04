import type { Metadata } from 'next';
import { redirect, RedirectType } from 'next/navigation';

import { getTranslations } from 'next-intl/server';
import { ResetPasswordForm } from '@/modules/auth/components/reset-password-form';
import { auth } from '@/modules/auth/lib';
import { LocaleLink } from '@/modules/i18n/routing';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Create a new password for your account',
};

type Props = Readonly<{
  searchParams: Promise<{
    token?: string;
  }>;
}>;

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    redirect('/auth/forgot-password', RedirectType.replace);
  }

  const [session, t] = await Promise.all([auth(), getTranslations()]);

  if (session?.user) {
    redirect('/dashboard', RedirectType.replace);
  }

  return (
    <Card className="mt-28 w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">{t('title')}</CardTitle>
        <CardDescription className="text-center">
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ResetPasswordForm token={token} />
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-2">
        <LocaleLink
          aria-label="Back to login"
          href="/auth/login"
          className="text-primary text-sm underline-offset-4 transition-colors hover:underline"
        >
          {t('back_to_login')}
        </LocaleLink>
      </CardFooter>
    </Card>
  );
}

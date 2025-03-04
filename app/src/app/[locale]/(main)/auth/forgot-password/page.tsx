import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
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

const ForgotPasswordForm = dynamic(() =>
  import('@/modules/auth/components/forgot-password-form').then(
    mod => mod.ForgotPasswordForm
  )
);

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your password',
};

export default async function ForgotPasswordPage() {
  const [session, t] = await Promise.all([
    auth(),
    getTranslations('auth.forgot_password'),
  ]);

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <Card className="mt-28 w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">{t('title')}</CardTitle>
        <CardDescription className="text-center">
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <LocaleLink
          href="/auth/login"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          {t('back_to_login')}
        </LocaleLink>
      </CardFooter>
    </Card>
  );
}

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getTranslations } from 'next-intl/server';
import GoogleLogin from '@/modules/auth/components/google';
import { LoginForm } from '@/modules/auth/components/login-form';
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
  title: 'Login',
  description: 'Login to your account',
};

export default async function LoginPage() {
  const [session, t] = await Promise.all([
    auth(),
    getTranslations('auth.login'),
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
      <CardContent className="grid gap-4">
        <LoginForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              {t('or_continue_with')}
            </span>
          </div>
        </div>
        <GoogleLogin />
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-muted-foreground text-sm">
          <span>{t('dont_have_account')}</span>
          <LocaleLink
            aria-label="Sign up"
            href="/auth/register"
            data-testid="register-link"
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            {t('sign_up')}
          </LocaleLink>
        </div>
        <LocaleLink
          aria-label="Forgot password"
          href="/auth/forgot-password"
          data-testid="forgot-password-link"
          className="text-primary text-sm underline-offset-4 transition-colors hover:underline"
        >
          {t('forgot_password')}
        </LocaleLink>
      </CardFooter>
    </Card>
  );
}

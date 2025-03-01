import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import GoogleLogin from '@/modules/auth/components/google';
import { SignUpForm } from '@/modules/auth/components/sign-up-form';
import { getSession } from '@/modules/auth/lib/session';
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
  title: 'Sign Up',
  description: 'Create a new account',
};

export default async function SignUpPage() {
  const [session, t] = await Promise.all([
    getSession(),
    getTranslations('auth.register'),
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
        <SignUpForm />
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
          <span>{t('already_have_account')}</span>
          <LocaleLink
            aria-label="Sign in"
            href="/auth/login"
            data-testid="login-link"
            className="text-primary transition-colors hover:underline"
          >
            {t('sign_in')}
          </LocaleLink>
        </div>
        <Link
          aria-label="Terms of Service"
          href="/terms"
          className="text-primary text-sm transition-colors hover:underline"
        >
          {t('terms_of_service')}
        </Link>
      </CardFooter>
    </Card>
  );
}

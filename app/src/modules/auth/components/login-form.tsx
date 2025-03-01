'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { loginServerAction } from '@/modules/auth/actions/login/login.action';
import type { LoginSchema } from '@/modules/auth/actions/login/login.schema';
import { loginSchema } from '@/modules/auth/actions/login/login.schema';
import { createSession } from '@/modules/auth/lib/session';
import FormInput from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const router = useRouter();

  const handleSubmit = useCallback(
    (data: LoginSchema) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.set('email', data.email);
        formData.set('password', data.password);
        const result = await loginServerAction(formData);

        if (result.error) {
          form.setError('email', { message: result.error.email?.[0] });
          form.setError('password', { message: result.error.password?.[0] });
          return;
        }

        if (result.message) {
          form.setError('email', { message: result.message });
          return;
        }

        if (result.session) {
          await createSession(result.session);
          router.replace('/dashboard');
        }
      });
    },
    [startTransition, router, form]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormInput
          control={form.control}
          name="email"
          label={t('inputs.email.label')}
          placeholder={t('inputs.email.placeholder')}
          disabled={isPending}
          type="email"
          data-testid="email-input"
          autoComplete="email"
        />
        <FormInput
          control={form.control}
          name="password"
          label={t('inputs.password.label')}
          placeholder={t('inputs.password.placeholder')}
          disabled={isPending}
          type="password"
          data-testid="password-input"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          data-testid="login-button"
        >
          {isPending ? t('signing_in') : t('sign_in')}
        </Button>
      </form>
    </Form>
  );
}

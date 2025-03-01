'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { register } from '@/modules/auth/actions/register/register.action';
import type { RegisterSchema } from '@/modules/auth/actions/register/register.schema';
import { registerSchema } from '@/modules/auth/actions/register/register.schema';
import FormInput from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('auth.register');
  const router = useRouter();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      confirmPassword: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = useCallback(
    (data: RegisterSchema) => {
      startTransition(async () => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });
        const result = await register(formData);

        if (result?.error) {
          Object.entries(result.error).forEach(([key, value]) => {
            form.setError(key as keyof RegisterSchema, {
              message: value?.[0],
            });
          });
          return;
        }

        if (result?.message) {
          const toast = await import('sonner');
          toast.toast.error(t(result.message));
          return;
        }

        router.push('/auth/login');
      });
    },
    [startTransition, form, t, router]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormInput
          control={form.control}
          name="name"
          label={t('inputs.name.label')}
          placeholder={t('inputs.name.placeholder')}
          disabled={isPending}
          data-testid="name-input"
          autoComplete="off"
        />
        <FormInput
          control={form.control}
          name="email"
          label={t('inputs.email.label')}
          placeholder={t('inputs.email.placeholder')}
          disabled={isPending}
          type="email"
          data-testid="email-input"
          autoComplete="off"
        />
        <FormInput
          control={form.control}
          name="password"
          label={t('inputs.password.label')}
          placeholder={t('inputs.password.placeholder')}
          disabled={isPending}
          type="password"
          data-testid="password-input"
          autoComplete="new-password"
        />
        <FormInput
          control={form.control}
          name="confirmPassword"
          label={t('inputs.confirm_password.label')}
          placeholder={t('inputs.confirm_password.placeholder')}
          disabled={isPending}
          type="password"
          data-testid="confirm-password-input"
          autoComplete="new-password"
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          data-testid="register-button"
        >
          {isPending ? t('creating_account') : t('create_account')}
        </Button>
      </form>
    </Form>
  );
}

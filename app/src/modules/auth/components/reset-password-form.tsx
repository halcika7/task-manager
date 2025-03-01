'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';

import { useForm } from 'react-hook-form';
import { resetPassword } from '@/modules/auth/actions/reset-password/reset-password.action';
import type { ResetPasswordSchema } from '@/modules/auth/actions/reset-password/reset-password.schema';
import { resetPasswordSchema } from '@/modules/auth/actions/reset-password/reset-password.schema';
import FormInput from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';

type Props = Readonly<{
  token: string;
}>;

export function ResetPasswordForm({ token }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('auth.reset_password');
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = useCallback(
    (data: ResetPasswordSchema) => {
      startTransition(async () => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });
        const result = await resetPassword(formData);

        if (result.error) {
          Object.entries(result.error).forEach(([key, value]) => {
            form.setError(key as keyof ResetPasswordSchema, {
              message: value?.[0],
            });
          });
          return;
        }

        if (result.message) {
          const toast = await import('sonner');
          toast.toast.error(t(result.message));
          form.reset();
          return;
        }
      });
    },
    [startTransition, form, t]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormInput
          control={form.control}
          name="password"
          label={t('inputs.password.label')}
          placeholder={t('inputs.password.placeholder')}
          disabled={isPending}
          type="password"
          autoComplete="new-password"
        />
        <FormInput
          control={form.control}
          name="confirmPassword"
          label={t('inputs.confirm_password.label')}
          placeholder={t('inputs.confirm_password.placeholder')}
          disabled={isPending}
          type="password"
          autoComplete="new-password"
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('resetting_password') : t('reset_password')}
        </Button>
      </form>
    </Form>
  );
}

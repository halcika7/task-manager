'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { forgotPassword } from '@/modules/auth/actions/forgot-password/forgot-password.action';
import type { ForgotPasswordSchema } from '@/modules/auth/actions/forgot-password/forgot-password.schema';
import { forgotPasswordSchema } from '@/modules/auth/actions/forgot-password/forgot-password.schema';
import FormInput from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgot_password');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = useCallback(
    (data: ForgotPasswordSchema) => {
      startTransition(async () => {
        setIsSuccess(false);
        const formData = new FormData();
        formData.append('email', data.email);
        const result = await forgotPassword(formData);

        if (result?.error) {
          form.setError('email', { message: result.error.email?.[0] });
          return;
        }

        const { message, status } = result;

        if (status === 'success') {
          form.reset();
          setIsSuccess(true);
          return;
        }

        const toast = await import('sonner');
        toast.toast.error(t(message));
      });
    },
    [startTransition, form, t]
  );

  if (isSuccess) {
    return (
      <div className="text-muted-foreground text-center">
        <p>{t('check_email')}</p>
        <p className="mt-2 text-sm">{t('check_spam_folder')}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormInput
          control={form.control}
          name="email"
          label={t('inputs.email.label')}
          placeholder={t('inputs.email.placeholder')}
          disabled={isPending}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('sending_reset_link') : t('send_reset_link')}
        </Button>
      </form>
    </Form>
  );
}

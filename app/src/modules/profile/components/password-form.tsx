'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { updatePassword } from '@/modules/profile/actions/update-password.action';
import { updatePasswordSchema } from '@/modules/profile/actions/update-profile.schema';
import type { UpdatePasswordSchema } from '@/modules/profile/actions/update-profile.schema';
import type { User } from '@/modules/users/types/user.type';
import FormInput from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui/button';
import { CardFooter } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';

type Props = Readonly<{
  user: User;
}>;

export function PasswordForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('profile');
  const form = useForm<UpdatePasswordSchema>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = useCallback(
    async (data: UpdatePasswordSchema) => {
      startTransition(async () => {
        const { toast } = await import('sonner');
        try {
          const formData = new FormData();
          formData.set('id', user.id);
          formData.set('password', data.password);
          formData.set('confirmPassword', data.confirmPassword);
          const response = await updatePassword(formData);

          if (response.error) {
            toast.error(t(response.error));
            return;
          }

          toast.success(t('validation.updatePassword.success'));
          form.reset();
        } catch {
          toast.error(t('validation.updatePassword.error'));
        }
      });
    },
    [user.id, startTransition, form, t]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <FormInput
            control={form.control}
            name="password"
            label={t('passwordForm.inputs.password.label')}
            placeholder={t('passwordForm.inputs.password.placeholder')}
            disabled={isPending}
            type="password"
            autoComplete="new-password"
          />

          <FormInput
            control={form.control}
            name="confirmPassword"
            label={t('passwordForm.inputs.confirmPassword.label')}
            placeholder={t('passwordForm.inputs.confirmPassword.placeholder')}
            disabled={isPending}
            type="password"
            autoComplete="new-password"
          />
        </div>
        <CardFooter className="px-0 pt-6">
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
              className="px-8"
              data-testid="update-password-button"
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {t('passwordForm.buttons.updatePassword')}
            </Button>
            {!isPending && (
              <Button type="button" variant="ghost">
                {t('passwordForm.buttons.reset')}
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}

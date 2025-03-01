'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateProfile } from '@/modules/profile/actions/update-profile.action';
import type { UpdateProfileSchema } from '@/modules/profile/actions/update-profile.schema';
import { updateProfileSchema } from '@/modules/profile/actions/update-profile.schema';
import type { User } from '@/modules/users/types/user.type';
import FormInput from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui/button';
import { CardFooter } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';

type Props = Readonly<{
  user: User;
}>;

export function ProfileForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('profile');
  const form = useForm<UpdateProfileSchema>({
    defaultValues: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    resolver: zodResolver(updateProfileSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: UpdateProfileSchema) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set('id', user.id);
        formData.set('email', data.email);
        formData.set('name', data.name);

        const response = await updateProfile(formData);

        if (response.error) {
          toast.error(t(response.error));
          return;
        }

        toast.success(t('validation.updateProfile.success'));
      } catch {
        toast.error(t('validation.updateProfile.error'));
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <FormInput
            control={form.control}
            name="email"
            label={t('profileForm.inputs.email.label')}
            placeholder={t('profileForm.inputs.email.placeholder')}
            disabled={isPending}
            type="email"
            autoComplete="email"
          />
          <FormInput
            control={form.control}
            name="name"
            label={t('profileForm.inputs.name.label')}
            placeholder={t('profileForm.inputs.name.placeholder')}
            disabled={isPending}
            autoComplete="off"
          />
        </div>
        <CardFooter className="px-0 pt-6">
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isPending} className="px-8">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('profileForm.buttons.save')}
            </Button>
            {!isPending && (
              <Button type="button" variant="ghost">
                {t('profileForm.buttons.cancel')}
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}

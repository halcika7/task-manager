'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { updateUser } from '@/modules/users/actions/update-user/update-user.action';
import { updateUserSchema } from '@/modules/users/actions/update-user/update-user.schema';
import type { UpdateUserSchema } from '@/modules/users/actions/update-user/update-user.schema';
import { useUserAction } from '@/modules/users/context/user-action.context';
import { locales, roles } from '@/modules/users/utils/utils';
import FormInput from '@/shared/components/form/input';
import FormSelect from '@/shared/components/form/select';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Form } from '@/shared/components/ui/form';
import { cn } from '@/shared/utils/cn';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function EditUserDialog({ isOpen, onClose }: Props) {
  const { selectedData } = useUserAction();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('users');

  const form = useForm<UpdateUserSchema>({
    defaultValues: {
      id: selectedData?.id,
      name: selectedData?.name,
      email: selectedData?.email,
      role: selectedData?.role,
    },
    resolver: zodResolver(updateUserSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = useCallback(
    async (data: UpdateUserSchema) => {
      startTransition(async () => {
        const toaster = await import('sonner');
        try {
          const formData = new FormData();
          formData.set('id', data.id);
          formData.set('name', data.name);
          formData.set('email', data.email);
          formData.set('role', data.role);

          const rsp = await updateUser(formData);

          if (rsp?.error) {
            toaster.toast.error(t(rsp.error));
            return;
          }

          toaster.toast.success(t('validation.updateUser.success'));
          onClose();
        } catch {
          toaster.toast.error(t('validation.updateUser.error'));
        }
      });
    },
    [onClose, t]
  );

  useEffect(() => {
    if (selectedData) {
      form.reset({
        id: selectedData?.id,
        name: selectedData?.name,
        email: selectedData?.email,
        role: selectedData?.role,
      });
    }
  }, [isOpen, selectedData, form]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-[400px]">
        <DialogDescription className="sr-only">
          {t('editUserDialog.title')}
        </DialogDescription>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-3">
              <Pencil className="text-primary h-6 w-6" />
            </div>
            <DialogTitle>{t('editUserDialog.title')}</DialogTitle>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-5"
          >
            <FormInput
              control={form.control}
              name="name"
              label={t('createUserModal.inputs.name.label')}
              placeholder={t('createUserModal.inputs.name.placeholder')}
              disabled={isPending}
              autoComplete="off"
            />

            <FormInput
              control={form.control}
              name="email"
              label={t('createUserModal.inputs.email.label')}
              placeholder={t('createUserModal.inputs.email.placeholder')}
              disabled={isPending}
              type="email"
              autoComplete="email"
            />

            <FormSelect
              control={form.control}
              name="role"
              label={t('createUserModal.inputs.role.label')}
              placeholder={t('createUserModal.inputs.role.placeholder')}
              options={roles}
            />

            <FormSelect
              control={form.control}
              name="locale"
              label={t('createUserModal.inputs.locale.label')}
              placeholder={t('createUserModal.inputs.locale.placeholder')}
              options={locales}
            />

            <DialogFooter>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                >
                  {t('editUserDialog.buttons.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className={cn(
                    'bg-primary hover:bg-primary/90',
                    isPending && 'animate-pulse'
                  )}
                >
                  {t('editUserDialog.buttons.save')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

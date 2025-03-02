'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { createUser } from '@/modules/users/actions/create-user/create-user.action';
import { createUserSchema } from '@/modules/users/actions/create-user/create-user.schema';
import type { CreateUserSchema } from '@/modules/users/actions/create-user/create-user.schema';
import { UserRole } from '@/modules/users/types/user.type';
import { locales, roles } from '@/modules/users/utils/utils';
import FormInput from '@/shared/components/form/input';
import FormSelect from '@/shared/components/form/select';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Form } from '@/shared/components/ui/form';
import { cn } from '@/shared/utils/cn';

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

export function CreateUserModal({ open, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('users');

  const form = useForm<CreateUserSchema>({
    defaultValues: {
      name: '',
      email: '',
      role: UserRole.USER,
    },
    resolver: zodResolver(createUserSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = useCallback(
    async (data: CreateUserSchema) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.set('name', data.name);
        formData.set('email', data.email);
        formData.set('role', data.role);

        const rsp = await createUser(formData);
        const toaster = await import('sonner');

        if (rsp?.error) {
          toaster.toast.error(t(rsp.error));
          return;
        }

        toaster.toast.success(t('validation.createUser.success'));
        onClose();
      });
    },
    [onClose, t]
  );

  return (
    <Dialog open={open}>
      <DialogContent className="gap-0 p-0 sm:max-w-[400px]">
        <DialogDescription className="sr-only">
          {t('createUserModal.title')}
        </DialogDescription>
        <DialogHeader className="flex flex-row items-center justify-between border-b p-4">
          <DialogTitle className="text-xl">
            {t('createUserModal.title')}
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-6 overflow-y-auto scroll-smooth p-6">
              <div className="space-y-4">
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
              </div>
            </div>
            <DialogFooter className="flex flex-row items-center justify-end gap-2 border-t p-4 sm:justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={onClose}
                type="button"
              >
                {t('createUserModal.buttons.cancel')}
              </Button>
              <Button
                size="sm"
                disabled={isPending}
                type="submit"
                className={cn(
                  'rounded-lg bg-gradient-to-r from-blue-500 to-blue-600',
                  'font-medium text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
                  'transition-all duration-200 ease-in-out',
                  'hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.05)]',
                  'active:scale-[0.98] active:duration-75',
                  'disabled:pointer-events-none disabled:opacity-50'
                )}
              >
                {t('createUserModal.buttons.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

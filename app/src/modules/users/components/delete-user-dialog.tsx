'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';

import { deleteUserAction } from '@/modules/users/actions/delete-user.action';
import { useUserAction } from '@/modules/users/context/user-action.context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteUserDialog({ isOpen, onClose }: Props) {
  const { selectedData } = useUserAction();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('users');

  const handleDelete = useCallback(async () => {
    if (!selectedData) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', selectedData.id);

      const rsp = await deleteUserAction(formData);

      if (rsp.error) {
        const toaster = await import('sonner');
        toaster.toast.error(t(rsp.error));
        return;
      }

      onClose();
    });
  }, [onClose, selectedData, t]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/15 rounded-full p-3">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <AlertDialogTitle>{t('deleteUserDialog.title')}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-3">
            {t('deleteUserDialog.description')}
            <span className="text-foreground font-medium">
              {selectedData?.name}
            </span>
            {t('deleteUserDialog.description2')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-2">
            <AlertDialogCancel asChild>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                {t('deleteUserDialog.buttons.cancel')}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                className={cn(
                  'bg-destructive hover:bg-destructive/90',
                  isPending && 'animate-pulse'
                )}
              >
                {t('deleteUserDialog.buttons.delete')}
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

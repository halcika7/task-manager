'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';

import { deleteTaskAction } from '@/modules/tasks/actions/delete-task-action';
import { useTaskAction } from '@/modules/tasks/context/task-action.context';
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

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
  withRedirect?: boolean;
}>;

export default function DeleteTaskAlert({
  open,
  onClose,
  withRedirect = false,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const { selectedData } = useTaskAction();
  const t = useTranslations('tasks');

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const sonner = await import('sonner');

      try {
        const rsp = await deleteTaskAction(selectedData?.id, withRedirect);

        if (rsp?.error) {
          sonner.toast.error(t(rsp.error));
        } else {
          sonner.toast.success(t('validation.deleteTask.success'));
        }
      } catch {
        sonner.toast.error(t('validation.deleteTask.error'));
      }
    });
  }, [startTransition, selectedData?.id, withRedirect, t]);

  return (
    <AlertDialog open={open} onOpenChange={isPending ? undefined : onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteTaskAlert.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteTaskAlert.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            {t('deleteTaskAlert.buttons.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
            disabled={isPending}
          >
            {t('deleteTaskAlert.buttons.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

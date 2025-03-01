'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';

import { useTaskAction } from '@/modules/tasks/context/task-action.context';
import { Action } from '@/shared/provider/action.provider';

const DeleteTaskAlert = dynamic(
  () => import('@/modules/tasks/components/task-modals/delete-task-alert'),
  { ssr: false }
);

const EditTaskModal = dynamic(
  () => import('@/modules/tasks/components/task-modals/edit-task-modal'),
  { ssr: false }
);

type Props = Readonly<{
  withRedirect?: boolean;
}>;

export default function TaskDetailsModals({ withRedirect = false }: Props) {
  const { handleSetSelectedData, action, setAction } = useTaskAction();

  const handleClose = useCallback(() => {
    if (!withRedirect) {
      setAction(null);
    } else {
      handleSetSelectedData(null, null);
    }
  }, [setAction, withRedirect, handleSetSelectedData]);

  return (
    <>
      {action === Action.EDIT && (
        <EditTaskModal isOpen={action === Action.EDIT} onClose={handleClose} />
      )}

      {action === Action.DELETE && (
        <DeleteTaskAlert
          open={action === Action.DELETE}
          onClose={handleClose}
          withRedirect={withRedirect}
        />
      )}
    </>
  );
}

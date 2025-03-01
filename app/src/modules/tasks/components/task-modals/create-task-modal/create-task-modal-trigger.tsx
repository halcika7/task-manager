'use client';

import { PlusIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

import { useTaskAction } from '@/modules/tasks/context/task-action.context';
import { Button } from '@/shared/components/ui/button';
import { Action } from '@/shared/provider/action.provider';

const CreateTaskModal = dynamic(
  () => import('@/modules/tasks/components/task-modals/create-task-modal')
);

export default function CreateTaskModalTrigger() {
  const { setAction } = useTaskAction();

  const handleClick = useCallback(() => {
    setAction(Action.CREATE);
  }, [setAction]);

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="shrink-0"
        onClick={handleClick}
      >
        <PlusIcon className="size-4" />
      </Button>
      <CreateTaskModal />
    </>
  );
}

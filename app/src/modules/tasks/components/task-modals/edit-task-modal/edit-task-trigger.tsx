'use client';

import { PencilIcon } from 'lucide-react';
import { useCallback } from 'react';

import { useTaskAction } from '@/modules/tasks/context/task-action.context';
import { Button } from '@/shared/components/ui/button';
import { Action } from '@/shared/provider/action.provider';

export default function EditTaskTrigger() {
  const { handleSetSelectedData, selectedData } = useTaskAction();

  const handleClick = useCallback(() => {
    handleSetSelectedData(selectedData, Action.EDIT);
  }, [handleSetSelectedData, selectedData]);

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <PencilIcon className="size-4" />
    </Button>
  );
}

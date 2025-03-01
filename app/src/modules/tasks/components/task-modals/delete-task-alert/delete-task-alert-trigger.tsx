'use client';

import { Trash2Icon } from 'lucide-react';
import { useCallback } from 'react';

import { useTaskAction } from '@/modules/tasks/context/task-action.context';
import { Button } from '@/shared/components/ui/button';
import { Action } from '@/shared/provider/action.provider';

export default function DeleteTaskAlertTrigger() {
  const { handleSetSelectedData, selectedData } = useTaskAction();

  const handleClick = useCallback(() => {
    handleSetSelectedData(selectedData, Action.DELETE);
  }, [handleSetSelectedData, selectedData]);

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <Trash2Icon className="h-4 w-4 text-red-500" />
    </Button>
  );
}

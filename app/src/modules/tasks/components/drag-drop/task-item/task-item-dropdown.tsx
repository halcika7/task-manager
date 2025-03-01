'use client';

import { PencilIcon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import type { LocaleLinkProps } from '@/modules/i18n/routing';
import { LocaleLink } from '@/modules/i18n/routing';
import TaskItemTrigger from '@/modules/tasks/components/drag-drop/task-item/task-item-trigger';
import { useTaskAction } from '@/modules/tasks/context/task-action.context';
import type { Task } from '@/modules/tasks/types/task.type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Action } from '@/shared/provider/action.provider';

type Props = Readonly<{
  task: Task;
  toggleDropdown: () => void;
  isOpen: boolean;
}>;

export default function TaskItemDropdown({
  task,
  toggleDropdown,
  isOpen,
}: Props) {
  const { handleSetSelectedData } = useTaskAction();
  const t = useTranslations('tasks.taskItem');

  const handleDeleteClick = useCallback(() => {
    handleSetSelectedData(task, Action.DELETE);
    toggleDropdown();
  }, [handleSetSelectedData, task, toggleDropdown]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={toggleDropdown} modal>
      <DropdownMenuTrigger asChild>
        <TaskItemTrigger isOpen={isOpen} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[180px]"
        onClick={e => e.stopPropagation()}
      >
        <DropdownMenuItem asChild>
          <LocaleLink href={`/dashboard/${task.id}` as LocaleLinkProps['href']}>
            <PencilIcon className="mr-2 h-4 w-4" />
            {t('edit')}
          </LocaleLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 dark:text-red-400"
          onClick={handleDeleteClick}
        >
          <Trash2Icon className="mr-2 h-4 w-4" />
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

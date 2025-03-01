'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ClockIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { memo, useCallback, useState } from 'react';

import TaskItemTrigger from '@/modules/tasks/components/drag-drop/task-item/task-item-trigger';
import type { Task, TaskStatus } from '@/modules/tasks/types/task.type';
import {
  categoryColors,
  categoryLabels,
  priorityColors,
  priorityLabels,
} from '@/modules/tasks/utils/labels';
import AvatarInitials from '@/shared/components/avatar-initials';
import dayjs from '@/shared/lib/dayjs';
import { cn } from '@/shared/utils/cn';

const TaskItemDropdown = dynamic(() => import('./task-item-dropdown'), {
  ssr: false,
  loading: () => <TaskItemTrigger />,
});

type Props = Readonly<{
  task: Task;
  status: TaskStatus;
  disabled?: boolean;
}>;

const TaskItem = memo(function TaskItem({ task, status, disabled }: Props) {
  const t = useTranslations('tasks');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition,
  } = useSortable({
    id: task.id,
    data: { status, task },
    disabled,
  });
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={{
        opacity: 1,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      {...attributes}
      {...(isOpen ? {} : listeners)}
      className={cn(
        'group w-full rounded-xl border bg-gradient-to-b p-5 text-left shadow-sm',
        'transition-all duration-200 ease-in-out',
        isDragging && [
          'ring-accent ring-2 ring-offset-2',
          'shadow-xl',
          'scale-105',
          'bg-accent/70 z-50',
        ],
        disabled && 'opacity-70'
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ring-1 transition-colors',
              priorityColors[task.priority]
            )}
          >
            {t(priorityLabels[task.priority])}
          </span>
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ring-1 transition-colors',
              categoryColors[task.category]
            )}
          >
            {t(categoryLabels[task.category])}
          </span>
        </div>
        <div className="relative z-50">
          <TaskItemDropdown
            task={task}
            toggleDropdown={toggleDropdown}
            isOpen={isOpen}
          />
        </div>
      </div>

      <h3 className="mb-1.5 text-base leading-tight font-medium">
        {task.title}
      </h3>

      <p className="text-muted-foreground/90 mb-3 line-clamp-2 text-sm">
        {task.description}
      </p>

      <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
        <div className="flex max-w-[45%] items-center gap-1.5">
          <div className="relative flex-shrink-0">
            <div className="ring-background relative h-6 w-6 overflow-hidden rounded-full ring-2 transition-transform group-hover:scale-105">
              <AvatarInitials
                name={task.assignedTo?.name ?? 'N N'}
                src=""
                alt={task.assignedTo?.name ?? 'NN'}
                className="size-full object-cover text-xs"
              />
            </div>
            <span className="border-background absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border-2 bg-emerald-500 transition-transform group-hover:scale-105" />
          </div>
          <span className="truncate text-xs">{task.assignedTo?.name}</span>
        </div>
        <div className="bg-secondary/40 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs shadow-sm backdrop-blur-sm">
          <ClockIcon className="h-3 w-3" />
          <span>{dayjs(task.dueDate).format('DD/MM/YYYY')}</span>
        </div>
      </div>
    </div>
  );
});

export default TaskItem;

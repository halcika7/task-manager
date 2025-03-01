'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTranslations } from 'next-intl';
import TaskItem from '@/modules/tasks/components/drag-drop/task-item';
import { TaskStatus } from '@/modules/tasks/types/task.type';
import type { Task } from '@/modules/tasks/types/task.type';
import { cn } from '@/shared/utils/cn';

type Props = Readonly<{
  id: TaskStatus;
  tasks: Task[];
  percentageCompleted?: number;
  count: number;
}>;

export default function TaskColumn({
  id,
  tasks,
  percentageCompleted,
  count,
}: Props) {
  const { setNodeRef } = useDroppable({ id: id });
  const t = useTranslations('tasks.status');

  return (
    <SortableContext
      items={tasks}
      strategy={verticalListSortingStrategy}
      id={id}
    >
      <div
        data-type="column"
        className={cn(
          'bg-card/50 w-72 min-w-72 rounded-lg border p-4 shadow-sm'
        )}
      >
        <div className="group from-background to-background/30 flex items-center justify-between gap-2 rounded-md border bg-gradient-to-b px-3 py-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
              {count}
            </div>
            {id === TaskStatus.COMPLETED && percentageCompleted ? (
              <div className="bg-primary/10 text-primary flex h-6 shrink-0 items-center justify-center rounded-full p-2 text-xs font-medium">
                {Math.round(percentageCompleted)}%
              </div>
            ) : null}
            <h2 className="text-sm font-medium">{t(id)}</h2>
          </div>
        </div>

        <div
          className={cn(
            'mt-4 flex flex-1 flex-col gap-2 pt-2 transition-all duration-200',
            !tasks.length && [
              'rounded-lg border-2 border-dashed',
              'hover:border-accent/50 hover:bg-accent/5',
              'transition-colors duration-200',
            ]
          )}
          ref={setNodeRef}
        >
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} status={id} />
          ))}
        </div>
      </div>
    </SortableContext>
  );
}

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
  const { setNodeRef, isOver } = useDroppable({ id: id });
  const t = useTranslations('tasks.status');

  // Ensure we always have at least one item ID for the column
  const sortableItems =
    tasks.length > 0 ? tasks.map(task => task.id) : [`${id}-placeholder`];

  return (
    <div
      data-type="column"
      className={cn('bg-card/50 w-72 min-w-72 rounded-lg border p-4 shadow-sm')}
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

      <SortableContext
        items={sortableItems}
        strategy={verticalListSortingStrategy}
        id={id}
      >
        <div
          ref={setNodeRef}
          className={cn(
            'mt-4 flex min-h-96 flex-col gap-2 pt-2 transition-all duration-200',
            !tasks.length && [
              'rounded-lg border-2 border-dashed',
              'hover:border-accent/50 hover:bg-accent/5',
              'transition-colors duration-200',
            ],
            isOver && 'border-accent/50 bg-accent/5'
          )}
        >
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} status={id} />
          ))}
          {!tasks.length && (
            <div className="text-muted-foreground flex items-center justify-center text-sm">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

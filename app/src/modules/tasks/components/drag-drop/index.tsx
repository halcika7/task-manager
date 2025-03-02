'use client';

import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { memo, useId, useMemo } from 'react';

import TaskColumn from '@/modules/tasks/components/drag-drop/column';
import useDragDrop from '@/modules/tasks/components/drag-drop/use-drag-drop';
import type { TasksResponse } from '@/modules/tasks/service/get-tasks';
import { TaskStatus } from '@/modules/tasks/types/task.type';

type Props = Readonly<{
  tasks: TasksResponse | null;
}>;

function DragDrop({ tasks: initialTasks }: Props) {
  const id = useId();

  const { columns, handleDragOver, handleDragEnd } = useDragDrop(initialTasks);

  // Sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const percentageCompleted = useMemo(() => {
    if (!columns) return 0;
    const totalTasks = Object.values(columns).reduce(
      (acc, column) => acc + column.tasks.length,
      0
    );
    const completedTasks = columns[TaskStatus.COMPLETED].tasks.length ?? 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [columns]);

  return (
    <div className="relative mt-8 overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        id={id}
      >
        <div className="flex h-full gap-4">
          <TaskColumn
            id={TaskStatus.PENDING}
            tasks={columns[TaskStatus.PENDING].tasks}
            count={columns[TaskStatus.PENDING].count}
          />
          <TaskColumn
            id={TaskStatus.IN_PROGRESS}
            tasks={columns[TaskStatus.IN_PROGRESS].tasks}
            count={columns[TaskStatus.IN_PROGRESS].count}
          />
          <TaskColumn
            id={TaskStatus.COMPLETED}
            tasks={columns[TaskStatus.COMPLETED].tasks}
            percentageCompleted={percentageCompleted}
            count={columns[TaskStatus.COMPLETED].count}
          />
        </div>
      </DndContext>
    </div>
  );
}

export default memo(DragDrop, (prevProps, nextProps) => {
  // If both are null, they're equal
  if (!prevProps.tasks && !nextProps.tasks) return true;
  // If one is null and other isn't, they're not equal
  if (!prevProps.tasks || !nextProps.tasks) return false;

  // Deep comparison of tasks
  return JSON.stringify(prevProps.tasks) === JSON.stringify(nextProps.tasks);
});

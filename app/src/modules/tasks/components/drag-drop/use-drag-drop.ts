'use client';

import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';

import type { TasksResponse } from '@/modules/tasks/service/get-tasks';
import { updateTaskPosition } from '@/modules/tasks/service/update-task';
import { TaskStatus } from '@/modules/tasks/types/task.type';
import type { Task } from '@/modules/tasks/types/task.type';
import { revalidateDashboard } from '@/shared/utils/revalidate-dashboard';

type Columns = Record<TaskStatus, { tasks: Task[]; count: number }>;

export default function useDragDrop(initialTasks: TasksResponse | null) {
  const [columns, setColumns] = useState<Columns>(() =>
    Object.values(TaskStatus).reduce((acc, status) => {
      acc[status] = {
        tasks: initialTasks?.data[status].data ?? [],
        count: initialTasks?.data[status].count ?? 0,
      };
      return acc;
    }, {} as Columns)
  );

  const findColumn = useCallback(
    (id: string | null) => {
      if ((id as TaskStatus) in columns) {
        return id as TaskStatus;
      }
      return Object.keys(columns).find(key =>
        columns[key as TaskStatus].tasks.find(task => task.id === id)
      ) as TaskStatus | null;
    },
    [columns]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over, delta } = event;
      const activeId = String(active.id);
      const overId = over ? String(over.id) : '';

      // Find the containers
      const activeColumn = findColumn(activeId);
      const overColumn = findColumn(overId);

      if (!activeColumn || !overColumn || activeColumn === overColumn) {
        return;
      }

      setColumns(prevState => {
        const activeItems = prevState[activeColumn];
        const overItems = prevState[overColumn];

        const activeIndex = activeItems.tasks.findIndex(i => {
          return i?.id === activeId;
        });
        const overIndex = overItems.tasks.findIndex(i => {
          return i?.id === overId;
        });
        const isBelowLastItem =
          over &&
          overIndex === overItems.tasks.length - 1 &&
          delta.y > over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        const newIndex =
          overIndex >= 0 ? overIndex + modifier : overItems.tasks.length + 1;

        const newActiveTasks = activeItems.tasks.filter(
          i => i?.id !== activeId
        );
        const newOverTasks = [
          ...overItems.tasks.slice(0, newIndex),
          activeItems.tasks[activeIndex],
          ...overItems.tasks.slice(newIndex, overItems.tasks.length),
        ];

        return {
          ...prevState,
          [activeColumn]: {
            tasks: newActiveTasks,
            count: newActiveTasks.length,
          },
          [overColumn]: {
            tasks: newOverTasks,
            count: newOverTasks.length,
          },
        };
      });
    },
    [findColumn]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      const activeId = String(active.id);
      const overId = over ? String(over.id) : null;

      const activeColumn = findColumn(activeId);
      const overColumn = findColumn(overId);

      if (!activeColumn || !overColumn) {
        return null;
      }

      const activeIndex = columns[activeColumn].tasks.findIndex(
        i => i?.id === activeId
      );
      const overIndex = columns[overColumn].tasks.findIndex(
        i => i?.id === overId
      );

      updateTaskPosition(activeId, {
        status: overColumn,
        position: overIndex,
      });

      setColumns(prevState => {
        const newOverTasks = arrayMove(
          prevState[overColumn].tasks,
          activeIndex,
          overIndex
        );
        return {
          ...prevState,
          [overColumn]: {
            tasks: newOverTasks,
            count: newOverTasks.length,
          },
        };
      });

      await revalidateDashboard();
    },
    [findColumn, columns]
  );

  useEffect(() => {
    if (initialTasks) {
      setColumns(() =>
        Object.values(TaskStatus).reduce((acc, status) => {
          acc[status] = {
            tasks: initialTasks?.data[status].data ?? [],
            count: initialTasks?.data[status].count ?? 0,
          };
          return acc;
        }, {} as Columns)
      );
    }
  }, [initialTasks]);

  return { columns, handleDragOver, handleDragEnd };
}

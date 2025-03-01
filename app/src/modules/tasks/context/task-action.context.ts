'use client';

import type { Task } from '@/modules/tasks/types/task.type';
import { createActionContext } from '@/shared/provider/action.provider';

export const { Provider: TaskActionProvider, useAction: useTaskAction } =
  createActionContext<Task>();

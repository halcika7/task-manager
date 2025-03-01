import type { Task, TaskStatus } from '@/modules/tasks/types/task.type';
import { serializeTasksParams } from '@/modules/tasks/utils/search-tasks-params';
import type { TasksSearchParams } from '@/modules/tasks/utils/search-tasks-params';
import { httpClient } from '@/shared/lib/http-client';

export type TasksResponse = Readonly<{
  data: Readonly<Record<TaskStatus, { data: Task[]; count: number }>>;
  meta: Readonly<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>;
}>;

export const getTasks = async (params: TasksSearchParams) => {
  try {
    const queryParams = await serializeTasksParams(params);
    const rsp = await httpClient.get<TasksResponse>(`/tasks${queryParams}`);

    return rsp.data;
  } catch {
    return null;
  }
};

import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';

import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '@/modules/tasks/types/task.type';

export const tasksSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(''),
  status: parseAsStringEnum(Object.values(TaskStatus)),
  priority: parseAsStringEnum(Object.values(TaskPriority)),
  category: parseAsStringEnum(Object.values(TaskCategory)),
  assigneeId: parseAsString.withDefault(''),
  createdById: parseAsString.withDefault(''),
  dateFrom: parseAsString.withDefault(''),
  dateTo: parseAsString.withDefault(''),
  orderBy: parseAsString.withDefault(''),
  orderDir: parseAsString.withDefault(''),
};

export const emptyTasksSearchParams: TasksSearchParams = {
  page: 1,
  limit: 10,
  search: '',
  status: null,
  priority: null,
  category: null,
  assigneeId: '',
  createdById: '',
  dateFrom: '',
  dateTo: '',
  orderBy: '',
  orderDir: '',
};

export const loaderTasksParams = createLoader(tasksSearchParams);

export const serializeTasksParams = createSerializer(tasksSearchParams);

export type TasksSearchParams = Awaited<ReturnType<typeof loaderTasksParams>>;

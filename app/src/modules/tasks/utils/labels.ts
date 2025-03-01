import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '@/modules/tasks/types/task.type';

export const priorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'priority.LOW',
  [TaskPriority.MEDIUM]: 'priority.MEDIUM',
  [TaskPriority.HIGH]: 'priority.HIGH',
};

export const categoryLabels: Record<TaskCategory, string> = {
  [TaskCategory.WORK]: 'category.WORK',
  [TaskCategory.PERSONAL]: 'category.PERSONAL',
  [TaskCategory.LEARNING]: 'category.LEARNING',
  [TaskCategory.OTHER]: 'category.OTHER',
};

export const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.COMPLETED]: 'status.COMPLETED',
  [TaskStatus.IN_PROGRESS]: 'status.IN_PROGRESS',
  [TaskStatus.PENDING]: 'status.PENDING',
};

export const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.LOW]:
    'bg-emerald-500/10 text-emerald-500 ring-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:ring-emerald-400/30',
  [TaskPriority.MEDIUM]:
    'bg-amber-500/10 text-amber-500 ring-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-400/30',
  [TaskPriority.HIGH]:
    'bg-rose-500/10 text-rose-500 ring-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400 dark:ring-rose-400/30',
};

export const categoryColors: Record<TaskCategory, string> = {
  [TaskCategory.WORK]:
    'bg-blue-500/10 text-blue-500 ring-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400 dark:ring-blue-400/30',
  [TaskCategory.PERSONAL]:
    'bg-purple-500/10 text-purple-500 ring-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400 dark:ring-purple-400/30',
  [TaskCategory.LEARNING]:
    'bg-green-500/10 text-green-500 ring-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:ring-green-400/30',
  [TaskCategory.OTHER]:
    'bg-gray-500/10 text-gray-500 ring-gray-500/30 dark:bg-gray-500/20 dark:text-gray-400 dark:ring-gray-400/30',
};

export const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.COMPLETED]: 'bg-emerald-500/10 text-emerald-500',
  [TaskStatus.IN_PROGRESS]: 'bg-amber-500/10 text-amber-500',
  [TaskStatus.PENDING]: 'bg-rose-500/10 text-rose-500',
};

import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '@/modules/tasks/types/task.type';

export const taskStatusOptions = Object.values(TaskStatus).map(status => ({
  label: `tasks.status.${status}`,
  value: status,
}));

export const taskPriorityOptions = Object.values(TaskPriority).map(
  priority => ({
    label: `tasks.priority.${priority}`,
    value: priority,
  })
);

export const taskCategoryOptions = Object.values(TaskCategory).map(
  category => ({
    label: `tasks.category.${category}`,
    value: category,
  })
);

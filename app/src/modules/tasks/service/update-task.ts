import type { Task, TaskStatus } from '@/modules/tasks/types/task.type';
import { httpClient } from '@/shared/lib/http-client';

interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assignedToId?: string;
}

interface UpdateTaskPosition {
  status: TaskStatus;
  position: number;
}

export async function updateTask(taskId: string, data: UpdateTaskData) {
  const response = await httpClient.patch<Task>(`/tasks/${taskId}`, data);
  return response.data;
}

export async function updateTaskPosition(
  taskId: string,
  data: UpdateTaskPosition
) {
  const response = await httpClient.patch<Task>(
    `/tasks/${taskId}/position`,
    data
  );
  return response.data;
}

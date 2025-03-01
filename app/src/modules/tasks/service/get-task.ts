import type { Task } from '@/modules/tasks/types/task.type';
import { httpClient } from '@/shared/lib/http-client';

export async function getTask(taskId: string) {
  try {
    const response = await httpClient.get<Task>(`/tasks/${taskId}`);
    return response.data;
  } catch {
    return null;
  }
}

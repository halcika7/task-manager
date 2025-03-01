import { httpClient } from '@/shared/lib/http-client';

export async function deleteTask(taskId: string): Promise<void> {
  await httpClient.delete(`/tasks/${taskId}`);
}

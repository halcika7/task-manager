'use server';

import { revalidatePath } from 'next/cache';
import type { UpdateTaskSchema } from '@/modules/tasks/actions/update-task/update-task.schema';
import { updateTaskSchema } from '@/modules/tasks/actions/update-task/update-task.schema';
import type { Task } from '@/modules/tasks/types/task.type';
import { httpClient } from '@/shared/lib/http-client';

export async function updateTask(formData: FormData) {
  const data = Object.fromEntries(
    formData.entries()
  ) as unknown as UpdateTaskSchema;
  data.dueDate = new Date(data.dueDate as unknown as string);
  const validatedFields = updateTaskSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const { id, ...rest } = validatedFields.data;
    const response = await httpClient.patch<Task>(`/tasks/${id}`, rest);

    if (!response.data?.id) {
      return { message: 'validation.updateTask.error', success: false };
    }

    revalidatePath('[locale]/dashboard', 'page');
    revalidatePath('[locale]/dashboard/[taskId]', 'page');

    return { message: 'validation.updateTask.success', success: true };
  } catch {
    return { message: 'validation.updateTask.error', success: false };
  }
}

'use server';

import { revalidatePath } from 'next/cache';

import type { CreateTaskSchema } from '@/modules/tasks/actions/create-task/create-task.schema';
import { createTaskSchema } from '@/modules/tasks/actions/create-task/create-task.schema';
import type { Task } from '@/modules/tasks/types/task.type';
import { httpClient } from '@/shared/lib/http-client';

export async function createTaskAction(formData: FormData) {
  const data = Object.fromEntries(
    formData.entries()
  ) as unknown as CreateTaskSchema;
  data.dueDate = new Date(data.dueDate as unknown as string);
  const validatedFields = createTaskSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const response = await httpClient.post<Task>(
      '/tasks',
      validatedFields.data
    );

    if (!response.data?.id) {
      return { message: 'validation.createTask.error', success: false };
    }

    revalidatePath('[locale]/dashboard', 'page');

    return { message: 'validation.createTask.success', success: true };
  } catch {
    return { message: 'validation.createTask.error', success: false };
  }
}

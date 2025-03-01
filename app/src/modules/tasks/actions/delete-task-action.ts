'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { httpClient } from '@/shared/lib/http-client';

const schema = z.object({
  taskId: z.string().cuid(),
});

export async function deleteTaskAction(taskId?: string, withRedirect = true) {
  if (!taskId) {
    return { error: 'validation.deleteTask.requiredTaskId' };
  }

  const { success } = schema.safeParse({ taskId });

  if (!success) {
    return { error: 'validation.deleteTask.invalidTaskId' };
  }

  try {
    const rsp = await httpClient.delete<{ success: boolean }>(
      `/tasks/${taskId}`
    );

    if (!rsp.data?.success) {
      return { error: 'validation.deleteTask.error' };
    }

    revalidatePath('[locale]/dashboard', 'layout');

    if (withRedirect) {
      redirect('[locale]/dashboard');
    }
  } catch {
    return { error: 'validation.deleteTask.error' };
  }
}

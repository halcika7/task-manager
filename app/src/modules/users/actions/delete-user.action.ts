'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { httpClient } from '@/shared/lib/http-client';

const schema = z.object({
  id: z.string().cuid(),
});

export async function deleteUserAction(formData: FormData) {
  const validatedFields = schema.safeParse({
    id: formData.get('id'),
  });

  if (!validatedFields.success) {
    return { error: 'validation.deleteUser.invalidFields' };
  }

  const { id } = validatedFields.data;

  try {
    const response = await httpClient.delete<{ message: string }>(
      `/users/${id}`
    );

    if (!response.data) {
      return { error: 'validation.deleteUser.error' };
    }

    revalidatePath('[locale]/dashboard/users', 'page');

    return { message: 'users.validation.deleteUser.success' };
  } catch {
    return { error: 'users.validation.deleteUser.error' };
  }
}

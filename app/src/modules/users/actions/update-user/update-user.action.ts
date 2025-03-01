'use server';

import { revalidatePath } from 'next/cache';

import { updateUserSchema } from '@/modules/users/actions/update-user/update-user.schema';
import type { User } from '@/modules/users/types/user.type';
import { httpClient } from '@/shared/lib/http-client';

export const updateUser = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = updateUserSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const { id, ...rest } = validatedFields.data;
    const response = await httpClient.patch<User>(`/users/${id}`, rest);

    if (!response.data?.id) {
      return { error: 'validation.updateUser.error' };
    }

    revalidatePath('[locale]/dashboard/users', 'page');
  } catch {
    return { error: 'validation.updateUser.error' };
  }
};

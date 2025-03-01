'use server';

import { revalidatePath } from 'next/cache';
import { createUserSchema } from '@/modules/users/actions/create-user/create-user.schema';
import type { User } from '@/modules/users/types/user.type';
import { httpClient } from '@/shared/lib/http-client';

export async function createUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = createUserSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const response = await httpClient.post<User>(
      '/users',
      validatedFields.data
    );

    if (!response.data?.id) {
      return { error: 'validation.createUser.error' };
    }

    revalidatePath('[locale]/dashboard/users', 'page');
  } catch {
    return { error: 'validation.createUser.error' };
  }
}

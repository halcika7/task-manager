'use server';

import { updatePasswordSchema } from '@/modules/profile/actions/update-profile.schema';
import type { User } from '@/modules/users/types/user.type';
import { httpClient } from '@/shared/lib/http-client';

export const updatePassword = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = updatePasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const response = await httpClient.patch<User>('/users/profile', {
      password: validatedFields.data.password,
    });

    if (!response.data?.id) {
      return { error: 'validation.updatePassword.error' };
    }

    return { success: true };
  } catch {
    return { error: 'validation.updatePassword.error' };
  }
};

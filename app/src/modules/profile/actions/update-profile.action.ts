'use server';

import { revalidatePath } from 'next/cache';

import { updateSession } from '@/modules/auth/actions/update-session';
import { updateProfileSchema } from '@/modules/profile/actions/update-profile.schema';
import type { User } from '@/modules/users/types/user.type';
import { httpClient } from '@/shared/lib/http-client';

export const updateProfile = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = updateProfileSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const response = await httpClient.patch<User>('/users/profile', {
      email: validatedFields.data.email,
      name: validatedFields.data.name,
    });

    if (!response.data?.id) {
      return { error: 'validation.updateProfile.error' };
    }

    await updateSession({
      user: response.data,
    });

    revalidatePath('/dashboard/profile', 'page');
    return { success: true };
  } catch {
    return { error: 'validation.updateProfile.error' };
  }
};

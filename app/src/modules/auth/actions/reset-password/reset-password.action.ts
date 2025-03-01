'use server';

import { redirect, RedirectType } from 'next/navigation';
import { resetPasswordSchema } from '@/modules/auth/actions/reset-password/reset-password.schema';
import { httpClient } from '@/shared/lib/http-client';

export async function resetPassword(formData: FormData) {
  const validatedFields = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { password, token } = validatedFields.data;

  try {
    const rsp = await httpClient.post<{ message: string }>(
      '/auth/reset-password',
      { password, token }
    );

    if (!rsp.data?.message) {
      return { message: 'error_message' };
    }

    redirect('/auth/login', RedirectType.replace);
  } catch {
    return { message: 'error_message' };
  }
}

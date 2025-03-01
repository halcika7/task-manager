'use server';

import type { ForgotPasswordFormState } from '@/modules/auth/actions/forgot-password/forgot-password.schema';
import { forgotPasswordSchema } from '@/modules/auth/actions/forgot-password/forgot-password.schema';
import { httpClient } from '@/shared/lib/http-client';

export async function forgotPassword(
  formData: FormData
): Promise<ForgotPasswordFormState> {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { email } = validatedFields.data;

  try {
    const rsp = await httpClient.post<{ message: string }>(
      '/auth/forgot-password',
      { email }
    );

    if (!rsp.data?.message) {
      return {
        message: 'error_message',
        status: 'error',
      };
    }

    return { status: 'success' };
  } catch {
    return {
      message: 'error_message',
      status: 'error',
    };
  }
}

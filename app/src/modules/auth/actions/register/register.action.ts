'use server';

import { registerSchema } from '@/modules/auth/actions/register/register.schema';
import { getUserLocale } from '@/modules/i18n/lib/locale-cookie';
import { UserRole } from '@/modules/users/types/user.type';
import { httpClient } from '@/shared/lib/http-client';

export async function register(formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const locale = await getUserLocale();
    const rsp = await httpClient.post<{ message: string }>('/auth/register', {
      name,
      email,
      password,
      role: UserRole.USER,
      locale,
    });

    if (!rsp.data || rsp.data?.message) {
      return { message: 'error_message' };
    }
  } catch {
    return { message: 'error_message' };
  }
}

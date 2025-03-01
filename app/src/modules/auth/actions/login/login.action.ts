'use server';

import { loginSchema } from '@/modules/auth/actions/login/login.schema';
import type { User } from '@/modules/users/types/user.type';
import { httpClient } from '@/shared/lib/http-client';

type LoginResponse = User & {
  locale: string;
  accessToken: string;
  refreshToken: string;
};

export const loginServerAction = async (formData: FormData) => {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await httpClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    if (response.error || !response.data) {
      return { message: 'auth.login.invalid_credentials' };
    }

    const user = response.data;

    return {
      session: {
        user: user,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      },
    };
  } catch {
    return {
      message: 'auth.login.invalid_credentials',
    };
  }
};

'use server';

import { loginSchema } from '@/modules/auth/actions/login/login.schema';
import { signIn } from '@/modules/auth/lib';

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
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return {
      message: 'auth.login.success',
      success: true,
    };
  } catch {
    return {
      message: 'auth.login.invalid_credentials',
    };
  }
};

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'auth.filed_errors.invalid_email',
      required_error: 'auth.filed_errors.email_required',
      message: 'auth.filed_errors.invalid_email',
    })
    .email({ message: 'auth.filed_errors.invalid_email' }),
  password: z.string({
    invalid_type_error: 'auth.filed_errors.invalid_password',
    required_error: 'auth.filed_errors.password_required',
    message: 'auth.filed_errors.invalid_password',
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string({
        invalid_type_error: 'auth.filed_errors.invalid_name',
        required_error: 'auth.filed_errors.name_required',
        message: 'auth.filed_errors.invalid_name',
      })
      .min(2, 'auth.filed_errors.name_min_length'),
    email: z
      .string({
        invalid_type_error: 'auth.filed_errors.invalid_email',
        required_error: 'auth.filed_errors.email_required',
        message: 'auth.filed_errors.invalid_email',
      })
      .email('auth.filed_errors.invalid_email'),
    password: z
      .string({
        invalid_type_error: 'auth.filed_errors.invalid_password',
        required_error: 'auth.filed_errors.password_required',
        message: 'auth.filed_errors.invalid_password',
      })
      .min(8, 'auth.filed_errors.password_min_length'),
    confirmPassword: z
      .string({
        invalid_type_error: 'auth.filed_errors.invalid_confirm_password',
        required_error: 'auth.filed_errors.confirm_password_required',
        message: 'auth.filed_errors.invalid_confirm_password',
      })
      .min(8, 'auth.filed_errors.confirm_password_min_length'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'auth.passwords_do_not_match',
    path: ['confirmPassword'],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

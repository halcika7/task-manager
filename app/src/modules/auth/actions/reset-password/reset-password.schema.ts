import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    token: z.string({
      invalid_type_error: 'auth.filed_errors.invalid_token',
      required_error: 'auth.filed_errors.token_required',
      message: 'auth.filed_errors.invalid_token',
    }),
    password: z
      .string({
        invalid_type_error: 'auth.filed_errors.invalid_password',
        required_error: 'auth.filed_errors.password_required',
        message: 'auth.filed_errors.invalid_password',
      })
      .min(8, 'auth.filed_errors.password_min_length'),
    confirmPassword: z.string({
      invalid_type_error: 'auth.filed_errors.invalid_confirm_password',
      required_error: 'auth.filed_errors.confirm_password_required',
      message: 'auth.filed_errors.invalid_confirm_password',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'auth.filed_errors.passwords_do_not_match',
    path: ['confirmPassword'],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

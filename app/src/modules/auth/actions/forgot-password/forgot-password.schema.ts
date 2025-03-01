import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'auth.filed_errors.invalid_email',
      required_error: 'auth.filed_errors.email_required',
      message: 'auth.filed_errors.invalid_email',
    })
    .email({ message: 'auth.filed_errors.invalid_email' }),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export type ForgotPasswordFormState =
  | {
      error: {
        email?: string[];
      };
      message?: never;
      status?: never;
    }
  | {
      error?: never;
      message: 'error_message';
      status: 'error';
    }
  | {
      error?: never;
      message?: never;
      status: 'success';
    };

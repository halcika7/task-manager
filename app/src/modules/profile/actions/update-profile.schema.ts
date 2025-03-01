import { z } from 'zod';

export const updatePasswordSchema = z
  .object({
    id: z
      .string({
        invalid_type_error: 'profile.inputsValidation.invalidId',
        required_error: 'profile.inputsValidation.requiredId',
        message: 'profile.inputsValidation.invalidId',
      })
      .cuid({
        message: 'profile.inputsValidation.invalidId',
      }),
    password: z
      .string({
        invalid_type_error: 'profile.inputsValidation.invalidPassword',
        required_error: 'profile.inputsValidation.requiredPassword',
        message: 'profile.inputsValidation.invalidPassword',
      })
      .min(8, 'profile.inputsValidation.passwordMinLength'),
    confirmPassword: z
      .string({
        invalid_type_error: 'profile.inputsValidation.invalidPassword',
        required_error: 'profile.inputsValidation.requiredPassword',
        message: 'profile.inputsValidation.invalidPassword',
      })
      .min(8, 'profile.inputsValidation.passwordMinLength'),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'profile.inputsValidation.passwordsDoNotMatch',
  });

export const updateProfileSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'profile.inputsValidation.invalidId',
      required_error: 'profile.inputsValidation.requiredId',
      message: 'profile.inputsValidation.invalidId',
    })
    .cuid({
      message: 'profile.inputsValidation.invalidId',
    }),
  email: z
    .string({
      invalid_type_error: 'profile.inputsValidation.invalidEmail',
      required_error: 'profile.inputsValidation.requiredEmail',
      message: 'profile.inputsValidation.invalidEmail',
    })
    .email('profile.inputsValidation.invalidEmail'),
  name: z
    .string({
      invalid_type_error: 'profile.inputsValidation.invalidName',
      required_error: 'profile.inputsValidation.requiredName',
      message: 'profile.inputsValidation.invalidName',
    })
    .min(2, 'profile.inputsValidation.nameMinLength'),
});

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

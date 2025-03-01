import { z } from 'zod';

import { UserRole } from '@/modules/users/types/user.type';

export const createUserSchema = z.object({
  name: z
    .string({
      message: 'users.inputsValidation.invalidName',
      invalid_type_error: 'users.inputsValidation.invalidName',
      required_error: 'users.inputsValidation.requiredName',
    })
    .min(1, {
      message: 'users.inputsValidation.nameMinLength',
    }),
  email: z
    .string({
      message: 'users.inputsValidation.invalidEmail',
      invalid_type_error: 'users.inputsValidation.invalidEmail',
      required_error: 'users.inputsValidation.requiredEmail',
    })
    .email('users.inputsValidation.invalidEmail'),
  role: z.nativeEnum(UserRole, {
    message: 'users.inputsValidation.invalidRole',
    invalid_type_error: 'users.inputsValidation.invalidRole',
    required_error: 'users.inputsValidation.requiredRole',
  }),
  locale: z
    .string({
      message: 'users.inputsValidation.invalidLocale',
      invalid_type_error: 'users.inputsValidation.invalidLocale',
      required_error: 'users.inputsValidation.requiredLocale',
    })
    .optional(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

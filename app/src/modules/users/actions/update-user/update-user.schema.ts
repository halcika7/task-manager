import { z } from 'zod';

import { createUserSchema } from '@/modules/users/actions/create-user/create-user.schema';

export const updateUserSchema = createUserSchema.extend({
  id: z
    .string({
      message: 'users.inputsValidation.invalidId',
      invalid_type_error: 'users.inputsValidation.invalidId',
      required_error: 'users.inputsValidation.requiredId',
    })
    .cuid('users.inputsValidation.invalidId'),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

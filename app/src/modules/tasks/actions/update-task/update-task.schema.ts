import { z } from 'zod';

import { createTaskSchema } from '@/modules/tasks/actions/create-task/create-task.schema';

export const updateTaskSchema = createTaskSchema.extend({
  id: z
    .string({
      invalid_type_error: 'tasks.inputsValidation.invalidId',
      required_error: 'tasks.inputsValidation.requiredId',
      message: 'tasks.inputsValidation.invalidId',
    })
    .cuid({
      message: 'tasks.inputsValidation.invalidId',
    }),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;

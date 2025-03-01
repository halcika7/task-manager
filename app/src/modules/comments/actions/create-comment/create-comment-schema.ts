import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z
    .string({
      invalid_type_error: 'comments.inputsValidation.invalidContent',
      required_error: 'comments.inputsValidation.requiredContent',
      message: 'comments.inputsValidation.invalidContent',
    })
    .min(1, 'comments.inputsValidation.contentMinLength'),
  taskId: z
    .string({
      invalid_type_error: 'comments.inputsValidation.invalidTaskId',
      required_error: 'comments.inputsValidation.requiredTaskId',
      message: 'comments.inputsValidation.invalidTaskId',
    })
    .cuid({
      message: 'comments.inputsValidation.invalidTaskId',
    }),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;

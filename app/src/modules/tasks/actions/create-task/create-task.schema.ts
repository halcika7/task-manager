import { z } from 'zod';

import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '@/modules/tasks/types/task.type';

export const createTaskSchema = z.object({
  title: z
    .string({
      invalid_type_error: 'tasks.inputsValidation.invalidTitle',
      required_error: 'tasks.inputsValidation.requiredTitle',
      message: 'tasks.inputsValidation.invalidTitle',
    })
    .min(1, 'tasks.inputsValidation.titleMinLength'),
  description: z
    .string({
      invalid_type_error: 'tasks.inputsValidation.invalidDescription',
      required_error: 'tasks.inputsValidation.requiredDescription',
      message: 'tasks.inputsValidation.invalidDescription',
    })
    .min(1, 'tasks.inputsValidation.descriptionMinLength'),
  status: z.nativeEnum(TaskStatus, {
    invalid_type_error: 'tasks.inputsValidation.invalidStatus',
    required_error: 'tasks.inputsValidation.requiredStatus',
    message: 'tasks.inputsValidation.invalidStatus',
  }),
  priority: z.nativeEnum(TaskPriority, {
    invalid_type_error: 'tasks.inputsValidation.invalidPriority',
    required_error: 'tasks.inputsValidation.requiredPriority',
    message: 'tasks.inputsValidation.invalidPriority',
  }),
  category: z.nativeEnum(TaskCategory, {
    invalid_type_error: 'tasks.inputsValidation.invalidCategory',
    required_error: 'tasks.inputsValidation.requiredCategory',
    message: 'tasks.inputsValidation.invalidCategory',
  }),
  dueDate: z
    .date({
      invalid_type_error: 'tasks.inputsValidation.invalidDueDate',
      required_error: 'tasks.inputsValidation.requiredDueDate',
      message: 'tasks.inputsValidation.invalidDueDate',
    })
    .optional(),
  assigneeId: z
    .string({
      invalid_type_error: 'tasks.inputsValidation.invalidAssigneeId',
      required_error: 'tasks.inputsValidation.requiredAssigneeId',
      message: 'tasks.inputsValidation.invalidAssigneeId',
    })
    .cuid({
      message: 'tasks.inputsValidation.invalidAssigneeId',
    })
    .optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

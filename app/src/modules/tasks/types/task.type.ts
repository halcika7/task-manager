import type { User } from '@/modules/users/types/user.type';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TaskCategory {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  OTHER = 'OTHER',
  LEARNING = 'LEARNING',
}

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedToId: string;
  createdById: string;
  assignedTo?: User;
  createdBy?: User;
  position: number;
};

import type { User } from '@/modules/users/types/user.type';

export type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  taskId: string;
  userId: string;
};

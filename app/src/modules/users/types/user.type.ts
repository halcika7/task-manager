export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locale: string;
  createdAt: string;
  updatedAt: string;
};

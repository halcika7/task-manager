'use client';

import { createContext } from 'react';

import type { User } from '@/modules/users/types/user.type';

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

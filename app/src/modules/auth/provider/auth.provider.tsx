'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useCallback } from 'react';

import { logoutAction } from '@/modules/auth/actions/logout.action';
import { AuthContext } from '@/modules/auth/provider/auth.context';
import type { User } from '@/modules/users/types/user.type';

interface AuthProviderProps {
  children: ReactNode;
  session?: User;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  const router = useRouter();
  const logout = useCallback(async () => {
    try {
      await logoutAction();
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  return (
    <AuthContext value={{ user: session, logout }}>{children}</AuthContext>
  );
}

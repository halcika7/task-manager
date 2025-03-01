'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import { AuthContext } from '@/modules/auth/provider/auth.context';
import type { User } from '@/modules/users/types/user.type';
import { logout as logoutAction } from '@/shared/lib/logout';

interface AuthProviderProps {
  children: ReactNode;
  session?: User;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(session ?? null);
  const router = useRouter();
  const logout = useCallback(async () => {
    try {
      await logoutAction();
      setUser(null);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  return <AuthContext value={{ user, logout }}>{children}</AuthContext>;
}

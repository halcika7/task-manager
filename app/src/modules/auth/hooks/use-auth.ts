'use client';

import { use } from 'react';
import { AuthContext } from '@/modules/auth/provider/auth.context';

export function useAuth() {
  const context = use(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

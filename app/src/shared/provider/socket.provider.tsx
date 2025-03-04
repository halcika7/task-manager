'use client';

import type { Session } from 'next-auth';
import type { ReactNode } from 'react';
import { createContext, useState } from 'react';
import type { Socket } from 'socket.io-client';

import { socketService } from '@/shared/lib/socket';

interface SocketProviderProps {
  children: ReactNode;
  session: Session | null;
}

type SocketContextType = Readonly<{
  socket?: Socket | null;
}>;

export const SocketContext = createContext<SocketContextType | null>({
  socket: null,
});

export function SocketProvider({ children, session }: SocketProviderProps) {
  const [socket] = useState(() => socketService.init(session!));

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

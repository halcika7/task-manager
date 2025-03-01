'use client';

import { useEffect, useRef } from 'react';

import type { TaskEvent } from '@/shared/lib/socket';
import { socketService } from '@/shared/lib/socket';

export type SocketCallback<T extends keyof TaskEvent> = (
  data: TaskEvent[T]
) => void;

export function useSocket<T extends keyof TaskEvent>(
  event: T,
  callback: SocketCallback<T>
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (data: TaskEvent[T]) => {
      savedCallback.current(data);
    };

    socketService?.on(event, handler);

    return () => {
      socketService?.off(event, handler);
    };
  }, [event]);
}

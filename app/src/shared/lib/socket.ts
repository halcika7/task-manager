import type { Session } from 'next-auth';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import type { Comment } from '@/modules/comments/types/comment.type';
import type { Task } from '@/modules/tasks/types/task.type';
import { BACKEND_URL } from '@/shared/constants';

// Types for socket events
export interface TaskEvent {
  taskCreated: Task;
  taskUpdated: Task;
  taskDeleted: Task;
  commentAdded: Comment;
  commentDeleted: Comment;
  taskReminder: Task & {
    hoursUntilDue: number;
  };
}

class SocketService {
  private static instance: SocketService | null = null;
  private socket: Socket | null = null;
  private accessToken: string | null = null;
  private connectionQueue: (() => void)[] = [];

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public init(session: Session) {
    if (this.socket?.connected) {
      return;
    }

    this.accessToken = session.token;

    this.socket = io(BACKEND_URL?.replace('/api', ''), {
      auth: {
        token: this.accessToken,
        userId: session.user?.id || '',
      },
      extraHeaders: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      autoConnect: true,
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      this.processQueue();
    });

    this.socket.on('connect_error', error => {
      console.error('Socket Connection Error ❌:', error);
    });

    this.socket.on('disconnect', reason => {
      console.log('Socket Disconnected ❌:', reason);
    });

    return this.socket;
  }

  private processQueue() {
    while (this.connectionQueue.length > 0) {
      const operation = this.connectionQueue.shift();
      operation?.();
    }
  }

  private ensureConnection(operation: () => void) {
    if (this.socket?.connected) {
      operation();
    } else {
      this.connectionQueue.push(operation);
    }
  }

  public joinTask(taskId: string) {
    this.ensureConnection(() => {
      this.socket?.emit('joinTask', taskId);
    });
  }

  public leaveTask(taskId: string) {
    this.ensureConnection(() => {
      this.socket?.emit('leaveTask', taskId);
    });
  }

  public on<T extends keyof TaskEvent>(
    event: T,
    callback: (data: TaskEvent[T]) => void
  ) {
    this.ensureConnection(() => {
      this.socket?.on(event as string, callback);
    });
  }

  public off<T extends keyof TaskEvent>(
    event: T,
    callback: (data: TaskEvent[T]) => void
  ) {
    this.socket?.off(event as string, callback);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectionQueue = [];
  }
}

export const socketService = SocketService.getInstance();

import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../../auth/guards/ws-jwt-auth.guard';
import { Task, TaskComment } from '@prisma/client';

@WSGateway({
  cors: {
    origin: process.env.APP_URL,
    credentials: true,
  },
})
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, Socket[]> = new Map();

  handleConnection(client: Socket) {
    const userId = client?.handshake?.auth?.userId as string;
    if (userId) {
      const userSockets = this.userSockets.get(userId) || [];
      userSockets.push(client);
      this.userSockets.set(userId, userSockets);
      client.send('connected', { userId });
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client?.handshake?.auth?.userId as string;
    if (userId) {
      const userSockets = this.userSockets.get(userId) || [];
      const updatedSockets = userSockets.filter(
        (socket) => socket.id !== client.id,
      );
      if (updatedSockets.length > 0) {
        this.userSockets.set(userId, updatedSockets);
      } else {
        this.userSockets.delete(userId);
      }
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('joinTask')
  async handleJoinTask(client: Socket, taskId: string) {
    await client.join(`task-${taskId}`);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('leaveTask')
  async handleLeaveTask(client: Socket, taskId: string) {
    await client.leave(`task-${taskId}`);
  }

  notifyTaskCreated(task: Task, ...userIds: string[]) {
    // Notify task creator and assignee
    this.notifyUsers(userIds, 'taskCreated', task);
  }

  notifyTaskUpdated(task: Task, ...userIds: string[]) {
    // Notify task creator, assignee, and anyone viewing the task
    this.notifyUsers(userIds, 'taskUpdated', task);
    this.server.to(`task-${task.id}`).emit('taskUpdated', task);
  }

  notifyTaskDeleted(task: Task, ...userIds: string[]) {
    // Notify all connected clients about task deletion
    this.notifyUsers(userIds, 'taskDeleted', task);
    this.server.to(`task-${task.id}`).emit('taskDeleted', task);
  }

  notifyCommentAdded(comment: TaskComment) {
    // Notify task room about new comment
    this.server.to(`task-${comment.taskId}`).emit('commentAdded', comment);
  }

  notifyCommentDeleted(comment: TaskComment) {
    this.server.to(`task-${comment.taskId}`).emit('commentDeleted', comment);
  }

  notifyTaskReminder(userId: string, data: Task & { hoursUntilDue: number }) {
    this.server.to(userId).emit('taskReminder', data);
  }

  private notifyUsers(userIds: string[], event: string, data: any) {
    userIds.forEach((userId) => {
      const userSockets = this.userSockets.get(userId);
      if (userSockets) {
        userSockets.forEach((socket) => socket.emit(event, data));
      }
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebSocketGateway } from '../task/gateways/task.gateway';
import { ActivityLogAction } from '@prisma/client';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wsGateway: WebSocketGateway,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async addComment(userId: string, taskId: string, content: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const comment = await this.prisma.taskComment.create({
      data: {
        content,
        task: { connect: { id: taskId } },
        user: { connect: { id: userId } },
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    // Notify about new comment
    this.wsGateway.notifyCommentAdded(comment);

    // Log activity
    await this.activityLogService.createLog({
      action: ActivityLogAction.CREATE_COMMENT,
      entityId: comment.id,
      entityType: 'COMMENT',
      userId,
      details: { comment, task },
    });

    return comment;
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.prisma.taskComment.findFirst({
      where: { id: commentId, userId },
      include: { task: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.taskComment.delete({
      where: { id: commentId },
    });

    // Notify about comment deletion
    this.wsGateway.notifyCommentDeleted(comment);

    // Log activity
    await this.activityLogService.createLog({
      action: ActivityLogAction.DELETE_COMMENT,
      entityId: commentId,
      entityType: 'COMMENT',
      userId,
      details: { comment, task: comment.task },
    });

    return { message: 'Comment deleted successfully', success: true };
  }

  async getComments(taskId: string, query: PaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [comments, total] = await this.prisma.$transaction([
      this.prisma.taskComment.findMany({
        where: { taskId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.taskComment.count({ where: { taskId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: comments,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}

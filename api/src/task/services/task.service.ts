import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WebSocketGateway } from '../gateways/task.gateway';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TasksQueryDto } from '../dto/tasks-query.dto';
import { Prisma, Task, TaskStatus } from '@prisma/client';
import { ActivityLogService } from '../../activity-log/activity-log.service';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private readonly wsGateway: WebSocketGateway,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async createTask(userId: string, { assigneeId, ...dto }: CreateTaskDto) {
    // Start a transaction since we need to update multiple records
    return this.prisma.$transaction(async (tx) => {
      // Shift all tasks in the same status down by 1
      await tx.task.updateMany({
        where: {
          status: dto.status || TaskStatus.PENDING,
        },
        data: {
          position: {
            increment: 1,
          },
        },
      });

      // Create the new task at position 0
      const task = await tx.task.create({
        data: {
          ...dto,
          position: 0, // New tasks always go to the top
          assignedTo: { connect: { id: assigneeId } },
          createdBy: { connect: { id: userId } },
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Notify about new task creation
      this.wsGateway.notifyTaskCreated(task, assigneeId);

      // Log activity
      await tx.activityLog.create({
        data: {
          action: 'CREATE_TASK',
          entityId: task.id,
          entityType: 'TASK',
          userId,
          details: task,
        },
      });

      return task;
    });
  }

  async getTasks(query: TasksQueryDto) {
    const where: Prisma.TaskWhereInput = {
      ...(query?.status ? { status: query.status } : {}),
      ...(query?.priority ? { priority: query.priority } : {}),
      ...(query?.category ? { category: query.category } : {}),
      ...(query?.assigneeId ? { assignedToId: query.assigneeId } : {}),
      ...(query?.createdById ? { createdById: query.createdById } : {}),
      ...(query?.dateFrom ? { dueDate: { gte: query.dateFrom } } : {}),
      ...(query?.dateTo ? { dueDate: { lte: query.dateTo } } : {}),
      ...(query?.search
        ? { title: { contains: query.search, mode: 'insensitive' } }
        : {}),
    };

    const [tasks, groupedTasks] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: query.orderBy
          ? { [query.orderBy]: query.orderDir }
          : { position: 'asc' },
      }),
      this.prisma.task.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
    ]);

    const result: Record<TaskStatus, { data: Task[]; count: number }> = {
      PENDING: {
        data: [],
        count: 0,
      },
      IN_PROGRESS: {
        data: [],
        count: 0,
      },
      COMPLETED: {
        data: [],
        count: 0,
      },
    };

    tasks.forEach((task) => {
      result[task.status].data.push(task);
    });

    groupedTasks.forEach((group) => {
      result[group.status].count = group._count;
    });

    return {
      data: result,
    };
  }

  async getTaskById(taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(
    userId: string,
    taskId: string,
    { assigneeId, ...dto }: CreateTaskDto,
  ) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...dto,
        assignedTo: { connect: { id: assigneeId } },
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const notifyUserIds: string[] = [];

    if (userId !== updatedTask.createdById) {
      notifyUserIds.push(updatedTask.createdById);
    }

    if (userId !== updatedTask.assignedToId) {
      notifyUserIds.push(updatedTask.assignedToId);
    }

    // Notify about task update
    this.wsGateway.notifyTaskUpdated(updatedTask, ...notifyUserIds);

    // Log activity
    await this.prisma.activityLog.create({
      data: {
        action: 'UPDATE_TASK',
        entityId: taskId,
        entityType: 'TASK',
        userId,
        details: updatedTask,
      },
    });

    return updatedTask;
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    const notifyUserIds: string[] = [];

    if (userId !== task.createdById) {
      notifyUserIds.push(task.createdById);
    }

    if (userId !== task.assignedToId) {
      notifyUserIds.push(task.assignedToId);
    }

    // Notify about task deletion
    this.wsGateway.notifyTaskDeleted(task, ...notifyUserIds);

    // Log activity
    await this.prisma.activityLog.create({
      data: {
        action: 'DELETE_TASK',
        entityId: taskId,
        entityType: 'TASK',
        userId,
        details: task,
      },
    });

    return { message: 'Task deleted successfully', success: true };
  }

  async updateTaskPosition(
    taskId: string,
    newStatus: TaskStatus,
    newPosition: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Get the task to be moved
      const task = await tx.task.findUnique({
        where: { id: taskId },
        select: { status: true, position: true },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (task.status === newStatus) {
        // Moving within the same status
        if (task.position === newPosition) return; // No change needed

        if (task.position < newPosition) {
          // Moving down - shift tasks up
          await tx.task.updateMany({
            where: {
              status: newStatus,
              position: {
                gt: task.position,
                lte: newPosition,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          });
        } else {
          // Moving up - shift tasks down
          await tx.task.updateMany({
            where: {
              status: newStatus,
              position: {
                gte: newPosition,
                lt: task.position,
              },
            },
            data: {
              position: {
                increment: 1,
              },
            },
          });
        }
      } else {
        // Moving to a different status
        // 1. Shift up tasks in old status
        await tx.task.updateMany({
          where: {
            status: task.status,
            position: {
              gt: task.position,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });

        // 2. Shift down tasks in new status
        await tx.task.updateMany({
          where: {
            status: newStatus,
            position: {
              gte: newPosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }

      // Update the task's position and status
      return tx.task.update({
        where: { id: taskId },
        data: {
          status: newStatus,
          position: newPosition,
        },
      });
    });
  }
}

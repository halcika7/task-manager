import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WebSocketGateway } from '../gateways/task.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from '../../mail/mail.service';
import { ActivityLogAction, Task } from '@prisma/client';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReminderService implements OnModuleInit {
  private readonly REMINDER_HOURS = [24, 12, 1]; // Hours before due date to send reminders

  constructor(
    private readonly prisma: PrismaService,
    private readonly wsGateway: WebSocketGateway,
    private readonly mailService: MailService,
    private readonly activityLogService: ActivityLogService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    // Initialize any reminder setup if needed
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkDueTasks() {
    const tasks = await this.prisma.task.findMany({
      where: {
        dueDate: {
          not: null,
        },
        status: {
          not: 'COMPLETED',
        },
      },
      include: {
        assignedTo: true,
      },
    });

    for (const task of tasks) {
      if (!task.dueDate) continue;

      const hoursUntilDue = this.getHoursUntilDue(task.dueDate);

      if (this.REMINDER_HOURS.includes(hoursUntilDue)) {
        await this.sendReminder(task, hoursUntilDue);
      }
    }
  }

  private async sendReminder(task: Task, hoursUntilDue: number) {
    const user = await this.userService.getUserById(task.assignedToId);
    // Send email reminder
    await this.mailService.sendTaskReminder({
      to: user.email,
      taskTitle: task.title,
      hoursUntilDue,
      taskId: task.id,
      userName: user.name,
      locale: user.locale,
    });

    // Send real-time notification
    this.wsGateway.notifyTaskReminder(user.id, {
      ...task,
      hoursUntilDue,
    });

    await this.activityLogService.createLog({
      action: ActivityLogAction.TASK_REMINDER,
      entityId: task.id,
      entityType: 'TASK',
      userId: user.id,
      details: {
        hoursUntilDue,
        ...task,
      },
    });
  }

  private getHoursUntilDue(dueDate: Date): number {
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60));
  }
}

import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './services/task.service';
import { ReminderService } from './services/reminder.service';
import { WebSocketGateway } from './gateways/task.gateway';
import { MailModule } from '../mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [MailModule, ScheduleModule.forRoot()],
  controllers: [TaskController],
  providers: [
    TaskService,
    ReminderService,
    WebSocketGateway,
    PrismaService,
    JwtService,
    ActivityLogService,
    UserService,
  ],
  exports: [WebSocketGateway],
})
export class TaskModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { UsersModule } from './user/users.module';
import { ActivityLogsModule } from './activity-log/activity-log.module';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { PrismaService } from './prisma/prisma.service';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    AuthModule,
    TaskModule,
    UsersModule,
    ActivityLogsModule,
    CommentModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { CommentService } from './comment.service';
import { WebSocketGateway } from '../task/gateways/task.gateway';
import { CommentController } from './comment.controller';

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [
    CommentService,
    PrismaService,
    ActivityLogService,
    WebSocketGateway,
    JwtService,
  ],
})
export class CommentModule {}

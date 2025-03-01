import { IsString, IsOptional, IsEnum, IsDate, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority, TaskCategory } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Task description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ enum: TaskCategory, default: TaskCategory.WORK })
  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: 'ID of the user to assign the task to' })
  @IsString()
  @Matches(/^c[a-z0-9]{24}$/, { message: 'Invalid CUID format' })
  assigneeId: string;
}

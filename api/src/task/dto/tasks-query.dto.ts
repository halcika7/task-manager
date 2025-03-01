import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority, TaskCategory } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class TasksQueryDto extends PaginationDto {
  @ApiProperty({ enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority, required: false })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ enum: TaskCategory, required: false })
  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  createdById?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  dateFrom?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  dateTo?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  orderBy?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  orderDir?: string;
}

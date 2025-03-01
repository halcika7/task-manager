import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './services/task.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksQueryDto } from './dto/tasks-query.dto';
import { RequestWithUser } from '../common/types/request.type';
import { TaskStatus } from '@prisma/client';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({
    type: CreateTaskDto,
    required: true,
    description: 'The task details',
    schema: {
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        assigneeId: { type: 'string' },
        status: { type: 'enum' },
        priority: { type: 'enum' },
        category: { type: 'enum' },
        dueDate: { type: 'string', format: 'date' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  createTask(@Request() req: RequestWithUser, @Body() dto: CreateTaskDto) {
    return this.taskService.createTask(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the current user' })
  @ApiQuery({ type: TasksQueryDto })
  @ApiResponse({ status: 200, description: 'Returns paginated tasks' })
  getTasks(@Query() query: TasksQueryDto) {
    return this.taskService.getTasks(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'The task ID' })
  @ApiResponse({ status: 200, description: 'Returns the task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', type: 'string', description: 'The task ID' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  updateTask(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.taskService.updateTask(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', type: 'string', description: 'The task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  deleteTask(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.taskService.deleteTask(req.user.id, id);
  }

  @Patch(':id/position')
  @ApiOperation({ summary: 'Update task position' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        },
        position: { type: 'number', minimum: 0 },
      },
      required: ['status', 'position'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Task position updated successfully',
  })
  async updateTaskPosition(
    @Request() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() dto: { status: TaskStatus; position: number },
  ) {
    return this.taskService.updateTaskPosition(
      taskId,
      dto.status,
      dto.position,
    );
  }
}

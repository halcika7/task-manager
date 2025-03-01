import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
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
import { RequestWithUser } from '../common/types/request.type';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({
    type: CreateCommentDto,
    required: true,
    description: 'The comment details',
  })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  createComment(
    @Request() req: RequestWithUser,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.addComment(req.user.id, dto.taskId, dto.content);
  }

  @Get('task/:taskId')
  @ApiOperation({ summary: 'Get all comments for a task' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'The task ID' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'Returns paginated comments' })
  getComments(@Param('taskId') taskId: string, @Query() query: PaginationDto) {
    return this.commentService.getComments(taskId, query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', type: 'string', description: 'The comment ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  deleteComment(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.commentService.deleteComment(req.user.id, id);
  }
}

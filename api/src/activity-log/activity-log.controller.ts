import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivityLogDto } from './dto/activity-log.dto';
import { ActivityLogFilterDto } from './dto/activity-log-filter.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('activity-logs')
@Controller('activity-logs')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activity logs (Admin only)' })
  @ApiQuery({ type: ActivityLogFilterDto })
  @ApiResponse({
    status: 200,
    description: 'Returns all activity logs',
    type: [ActivityLogDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getLogs(@Query() filters: ActivityLogFilterDto) {
    return this.activityLogService.getLogs(filters);
  }
}

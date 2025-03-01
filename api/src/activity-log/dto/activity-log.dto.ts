import { ApiProperty } from '@nestjs/swagger';

export class ActivityLogDto {
  @ApiProperty({ description: 'Activity log ID' })
  id: string;

  @ApiProperty({ description: 'Action performed', example: 'CREATE_TASK' })
  action: string;

  @ApiProperty({ description: 'ID of the entity affected' })
  entityId: string;

  @ApiProperty({ description: 'Type of entity', example: 'TASK' })
  entityType: string;

  @ApiProperty({ description: 'ID of the user who performed the action' })
  userId: string;

  @ApiProperty({ description: 'Additional details about the action' })
  details: Record<string, any>;

  @ApiProperty({ description: 'When the action was performed' })
  createdAt: Date;
}

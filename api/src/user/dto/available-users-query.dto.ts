import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class AvailableUsersQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;
}

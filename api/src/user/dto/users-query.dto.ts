import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class UsersQueryDto extends PaginationDto {
  @ApiProperty({ enum: Role, required: false })
  @IsOptional()
  role?: Role;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    enum: ['name', 'email', 'role', 'createdAt'],
    required: false,
    default: 'createdAt',
  })
  @IsString()
  @IsOptional()
  orderBy?: 'name' | 'email' | 'role' | 'createdAt' = 'createdAt';

  @ApiProperty({ enum: ['asc', 'desc'], required: false, default: 'desc' })
  @IsString()
  @IsOptional()
  orderDir?: 'asc' | 'desc' = 'desc';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  dateFrom?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  dateTo?: string;
}

import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityLogAction } from '@prisma/client';

export class ActivityLogFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  entityType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  action?: ActivityLogAction;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  dateFrom?: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  dateTo?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  orderBy?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  orderDir?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;
}

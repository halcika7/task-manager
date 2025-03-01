import {
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'User role', enum: Role, default: Role.USER })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ description: 'User locale', required: false })
  @IsString()
  @IsOptional()
  locale?: string;
}

export class AdminCreateUserDto extends CreateUserDto {
  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsOptional()
  @MinLength(0)
  password = '';
}

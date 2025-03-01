import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEmail,
  IsUrl,
  IsEnum,
  IsOptional,
  validate as validateObject,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  // Server
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  HOST: string = '0.0.0.0';

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  TRUST_PROXY: boolean = false;

  // CORS
  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = 'http://localhost:3000';

  // JWT
  @IsString()
  JWT_SECRET: string;

  @IsString()
  REFRESH_JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  REFRESH_JWT_EXPIRES_IN: string;

  // Database
  @IsString()
  DATABASE_URL: string;

  // Mail
  @IsString()
  MAIL_HOST: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  MAIL_PORT: number = 587;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  MAIL_SECURE: boolean = false;

  @IsString()
  MAIL_USER: string;

  @IsString()
  MAIL_PASSWORD: string;

  @IsString()
  @IsOptional()
  MAIL_FROM_NAME: string = 'Task Manager';

  @IsEmail()
  MAIL_FROM_ADDRESS: string;

  // Google OAuth
  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsUrl({
    require_tld: false,
    require_protocol: true,
    require_host: true,
    require_port: false,
    require_valid_protocol: true,
    protocols: ['http', 'https'],
  })
  GOOGLE_CALLBACK_URL: string;

  // Frontend
  @IsUrl({
    require_tld: false,
    require_protocol: true,
    require_host: true,
    require_port: false,
    require_valid_protocol: true,
    protocols: ['http', 'https'],
  })
  @IsOptional()
  APP_URL: string = 'http://localhost:3000';
}

export async function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config);

  const errors = await validateObject(validatedConfig);

  if (errors.length > 0) {
    throw new Error(`Config validation error: ${errors.join(', ')}`);
  }

  return validatedConfig;
}

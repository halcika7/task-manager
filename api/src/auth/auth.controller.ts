import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-oauth.guard';
import { RequestWithUser } from 'src/common/types/request.type';
import { Role } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: CreateUserDto,
    required: true,
    description: 'The email, password, and name of the user',
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        name: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser({
      ...createUserDto,
      role: Role.USER,
    });
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    type: LoginDto,
    required: true,
    description: 'The email and password of the user',
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Req() req: RequestWithUser) {
    return this.authService.signOut(req.user.id);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refresh(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  googleAuth() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google login successful' })
  async googleAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const result = await this.authService.login(req.user);

    const frontendUrl = this.configService.getOrThrow<string>('APP_URL');
    res.redirect(
      `${frontendUrl}/api/auth/google/callback?userId=${result.id}&name=${result.name}&accessToken=${result.accessToken}&refreshToken=${result.refreshToken}&role=${result.role}`,
    );
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiBody({
    required: true,
    description: 'The email of the user',
    schema: {
      properties: { email: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  forgotPassword(@Body() body: { email: string }, @Req() req: RequestWithUser) {
    const locale = req.headers['accept-language']?.split(',')[0];
    return this.authService.forgotPassword(body.email, locale);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    required: true,
    description: 'The token and new password of the user',
    schema: {
      properties: { token: { type: 'string' }, password: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }
}

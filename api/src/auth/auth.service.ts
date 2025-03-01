import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { MailService } from '../mail/mail.service';
import resetPasswordConfig from './config/reset-password.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    @Inject(resetPasswordConfig.KEY)
    private resetPasswordTokenConfig: ConfigType<typeof resetPasswordConfig>,
    private readonly mailService: MailService,
  ) {}

  private async getUserById(userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    return user;
  }

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.getByEmail(createUserDto.email);

    if (user) throw new ConflictException('User already exists!');

    const newUser = await this.userService.createUser(createUserDto);

    return {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
    };
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) throw new UnauthorizedException('User not found!');

    const isPasswordMatched = await verify(user.password || '', password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    return { id: user.id, name: user.name, role: user.role };
  }

  async login(userData: User) {
    const { accessToken, refreshToken } = await this.generateTokens(
      userData.id,
    );

    const hashedRT = await hash(refreshToken, {
      secret: Buffer.from(this.refreshTokenConfig.secret!),
    });

    await this.userService.updateHashedRefreshToken(userData.id, hashedRT);

    return {
      id: userData.id,
      name: userData.name,
      role: userData.role,
      locale: userData.locale,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken };
  }

  async validateJwtUser(userId: string) {
    const user = await this.getUserById(userId);
    return { id: user.id, role: user.role };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.getUserById(userId);

    const refreshTokenMatched = await verify(
      user.hashedRefreshToken || '',
      refreshToken,
      {
        secret: Buffer.from(this.refreshTokenConfig.secret!),
      },
    );

    if (!refreshTokenMatched) {
      throw new UnauthorizedException('Invalid Refresh Token!');
    }

    return { id: user.id };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.getByEmail(googleUser.email);

    if (user) return user;

    return this.userService.createUser(googleUser);
  }

  signOut(userId: string) {
    return this.userService.updateHashedRefreshToken(userId, null);
  }

  async forgotPassword(email: string, locale = 'en') {
    const user = await this.userService.getByEmail(email);

    if (!user) throw new NotFoundException('User not found!');

    const resetToken = await this.jwtService.signAsync(
      { sub: user.id },
      this.resetPasswordTokenConfig,
    );

    await this.mailService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.name,
      locale,
    );

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, password: string) {
    const { sub } = await this.jwtService.verifyAsync<AuthJwtPayload>(token, {
      secret: this.resetPasswordTokenConfig.secret!,
    });

    const user = await this.getUserById(sub);

    await this.userService.updateUser(user.id, { password });

    return { message: 'Password reset successful' };
  }
}

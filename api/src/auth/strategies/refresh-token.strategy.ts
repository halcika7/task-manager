import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import refreshConfig from '../config/refresh.config';
import { Request } from 'express';
import { AuthJwtPayload } from '../types/auth-jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: refreshTokenConfig.secret!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  // request.user
  validate(req: Request, payload: AuthJwtPayload) {
    const userId = payload.sub;
    const refreshToken = (req.body as { refresh: string }).refresh;

    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}

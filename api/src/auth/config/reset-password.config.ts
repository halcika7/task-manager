import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'reset-password',
  (): JwtSignOptions => ({
    secret: process.env.RESET_PASSWORD_JWT_SECRET,
    expiresIn: process.env.RESET_PASSWORD_JWT_EXPIRES_IN,
  }),
);

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
    });
  }

  async validate(payload: any) {
    this.logger.log(`JWT validated for user: ${payload.email} (${payload.role})`);
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      country: payload.country,
    };
  }
}

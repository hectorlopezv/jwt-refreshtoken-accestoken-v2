import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/types';
@Injectable()
export class AccesstokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayload, done) {
    return payload;
  }
}

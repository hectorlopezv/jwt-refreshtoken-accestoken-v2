import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, JwtPayloadWithRefreshToken } from '../types/types';
@Injectable()
export class RtStategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req?.get('authorization')?.replace('Bearer ', '');
    return { ...payload, refreshToken };
  }
}

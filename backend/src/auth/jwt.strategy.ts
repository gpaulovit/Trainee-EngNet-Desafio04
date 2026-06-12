import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        let token = null;
        if (request && request.cookies) {
          token = request.cookies['access_token'];
        }
        return token;
      }]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'buioavbuoav#!@#eBUOACBUOAoadbioçac*!#iaeeakjpçeioçgjiçfawe129-03091r9-645&¨(769ft7qe8qygve@!#(&',
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, perfil: payload.perfil };
  }
}
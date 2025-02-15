import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Asegúrate de que valide la expiración
      secretOrKey: process.env.JWT_SECRET, // Usa tu clave secreta
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}

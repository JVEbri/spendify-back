import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: any): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, { expiresIn: '2h' });
  }

  generateRefreshToken(user: any): string {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}

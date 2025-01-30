import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token no proporcionado');
    }

    try {
      // Verifica y decodifica el refresh token
      const payload = this.jwtService.verify(refreshToken, {});

      // Adjunta el usuario decodificado al objeto de la solicitud
      request.user = payload;
      return true;
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  }
}

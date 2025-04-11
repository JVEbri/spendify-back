import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private readonly fakeUsers = [
    {
      id: 42,
      email: 'ebrigomezjv@gmail.com',
      password: 'admin', // En real life esto va hasheado
    },
  ];

  async login({ email, password }: LoginDto) {
    if (email !== 'ebrigomezjv@gmail.com') {
      throw new UnauthorizedException('Email no permitido');
    }

    const user = await this.usersService.findOneByEmail(email);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Aquí puedes usar bcrypt si ya tienes passwords hasheadas
    if (password !== 'admin') {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const accessToken = this.generateJwt(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
  generateJwt(user: any): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, { expiresIn: '2h' });
  }

  generateRefreshToken(user: any): string {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}

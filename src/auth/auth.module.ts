import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule, // Asegúrate de importar ConfigModule
    JwtModule.registerAsync({
      imports: [ConfigModule], // Necesita importar ConfigModule para usar ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Carga la clave secreta desde el .env
        signOptions: { expiresIn: '2h' }, // Configuración adicional para el token
      }),
      inject: [ConfigService], // Inyecta ConfigService
    }),
    UsersModule, // Importa el módulo de usuarios
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}

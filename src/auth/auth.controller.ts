import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Post } from '@nestjs/common';
import { RefreshTokenGuard } from './refresh-token.guard';
import { LoginDto } from './dto/login.dto';
@ApiTags('Autenticación') // Grupo de rutas en Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Iniciar sesión con Google' }) // Descripción de la operación
  @ApiResponse({ status: 302, description: 'Redirección a Google' }) // Respuesta esperada
  @Get('google')
  //@UseGuards(AuthGuard('google')) // Guarda el usuario en la sesión
  googleLogin(@Req() req: Request, @Res() res: Response) {
    const invitationToken = req.query.invitationToken as string;
    const state = invitationToken ? encodeURIComponent(JSON.stringify({ invitationToken })) : '';

    console.log('🔄 Token de invitación enviado:', invitationToken);
    console.log('🔄 Parámetro state enviado:', state);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=email%20profile&state=${state}`;

    console.log('🔄 URL final de autenticación:', googleAuthUrl);

    res.redirect(googleAuthUrl); // Redirige manualmente a Google
  }

  @ApiOperation({ summary: 'Callback de Google' }) // Descripción de la operación
  @ApiResponse({ status: 200, description: 'Usuario autenticado con éxito' }) // Respuesta esperada
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    console.log('🔄 Recibido en Google Callback:', req.query);
    console.log('🔄 Usuario en req.user:', req.user);
    const user = req.user;
    const token = this.authService.generateJwt(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    let invitationToken: string | undefined;
    if (req.query.state) {
      try {
        const decodedState = JSON.parse(decodeURIComponent(req.query.state as string));
        invitationToken = decodedState.invitationToken;
        console.log('🎯 Token de invitación recuperado:', invitationToken);
      } catch (error) {
        console.error('❌ Error al decodificar state:', error);
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (invitationToken) {
      res.redirect(`${frontendUrl}/accept-invitation/${invitationToken}?token=${token}`);
    } else {
      res.redirect(`${frontendUrl}/redirect?token=${token}`);
    }
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard) // Un guard que valide el refresh token
  refresh(@Req() req: Request): { accessToken: string } {
    const user = req.user; // Información del usuario extraída del refresh token
    const newAccessToken = this.authService.generateJwt(user); // Generar nuevo JWT
    return { accessToken: newAccessToken };
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Login correcto' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

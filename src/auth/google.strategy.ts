import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      // state: true, // Mantener el state, pero lo manejaremos manualmente
      // passReqToCallback: true, // Para poder acceder a la request
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<User> {
    console.log('✅ Ejecutando validate() en GoogleStrategy...');
    console.log('🔄 AccessToken:', accessToken);
    console.log('🔄 Profile:', profile);

    const { id, displayName, emails } = profile;
    const googleUser = {
      google_id: id,
      name: displayName,
      email: emails[0].value,
    };

    return this.usersService.findOrCreate(googleUser);
  }
}

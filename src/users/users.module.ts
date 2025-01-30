import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';

import { UsersController } from './users.controller';

import { User } from './users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registra la entidad

  providers: [UsersService],

  controllers: [UsersController],

  exports: [UsersService], // Para usarlo en otros módulos como `Auth`
})
export class UsersModule {}

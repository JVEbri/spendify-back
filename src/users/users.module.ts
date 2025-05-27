import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useFactory: (dataSource: DataSource) => new UsersRepository(dataSource),
      inject: [DataSource],
    },
  ],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

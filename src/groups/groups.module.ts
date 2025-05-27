import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './groups.entity';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User]), UsersModule],
  controllers: [GroupsController],
  providers: [GroupsService, UsersService],
  exports: [GroupsService],
})
export class GroupsModule {}

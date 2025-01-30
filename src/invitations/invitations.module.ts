import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { Invitation } from './invitations.entity';
import { MailService } from '../mail/mail.service'; // Servicio de envío de correos
import { GroupsService } from '../groups/groups.service'; // Para validaciones de grupos
import { Group } from './../groups/groups.entity';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
@Module({
  imports: [TypeOrmModule.forFeature([Invitation, Group, User])],
  controllers: [InvitationsController],
  providers: [InvitationsService, MailService, GroupsService, UsersService],
  exports: [InvitationsService],
})
export class InvitationsModule {}

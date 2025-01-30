import { Controller, Post, Body, UseGuards, Get, Param, Req } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { GroupsService } from '../groups/groups.service';
import { User } from 'src/users/users.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly groupsService: GroupsService,
  ) {}

  @UseGuards(JwtAuthGuard) // Protegemos la ruta con autenticación
  @Get(':token')
  async getInvitation(@Param('token') token: string, @Req() @CurrentUser() user: User) {
    return this.invitationsService.findByTokenAndValidateEmail(token, user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createInvitationDto: CreateInvitationDto) {
    return this.invitationsService.createInvitation(createInvitationDto);
  }

  @Post('accept')
  async acceptInvitation(@Body() { token }: { token: string }) {
    await this.invitationsService.acceptInvitation(token);

    // Procesar la invitación (e.g., añadir al usuario al grupo)
    //await this.groupsService.addUserToGroup(invitation.groupId, invitation.userId);

    // Eliminar la invitación para que no pueda usarse de nuevo
    //await this.invitationsService.deleteInvitation(token);

    return { message: 'Invitación aceptada con éxito' };
  }
}

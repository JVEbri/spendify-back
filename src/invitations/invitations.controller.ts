import { Controller, Post, Body, UseGuards, Get, Param, Req } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { GroupsService } from '../groups/groups.service';
import { User } from 'src/users/users.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from '../users/users.service';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly groupsService: GroupsService,
    private readonly userService: UsersService,
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
    const invitation = await this.invitationsService.acceptInvitation(token);

    const user = await this.userService.findOneByEmail(invitation.email);
    console.log('user', user);
    await this.groupsService.addUserToGroup(user.id, invitation.group.id);

    // Eliminar la invitación para que no pueda usarse de nuevo
    //await this.invitationsService.deleteInvitation(token);

    return { message: 'Invitación aceptada con éxito' };
  }
}

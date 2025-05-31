import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './invitations.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { GroupsService } from 'src/groups/groups.service';
@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    private readonly mailService: MailService,
    private readonly groupService: GroupsService,
  ) {}

  async createInvitation(dto: CreateInvitationDto) {
    // Generar un token único
    const token = crypto.randomBytes(20).toString('hex');

    const invitation = this.invitationRepository.create({
      email: dto.email,
      group: { id: dto.groupId }, // Relación con el grupo
      token,
    });

    await this.invitationRepository.save(invitation);

    // Enviar correo al usuario con el enlace único
    const invitationLink = `${process.env.FRONTEND_URL}/accept-invitation/${token}`;
    await this.mailService.sendMail(
      dto.email,
      'Invitación a unirse al grupo',
      `Te han invitado a unirte al grupo. Haz clic en el enlace para aceptar: ${invitationLink}`,
    );

    return { message: 'Invitación creada y correo enviado' };
  }

  async findByToken(token: string): Promise<Invitation | null> {
    return this.invitationRepository.findOne({ where: { token }, relations: ['group'] });
  }

  async findByTokenAndValidateEmail(token: string, userEmail: string): Promise<Invitation> {
    const invitation = await this.findByToken(token);

    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada o ya ha sido utilizada.');
    }

    if (invitation.email !== userEmail) {
      throw new ForbiddenException('Esta invitación no pertenece a tu dirección de correo.');
    }

    return invitation;
  }

  async delete(id: string): Promise<void> {
    await this.invitationRepository.delete(id);
  }

  async acceptInvitation(token: string): Promise<Invitation> {
    console.log('✅ Ejecutando acceptInvitation() en InvitationsService...');
    console.log('🔄 Token:', token);
    const invitation = await this.invitationRepository.findOne({
      where: { token, isUsed: false },
      relations: ['group'],
    });
    console.log('🔄 Invitación:', invitation);
    if (!invitation) {
      throw new Error();
    }

    // Marcar la invitación como usada
    invitation.isUsed = true;
    await this.invitationRepository.save(invitation);

    // Aquí asocia al usuario autenticado al grupo
    // (implementa lógica según tu caso)
    //this.groupService.addUserToGroup(userId, invitation.group.id);

    return invitation;
  }
}

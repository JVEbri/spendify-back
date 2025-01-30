import { IsEmail, IsUUID } from 'class-validator';

export class CreateInvitationDto {
  @IsEmail()
  email: string;

  @IsUUID()
  groupId: string;
}

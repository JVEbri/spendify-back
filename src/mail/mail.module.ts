import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService], // Si necesitas usar MailService en otros módulos
})
export class MailModule {}

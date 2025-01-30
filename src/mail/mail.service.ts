import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Puedes usar un proveedor de correo diferente
      auth: {
        user: process.env.EMAIL_USER, // Tu dirección de correo
        pass: process.env.EMAIL_PASS, // Contraseña o App Password
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER, // Dirección del remitente
        to, // Dirección del destinatario
        subject, // Asunto del correo
        html, // Cuerpo del correo en formato HTML
      });
      console.log('Correo enviado:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw error;
    }
  }
}

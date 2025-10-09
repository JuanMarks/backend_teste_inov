// mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';

@Injectable()
export class MailService {
  private transporter;
  private logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendInvitationEmail(to: string, token: string) {
    const frontendUrl = process.env.FRONTEND_INVITE_URL || 'https://your-frontend/cadastro';
    const link = `${frontendUrl}?token=${token}`;

    const mailOptions = {
      from: process.env.MAIL_FROM || 'no-reply@example.com',
      to,
      subject: 'Convite para registo',
      html: `
        <p>Foste convidado para te registares. Clica no link abaixo (válido por 24 horas):</p>
        <p><a href="${link}">Finalizar cadastro</a></p>
        <p>Se não solicitaste este convite, ignora.</p>
      `,
    };

    const info = await this.transporter.sendMail(mailOptions);
    this.logger.log(`Invitation email sent: ${info.messageId}`);
    return info;
  }
}
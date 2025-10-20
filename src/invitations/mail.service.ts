// mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private logger = new Logger(MailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendInvitationEmail(to: string, token: string) {
    const frontendUrl = process.env.FRONTEND_INVITE_URL || 'http://localhost:3000/cadastro';
    const link = `${frontendUrl}?token=${token}`;

    try {
      const { data, error } = await this.resend.emails.send({
        from: process.env.MAIL_FROM || 'no-reply@seusite.com',
        to,
        subject: 'Convite para registro',
        html: `
          <p>Foste convidado para te registares. Clica no link abaixo (válido por 24 horas):</p>
          <p><a href="${link}">Finalizar cadastro</a></p>
          <p>Se não solicitaste este convite, ignora.</p>
        `,
      });

      if (error) {
        this.logger.error('Erro ao enviar e-mail:', error);
        throw error;
      }

      this.logger.log(`E-mail enviado com sucesso: ${data?.id}`);
      return data;
    } catch (err) {
      this.logger.error('Erro ao enviar convite:', err);
      throw err;
    }
  }
}

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { SendInvitationDto } from './dto/sendInvitationsDTO';
import { MailService } from './mail.service';
import { CompleteInvitationsDto } from './completeInvitationsDto';

@Injectable()
export class InvitationsService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private mailService:  MailService){}

    async sendInvitation(data: SendInvitationDto, companyId: string ) {

        const existing = await this.prisma.invitation.findFirst({
            where: { email: data.email, companyId: companyId, status: 'PENDENTE' }
          });
          
        if (existing) {
            throw new Error('Já existe um convite pendente para este e-mail nesta empresa');
        }
        
        // if (data.role === 'ADMIN' || data.role === 'GESTOR') {
        //     throw new ForbiddenException('Não pode convidar um ADMIN ou GESTOR');
        // }

        const payload = {
            email: data.email,
            companyId: companyId,
            role: data.role
        }

        const token = this.jwt.sign(payload, {expiresIn: '1d'});
        const tokenHash = await bcrypt.hash(token, 10);
        await this.prisma.invitation.create({
            data: {
                email: data.email,
                companyId: companyId,
                role: data.role,
                tokenHash,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 dia
            }
        });

        await this.mailService.sendInvitationEmail(data.email, token);

        return {
            message: 'Convite enviado com sucesso',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };
    }

    async validateInvitation(token: string) {
        // Busca todos os convites pendentes
        const invitations = await this.prisma.invitation.findMany({
          where: { status: 'PENDENTE' },
        });
      
        // Procura se algum hash bate com o token
        let invitation: any = null;
        for (const inv of invitations) {
          const match = await bcrypt.compare(token, inv.tokenHash);
          if (match) {
            invitation = inv;
            break;
          }
        }
      
        if (!invitation) {
          throw new NotFoundException('Token inválido');
        }
      
        if (invitation.expiresAt < new Date()) {
          throw new BadRequestException('Token expirado');
        }
      
        return invitation
      }

      async completeInvitation(data: CompleteInvitationsDto) {
        const tokenPayload = await this.validateInvitation(data.token);
        const existingUser = await this.prisma.user.findUnique({
          where: { email: tokenPayload.email },
        });
        if (existingUser) {
          throw new BadRequestException('Já existe um usuário com este e-mail');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        await this.prisma.user.create({
          data: {
            email: tokenPayload.email,
            password: hashedPassword,
            role: tokenPayload.role,
            companyId: tokenPayload.companyId,
            name: data.name,
            avatar: null,
          }
        })

        await this.prisma.invitation.update({
          where: { id: tokenPayload.id },
          data: { status: 'COMPLETO' },
        });

        return { message: 'Usuário registrado com sucesso' };
      }

      async removeExpiredInvitations() {
        const result = await this.prisma.invitation.deleteMany({
          where: {
            expiresAt: { lt: new Date() },
            status: 'PENDENTE',
          },
        });
        return { message: `${result.count} convites expirados removidos.` };
      }

      async deleteInvitation(id: string) {
        const existing = await this.prisma.invitation.findUnique({where: {id}})

        if(!existing){
            throw new NotFoundException(`nenhum convite com esse id: ${id} encontrado.`)
        }

        await this.prisma.invitation.delete({where: {id}})

        return `Convite deletado.`
      }

      async getAllInvitations(){
        return await this.prisma.invitation.findMany()
      }
}

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentsDto } from './dto/createCommentsDto';
import { CommentableType } from '@prisma/client';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateCommentsDto, companyId: string, userId: string){

        if (!['CHALLENGE', 'IDEA'].includes(data.commentableType)) {
            throw new BadRequestException('Tipo de comentário inválido.');
        }

        const existing = data.commentableType === 'CHALLENGE'
            ? await this.prisma.challenges.findUnique({ where: { id: data.commentableId } })
            : await this.prisma.idea.findUnique({ where: { id: data.commentableId } });

        if (!existing) {
            throw new NotFoundException('Entidade comentável não encontrada.');
        }

        const isOwner = existing.companyId === companyId;

        if (!isOwner) {
            throw new ForbiddenException('Você não tem permissão para comentar neste item.');
        }

        return this.prisma.comments.create({
            data: {
                text: data.text,
                commentableType: data.commentableType,
                commentableId: data.commentableId,
                evaluationsId: data.evaluationsId,
                authorId: userId
            }
            
        })
    }

    async findByEntity(id: string, type: CommentableType, companyId: string){
        if (!['CHALLENGE', 'IDEA'].includes(type)) {
            throw new BadRequestException('Tipo de comentário inválido.');
          }

          const entity =
            type === 'CHALLENGE'
              ? await this.prisma.challenges.findUnique({ where: { id } })
              : await this.prisma.idea.findUnique({ where: { id } });
        
          if (!entity) {
            throw new NotFoundException('Entidade comentável não encontrada.');
          }
        
          const isOwner = entity.companyId === companyId;
        
          if (!isOwner) {
            throw new ForbiddenException('Você não tem permissão para ver os comentários deste item.');
          }


          return this.prisma.comments.findMany({
            where: { commentableId: id, commentableType: type },
            orderBy: { createdAt: 'desc' },
            include: {
              author: { select: { id: true, name: true, email: true } },
            },
          });
    }

    async delete(id: string, authorId: string, role: string){

        const existingComment = await this.prisma.comments.findUnique({
            where: {
                id
            }
        })

        if(!existingComment){
            throw new NotFoundException('Comentário não encontrado.');
        }

        const IsOwner = existingComment.authorId === authorId
        const IsAdmin = role === 'ADMIN'

        if(!IsOwner && !IsAdmin){
            throw new ForbiddenException('Você não tem permissão para deletar este comentário.');
        }

        return this.prisma.comments.delete({
            where: {
                id
            }
        })
    }
}

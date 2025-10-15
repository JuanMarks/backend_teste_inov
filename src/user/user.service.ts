import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService){}

    async create(data){
        return await this.prisma.user.create({data})
    }

    async filterByCompany(companyId: string){
        const existing = await this.prisma.companies.findUnique({where: {id: companyId}})

        if(!existing){
            throw new NotFoundException(`nenhuma empresa encontrada com esse id: ${companyId} encontrado.`)
        }

        return await this.prisma.user.findMany({where: {companyId}})
    }

    async deleteUser(id: string){
        const existing = await this.prisma.user.findUnique({where: {id}})

        if(!existing){
            throw new NotFoundException(`nenhum usuário com esse id: ${id} encontrado.`)
        }

        await this.prisma.comments.deleteMany({where: {authorId: id}})
        await this.prisma.user.delete({where: {id}})

        return `Usário ${existing.name} deletado.`
    }

    async removeUserFromCompany(userId: string, companyId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
        }

        if (user.companyId !== companyId) {
            throw new ForbiddenException('Você não tem permissão para remover este usuário desta empresa.');
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: { companyId: null },
        });

        return `Usuário ${user.name} removido da empresa com sucesso.`;
    }

}

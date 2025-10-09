import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {

    constructor(private prisma: PrismaService) { }

    async createCompany(data: Prisma.CompaniesCreateInput) {
        return await this.prisma.companies.create({
            data
        });
    }

    async getAllCompanies() {
        return await this.prisma.companies.findMany();
    }

    async getCompanyById(id: string) {
        return await this.prisma.companies.findUnique({
            where: { id }
        });
    }

    async getCompanyPaginated(page: number = 1, limit: number = 10){
        const skip = (page - 1) * limit

        const [data, total] = await this.prisma.$transaction([
            this.prisma.companies.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.companies.count()
        ])

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        } 
    }

    async updateCompany(id: string, data: Prisma.CompaniesUpdateInput) {

        const found = await this.prisma.companies.findUnique({
            where: { id }
        })

        if (!found) {
            throw new Error("Empresa não encontrada");
        }


        return await this.prisma.companies.update({
            where: { id },
            data
        });
    }

    async deleteCompany(id: string) {
        return await this.prisma.companies.delete({
            where: { id }
        });
    }
}

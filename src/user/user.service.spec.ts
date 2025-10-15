import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrisma = {
    companies: {
      findUnique: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    comments: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('filterByCompany', () => {
    it('deve retornar os usuários da empresa', async () => {
      const companyId = 'empresa-123';
      const mockUsers = [{ id: '1', name: 'User A' }];

      mockPrisma.companies.findUnique.mockResolvedValue({ id: companyId });
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.filterByCompany(companyId);

      expect(result).toEqual(mockUsers);
      expect(mockPrisma.companies.findUnique).toHaveBeenCalledWith({ where: { id: companyId } });
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({ where: { companyId } });
    });

    it('deve lançar NotFoundException se a empresa não existir', async () => {
      mockPrisma.companies.findUnique.mockResolvedValue(null);

      await expect(service.filterByCompany('empresa-naoexiste')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário e seus comentários', async () => {
      const userId = 'user-123';
      const mockUser = { id: userId, name: 'Beatriz' };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.comments.deleteMany.mockResolvedValue({});
      mockPrisma.user.delete.mockResolvedValue({});

      const result = await service.deleteUser(userId);

      expect(result).toEqual(`Usário ${mockUser.name} deletado.`);
      expect(mockPrisma.comments.deleteMany).toHaveBeenCalledWith({ where: { authorId: userId } });
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser('user-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeUserFromCompany', () => {
    it('deve remover um usuário da empresa com sucesso', async () => {
      const userId = 'user-123';
      const companyId = 'company-123';
      const mockUser = { id: userId, name: 'João', companyId };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.removeUserFromCompany(userId, companyId);

      expect(result).toEqual(`Usuário ${mockUser.name} removido da empresa com sucesso.`);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { companyId: null },
      });
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.removeUserFromCompany('user-inexistente', 'company-id')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException se o usuário não pertencer à empresa', async () => {
      const mockUser = { id: 'user-123', name: 'Lucas', companyId: 'outra-empresa' };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.removeUserFromCompany('user-123', 'company-id')).rejects.toThrow(ForbiddenException);
    });
  });
});

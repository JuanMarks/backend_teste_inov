import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentableType } from '@prisma/client';

describe('CommentsService', () => {
  let service: CommentsService;
  let prisma: PrismaService;

  const mockPrisma = {
    comments: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    challenges: {
      findUnique: jest.fn(),
    },
    idea: {
      findUnique: jest.fn(),
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const baseDto = {
      text: 'Comentário teste',
      commentableType: 'IDEA' as CommentableType,
      commentableId: 'idea-id',
      evaluationsId: 'eval-id'
    };

    it('deve criar um comentário se entidade existir e for da empresa', async () => {
      mockPrisma.idea.findUnique.mockResolvedValue({ companyId: 'company-1' });
      mockPrisma.comments.create.mockResolvedValue({ id: 'comment-id', ...baseDto });

      const result = await service.create(baseDto, 'company-1', 'user-1');

      expect(result).toEqual({ id: 'comment-id', ...baseDto });
      expect(mockPrisma.comments.create).toHaveBeenCalledWith({
        data: {
          text: baseDto.text,
          commentableType: baseDto.commentableType,
          commentableId: baseDto.commentableId,
          evaluationsId: baseDto.evaluationsId,
          authorId: 'user-1',
        },
      });
    });

    it('deve lançar erro se o tipo for inválido', async () => {
      await expect(service.create({ ...baseDto, commentableType: 'INVALID' as any }, 'company-1', 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException se entidade não existir', async () => {
      mockPrisma.idea.findUnique.mockResolvedValue(null);
      await expect(service.create(baseDto, 'company-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException se não for dono da entidade', async () => {
      mockPrisma.idea.findUnique.mockResolvedValue({ companyId: 'other-company' });
      await expect(service.create(baseDto, 'company-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByEntity', () => {
    it('deve retornar comentários se for o dono', async () => {
      const mockEntity = { companyId: 'company-1' };
      const mockComments = [{ text: 'abc', author: { id: 'user1' } }];

      mockPrisma.idea.findUnique.mockResolvedValue(mockEntity);
      mockPrisma.comments.findMany.mockResolvedValue(mockComments);

      const result = await service.findByEntity('idea-id', 'IDEA', 'company-1');
      expect(result).toEqual(mockComments);
    });

    it('deve lançar ForbiddenException se não for dono', async () => {
      mockPrisma.idea.findUnique.mockResolvedValue({ companyId: 'other-company' });
      await expect(service.findByEntity('idea-id', 'IDEA', 'company-1')).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar NotFoundException se a entidade não existir', async () => {
      mockPrisma.idea.findUnique.mockResolvedValue(null);
      await expect(service.findByEntity('idea-id', 'IDEA', 'company-1')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar BadRequestException para tipo inválido', async () => {
      await expect(service.findByEntity('some-id', 'INVALID' as any, 'company-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('deve deletar o comentário se for o autor', async () => {
      mockPrisma.comments.findUnique.mockResolvedValue({ id: 'c1', authorId: 'user-1' });
      mockPrisma.comments.delete.mockResolvedValue({ id: 'c1' });

      const result = await service.delete('c1', 'user-1', 'USER');
      expect(result).toEqual({ id: 'c1' });
    });

    it('deve permitir ADMIN deletar', async () => {
      mockPrisma.comments.findUnique.mockResolvedValue({ id: 'c1', authorId: 'user-1' });
      mockPrisma.comments.delete.mockResolvedValue({ id: 'c1' });

      const result = await service.delete('c1', 'user-2', 'ADMIN');
      expect(result).toEqual({ id: 'c1' });
    });

    it('deve lançar ForbiddenException se não for autor nem admin', async () => {
      mockPrisma.comments.findUnique.mockResolvedValue({ id: 'c1', authorId: 'user-1' });

      await expect(service.delete('c1', 'user-2', 'USER')).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar NotFoundException se comentário não existir', async () => {
      mockPrisma.comments.findUnique.mockResolvedValue(null);
      await expect(service.delete('c1', 'user-1', 'USER')).rejects.toThrow(NotFoundException);
    });
  });
});

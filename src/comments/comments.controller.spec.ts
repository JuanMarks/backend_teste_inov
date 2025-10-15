import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentsDto } from './dto/createCommentsDto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockService = {
    create: jest.fn(),
    findByEntity: jest.fn(),
    delete: jest.fn(),
  };

  const mockReq = {
    user: {
      id: 'user-id-123',
      companyId: 'company-id-123',
      role: 'ADMIN',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [{ provide: CommentsService, useValue: mockService }],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('deve criar um comentário', async () => {
    const dto: CreateCommentsDto = {
      text: 'Comentário teste',
      commentableId: 'idea-id-123',
      commentableType: 'IDEA',
      evaluationsId: 'evaluation-id-123',
    };

    const expectedResponse = { id: 'comment-id-1', ...dto };

    mockService.create.mockResolvedValue(expectedResponse);

    const result = await controller.create(dto, mockReq);

    expect(result).toEqual(expectedResponse);
    expect(service.create).toHaveBeenCalledWith(dto, mockReq.user.companyId, mockReq.user.id);
  });

  it('deve listar comentários por entidade', async () => {
    const id = 'entity-id-123';
    const type = 'IDEA';
    const expectedComments = [
      {
        id: 'comment1',
        text: 'Comentário 1',
        commentableType: type,
        commentableId: id,
        author: { id: 'user-id', name: 'Usuário', email: 'user@email.com' },
      },
    ];

    mockService.findByEntity.mockResolvedValue(expectedComments);

    const result = await controller.findByEntity(id, type, mockReq);

    expect(result).toEqual(expectedComments);
    expect(service.findByEntity).toHaveBeenCalledWith(id, type, mockReq.user.companyId);
  });

  it('deve deletar um comentário', async () => {
    const commentId = 'comment-id-1';
    const expectedResponse = { id: commentId };

    mockService.delete.mockResolvedValue(expectedResponse);

    const result = await controller.delete(commentId, mockReq);

    expect(result).toEqual(expectedResponse);
    expect(service.delete).toHaveBeenCalledWith(commentId, mockReq.user.id, mockReq.user.role);
  });

  it('deve lançar NotFoundException ao deletar comentário inexistente', async () => {
    const commentId = 'invalido';

    mockService.delete.mockRejectedValue(new NotFoundException('Comentário não encontrado.'));

    await expect(controller.delete(commentId, mockReq)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ForbiddenException ao tentar deletar comentário sem permissão', async () => {
    const commentId = 'comentario-de-outro-user';

    mockService.delete.mockRejectedValue(new ForbiddenException('Você não tem permissão para deletar este comentário.'));

    await expect(controller.delete(commentId, mockReq)).rejects.toThrow(ForbiddenException);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { SendInvitationDto } from './dto/sendInvitationsDTO';
import { CompleteInvitationsDto } from './completeInvitationsDto';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('InvitationsController', () => {
  let controller: InvitationsController;
  let service: InvitationsService;

  const mockInvitationsService = {
    sendInvitation: jest.fn(),
    validateInvitation: jest.fn(),
    completeInvitation: jest.fn(),
  };

  const mockRequest = {
    user: {
      companyId: 'company-id',
      id: 'user-id',
      role: 'GESTOR',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvitationsController],
      providers: [
        { provide: InvitationsService, useValue: mockInvitationsService },
      ],
    }).compile();

    controller = module.get<InvitationsController>(InvitationsController);
    service = module.get<InvitationsService>(InvitationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendInvitation', () => {
    it('deve enviar convite com sucesso', async () => {
      const dto: SendInvitationDto = { email: 'test@example.com', role: 'AVALIADOR' };
      const result = { message: 'Convite enviado com sucesso', expiresAt: new Date() };

      mockInvitationsService.sendInvitation.mockResolvedValue(result);

      expect(await controller.sendInvitation(dto, mockRequest)).toEqual(result);
      expect(service.sendInvitation).toHaveBeenCalledWith(dto, 'company-id');
    });

    it('deve lançar erro se não puder enviar convite', async () => {
      const dto: SendInvitationDto = { email: 'fail@example.com', role: 'ADMIN' };
      mockInvitationsService.sendInvitation.mockRejectedValue(new ForbiddenException());

      await expect(controller.sendInvitation(dto, mockRequest)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('validateInvitation', () => {
    it('deve validar um token com sucesso', async () => {
      const result = { id: 'inv-id', email: 'test@example.com' };
      mockInvitationsService.validateInvitation.mockResolvedValue(result);

      expect(await controller.validateInvitation('token123')).toEqual(result);
      expect(service.validateInvitation).toHaveBeenCalledWith('token123');
    });
  });

  describe('completeInvitation', () => {
    it('deve completar convite com sucesso', async () => {
      const dto: CompleteInvitationsDto = {
        token: 'token123',
        name: 'Test User',
        password: 'SenhaSegura',
      };
      const result = { message: 'Usuário registrado com sucesso' };

      mockInvitationsService.completeInvitation.mockResolvedValue(result);

      expect(await controller.completeInvitation(dto)).toEqual(result);
      expect(service.completeInvitation).toHaveBeenCalledWith(dto);
    });

    it('deve lançar erro se dados inválidos', async () => {
      const dto: CompleteInvitationsDto = {
        token: 'token123',
        name: 'Test User',
        password: 'SenhaSegura',
      };
      mockInvitationsService.completeInvitation.mockRejectedValue(new BadRequestException());

      await expect(controller.completeInvitation(dto)).rejects.toThrow(BadRequestException);
    });
  });
});

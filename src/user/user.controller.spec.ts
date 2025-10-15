import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    filterByCompany: jest.fn(),
    deleteUser: jest.fn(),
    removeUserFromCompany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('filterByCompany', () => {
    it('deve retornar lista de usuários da empresa', async () => {
      const mockUsers = [{ id: '1', name: 'Beatriz' }];
      mockUserService.filterByCompany.mockResolvedValue(mockUsers);

      const result = await controller.filterByCompany('empresa-123');
      expect(result).toEqual(mockUsers);
      expect(mockUserService.filterByCompany).toHaveBeenCalledWith('empresa-123');
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário pelo ID', async () => {
      mockUserService.deleteUser.mockResolvedValue('Usuário deletado.');

      const result = await controller.deleteUser('user-123');
      expect(result).toBe('Usuário deletado.');
      expect(mockUserService.deleteUser).toHaveBeenCalledWith('user-123');
    });
  });

  describe('removeUserFromCompany', () => {
    it('deve remover um usuário da empresa', async () => {
      const mockReq = {
        user: {
          companyId: 'empresa-123',
        },
      };

      mockUserService.removeUserFromCompany.mockResolvedValue('Usuário removido com sucesso.');

      const result = await controller.removeUserFromCompany('user-456', mockReq as any);
      expect(result).toBe('Usuário removido com sucesso.');
      expect(mockUserService.removeUserFromCompany).toHaveBeenCalledWith('user-456', 'empresa-123');
    });
  });
});

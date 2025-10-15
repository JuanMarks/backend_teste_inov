import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsService } from './invitations.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import * as bcrypt from 'bcrypt';
import { ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('InvitationsService', () => {
  let service: InvitationsService;
  let prisma: PrismaService;
  let jwt: JwtService;
  let mail: MailService;

  const mockPrisma = {
    invitation: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('fake-token'),
  };

  const mockMail = {
    sendInvitationEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: MailService, useValue: mockMail },
      ],
    }).compile();

    service = module.get<InvitationsService>(InvitationsService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    mail = module.get<MailService>(MailService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve enviar um convite com sucesso', async () => {
    mockPrisma.invitation.findFirst.mockResolvedValue(null);
    mockPrisma.invitation.create.mockResolvedValue({});
    mockMail.sendInvitationEmail.mockResolvedValue(undefined);

    const dto = { email: 'user@example.com', role: Role.AVALIADOR };
    const response = await service.sendInvitation(dto, 'company-id');

    expect(mockPrisma.invitation.create).toHaveBeenCalled();
    expect(mockMail.sendInvitationEmail).toHaveBeenCalledWith(dto.email, 'fake-token');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('expiresAt');
  });

  it('deve lançar erro se já existir convite pendente', async () => {
    mockPrisma.invitation.findFirst.mockResolvedValue({});

    await expect(
      service.sendInvitation({ email: 'user@example.com', role: 'AVALIADOR' }, 'company-id'),
    ).rejects.toThrow('Já existe um convite pendente para este e-mail nesta empresa');
  });

  it('deve Error para ADMIN ou GESTOR', async () => {
    await expect(
      service.sendInvitation({ email: 'admin@example.com', role: 'ADMIN' }, 'company-id'),
    ).rejects.toThrow(Error);
  });

  it('deve validar um token de convite', async () => {
    const token = 'valid-token';
    const tokenHash = await bcrypt.hash(token, 10);

    mockPrisma.invitation.findMany.mockResolvedValue([
      { tokenHash, expiresAt: new Date(Date.now() + 100000), id: 'inv-id', email: 'user@example.com', role: 'AVALIADOR', companyId: 'company-id' },
    ]);

    const result = await service.validateInvitation(token);
    expect(result).toHaveProperty('id');
  });

  it('deve lançar NotFoundException se token não bater', async () => {
    mockPrisma.invitation.findMany.mockResolvedValue([]);
    await expect(service.validateInvitation('invalid-token')).rejects.toThrow(NotFoundException);
  });

  it('deve lançar BadRequestException se token expirado', async () => {
    const token = 'expired-token';
    const tokenHash = await bcrypt.hash(token, 10);

    mockPrisma.invitation.findMany.mockResolvedValue([
      { tokenHash, expiresAt: new Date(Date.now() - 10000), id: 'inv-id' },
    ]);

    await expect(service.validateInvitation(token)).rejects.toThrow(BadRequestException);
  });

  it('deve completar convite com sucesso', async () => {
    const token = 'valid-token';
    const tokenHash = await bcrypt.hash(token, 10);
    const invitation = {
      id: 'inv-id',
      email: 'user@example.com',
      role: 'AVALIADOR',
      companyId: 'company-id',
      tokenHash,
      expiresAt: new Date(Date.now() + 100000),
    };

    mockPrisma.invitation.findMany.mockResolvedValue([invitation]);
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({});
    mockPrisma.invitation.update.mockResolvedValue({});

    const result = await service.completeInvitation({
      token,
      name: 'Novo Usuário',
      password: 'senha123',
    });

    expect(result).toEqual({ message: 'Usuário registrado com sucesso' });
    expect(mockPrisma.user.create).toHaveBeenCalled();
    expect(mockPrisma.invitation.update).toHaveBeenCalledWith({
      where: { id: invitation.id },
      data: { status: 'COMPLETO' },
    });
  });

  it('deve lançar erro se já existir usuário com o email', async () => {
    const token = 'existing-user-token';
    const tokenHash = await bcrypt.hash(token, 10);

    const invitation = {
      id: 'inv-id',
      email: 'existing@example.com',
      role: 'AVALIADOR',
      companyId: 'company-id',
      tokenHash,
      expiresAt: new Date(Date.now() + 100000),
    };

    mockPrisma.invitation.findMany.mockResolvedValue([invitation]);
    mockPrisma.user.findUnique.mockResolvedValue({ email: 'existing@example.com' });

    await expect(
      service.completeInvitation({ token, name: 'Já Existe', password: 'senha123' }),
    ).rejects.toThrow(BadRequestException);
  });
});

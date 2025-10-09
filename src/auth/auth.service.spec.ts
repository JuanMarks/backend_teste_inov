import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from './cloudinary.service';
import * as bcrypt from 'bcrypt';
import { mock } from 'node:test';


const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}

const moockCloudinary = {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
}

const mockJwt = {
    sign: jest.fn(),
    verify: jest.fn(),
};

describe('AuthService', () => {
    let service: AuthService;
    let prisma: PrismaService;
    let jwt: JwtService;
    let cloudinary: CloudinaryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: JwtService, useValue: mockJwt },
                { provide: CloudinaryService, useValue: moockCloudinary },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prisma = module.get<PrismaService>(PrismaService);
        jwt = module.get<JwtService>(JwtService);
        cloudinary = module.get<CloudinaryService>(CloudinaryService);
    })

    it("deve validar um usuário", async () => {
    
        const password = "123456"
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const dto = {
            id: "1",
            name: "Teste",
            email: "test@gmail.com",
            password: hashedPassword,
            role: "COMUM",
            companyId: "1",
            avatar: []
        } as any
    
        mockPrisma.user.findUnique.mockResolvedValue(dto);

        const user = await service.validateUser(dto.email, password);
        expect(user).toBe(dto);
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
    })

    it("deve registrar um usuário", async () => {
        const dto = {
            id: "1",
            name: "Teste",
            email: "test@gmail.com",
            password: "123456",
            role: "COMUM",
            companyId: "1",
            avatar: []
        } as any

        const currentUser = {
            id: "2",
            role: "GESTOR",
            companyId: "1"
        } as any
        mockPrisma.user.create.mockResolvedValue(dto);
        const user = await service.register(dto, currentUser);
        expect(user).toBe(dto);
        expect(mockPrisma.user.create).toHaveBeenCalled();
    })

    it("deve logar um usuário", async () => {
        const dto = {
            email: "test@gmail.com",
            password: "123456",
        } as any

        const user = await service.validateUser(dto.email, dto.password);
        const token = jwt.sign(user);

        mockPrisma.user.findUnique.mockResolvedValue(user);
        mockJwt.sign.mockReturnValue(token);

        const result = await service.login(dto);
        expect(result).toEqual({ access_token: token });
        expect(mockJwt.sign).toHaveBeenCalledWith(user);
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
    })
})


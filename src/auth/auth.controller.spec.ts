import { Test, TestingModule } from "@nestjs/testing";
import { CloudinaryService } from "./cloudinary.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { register } from "module";
import { BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";



describe("FilmesController", () => {
    let controller: AuthController;
    let authService: jest.Mocked<AuthService>;
    let cloudinaryService: jest.Mocked<CloudinaryService>
    let jwtService: jest.Mocked<JwtService>
    
    beforeEach(async () =>{
    const mockAuthService: jest.Mocked<AuthService> = {
        register: jest.fn(),
        login: jest.fn(),
        validateUser: jest.fn()
    } as any
    
    const mockCloudinaryService: jest.Mocked<CloudinaryService> = {
        deleteImage: jest.fn(),
        uploadImage: jest.fn()
    } as any

    const mockJwtService: jest.Mocked<JwtService> = {
        sign: jest.fn(),
        verify: jest.fn()
    } as any
    
    const module: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
            {provide: AuthService, useValue: mockAuthService},
            {provide: CloudinaryService, useValue: mockCloudinaryService},
            {provide: JwtService, useValue: mockJwtService},
        ]
    }).compile()
    
    controller = module.get<AuthController>(AuthController)
    authService = module.get(AuthService)
    cloudinaryService = module.get(CloudinaryService)
    jwtService = module.get(JwtService)
    })

    it("deve registrar um usuário", async () => {
        const dto = {
            name: "Teste",
            email: "test@gmail.com",
            password: "123456",
            role: "COMUM",
            companyId: "1",
        } as any

        const files = {images: [{ buffer: Buffer.from("test") }]}

        cloudinaryService.uploadImage.mockResolvedValue({url: "http://image.com", public_id: "public_id"})
        authService.register.mockResolvedValue({
            id: "1",
            ...dto,
            avatar: ["http://image.com"]
        })
        
        const currentUser = { id: "1", role: "GESTOR", companyId: "1" }
        const result = await controller.register(dto, { user: currentUser }, files as any)
        expect(result).toEqual({
            id: "1",
            ...dto,
            avatar: ["http://image.com"]
        })
        expect(cloudinaryService.uploadImage).toHaveBeenCalledTimes(1)
        expect(authService.register).toHaveBeenCalledWith({
            ...dto,
            avatar: [{url: "http://image.com", public_id: "public_id"}]
        }, currentUser)

    })

    it("deve lançar um erro se nenhuma imagem for enviada", async () => {
        const dto = {
            name: "Teste",
            email: "test@gmail.com",
            password: "123456",
            role: "COMUM",
            companyId: "1",
            } as any
        const files = {images: []}
        const currentUser = { id: "1", role: "GESTOR", companyId: "1" }
        await expect(controller.register(dto, { user: currentUser }, files as any)).rejects.toThrow(BadRequestException)
    })

    it("deve logar um usuário", async () => {
        const dto = {
            email: "test@gmail.com",
            password: "123456",
        } as any

        const user = await authService.validateUser(dto.email, dto.password)
        const token = jwtService.sign(user)
        authService.login.mockResolvedValue({ access_token: token })
        const result = await controller.login(dto)
        expect(result).toEqual({ access_token: token })
        expect(authService.login).toHaveBeenCalledWith(dto)
        expect(jwtService.sign).toHaveBeenCalledWith(user)
    })
})

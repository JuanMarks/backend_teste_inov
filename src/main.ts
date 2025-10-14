import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
const app = await NestFactory.create(AppModule);

// Configurações da documentação Swagger
const config = new DocumentBuilder()
    .setTitle('Plataforma de Inovação Aberta')
    .setDescription('Documentação da API da Plataforma com NestJS + Prisma + Swagger')
    .setVersion('1.0') // Tag opcional para categorizar as rotas
    .addBearerAuth({// Esquema 
      type: 'http',
      scheme: 'bearer', // Define o tipo de autenticação como Bearer Token
      bearerFormat: 'JWT', // Formato do token JWT 
      name: 'Authorization', // Nome do cabeçalho de autenticação
      in: 'header', // Localização do cabeçalho de autenticação
      description: 'Insira o token JWT no formato "Bearer {token}"', 
    })
    .build();

    app.enableCors({
      origin: ['http://localhost:3001',], 
      credentials: true,
    });


    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Remove propriedades não decoradas no DTO
        forbidNonWhitelisted: true, // Retorna erro se enviar propriedades não permitidas
        transform: true, // Transforma os tipos automaticamente (ex: string para number)
      })
    );

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document); // Acessível em http://localhost:3000/api

await app.listen(process.env.API_PORT ?? 3000);
}
bootstrap();
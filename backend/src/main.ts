import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Ativa a validação global interceptando os DTOs com class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Remove propriedades do JSON que não estão no DTO
      forbidNonWhitelisted: true, // Rejeita a requisição se enviarem campos extras
      transform: true,         // Transforma os tipos dos dados automaticamente
    }),
  );

  // 2. Garante que o servidor aceita conexões externas de dentro do container Docker
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
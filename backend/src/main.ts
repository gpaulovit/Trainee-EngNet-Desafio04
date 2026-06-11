import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita a validação global com base nos DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove campos que não estão no DTO
    forbidNonWhitelisted: true, // Retorna erro se enviar campo não esperado
    transform: true, // Transforma os dados recebidos para os tipos do DTO
  }));
  
  // Habilita o CORS para o frontend (porta 3001)
  app.enableCors({
    origin: '*', // Para fins de desenvolvimento
  });

  await app.listen(3000);
}
bootstrap();

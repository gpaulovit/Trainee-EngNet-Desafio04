import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser = require('cookie-parser');
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3001', // A porta exata onde o seu Front-end vai correr
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Remove qualquer campo que não esteja definido no DTO
      forbidNonWhitelisted: true, // Rejeita o pedido se o utilizador enviar campos extra
      transform: true,            // Converte os dados automaticamente para as classes DTO
    }),
  );

  const porta = process.env.PORT || 3000;
  await app.listen(porta);
  
  console.log(` Servidor na porta: ${porta}`);
}

bootstrap();
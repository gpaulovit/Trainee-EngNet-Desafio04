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
      whitelist: true,            
      forbidNonWhitelisted: true, 
      transform: true,            
    }),
  );

  const porta = process.env.PORT || 3000;
  // Mantemos a porta variável, mas com o '0.0.0.0' exigido pelo Docker da branch developer
  await app.listen(porta, '0.0.0.0');
  
  console.log(` Servidor na porta: ${porta}`);
}
bootstrap();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import cookieParser from "cookie-parser"; 
import helmet from "helmet";
import express from "express"; 

const server = express(); 

// Remove o prefixo se necessário (mantido caso seu front antigo usasse)


async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.setGlobalPrefix('api');

  app.use(helmet());
  app.use(cookieParser());

  // CONFIGURAÇÃO DO CORS
  app.enableCors({
    // Adicionei a env FRONTEND_URL. Se ela não existir, ele usa a lista padrão que você já tinha.
    origin: process.env.FRONTEND_URL 
      ? [process.env.FRONTEND_URL, "http://localhost:3001", "http://localhost:3000", /\.vercel\.app$/]
      : ["http://localhost:3001", "http://localhost:3000", /\.vercel\.app$/],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // O Railway e o Docker exigem escutar em '0.0.0.0'. 
  // A porta DEVE ser a do processo do Railway (process.env.PORT) ou 3000 como fallback local.
  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend rodando com sucesso na porta ${port} (0.0.0.0)!`);
}

bootstrap();
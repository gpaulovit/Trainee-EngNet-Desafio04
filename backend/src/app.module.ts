import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule } from "@nestjs/config";

import { Usuario } from "./modules/entities/usuario.entity";
import { Turma } from "./modules/entities/turma.entity";
import { Aluno } from "./modules/entities/aluno.entity";
import { Aula } from "./modules/entities/aula.entity";
import { Frequencia } from "./modules/entities/frequencia.entity";

import { AuthModule } from "./modules/auth/auth.module";
import { TurmasModule } from "./modules/turmas/turmas.module";
import { AlunosModule } from "./modules/alunos/alunos.module";
import { AulasModule } from "./modules/aulas/aulas.module";
import { FrequenciasModule } from "./modules/frequencias/frequencias.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { RelatoriosModule } from "./modules/relatorios/relatorios.module";
import { UsuariosModule } from "./modules/usuarios/usuarios.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_DATABASE || process.env.DB_NAME || "engnet_presenca",
      entities: [Usuario, Turma, Aluno, Aula, Frequencia],
      synchronize: true,
    }),

    AuthModule,
    TurmasModule,
    AlunosModule,
    AulasModule,
    FrequenciasModule,
    DashboardModule,
    RelatoriosModule,
    UsuariosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

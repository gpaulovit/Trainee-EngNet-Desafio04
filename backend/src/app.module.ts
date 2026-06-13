import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

import { Usuario } from './entities/usuario.entity';
import { Turma } from './entities/turma.entity';
import { Aluno } from './entities/aluno.entity';
import { Aula } from './entities/aula.entity';
import { Frequencia } from './entities/frequencia.entity';

// Módulos da sua implementação (Mantidos para o Front-end funcionar)
import { AuthModule } from './auth/auth.module';
import { TurmasModule } from './turmas/turmas.module';
import { AlunosModule } from './alunos/alunos.module';
import { AulasModule } from './aulas/aulas.module';
import { FrequenciasModule } from './frequencias/frequencias.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { UsuariosModule } from './usuarios/usuarios.module';

// Módulo exclusivo da branch developer (não dá conflito de nome)
import { UsersModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10,  
    }]),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'engnet_presenca',
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
    UsersModule, // Adicionado para manter compatibilidade com a developer
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
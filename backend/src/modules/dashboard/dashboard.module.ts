import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

import { Turma } from '../entities/turma.entity';
import { Aluno } from '../entities/aluno.entity';
import { Aula } from '../entities/aula.entity';
import { Frequencia } from '../entities/frequencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turma, Aluno, Aula, Frequencia])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
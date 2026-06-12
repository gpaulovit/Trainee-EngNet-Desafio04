import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';

import { Frequencia } from '../entities/frequencia.entity';
import { Aluno } from '../entities/aluno.entity';
import { Turma } from '../entities/turma.entity';
import { Aula } from '../entities/aula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Frequencia, Aluno, Turma, Aula])],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
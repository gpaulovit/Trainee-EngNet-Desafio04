import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from '../entities/aula.entity';
import { Turma } from '../entities/turma.entity';
import { Frequencia } from '../entities/frequencia.entity';
import { AulasService } from './aulas.service';
import { AulasController } from './aulas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aula, Turma, Frequencia])], 
  providers: [AulasService],
  controllers: [AulasController],
})
export class AulasModule {}
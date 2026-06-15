import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turma } from '../entities/turma.entity';
import { TurmasService } from './turmas.service';
import { TurmasController } from './turmas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Turma])],
  providers: [TurmasService],
  controllers: [TurmasController],
  exports: [TurmasService],
})
export class TurmasModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Frequencia } from '../entities/frequencia.entity';
import { Aula } from '../entities/aula.entity';
import { FrequenciasService } from './frequencias.service';
import { FrequenciasController } from './frequencias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Frequencia, Aula])],
  providers: [FrequenciasService],
  controllers: [FrequenciasController],
})
export class FrequenciasModule {}
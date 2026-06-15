import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Frequencia } from '../entities/frequencia.entity';
import { CriarFrequenciaDto } from './dto/criar-frequencia.dto';

@Injectable()
export class FrequenciasService {
  constructor(
    @InjectRepository(Frequencia)
    private frequenciasRepository: Repository<Frequencia>,
  ) {}

  async registrar(criarFrequenciaDto: CriarFrequenciaDto) {
    const novaFrequencia = this.frequenciasRepository.create({
      status: criarFrequenciaDto.status,
      aluno: { id: criarFrequenciaDto.alunoId },
      aula: { id: criarFrequenciaDto.aulaId }
    });
    return this.frequenciasRepository.save(novaFrequencia);
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aula } from '../entities/aula.entity';
import { Frequencia, StatusFrequencia } from '../entities/frequencia.entity';
import { CriarAulaDto } from './dto/criar-aula.dto';

@Injectable()
export class AulasService {
  constructor(
    @InjectRepository(Aula)
    private aulasRepository: Repository<Aula>,
    
    @InjectRepository(Frequencia)
    private frequenciasRepository: Repository<Frequencia>,
  ) {}

  async criar(dadosChamada: CriarAulaDto) {
    const novaAula = this.aulasRepository.create({
      data: dadosChamada.data,
      hora_inicio: dadosChamada.horarioInicio,
      hora_fim: dadosChamada.horarioFim,
      descricao: dadosChamada.descricao?.trim() || 'Chamada registrada via sistema',
      turma: { id: dadosChamada.turmaId },
    });
    
    const aulaSalva = await this.aulasRepository.save(novaAula);

    const listaFrequencias = dadosChamada.frequencias.map((freq) =>
      this.frequenciasRepository.create({
        status: freq.status === 'ausente' ? StatusFrequencia.FALTA : StatusFrequencia.PRESENTE,
        aluno: { id: freq.alunoId },
        aula: { id: aulaSalva.id },
      }),
    );

    await this.frequenciasRepository.save(listaFrequencias);

    return aulaSalva;
  }

  async listarPorTurma(turmaId: string) {
    return this.aulasRepository.find({
      where: { turma: { id: turmaId } },
      relations: {
        turma: true,
        frequencias: {
          aluno: true,
        },
      },
      order: {
        data: 'DESC',
        hora_inicio: 'DESC',
      },
    });
  }
}
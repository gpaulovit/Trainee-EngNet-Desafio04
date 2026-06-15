import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Frequencia, StatusFrequencia } from '../entities/frequencia.entity';
import { Aluno } from '../entities/aluno.entity';
import { Turma } from '../entities/turma.entity';
import { Aula } from '../entities/aula.entity';

@Injectable()
export class RelatoriosService {
  constructor(
    @InjectRepository(Frequencia)
    private frequenciasRepository: Repository<Frequencia>,
    @InjectRepository(Aluno)
    private alunosRepository: Repository<Aluno>,
    @InjectRepository(Turma)
    private turmasRepository: Repository<Turma>,
    @InjectRepository(Aula)
    private aulasRepository: Repository<Aula>,
  ) {}

  async relatorioPorTurma(turmaId: string, userId: string, isAdmin: boolean) {
    const [turma, aulas, alunos] = await Promise.all([
      this.turmasRepository.findOne({
        where: { id: turmaId },
        relations: { alunos: true },
      }),
      this.aulasRepository.find({
        where: { turma: { id: turmaId } },
        relations: {
          turma: true,
          frequencias: { aluno: true },
        },
        order: {
          data: 'DESC',
          hora_inicio: 'DESC',
        },
      }),
      this.alunosRepository.find({
        where: { turma: { id: turmaId } },
        relations: {
          turma: true,
          frequencias: { aula: { turma: true } },
        },
      }),
    ]);

    if (!turma) {
      return {
        turmaId,
        totalPresencas: 0,
        totalFaltas: 0,
        taxaAssiduidade: '0%',
        totalAulas: 0,
        alunosFaltosos: [],
        historicoTurma: [],
      };
    }

    const frequenciasTurma = aulas.flatMap((aula) => aula.frequencias || []);
    const presencas = frequenciasTurma.filter((frequencia) => frequencia.status === StatusFrequencia.PRESENTE).length;
    const faltas = frequenciasTurma.filter((frequencia) => frequencia.status === StatusFrequencia.FALTA).length;
    const total = presencas + faltas;

    const alunosFaltosos = alunos
      .map((aluno) => {
        const frequenciasAluno = aluno.frequencias.filter(
          (frequencia) => frequencia.aula?.turma?.id === turmaId,
        );
        const presencasAluno = frequenciasAluno.filter(
          (frequencia) => frequencia.status === StatusFrequencia.PRESENTE,
        ).length;
        const faltasAluno = frequenciasAluno.filter(
          (frequencia) => frequencia.status === StatusFrequencia.FALTA,
        ).length;
        const totalAluno = presencasAluno + faltasAluno;
        const taxaPresenca = totalAluno > 0 ? Math.round((presencasAluno / totalAluno) * 100) : 0;

        return {
          id: aluno.id,
          nome: aluno.nome,
          matricula: aluno.matricula,
          presencas: presencasAluno,
          faltas: faltasAluno,
          taxaPresenca,
        };
      })
      .filter((aluno) => aluno.faltas > 0 || aluno.taxaPresenca < 75)
      .sort((a, b) => a.taxaPresenca - b.taxaPresenca);

    const historicoTurma = aulas.map((aula) => {
      const presencasAula = (aula.frequencias || []).filter((frequencia) => frequencia.status === StatusFrequencia.PRESENTE).length;
      const faltasAula = (aula.frequencias || []).filter((frequencia) => frequencia.status === StatusFrequencia.FALTA).length;
      const faltosos = (aula.frequencias || [])
        .filter((frequencia) => frequencia.status === StatusFrequencia.FALTA)
        .map((frequencia) => frequencia.aluno.nome);

      return {
        id: aula.id,
        data: aula.data,
        hora_inicio: aula.hora_inicio,
        hora_fim: aula.hora_fim,
        descricao: aula.descricao,
        presentes: presencasAula,
        faltas: faltasAula,
        faltosos,
      };
    });

    return {
      turma: {
        id: turma.id,
        nome: turma.nome,
        codigo: turma.codigo,
        horario: turma.horario,
        capacidade: turma.capacidade,
        totalAlunos: turma.alunos?.length ?? alunos.length,
      },
      turmaId,
      totalPresencas: presencas,
      totalFaltas: faltas,
      taxaAssiduidade: total > 0 ? `${((presencas / total) * 100).toFixed(2)}%` : '0%',
      totalAulas: aulas.length,
      alunosFaltosos,
      historicoTurma,
    };
  }

  async relatorioIndividual(alunoId: string, userId: string, isAdmin: boolean) {
    const aluno = await this.alunosRepository.findOne({
      where: { id: alunoId },
      relations: {
        turma: true,
        frequencias: { aula: { turma: true } },
      },
    });

    if (!aluno) {
      return {
        alunoId,
        totalPresencas: 0,
        totalFaltas: 0,
        taxaAssiduidade: '0%',
        historico: [],
      };
    }

    const frequenciasAluno = aluno.frequencias.filter(
      (frequencia) => frequencia.aula?.turma?.id === aluno.turma?.id,
    );
    const presencas = frequenciasAluno.filter((frequencia) => frequencia.status === StatusFrequencia.PRESENTE).length;
    const faltas = frequenciasAluno.filter((frequencia) => frequencia.status === StatusFrequencia.FALTA).length;
    const total = presencas + faltas;

    const historico = frequenciasAluno
      .map((frequencia) => ({
        aulaId: frequencia.aula.id,
        data: frequencia.aula.data,
        hora_inicio: frequencia.aula.hora_inicio,
        hora_fim: frequencia.aula.hora_fim,
        status: frequencia.status,
      }))
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    return {
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        matricula: aluno.matricula,
        email: aluno.email,
        turma: aluno.turma
          ? {
              id: aluno.turma.id,
              nome: aluno.turma.nome,
              codigo: aluno.turma.codigo,
            }
          : null,
      },
      alunoId,
      totalPresencas: presencas,
      totalFaltas: faltas,
      taxaAssiduidade: total > 0 ? `${((presencas / total) * 100).toFixed(2)}%` : '0%',
      historico,
    };
  }
}
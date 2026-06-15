import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turma } from '../entities/turma.entity';
import { Aluno } from '../entities/aluno.entity';
import { Aula } from '../entities/aula.entity';
import { Frequencia, StatusFrequencia } from '../entities/frequencia.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Turma) private turmasRepository: Repository<Turma>,
    @InjectRepository(Aluno) private alunosRepository: Repository<Aluno>,
    @InjectRepository(Aula) private aulasRepository: Repository<Aula>,
    @InjectRepository(Frequencia) private frequenciasRepository: Repository<Frequencia>,
  ) {}

  async obterDados() {
    const [totalTurmas, totalAlunos, totalAulas, frequencias, alunos] = await Promise.all([
      this.turmasRepository.count(),
      this.alunosRepository.count(),
      this.aulasRepository.count(),
      this.frequenciasRepository.find({ relations: { aluno: { turma: true }, aula: { turma: true } } }),
      this.alunosRepository.find({
        relations: {
          turma: true,
          frequencias: { aula: { turma: true } },
        },
      }),
    ]);

    const presencas = frequencias.filter((frequencia) => frequencia.status === StatusFrequencia.PRESENTE).length;
    const taxaMediaPresenca = frequencias.length > 0 ? Math.round((presencas / frequencias.length) * 100) : 0;

    const alertasBaixaFrequencia = alunos
      .map((aluno) => {
        const frequenciasAluno = aluno.frequencias.filter((frequencia) => frequencia.aula?.turma?.id === aluno.turma?.id);
        const presencasAluno = frequenciasAluno.filter((frequencia) => frequencia.status === StatusFrequencia.PRESENTE).length;
        const faltasAluno = frequenciasAluno.filter((frequencia) => frequencia.status === StatusFrequencia.FALTA).length;
        const totalAluno = presencasAluno + faltasAluno;
        const taxaAssiduidade = totalAluno > 0 ? Math.round((presencasAluno / totalAluno) * 100) : 0;

        return {
          id: aluno.id,
          nome: aluno.nome,
          matricula: aluno.matricula,
          turma: aluno.turma
            ? {
                id: aluno.turma.id,
                nome: aluno.turma.nome,
                codigo: aluno.turma.codigo,
              }
            : null,
          taxaAssiduidade,
          faltas: faltasAluno,
        };
      })
      .filter((aluno) => aluno.turma && aluno.faltas > 0 && aluno.taxaAssiduidade < 75)
      .sort((a, b) => a.taxaAssiduidade - b.taxaAssiduidade)
      .slice(0, 5);

    return {
      totalTurmas,
      totalAlunos,
      totalAulas,
      taxaMediaPresenca,
      alertasBaixaFrequencia,
      mensagem:
        alertasBaixaFrequencia.length > 0
          ? `${alertasBaixaFrequencia.length} aluno(s) com frequência abaixo de 75%`
          : 'Nenhum alerta relevante no momento.',
    };
  }
}
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turma } from '../entities/turma.entity';
import { CriarTurmaDto } from './dto/criar-turma.dto';

@Injectable()
export class TurmasService {
  constructor(
    @InjectRepository(Turma)
    private turmasRepository: Repository<Turma>,
  ) {}

  async criar(criarTurmaDto: CriarTurmaDto, professorId: string) {
    const novaTurma = this.turmasRepository.create({
      curso: 'Padrão',
      ...criarTurmaDto,
      professor: { id: professorId }, // O TypeORM liga a turma ao professor logado
    });
    return this.turmasRepository.save(novaTurma);
  }

  // Filtra apenas as turmas deste professor
  async listarTodas(professorId: string) {
    const turmas = await this.turmasRepository
      .createQueryBuilder('turma')
      .loadRelationCountAndMap('turma.qtdAlunos', 'turma.alunos')
      .where('turma.professor_id = :professorId', { professorId })
      .getMany();

    return turmas.map((turma: any) => ({
      id: turma.id,
      nome: turma.nome,
      codigo: turma.codigo,
      horario: turma.horario,
      curso: turma.curso,
      capacidade: turma.capacidade,
      qtdAlunos: Number(turma.qtdAlunos ?? 0),
    }));
  }

  async remover(turmaId: string, professorId: string) {
    // Procura a turma e carrega também quem é o professor dono dela
    const turma = await this.turmasRepository.findOne({ 
      where: { id: turmaId },
      relations: ['professor'], 
    });

    if (!turma) {
      throw new NotFoundException(`Turma não encontrada.`);
    }

    // Impede que o professor A apague a turma do professor B
    if (turma.professor.id !== professorId) {
      throw new UnauthorizedException('Você não tem permissão para remover esta turma.');
    }

    return this.turmasRepository.remove(turma);
  }

  async atualizar(turmaId: string, dados: any, professorId: string) {
    const turma = await this.turmasRepository.findOne({ 
      where: { id: turmaId },
      relations: ['professor'], 
    });

    if (!turma) throw new NotFoundException('Turma não encontrada.');
    if (turma.professor.id !== professorId) throw new UnauthorizedException('Sem permissão.');

    Object.assign(turma, dados);
    return this.turmasRepository.save(turma);
  }
}
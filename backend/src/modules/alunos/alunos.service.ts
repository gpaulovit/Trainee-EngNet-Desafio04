import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno } from '../entities/aluno.entity';
import { CriarAlunoDto } from './dto/criar-aluno.dto';
import { AtualizarAlunoDto } from './dto/atualizar-aluno.dto';

@Injectable()
export class AlunosService {
  constructor(
    @InjectRepository(Aluno)
    private alunosRepository: Repository<Aluno>,
  ) {}

  async criar(criarAlunoDto: CriarAlunoDto) {
    const novoAluno = this.alunosRepository.create({
      ...criarAlunoDto,
      turma: { id: criarAlunoDto.turmaId }
    });
    return this.alunosRepository.save(novoAluno);
  }

  async atualizar(alunoId: string, atualizarAlunoDto: AtualizarAlunoDto) {
    const aluno = await this.alunosRepository.findOne({
      where: { id: alunoId },
      relations: ['turma'],
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    if (atualizarAlunoDto.nome !== undefined) {
      aluno.nome = atualizarAlunoDto.nome;
    }

    if (atualizarAlunoDto.email !== undefined) {
      aluno.email = atualizarAlunoDto.email;
    }

    if (atualizarAlunoDto.matricula !== undefined) {
      aluno.matricula = atualizarAlunoDto.matricula;
    }

    if (atualizarAlunoDto.turmaId !== undefined) {
      aluno.turma = { id: atualizarAlunoDto.turmaId } as any;
    }

    return this.alunosRepository.save(aluno);
  }

  async importarCsv(turmaId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum ficheiro enviado.');
    }
    return { mensagem: 'Upload de CSV recebido com sucesso', tamanho: file.size, turmaId };
  }

  async buscarPorTurma(turmaId: string) {
    return this.alunosRepository.find({
      where: { turma: { id: turmaId } },
      order: { nome: 'ASC' },
    });
  }
}

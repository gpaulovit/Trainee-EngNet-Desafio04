import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CriarTurmaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da turma é obrigatório' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O código da turma (ex: RC2026) é obrigatório' })
  codigo: string;

  @IsString()
  @IsNotEmpty({ message: 'O horário da turma é obrigatório' })
  horario: string;

  @IsString()
  @IsNotEmpty({ message: 'O curso de destino é obrigatório' })
  curso: string;

  @IsInt({ message: 'A capacidade deve ser um número inteiro' })
  @Min(1, { message: 'A capacidade da turma deve ser de pelo menos 1 aluno' })
  capacidade: number;
}
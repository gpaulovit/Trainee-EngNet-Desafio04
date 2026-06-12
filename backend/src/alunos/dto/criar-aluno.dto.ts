import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CriarAlunoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do aluno é obrigatório' })
  nome: string;

  @IsEmail({}, { message: 'E-mail do aluno inválido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A matrícula é obrigatória' })
  matricula: string;

  @IsUUID('4', { message: 'O ID da turma deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O aluno deve estar vinculado a uma turma' })
  turmaId: string;
}
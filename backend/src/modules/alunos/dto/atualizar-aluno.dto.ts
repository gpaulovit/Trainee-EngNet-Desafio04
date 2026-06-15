import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class AtualizarAlunoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail do aluno inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  matricula?: string;

  @IsOptional()
  @IsUUID('4', { message: 'O ID da turma deve ser um UUID válido' })
  turmaId?: string;
}
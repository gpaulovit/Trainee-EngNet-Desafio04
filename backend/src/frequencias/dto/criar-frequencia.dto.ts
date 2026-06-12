import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { StatusFrequencia } from '../../entities/frequencia.entity'; 

export class CriarFrequenciaDto {
  @IsUUID('4', { message: 'O ID do aluno deve ser um UUID válido' })
  @IsNotEmpty()
  alunoId: string;

  @IsUUID('4', { message: 'O ID da aula deve ser um UUID válido' })
  @IsNotEmpty()
  aulaId: string;

  @IsEnum(StatusFrequencia, { message: 'Status inválido' })
  @IsNotEmpty()
  status: StatusFrequencia;
}
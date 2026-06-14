import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CriarFrequenciaAulaDto } from './criar-frequencia-aula.dto';

export class CriarAulaDto {
  @IsDateString({}, { message: 'A data da aula deve ser uma data válida (ISO 8601)' })
  @IsNotEmpty({ message: 'A data é obrigatória' })
  data: string;

  @IsString()
  @IsNotEmpty({ message: 'O horário de início é obrigatório' })
  horarioInicio: string;

  @IsString()
  @IsNotEmpty({ message: 'O horário de término é obrigatório' })
  horarioFim: string;

  @IsUUID('4', { message: 'O ID da turma deve ser um UUID válido' })
  @IsNotEmpty({ message: 'A aula precisa estar vinculada a uma turma' })
  turmaId: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsArray({ message: 'As frequências devem ser uma lista' })
  @ArrayMinSize(1, { message: 'É preciso registrar pelo menos um aluno' })
  @ValidateNested({ each: true })
  @Type(() => CriarFrequenciaAulaDto)
  frequencias: CriarFrequenciaAulaDto[];
}
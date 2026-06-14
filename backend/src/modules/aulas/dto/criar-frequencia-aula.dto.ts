import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';

export class CriarFrequenciaAulaDto {
  @IsUUID('4', { message: 'O ID do aluno deve ser um UUID válido' })
  @IsNotEmpty()
  alunoId: string;

  @IsIn(['presente', 'ausente'], { message: 'Status inválido' })
  @IsNotEmpty()
  status: 'presente' | 'ausente';
}
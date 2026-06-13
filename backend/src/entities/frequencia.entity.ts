import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Unique } from 'typeorm';
import { Aluno } from './aluno.entity';
import { Aula } from './aula.entity';

export enum StatusFrequencia {
  PRESENTE = 'presente',
  FALTA = 'falta',
}

@Entity('frequencias')
@Unique(['aluno', 'aula']) 
export class Frequencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: StatusFrequencia })
  status: StatusFrequencia;

  @CreateDateColumn()
  registrado_em: Date;

  @ManyToOne(() => Aluno, (aluno) => aluno.frequencias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aluno_id' })
  aluno: Aluno;

  @ManyToOne(() => Aula, (aula) => aula.frequencias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aula_id' })
  aula: Aula;
}
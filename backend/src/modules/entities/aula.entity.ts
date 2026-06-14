import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Turma } from './turma.entity';
import { Frequencia } from './frequencia.entity';

@Entity('aulas')
export class Aula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  data: Date;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fim: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @ManyToOne(() => Turma, (turma) => turma.aulas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'turma_id' })
  turma: Turma;

  @OneToMany(() => Frequencia, (frequencia) => frequencia.aula)
  frequencias: Frequencia[];
}
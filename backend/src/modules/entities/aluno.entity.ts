import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Turma } from './turma.entity';
import { Frequencia } from './frequencia.entity';

@Entity('alunos')
export class Aluno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  nome: string;

  @Column({ unique: true, length: 50 })
  matricula: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Turma, (turma) => turma.alunos, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'turma_id' })
  turma: Turma;

  @OneToMany(() => Frequencia, (frequencia) => frequencia.aluno)
  frequencias: Frequencia[];
}
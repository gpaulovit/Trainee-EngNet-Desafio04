import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Aluno } from './aluno.entity';
import { Aula } from './aula.entity';

@Entity('turmas')
export class Turma {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ unique: true, length: 20 })
  codigo: string;

  @Column({ length: 50 })
  horario: string;

  @Column({ length: 100 })
  curso: string;

  @Column({ type: 'int', default: 0 })
  capacidade: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.turmas)
  @JoinColumn({ name: 'professor_id' })
  professor: Usuario;

  @OneToMany(() => Aluno, (aluno) => aluno.turma)
  alunos: Aluno[];

  @OneToMany(() => Aula, (aula) => aula.turma)
  aulas: Aula[];
}
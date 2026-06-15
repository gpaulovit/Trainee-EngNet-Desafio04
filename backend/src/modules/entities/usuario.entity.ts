import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Turma } from './turma.entity';

export enum PerfilUsuario {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  senha: string;

  @Column({ type: 'enum', enum: PerfilUsuario, default: PerfilUsuario.PROFESSOR })
  perfil: PerfilUsuario;

  @OneToMany(() => Turma, (turma) => turma.professor)
  turmas: Turma[];
}
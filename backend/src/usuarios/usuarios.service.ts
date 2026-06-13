import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(criarUsuarioDto: CriarUsuarioDto) {
    const utilizadorExistente = await this.usuariosRepository.findOne({ 
      where: { email: criarUsuarioDto.email } 
    });
    
    if (utilizadorExistente) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const senhaEncriptada = await bcrypt.hash(criarUsuarioDto.senha, salt);

    const novoUsuario = this.usuariosRepository.create({
      nome: criarUsuarioDto.nome,
      email: criarUsuarioDto.email,
      senha: senhaEncriptada,
      perfil: criarUsuarioDto.perfil,
    });

    const utilizadorSalvo = await this.usuariosRepository.save(novoUsuario);
    
   
    const { senha, ...usuarioSemSenha } = utilizadorSalvo;
    return usuarioSemSenha;
  }

  async findByEmail(email: string) {
    return this.usuariosRepository.findOne({ 
      where: { email },
      select: ['id', 'nome', 'email', 'senha', 'perfil'] 
    });
  }
}
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  //mockado ate o baldit entregar o banco
  private usuariosSimulados = [
    {
      id: '1',
      nome: 'Admin do Sistema',
      email: 'admin@engnet.com',
      senha: 'securepassword123', //trocar por hash
      role: 'ADMIN',
    },
    {
      id: '2',
      nome: 'Professor de Engenharia',
      email: 'professor@engnet.com',
      senha: 'passwordprof123',
      role: 'PROFESSOR',
    },
  ];

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    
    const usuario = this.usuariosSimulados.find(u => u.email === email);

    
    if (!usuario || usuario.senha !== senha) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    //retornando dados do usuário logado
    //transformar isso em um JWT dps)
    return {
      message: 'Autenticação realizada com sucesso!',
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }
}
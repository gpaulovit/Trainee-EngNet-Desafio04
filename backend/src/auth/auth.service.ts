import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService
  ) {}

  async validarUsuario(email: string, senhaPassada: string): Promise<any> {
    const usuario = await this.usuariosService.findByEmail(email);
    if (usuario && await bcrypt.compare(senhaPassada, usuario.senha)) {
      const { senha, ...result } = usuario;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, perfil: user.perfil };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
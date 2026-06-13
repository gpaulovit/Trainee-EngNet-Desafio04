import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PerfilUsuario } from '../../entities/usuario.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesExigidas = this.reflector.getAllAndOverride<PerfilUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rolesExigidas) {
      return true; 
    }

    const { user } = context.switchToHttp().getRequest();
    
    const possuiPermissao = rolesExigidas.some((role) => user.perfil === role);
    if (!possuiPermissao) {
        throw new ForbiddenException('Acesso restrito para o seu perfil.');
    }

    return true;
  }
}
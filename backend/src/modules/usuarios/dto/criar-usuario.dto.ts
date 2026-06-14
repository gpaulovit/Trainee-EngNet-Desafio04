import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { PerfilUsuario } from '../../entities/usuario.entity';

export class CriarUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  senha: string;

  @IsEnum(PerfilUsuario, { message: 'Perfil inválido' })
  perfil: PerfilUsuario;
}
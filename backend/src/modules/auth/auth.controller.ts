import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')//define o prefixo como /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Força o retorno do status HTTP 200 ao invés de 201
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);//repassa a requisicao para o service
  }
}
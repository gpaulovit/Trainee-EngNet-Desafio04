import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FrequenciasService } from './frequencias.service';
import { CriarFrequenciaDto } from './dto/criar-frequencia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('frequencias')
export class FrequenciasController {
  constructor(private readonly frequenciasService: FrequenciasService) {}

  @Post()
  async registrar(@Body() criarFrequenciaDto: CriarFrequenciaDto) {
    return this.frequenciasService.registrar(criarFrequenciaDto);
  }
}
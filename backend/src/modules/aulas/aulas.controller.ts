import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AulasService } from './aulas.service';
import { CriarAulaDto } from './dto/criar-aula.dto'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Post()
  async criar(@Body() criarAulaDto: CriarAulaDto) {
    return this.aulasService.criar(criarAulaDto);
  }

  @Get('turma/:turmaId')
  async listarPorTurma(@Param('turmaId') turmaId: string) {
    return this.aulasService.listarPorTurma(turmaId);
  }
}
import { Controller, Post, Get, Delete, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TurmasService } from './turmas.service';
import { CriarTurmaDto } from './dto/criar-turma.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@UseGuards(JwtAuthGuard)
@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) {}

  @Post()
  async criar(@Body() criarTurmaDto: CriarTurmaDto, @Req() req: any) {
    const professorId = req.user.id; 
    return this.turmasService.criar(criarTurmaDto, professorId);
  }

  @Get()
  async listarTodas(@Req() req: any) {
    const professorId = req.user.id;
    return this.turmasService.listarTodas(professorId); 
  }

  @Delete(':id')
  async remover(@Param('id') id: string, @Req() req: any) {
    const professorId = req.user.id;
    return this.turmasService.remover(id, professorId);
  }

  @Patch(':id')
  async atualizar(@Param('id') id: string, @Body() dadosAtualizados: any, @Req() req: any) {
    const professorId = req.user.id;
    return this.turmasService.atualizar(id, dadosAtualizados, professorId);
  }
}


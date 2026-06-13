import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('turma/:turmaId')
  async relatorioPorTurma(@Param('turmaId') turmaId: string, @Req() req: any) {
    const isAdmin = req.user.perfil === 'admin';
    return this.relatoriosService.relatorioPorTurma(turmaId, req.user.id, isAdmin);
  }

  @Get('aluno/:alunoId')
  async relatorioIndividual(@Param('alunoId') alunoId: string, @Req() req: any) {
    const isAdmin = req.user.perfil === 'admin';
    return this.relatoriosService.relatorioIndividual(alunoId, req.user.id, isAdmin);
  }
}
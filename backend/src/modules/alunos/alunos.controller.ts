import { Controller, Post, Get, Patch, Body, Param, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlunosService } from './alunos.service';
import { CriarAlunoDto } from './dto/criar-aluno.dto'; 
import { AtualizarAlunoDto } from './dto/atualizar-aluno.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  async criar(@Body() criarAlunoDto: CriarAlunoDto) {
    return this.alunosService.criar(criarAlunoDto);
  }

  @Patch(':id')
  async atualizar(@Param('id') id: string, @Body() atualizarAlunoDto: AtualizarAlunoDto) {
    return this.alunosService.atualizar(id, atualizarAlunoDto);
  }

  @Get('turma/:turmaId')
  async buscarPorTurma(@Param('turmaId') turmaId: string) {
    return this.alunosService.buscarPorTurma(turmaId);
  }

  @Post('upload-csv/:turmaId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @Param('turmaId') turmaId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.alunosService.importarCsv(turmaId, file);
  }
}
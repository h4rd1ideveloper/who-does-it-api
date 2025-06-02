import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AvaliacoesService } from './avaliacoes.service';

@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService) {}

  @Get('prestador/:prestadorId')
  async listarAvaliacoesPorPrestador(@Param('prestadorId') prestadorId: string) {
    return this.avaliacoesService.listarAvaliacoesPorPrestador(parseInt(prestadorId));
  }

  @Post()
  async criarAvaliacao(@Body() data: any) {
    return this.avaliacoesService.criarAvaliacao(data);
  }

  @Get(':id')
  async obterAvaliacaoPorId(@Param('id') id: string) {
    return this.avaliacoesService.obterAvaliacaoPorId(parseInt(id));
  }
}

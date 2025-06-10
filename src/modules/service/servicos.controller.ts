import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Get('prestador/:prestadorId')
  async listarServicosPorPrestador(@Param('prestadorId') prestadorId: string) {
    return this.servicosService.listarServicosPorPrestador(parseInt(prestadorId));
  }

  @Get(':id')
  async obterServicoPorId(@Param('id') id: string) {
    return this.servicosService.obterServicoPorId(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async criarServico(@Body() data: any) {
    return this.servicosService.criarServico(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async atualizarServico(@Param('id') id: string, @Body() data: any) {
    return this.servicosService.atualizarServico(parseInt(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async excluirServico(@Param('id') id: string) {
    return this.servicosService.excluirServico(parseInt(id));
  }
}

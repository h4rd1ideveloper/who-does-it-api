import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class PrestadoresController {
  constructor(private readonly prestadoresService: ServiceProviderService) {}

  @Get('prestadores/validar-token')
  async validarToken(@Query('token') token: string) {
    return this.prestadoresService.validarToken(token);
  }

  @Post('prestadores/cadastrar')
  async cadastrarPrestador(@Body() data: any) {
    return this.prestadoresService.cadastrarPrestador(data);
  }

  @Get('prestadores')
  async buscarPrestadores(
    @Query('query') query: string,
    @Query('categoria') categoria: string,
    @Query('cidade') cidade: string,
    @Query('ordenar_por') ordenarPor: string,
  ) {
    return this.prestadoresService.buscarPrestadores(query, categoria, cidade, ordenarPor);
  }

  @Get('prestador/:id')
  async obterPerfilPrestador(@Param('id') id: string) {
    return this.prestadoresService.obterPerfilPrestador(parseInt(id));
  }

  @Get('prestador/:id/metricas/visitas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async obterMetricasVisitas(
    @Param('id') id: string,
    @Query('periodo') periodo: string = '7',
  ) {
    return this.prestadoresService.obterMetricasVisitas(parseInt(id), parseInt(periodo));
  }

  @Get('prestador/:id/metricas/cliques')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async obterMetricasCliques(
    @Param('id') id: string,
    @Query('periodo') periodo: string = '7',
  ) {
    return this.prestadoresService.obterMetricasCliques(parseInt(id), parseInt(periodo));
  }
}

import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { MetricasService } from './metricas.service';

@Controller('metricas')
export class MetricasController {
  constructor(private readonly metricasService: MetricasService) {}

  @Post('visita')
  async registrarVisita(@Body() data: { prestador_id: number; origem: string }) {
    return this.metricasService.registrarVisita(data);
  }

  @Post('clique')
  async registrarClique(@Body() data: { prestador_id: number; tipo_contato: string }) {
    return this.metricasService.registrarClique(data);
  }
}

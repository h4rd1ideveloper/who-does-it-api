import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateVisitDto } from './create-visit.dto';
import { CreateContactClickDto } from './create-contact-click.dto';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post('visita') async registerVisit(@Body() data: CreateVisitDto) {
    return this.metricsService.registerVisit(data);
  }

  @Post('clique') async registerClick(@Body() data: CreateContactClickDto) {
    return this.metricsService.registerClick(data);
  }

  @Post('categoria') async registerCategoryVisit(
    @Body('categoryId') categoryId: number,
  ) {
    return this.metricsService.registerCategoryVisit(categoryId);
  }

  @Get('visitas') async getVisitMetrics(
    @Query('providerId') providerId: number,
    @Query('period') period: number,
  ) {
    return this.metricsService.getVisitMetricsByPeriod(providerId, period);
  }

  @Get('cliques') async getClickMetrics(
    @Query('providerId') providerId: number,
    @Query('period') period: number,
  ) {
    return this.metricsService.getClickMetricsByPeriod(providerId, period);
  }

  @Get('categories') async getCategoryMetrics(
    @Query('period') period: number,
  ) {
    return this.metricsService.getCategoryMetricsByPeriod(period);
  }
}

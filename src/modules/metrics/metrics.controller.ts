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
    @Query('providerId') providerId: string,
    @Query('period') period: string = '7',
  ) {
    return this.metricsService.getVisitMetricsByPeriod(
      parseInt(providerId),
      parseInt(period),
    );
  }

  @Get('cliques') async getClickMetrics(
    @Query('providerId') providerId: string,
    @Query('period') period: string,
  ) {
    return this.metricsService.getClickMetricsByPeriod(
      parseInt(providerId),
      parseInt(period),
    );
  }

  @Get('categories') async getCategoryMetrics(@Query('period') period: number) {
    return this.metricsService.getCategoryMetricsByPeriod(period);
  }
}

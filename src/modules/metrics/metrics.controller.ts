import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateVisitDto } from './create-visit.dto';
import { CreateContactClickDto } from './create-contact-click.dto';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post('view') async registerVisit(@Body() data: CreateVisitDto) {
    return this.metricsService.registerVisit(data);
  }

  @Post('click') async registerClick(@Body() data: CreateContactClickDto) {
    return this.metricsService.registerClick(data);
  }

  @Post('category-visit') async registerCategoryVisit(
    @Body('categoryId') categoryId: number,
  ) {
    return this.metricsService.registerCategoryVisit(categoryId);
  }

  @Get('views') async getVisitMetrics(
    @Query('providerId') providerId: string,
    @Query('period') period: string = '7',
  ) {
    return this.metricsService.getVisitMetricsByPeriod(
      parseInt(providerId),
      parseInt(period),
    );
  }

  @Get('clicks') async getClickMetrics(
    @Query('providerId') providerId: string,
    @Query('period') period: string,
  ) {
    return this.metricsService.getClickMetricsByPeriod(
      parseInt(providerId),
      parseInt(period),
    );
  }

  @Get('categories-visit') async getCategoryMetrics(@Query('period') period: number) {
    return this.metricsService.getCategoryMetricsByPeriod(period);
  }
}

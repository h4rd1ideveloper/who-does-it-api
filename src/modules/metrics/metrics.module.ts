import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProviderVisit } from '../database/entities/service-provider-visit.entity';
import { ContactClick } from '../database/entities/contact-click.entity';
import { CategoryVisit } from '../database/entities/category-visit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceProviderVisit,
      ContactClick,
      CategoryVisit,
    ]),
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}

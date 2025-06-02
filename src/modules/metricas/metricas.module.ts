import { Module } from '@nestjs/common';
import { MetricasController } from './metricas.controller';
import { MetricasService } from './metricas.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MetricasController],
  providers: [MetricasService],
  exports: [MetricasService],
})
export class MetricasModule {}

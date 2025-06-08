import { Module } from '@nestjs/common';
import { PrestadoresController } from './prestadores.controller';
import { ServiceProviderService } from './service-provider.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrestadoresController],
  providers: [ServiceProviderService],
  exports: [ServiceProviderService],
})
export class PrestadoresModule {}

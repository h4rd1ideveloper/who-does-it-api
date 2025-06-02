import { Module } from '@nestjs/common';
import { PrestadoresController } from './prestadores.controller';
import { PrestadoresService } from './prestadores.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrestadoresController],
  providers: [PrestadoresService],
  exports: [PrestadoresService],
})
export class PrestadoresModule {}

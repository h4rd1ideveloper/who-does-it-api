import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateServiceDto } from './create-service.dto';
import { UpdateServiceDto } from './update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('service-provider/:id') async listServicesByProvider(
    @Param('id') id: string,
  ) {
    return this.servicesService.listByProvider(parseInt(id));
  }

  @Get(':id') async getServiceById(@Param('id') id: string) {
    return this.servicesService.getById(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async createService(@Body() data: CreateServiceDto) {
    return this.servicesService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async updateService(@Param('id') id: string, @Body() data: UpdateServiceDto) {
    return this.servicesService.update(parseInt(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async deleteService(@Param('id') id: string) {
    return this.servicesService.remove(parseInt(id));
  }
}

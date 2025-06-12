import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateServiceProviderDto } from './create-service-provider.dto';

@Controller('service-provider')
export class ServiceProviderController {
  constructor(
    private readonly serviceProviderService: ServiceProviderService,
  ) {}

  @Get('validate-token') async validateToken(@Query('token') token: string) {
    return this.serviceProviderService.validateToken(token);
  }

  @Post() async registerServiceProvider(
    @Body() data: CreateServiceProviderDto,
  ) {
    return this.serviceProviderService.register(data);
  }

  @Get() async searchProviders(
    @Query('query') query: string,
    @Query('category') category: string,
    @Query('city') city: string,
    @Query('order') order: string,
  ) {
    return this.serviceProviderService.searchProviders(
      query,
      category,
      city,
      order,
    );
  }

  @Get(':id') async getProviderProfile(@Param('id') id: string) {
    return this.serviceProviderService.getProviderProfile(parseInt(id));
  }

  @Get(':id/metrics/visits')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async getVisitMetrics(
    @Param('id') id: string,
    @Query('period') period: string = '7',
  ) {
    return this.serviceProviderService.getVisitMetrics(
      parseInt(id),
      parseInt(period),
    );
  }

  @Get(':id/metrics/cliques')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async getClickMetrics(
    @Param('id') id: string,
    @Query('period') period: string = '7',
  ) {
    return this.serviceProviderService.getClickMetrics(
      parseInt(id),
      parseInt(period),
    );
  }
}

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

@Controller()
export class ServiceProviderController {
  constructor(private readonly prestadoresService: ServiceProviderService) {}

  @Get('serviceProvider/validate-token') async validateToken(
    @Query('token') token: string,
  ) {
    return this.prestadoresService.validateToken(token);
  }

  @Post('serviceProvider/register') async registerServiceProvider(
    @Body() data: CreateServiceProviderDto,
  ) {
    return this.prestadoresService.register(data);
  }

  @Get('serviceProvider') async searchProviders(
    @Query('query') query: string,
    @Query('categoria') categoria: string,
    @Query('cidade') cidade: string,
    @Query('ordenar_por') ordenarPor: string,
  ) {
    return this.prestadoresService.searchProviders(
      query,
      categoria,
      cidade,
      ordenarPor,
    );
  }

  @Get('serviceProvider/:id') async getProviderProfile(
    @Param('id') id: string,
  ) {
    return this.prestadoresService.getProviderProfile(parseInt(id));
  }

  @Get('prestador/:id/metrics/visitas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async getVisitMetrics(
    @Param('id') id: string,
    @Query('periodo') periodo: string = '7',
  ) {
    return this.prestadoresService.getVisitMetrics(
      parseInt(id),
      parseInt(periodo),
    );
  }

  @Get('prestador/:id/metrics/cliques')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async getClickMetrics(
    @Param('id') id: string,
    @Query('periodo') periodo: string = '7',
  ) {
    return this.prestadoresService.getClickMetrics(
      parseInt(id),
      parseInt(periodo),
    );
  }
}

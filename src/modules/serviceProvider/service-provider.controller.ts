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

@Controller()
export class ServiceProviderController {
  constructor(private readonly prestadoresService: ServiceProviderService) {}

  @Get('serviceProvider/validar-token') async validarToken(
    @Query('token') token: string,
  ) {
    return this.prestadoresService.validateToken(token);
  }

  @Post('serviceProvider/cadastrar') async cadastrarPrestador(@Body() data: any) {
    return this.prestadoresService.register(data);
  }

  @Get('serviceProvider') async buscarPrestadores(
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

  @Get('prestador/:id') async obterPerfilPrestador(@Param('id') id: string) {
    return this.prestadoresService.getProviderProfile(parseInt(id));
  }

  @Get('prestador/:id/metrics/visitas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestador')
  async obterMetricasVisitas(
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
  async obterMetricasCliques(
    @Param('id') id: string,
    @Query('periodo') periodo: string = '7',
  ) {
    return this.prestadoresService.getClickMetrics(
      parseInt(id),
      parseInt(periodo),
    );
  }
}

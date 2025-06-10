import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

class TokenDto {
  validade_dias: number;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('tokens')
  async gerarTokenConvite(@Body() tokenDto: TokenDto) {
    return this.adminService.gerarTokenConvite(tokenDto.validade_dias);
  }

  @Get('estatisticas/geral')
  async getEstatisticasGerais() {
    return this.adminService.getEstatisticasGerais();
  }

  @Get('metricas/categorias')
  async getTopCategorias(@Query('periodo') periodo: string = '7') {
    return this.adminService.getTopCategorias(parseInt(periodo));
  }

  @Get('metricas/serviceProvider')
  async getTopPrestadores(@Query('periodo') periodo: string = '7') {
    return this.adminService.getTopPrestadores(parseInt(periodo));
  }
}

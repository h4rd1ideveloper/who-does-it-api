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
    return this.adminService.createInvitationToken(tokenDto.validade_dias);
  }

  @Get('estatisticas/geral')
  async getStatistics() {
    return this.adminService.getStatistics();
  }

  @Get('metricas/categorias')
  async getRecentCategoryVisits(@Query('periodo') periodo: string = '7') {
    return this.adminService.getRecentCategoryVisits(parseInt(periodo));
  }

  @Get('metricas/serviceProvider')
  async getRecentServiceProviderVisits(@Query('periodo') periodo: string = '7') {
    return this.adminService.getRecentServiceProviderVisits(parseInt(periodo));
  }
}

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  async listarCategorias() {
    return this.categoriasService.listarCategorias();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async criarCategoria(@Body() data: { nome: string; imagem_url?: string }) {
    return this.categoriasService.criarCategoria(data);
  }

  @Get(':id')
  async obterCategoriaPorId(@Param('id') id: string) {
    return this.categoriasService.obterCategoriaPorId(parseInt(id));
  }

  @Get('slug/:slug')
  async obterCategoriaPorSlug(@Param('slug') slug: string) {
    return this.categoriasService.obterCategoriaPorSlug(slug);
  }
}

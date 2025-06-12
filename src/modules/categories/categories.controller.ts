import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateCategoryDto } from './create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriasService: CategoriesService) {}

  @Get() async listCategories() {
    return this.categoriasService.listCategories();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async criarCategoria(@Body() data: CreateCategoryDto) {
    return this.categoriasService.createCategory(data);
  }

  @Get(':id') async getCategoryById(@Param('id') id: string) {
    return this.categoriasService.getCategoryById(parseInt(id));
  }

  @Get('slug/:slug') async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoriasService.getCategoryBySlug(slug);
  }
}

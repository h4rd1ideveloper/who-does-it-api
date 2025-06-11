import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { slugify } from '../../utils/string-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../database/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async listCategories() {
    const categories = await this.categoryRepo.find({
      order: { name: 'ASC' },
    });
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl,
    }));
  }

  async createCategory(data: CreateCategoryDto) {
    const name = data.name.trim();
    const slug = slugify(name);

    // Verifica existência por name ou slug
    const exists = await this.categoryRepo.findOne({
      where: [{ name }, { slug }],
    });
    if (exists) {
      throw new BadRequestException(
        'Category with same name or slug already exists',
      );
    }

    const category = this.categoryRepo.create({
      name,
      slug,
      imageUrl: data.imageUrl,
    });
    const saved = await this.categoryRepo.save(category);
    return {
      id: saved.id,
      name: saved.name,
      slug: saved.slug,
      imageUrl: saved.imageUrl,
    };
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl,
    };
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.categoryRepo.findOne({ where: { slug } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl,
    };
  }
}

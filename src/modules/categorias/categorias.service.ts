import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify } from '../../utils/string-utils';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async listarCategorias() {
    const categorias = await this.prisma.categoria.findMany({
      orderBy: {
        nome: 'asc',
      },
    });

    return categorias.map(categoria => ({
      id: categoria.id,
      nome: categoria.nome,
      slug: categoria.slug,
      imagem_url: categoria.imagem_url,
    }));
  }

  async criarCategoria(data: { nome: string; imagem_url?: string }) {
    const slug = slugify(data.nome);

    // Verificar se já existe categoria com mesmo nome ou slug
    const categoriaExistente = await this.prisma.categoria.findFirst({
      where: {
        OR: [
          { nome: data.nome },
          { slug },
        ],
      },
    });

    if (categoriaExistente) {
      throw new Error('Já existe uma categoria com este nome');
    }

    const categoria = await this.prisma.categoria.create({
      data: {
        nome: data.nome,
        slug,
        imagem_url: data.imagem_url,
      },
    });

    return categoria;
  }

  async obterCategoriaPorId(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    return categoria;
  }

  async obterCategoriaPorSlug(slug: string) {
    const categoria = await this.prisma.categoria.findFirst({
      where: { slug },
    });

    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    return categoria;
  }
}

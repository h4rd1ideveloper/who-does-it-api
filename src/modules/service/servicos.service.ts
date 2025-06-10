import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicosService {
  constructor(private prisma: PrismaService) {}

  async listarServicosPorPrestador(prestadorId: number) {
    const servicos = await this.prisma.servico.findMany({
      where: { prestador_id: prestadorId },
      include: {
        categoria: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return servicos.map(servico => ({
      id: servico.id,
      prestador_id: servico.prestador_id,
      categoria_id: servico.categoria_id,
      categoria: {
        id: servico.categoria.id,
        nome: servico.categoria.nome,
        slug: servico.categoria.slug,
      },
      titulo: servico.titulo,
      descricao: servico.descricao,
      preco_min: servico.preco_min,
      preco_max: servico.preco_max,
      tempo_estimado: servico.tempo_estimado,
      local_atendimento: servico.local_atendimento,
      fotos_urls: servico.fotos_urls ? JSON.parse(servico.fotos_urls) : [],
    }));
  }

  async obterServicoPorId(id: number) {
    const servico = await this.prisma.servico.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    });

    if (!servico) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return {
      id: servico.id,
      prestador_id: servico.prestador_id,
      categoria_id: servico.categoria_id,
      categoria: {
        id: servico.categoria.id,
        nome: servico.categoria.nome,
        slug: servico.categoria.slug,
      },
      titulo: servico.titulo,
      descricao: servico.descricao,
      preco_min: servico.preco_min,
      preco_max: servico.preco_max,
      tempo_estimado: servico.tempo_estimado,
      local_atendimento: servico.local_atendimento,
      fotos_urls: servico.fotos_urls ? JSON.parse(servico.fotos_urls) : [],
    };
  }

  async criarServico(data: any) {
    // Verificar se a categoria existe
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: data.categoria_id },
    });

    if (!categoria) {
      throw new BadRequestException('Categoria não encontrada');
    }

    // Verificar se o prestador existe
    const prestador = await this.prisma.prestador.findUnique({
      where: { id: data.prestador_id },
    });

    if (!prestador) {
      throw new BadRequestException('Prestador não encontrado');
    }

    // Criar serviço
    const servico = await this.prisma.servico.create({
      data: {
        prestador_id: data.prestador_id,
        categoria_id: data.categoria_id,
        titulo: data.titulo,
        descricao: data.descricao,
        preco_min: data.preco_min,
        preco_max: data.preco_max,
        tempo_estimado: data.tempo_estimado,
        local_atendimento: data.local_atendimento,
        fotos_urls: data.fotos_urls ? JSON.stringify(data.fotos_urls) : null,
      },
      include: {
        categoria: true,
      },
    });

    return {
      id: servico.id,
      prestador_id: servico.prestador_id,
      categoria_id: servico.categoria_id,
      categoria: {
        id: servico.categoria.id,
        nome: servico.categoria.nome,
        slug: servico.categoria.slug,
      },
      titulo: servico.titulo,
      descricao: servico.descricao,
      preco_min: servico.preco_min,
      preco_max: servico.preco_max,
      tempo_estimado: servico.tempo_estimado,
      local_atendimento: servico.local_atendimento,
      fotos_urls: servico.fotos_urls ? JSON.parse(servico.fotos_urls) : [],
    };
  }

  async atualizarServico(id: number, data: any) {
    // Verificar se o serviço existe
    const servicoExistente = await this.prisma.servico.findUnique({
      where: { id },
    });

    if (!servicoExistente) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Verificar se a categoria existe, se fornecida
    if (data.categoria_id) {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: data.categoria_id },
      });

      if (!categoria) {
        throw new BadRequestException('Categoria não encontrada');
      }
    }

    // Atualizar serviço
    const servico = await this.prisma.servico.update({
      where: { id },
      data: {
        categoria_id: data.categoria_id,
        titulo: data.titulo,
        descricao: data.descricao,
        preco_min: data.preco_min,
        preco_max: data.preco_max,
        tempo_estimado: data.tempo_estimado,
        local_atendimento: data.local_atendimento,
        fotos_urls: data.fotos_urls ? JSON.stringify(data.fotos_urls) : servicoExistente.fotos_urls,
      },
      include: {
        categoria: true,
      },
    });

    return {
      id: servico.id,
      prestador_id: servico.prestador_id,
      categoria_id: servico.categoria_id,
      categoria: {
        id: servico.categoria.id,
        nome: servico.categoria.nome,
        slug: servico.categoria.slug,
      },
      titulo: servico.titulo,
      descricao: servico.descricao,
      preco_min: servico.preco_min,
      preco_max: servico.preco_max,
      tempo_estimado: servico.tempo_estimado,
      local_atendimento: servico.local_atendimento,
      fotos_urls: servico.fotos_urls ? JSON.parse(servico.fotos_urls) : [],
    };
  }

  async excluirServico(id: number) {
    // Verificar se o serviço existe
    const servico = await this.prisma.servico.findUnique({
      where: { id },
    });

    if (!servico) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Excluir serviço
    await this.prisma.servico.delete({
      where: { id },
    });

    return { message: 'Serviço excluído com sucesso' };
  }
}

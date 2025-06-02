import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AvaliacoesService {
  constructor(private prisma: PrismaService) {}

  async listarAvaliacoesPorPrestador(prestadorId: number) {
    const avaliacoes = await this.prisma.avaliacao.findMany({
      where: { prestador_id: prestadorId },
      orderBy: {
        data_hora: 'desc',
      },
    });

    return avaliacoes.map(avaliacao => ({
      id: avaliacao.id,
      prestador_id: avaliacao.prestador_id,
      nome_cliente: avaliacao.nome_cliente,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      data_hora: avaliacao.data_hora.toISOString(),
    }));
  }

  async criarAvaliacao(data: any) {
    // Verificar se o prestador existe
    const prestador = await this.prisma.prestador.findUnique({
      where: { id: data.prestador_id },
    });

    if (!prestador) {
      throw new BadRequestException('Prestador não encontrado');
    }

    // Validar nota
    if (data.nota < 1 || data.nota > 5) {
      throw new BadRequestException('A nota deve ser entre 1 e 5');
    }

    // Criar avaliação
    const avaliacao = await this.prisma.avaliacao.create({
      data: {
        prestador_id: data.prestador_id,
        nome_cliente: data.nome_cliente,
        nota: data.nota,
        comentario: data.comentario,
      },
    });

    return {
      id: avaliacao.id,
      prestador_id: avaliacao.prestador_id,
      nome_cliente: avaliacao.nome_cliente,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      data_hora: avaliacao.data_hora.toISOString(),
    };
  }

  async obterAvaliacaoPorId(id: number) {
    const avaliacao = await this.prisma.avaliacao.findUnique({
      where: { id },
    });

    if (!avaliacao) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return {
      id: avaliacao.id,
      prestador_id: avaliacao.prestador_id,
      nome_cliente: avaliacao.nome_cliente,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      data_hora: avaliacao.data_hora.toISOString(),
    };
  }
}

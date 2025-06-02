import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  gerarTokenConvite(validadeDias: number) {
    const token = v4();
    const dataExpiracao = add(new Date(), { days: validadeDias });

    // Em um ambiente real, salvaríamos o token em uma tabela específica
    // ou atualizaríamos um registro existente

    return {
      token,
      data_expiracao: dataExpiracao.toISOString().split('T')[0],
    };
  }

  async getEstatisticasGerais() {
    const totalPrestadores = await this.prisma.prestador.count();
    const totalVisitas = await this.prisma.visitaPrestador.count();
    const totalCliques = await this.prisma.cliqueContato.count();

    return {
      total_prestadores: totalPrestadores,
      total_visitas: totalVisitas,
      total_cliques: totalCliques,
    };
  }

  async getTopCategorias(periodo: number) {
    // Em um ambiente real, faríamos uma consulta mais complexa
    // para obter as categorias mais visitadas
    const dataLimite = add(new Date(), { days: -periodo });

    // Esta é uma consulta simplificada que não reflete a implementação real
    // que exigiria joins e agrupamentos mais complexos
    const categorias = await this.prisma.categoria.findMany({
      take: 5,
      orderBy: {
        id: 'asc', // Em um ambiente real, seria ordenado por contagem de visitas
      },
    });

    // Simulando o resultado esperado
    return categorias.map((categoria) => ({
      categoria_id: categoria.id,
      nome: categoria.nome,
      total_visitas: Math.floor(Math.random() * 100) + 20, // Simulação
    }));
  }

  async getTopPrestadores(periodo: number) {
    // Em um ambiente real, faríamos uma consulta mais complexa
    // para obter os prestadores mais visitados
    const dataLimite = add(new Date(), { days: -periodo });

    // Esta é uma consulta simplificada que não reflete a implementação real
    const prestadores = await this.prisma.prestador.findMany({
      take: 5,
      include: {
        usuario: true,
      },
      orderBy: {
        id: 'asc', // Em um ambiente real, seria ordenado por contagem de visitas
      },
    });

    // Simulando o resultado esperado
    return prestadores.map((prestador) => ({
      prestador_id: prestador.id,
      nome: prestador.usuario.nome,
      total_visitas: Math.floor(Math.random() * 50) + 10, // Simulação
    }));
  }
}

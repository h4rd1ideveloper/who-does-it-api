import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MetricasService {
  constructor(private prisma: PrismaService) {}

  async registrarVisita(data: { prestador_id: number; origem: string }) {
    const visita = await this.prisma.visitaPrestador.create({
      data: {
        prestador_id: data.prestador_id,
        origem: data.origem as any, // Convertendo para o enum
      },
    });

    return { success: true };
  }

  async registrarClique(data: { prestador_id: number; tipo_contato: string }) {
    const clique = await this.prisma.cliqueContato.create({
      data: {
        prestador_id: data.prestador_id,
        tipo_contato: data.tipo_contato as any, // Convertendo para o enum
      },
    });

    return { success: true };
  }

  async obterMetricasVisitasPorPeriodo(prestadorId: number, periodo: number) {
    // Em um ambiente real, faríamos uma consulta mais complexa
    // para obter as visitas agrupadas por dia
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - periodo);

    const visitas = await this.prisma.visitaPrestador.findMany({
      where: {
        prestador_id: prestadorId,
        data_hora: {
          gte: dataLimite,
        },
      },
      orderBy: {
        data_hora: 'asc',
      },
    });

    // Agrupar por data
    const visitasPorDia = {};
    visitas.forEach(visita => {
      const data = visita.data_hora.toISOString().split('T')[0];
      if (!visitasPorDia[data]) {
        visitasPorDia[data] = 0;
      }
      visitasPorDia[data]++;
    });

    // Converter para array
    return Object.entries(visitasPorDia).map(([data, total_visitas]) => ({
      data,
      total_visitas,
    }));
  }

  async obterMetricasCliquesPorPeriodo(prestadorId: number, periodo: number) {
    // Em um ambiente real, faríamos uma consulta mais complexa
    // para obter os cliques agrupados por dia e tipo
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - periodo);

    const cliques = await this.prisma.cliqueContato.findMany({
      where: {
        prestador_id: prestadorId,
        data_hora: {
          gte: dataLimite,
        },
      },
      orderBy: {
        data_hora: 'asc',
      },
    });

    // Agrupar por data e tipo
    const cliquesPorDiaTipo = {};
    cliques.forEach(clique => {
      const data = clique.data_hora.toISOString().split('T')[0];
      const tipo = clique.tipo_contato;
      const chave = `${data}_${tipo}`;
      
      if (!cliquesPorDiaTipo[chave]) {
        cliquesPorDiaTipo[chave] = {
          data,
          tipo_contato: tipo,
          total_cliques: 0,
        };
      }
      
      cliquesPorDiaTipo[chave].total_cliques++;
    });

    // Converter para array
    return Object.values(cliquesPorDiaTipo);
  }
}

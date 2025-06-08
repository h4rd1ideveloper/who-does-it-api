import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreatePrestadorDto } from './create-prestador.dto';


@Injectable()
export class ServiceProviderService {
  constructor(private prisma: PrismaService) {}

  validarToken(token: string) {
    if (!token || token.length < 5) {
      throw new BadRequestException('Token inválido ou expirado');
    }
    return { valid: true };
  }

  async cadastrarPrestador(data: CreatePrestadorDto) {
    this.validarToken(data.token);

    const emailExistente = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (emailExistente) {
      throw new ConflictException('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const result = await this.prisma.$transaction(async (prisma) => {
      const usuario = await prisma.usuario.create({
        data: {
          nome: data.nome,
          email: data.email,
          senha_hash: senhaHash,
          tipo_usuario: 'prestador',
        },
      });

      const prestador = await prisma.prestador.create({
        data: {
          id: usuario.id,
          cpf_cnpj: data.cpf_cnpj,
          telefone: data.telefone,
          endereco: data.endereco,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
          atende_domicilio: data.atende_domicilio,
          horario_funcionamento: data.horario_funcionamento,
          foto_url: data.foto_url,
          is_ativo: true,
        },
      });

      if (data.servicos && data.servicos.length > 0) {
        for (const servico of data.servicos) {
          await prisma.servico.create({
            data: {
              prestador_id: prestador.id,
              categoria_id: servico.categoria_id,
              titulo: servico.titulo,
              descricao: servico.descricao,
              preco_min: servico.preco_min,
              preco_max: servico.preco_max,
              tempo_estimado: servico.tempo_estimado,
              local_atendimento: servico.local_atendimento as ServiceLocation,
              fotos_urls: servico.fotos_urls
                ? JSON.stringify(servico.fotos_urls)
                : null,
            },
          });
        }
      }

      return { id_prestador: prestador.id };
    });

    return {
      id_prestador: result.id_prestador,
      message: 'Cadastro realizado com sucesso',
    };
  }

  async buscarPrestadores(
    query: string,
    categoria: string,
    cidade: string,
    ordenarPor: string,
  ) {
    const where: {
      [key: string]: any;
    } = {};

    if (query) {
      where.OR = [
        {
          servicos: {
            some: {
              titulo: { contains: query, mode: 'insensitive' },
            },
          },
        },
        {
          servicos: {
            some: {
              descricao: { contains: query, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    if (categoria) {
      where.servicos = {
        some: { categoria: { slug: categoria } },
      };
    }

    if (cidade) {
      where.cidade = { contains: cidade, mode: 'insensitive' };
    }

    let orderBy = {};

    switch (ordenarPor) {
      case 'mais_visitados':
      case 'melhor_avaliados':
      case 'menor_preco':
        orderBy = { id: 'asc' }; // Simulação
        break;
      default:
        orderBy = { id: 'asc' }; // Padrão
    }

    const prestadores = await this.prisma.prestador.findMany({
      where,
      include: {
        usuario: true,
        servicos: { include: { categoria: true } },
        avaliacoes: true,
      },
      orderBy,
    });

    return prestadores.map((prestador) => {
      const notaMedia =
        prestador.avaliacoes.length > 0
          ? prestador.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) /
            prestador.avaliacoes.length
          : 0;

      const precoMin =
        prestador.servicos.length > 0
          ? Math.min(...prestador.servicos.map((s) => s.preco_min))
          : null;

      const precoMax =
        prestador.servicos.length > 0
          ? Math.max(
              ...prestador.servicos.map((s) => s.preco_max || s.preco_min),
            )
          : null;

      const localAtendimento =
        prestador.servicos.length > 0
          ? prestador.servicos[0].local_atendimento
          : null;

      return {
        prestador_id: prestador.id,
        nome: prestador.usuario.nome,
        foto_url: prestador.foto_url,
        nota_media: parseFloat(notaMedia.toFixed(1)),
        total_avaliacoes: prestador.avaliacoes.length,
        preco_min: precoMin,
        preco_max: precoMax,
        slogan:
          prestador.servicos.length > 0 ? prestador.servicos[0].titulo : '',
        local_atendimento: localAtendimento,
      };
    });
  }

  async obterPerfilPrestador(id: number) {
    const prestador = await this.prisma.prestador.findUnique({
      where: { id },
      include: {
        usuario: true,
        servicos: { include: { categoria: true } },
        avaliacoes: { orderBy: { data_hora: 'desc' } },
      },
    });

    if (!prestador) {
      throw new NotFoundException('Prestador não encontrado');
    }

    const notaMedia =
      prestador.avaliacoes.length > 0
        ? prestador.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) /
          prestador.avaliacoes.length
        : 0;

    const servicos = prestador.servicos.map((servico) => {
      return {
        id: servico.id,
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
        fotos_urls: servico.fotos_urls,
      };
    });

    const avaliacoes = prestador.avaliacoes.map((avaliacao) => ({
      nome_cliente: avaliacao.nome_cliente,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      data_hora: avaliacao.data_hora.toISOString(),
    }));

    const contatos = {
      whatsapp: prestador.telefone,
      email: prestador.usuario.email,
      telefone: prestador.telefone,
      site_externo: null,
    };

    return {
      id: prestador.id,
      nome: prestador.usuario.nome,
      foto_url: prestador.foto_url,
      nota_media: parseFloat(notaMedia.toFixed(1)),
      total_avaliacoes: prestador.avaliacoes.length,
      descricao: '',
      endereco: prestador.endereco,
      cidade: prestador.cidade,
      estado: prestador.estado,
      cep: prestador.cep,
      atende_domicilio: prestador.atende_domicilio,
      horario_funcionamento: prestador.horario_funcionamento,
      servicos,
      avaliacoes,
      contatos,
    };
  }

  obterMetricasVisitas(prestadorId: number, periodo: number) {
    const hoje = new Date();
    const resultado: { data: string; total_visitas: number }[] = [];

    for (let i = 0; i < periodo; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);

      resultado.push({
        data: data.toISOString().split('T')[0],
        total_visitas: Math.floor(Math.random() * 20) + 1,
      });
    }

    return resultado.reverse();
  }

  obterMetricasCliques(prestadorId: number, periodo: number) {
    const hoje = new Date();
    const resultado: {
      data: string;
      tipo_contato: string;
      total_cliques: number;
    }[] = [];
    const tiposContato = ['whatsapp', 'email', 'telefone'];

    for (let i = 0; i < periodo; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);

      for (const tipo of tiposContato) {
        resultado.push({
          data: data.toISOString().split('T')[0],
          tipo_contato: tipo,
          total_cliques: Math.floor(Math.random() * 10) + 1,
        });
      }
    }

    return resultado.reverse();
  }
}

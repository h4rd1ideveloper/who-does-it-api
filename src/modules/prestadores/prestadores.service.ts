import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreatePrestadorDto } from './create-prestador.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrestadoresService {
  constructor(private prisma: PrismaService) {}

  validarToken(token: string) {
    // Em um ambiente real, verificaríamos se o token existe e não expirou
    if (!token || token.length < 5) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Simulando validação de token
    return { valid: true };
  }

  async cadastrarPrestador(data: CreatePrestadorDto) {
    // Validar token
    this.validarToken(data.token);

    // Verificar se endereço eletrónico já existe
    const emailExistente = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (emailExistente) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(data.senha, 10);

    // Criar usuário e prestador em uma transação
    const result = await this.prisma.$transaction(async (prisma) => {
      // Criar usuário
      const usuario = await prisma.usuario.create({
        data: {
          nome: data.nome,
          email: data.email,
          senha_hash: senhaHash,
          tipo_usuario: 'prestador',
        },
      });

      // Criar prestador
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

      // Criar serviços iniciais, se fornecidos
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
              local_atendimento: servico.local_atendimento,
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
    // Construir filtros
    const where: Prisma.PrestadorWhereInput = {};

    if (query) {
      where.OR = [
        {
          servicos: {
            some: {
              titulo: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          servicos: {
            some: {
              descricao: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    if (categoria) {
      where.servicos = {
        some: {
          categoria: {
            slug: categoria,
          },
        },
      };
    }

    if (cidade) {
      where.cidade = {
        contains: cidade,
        mode: 'insensitive',
      };
    }

    // Definir ordenação
    let orderBy: any = {};

    switch (ordenarPor) {
      case 'mais_visitados':
        // Em um ambiente real, faríamos um cálculo mais complexo
        orderBy = { id: 'asc' }; // Simulação
        break;
      case 'melhor_avaliados':
        // Em um ambiente real, faríamos um cálculo de média
        orderBy = { id: 'asc' }; // Simulação
        break;
      case 'menor_preco':
        // Em um ambiente real, faríamos um cálculo de preço médio
        orderBy = { id: 'asc' }; // Simulação
        break;
      default:
        // Ordenação padrão por score
        orderBy = { id: 'asc' }; // Simulação
    }

    // Buscar prestadores
    const prestadores = await this.prisma.prestador.findMany({
      where,
      include: {
        usuario: true,
        servicos: {
          include: {
            categoria: true,
          },
        },
        avaliacoes: true,
      },
      orderBy,
    });

    // Formatar resultado
    return prestadores.map((prestador) => {
      // Calcular nota média
      const notaMedia =
        prestador.avaliacoes.length > 0
          ? prestador.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) /
            prestador.avaliacoes.length
          : 0;

      // Encontrar preço mínimo entre todos os serviços
      const precoMin =
        prestador.servicos.length > 0
          ? Math.min(...prestador.servicos.map((s) => s.preco_min))
          : null;

      // Encontrar preço máximo entre todos os serviços
      const precoMax =
        prestador.servicos.length > 0
          ? Math.max(
              ...prestador.servicos.map((s) => s.preco_max || s.preco_min),
            )
          : null;

      // Extrair local de atendimento predominante
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
        servicos: {
          include: {
            categoria: true,
          },
        },
        avaliacoes: {
          orderBy: {
            data_hora: 'desc',
          },
        },
      },
    });

    if (!prestador) {
      throw new NotFoundException('Prestador não encontrado');
    }

    // Calcular nota média
    const notaMedia =
      prestador.avaliacoes.length > 0
        ? prestador.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) /
          prestador.avaliacoes.length
        : 0;

    // Formatar serviços
    const servicos = prestador.servicos.map((servico) => ({
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
      fotos_urls: servico.fotos_urls ? JSON.parse(servico.fotos_urls) : [],
    }));

    // Formatar avaliações
    const avaliacoes = prestador.avaliacoes.map((avaliacao) => ({
      nome_cliente: avaliacao.nome_cliente,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      data_hora: avaliacao.data_hora.toISOString(),
    }));

    // Formatar contatos
    const contatos = {
      whatsapp: prestador.telefone,
      email: prestador.usuario.email,
      telefone: prestador.telefone,
      site_externo: null, // Não implementado no MVP
    };

    return {
      id: prestador.id,
      nome: prestador.usuario.nome,
      foto_url: prestador.foto_url,
      nota_media: parseFloat(notaMedia.toFixed(1)),
      total_avaliacoes: prestador.avaliacoes.length,
      descricao: '', // Não implementado no MVP
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

  async obterMetricasVisitas(prestadorId: number, periodo: number) {
    // Em um ambiente real, faríamos uma consulta mais complexa
    // para obter as visitas agrupadas por dia

    // Simulando o resultado esperado
    const hoje = new Date();
    const resultado = [];

    for (let i = 0; i < periodo; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);

      resultado.push({
        data: data.toISOString().split('T')[0],
        total_visitas: Math.floor(Math.random() * 20) + 1, // Simulação
      });
    }

    return resultado.reverse(); // Ordenar do mais antigo para o mais recente
  }

  async obterMetricasCliques(prestadorId: number, periodo: number) {
    // Em um ambiente real, faríamos uma consulta mais complexa
    // para obter os cliques agrupados por dia e tipo

    // Simulando o resultado esperado
    const hoje = new Date();
    const resultado = [];
    const tiposContato = ['whatsapp', 'email', 'telefone'];

    for (let i = 0; i < periodo; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);

      for (const tipo of tiposContato) {
        resultado.push({
          data: data.toISOString().split('T')[0],
          tipo_contato: tipo,
          total_cliques: Math.floor(Math.random() * 10) + 1, // Simulação
        });
      }
    }

    return resultado.reverse(); // Ordenar do mais antigo para o mais recente
  }
}

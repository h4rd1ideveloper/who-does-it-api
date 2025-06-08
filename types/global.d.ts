export {}; // garante que o arquivo seja módulo, para não conflitar

declare global {
  enum UserType {
    ADMIN = 'admin',
    SERVICE_PROVIDER = 'prestador',
  }

  enum ServiceLocation {
    WORKSHOP = 'oficina',
    HOME = 'domicilio',
    BOTH = 'ambos',
  }

  enum VisitOrigin {
    SEARCH = 'busca',
    CATEGORY = 'categoria',
    HOME = 'home',
    FEATURED = 'destaque',
  }

  enum ContactType {
    WHATSAPP = 'whatsapp',
    EMAIL = 'email',
    PHONE = 'telefone',
  }

  interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha_hash: string;
    tipo_usuario: TipoUsuario;
    token_convite?: string | null;
    data_criacao: Date;
    prestador?: Prestador | null;
  }

  interface Prestador {
    id: number;
    cpf_cnpj?: string | null;
    telefone: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    atende_domicilio: boolean;
    horario_funcionamento?: string | null;
    foto_url?: string | null;
    is_ativo: boolean;
    data_cadastro: Date;

    usuario: Usuario;
    servicos: Servico[];
    avaliacoes: Avaliacao[];
    visitas: VisitaPrestador[];
    cliques: CliqueContato[];
  }

  interface Categoria {
    id: number;
    nome: string;
    slug: string;
    imagem_url?: string | null;

    servicos: Servico[];
  }

  interface Servico {
    id: number;
    prestador_id: number;
    categoria_id: number;
    titulo: string;
    descricao: string;
    preco_min: number;
    preco_max?: number | null;
    tempo_estimado: string;
    local_atendimento: LocalAtendimento;
    fotos_urls?: string | null;

    prestador: Prestador;
    categoria: Categoria;
  }

  interface Avaliacao {
    id: number;
    prestador_id: number;
    nome_cliente: string;
    nota: number;
    comentario?: string | null;
    data_hora: Date;

    prestador: Prestador;
  }

  interface VisitaPrestador {
    id: number;
    prestador_id: number;
    data_hora: Date;
    origem: OrigemVisita;

    prestador: Prestador;
  }

  interface CliqueContato {
    id: number;
    prestador_id: number;
    tipo_contato: TipoContato;
    data_hora: Date;

    prestador: Prestador;
  }

  interface JwtPayload {
    sub: number; // id do usuário
    email: string;
    iat?: number; // opcional: issued at
    exp?: number; // opcional: expiration
    // ... qualquer outro claim
  }
  /**
   * Interface que descreve o objeto `user` retornado pelo JwtStrategy.validate()
   */
  interface JwtUser {
    id: number;
    email: string;
    tipo_usuario: string;
  }
  /**
   * Extensão de Express.Request para incluir o usuário tipado
   */
  interface AuthRequest extends Request {
    user: JwtUser;
  }
}

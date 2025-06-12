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

  interface JwtPayload {
    sub: number; // id do 'usuário'
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
    userType: UserType;
  }
  /**
   * Extensão de Express. Request para incluir o 'usuário' 'tipado'
   */
  interface AuthRequest extends Request {
    user: JwtUser;
  }
}

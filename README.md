# Eu Faço Isso - Backend

Este é o backend da plataforma "Eu Faço Isso", desenvolvido com NestJS e Prisma ORM para conectar prestadores de serviço com clientes.

## Tecnologias Utilizadas

- NestJS
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- TypeScript

## Estrutura do Projeto

```
backend/
├── prisma/
│   └── schema.prisma    # Definição do modelo de dados
├── src/
│   ├── modules/         # Módulos da aplicação
│   │   ├── admin/       # Funcionalidades de administração
│   │   ├── auth/        # Autenticação e autorização
│   │   ├── avaliacoes/  # Avaliações de prestadores
│   │   ├── categorias/  # Categorias de serviços
│   │   ├── metricas/    # Métricas e estatísticas
│   │   ├── prestadores/ # Gerenciamento de prestadores
│   │   └── servicos/    # Gerenciamento de serviços
│   ├── prisma/          # Serviço de conexão com o Prisma
│   ├── utils/           # Utilitários
│   ├── app.module.ts    # Módulo principal
│   └── main.ts          # Ponto de entrada da aplicação
├── .env                 # Variáveis de ambiente
└── package.json         # Dependências
```

## Requisitos

- Node.js (v16 ou superior)
- PostgreSQL
- npm ou yarn

## Instalação

1. Clone o repositório
2. Navegue até a pasta do backend:
   ```bash
   cd eu-faco-isso/backend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` baseado no `.env.example`
   - Configure a URL do banco de dados PostgreSQL

5. Execute as migrações do Prisma:
   ```bash
   npx prisma migrate dev
   ```

## Executando a Aplicação

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

O servidor estará disponível em `http://localhost:3000`.

## Endpoints da API

### Autenticação

- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário (cliente)

### Admin

- `POST /admin/token` - Gerar token de convite para prestador
- `GET /admin/metricas` - Obter métricas gerais da plataforma

### Prestadores

- `POST /prestadores/cadastrar` - Cadastrar novo prestador (com token)
- `GET /prestadores` - Listar prestadores
- `GET /prestadores/:id` - Obter detalhes de um prestador
- `PUT /prestadores/:id` - Atualizar perfil de prestador
- `GET /prestadores/busca` - Buscar prestadores por termo ou categoria

### Categorias

- `GET /categorias` - Listar todas as categorias
- `POST /categorias` - Criar nova categoria (admin)
- `PUT /categorias/:id` - Atualizar categoria (admin)
- `DELETE /categorias/:id` - Remover categoria (admin)

### Serviços

- `GET /servicos` - Listar todos os serviços
- `GET /servicos/:id` - Obter detalhes de um serviço
- `POST /servicos` - Criar novo serviço (prestador)
- `PUT /servicos/:id` - Atualizar serviço (prestador)
- `DELETE /servicos/:id` - Remover serviço (prestador)
- `GET /servicos/prestador/:id` - Listar serviços de um prestador

### Avaliações

- `GET /avaliacoes/prestador/:id` - Listar avaliações de um prestador
- `POST /avaliacoes` - Criar nova avaliação
- `PUT /avaliacoes/:id` - Atualizar avaliação (próprio autor)
- `DELETE /avaliacoes/:id` - Remover avaliação (próprio autor ou admin)

### Métricas

- `GET /metricas/prestador/:id/visitas` - Obter métricas de visitas ao perfil
- `GET /metricas/prestador/:id/cliques` - Obter métricas de cliques em contatos

## Segurança

A API utiliza JWT (JSON Web Tokens) para autenticação. Todos os endpoints protegidos requerem um token válido no cabeçalho da requisição:

```
Authorization: Bearer <token>
```

## Controle de Acesso

O sistema possui três níveis de acesso:
- **Admin**: Acesso total ao sistema
- **Prestador**: Gerencia seu perfil e serviços
- **Cliente/Visitante**: Visualiza e busca prestadores/serviços

## Testes

Para executar os testes:

```bash
npm run test
```

## Documentação da API

A documentação completa da API está disponível através do Swagger UI em:

```
http://localhost:3000/api
```

(Quando o servidor estiver em execução)

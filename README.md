# who-does-it-api

**Descrição:** API backend para conectar prestadores de serviço e clientes, desenvolvida com NestJS, TypeORM, PostgreSQL e JWT para autenticação. Gerencia usuários, serviços, avaliações e métricas.

Este é o backend da plataforma "Eu Faço Isso", desenvolvido com NestJS e TypeORM para conectar prestadores de serviço com clientes.

## Tecnologias Utilizadas

*   NestJS
*   TypeORM
*   PostgreSQL
*   JWT para autenticação
*   TypeScript

## Estrutura do Projeto

```
backend/
├── src/
│   ├── modules/         # Módulos da aplicação
│   │   ├── admin/       # Funcionalidades de administração
│   │   ├── auth/        # Autenticação e autorização
│   │   ├── categories/  # Gerenciamento de categorias
│   │   ├── database/    # Configuração do banco de dados com TypeORM
│   │   ├── metrics/     # Métricas e estatísticas
│   │   ├── reviews/     # Avaliações de prestadores
│   │   ├── serviceProvider/ # Gerenciamento de prestadores
│   │   └── services/    # Gerenciamento de serviços
│   ├── utils/           # Utilitários
│   ├── app.module.ts    # Módulo principal
│   └── main.ts          # Ponto de entrada da aplicação
├── .env                 # Variáveis de ambiente
└── package.json         # Dependências
```

## Pré-requisitos

*   Node.js (v16 ou superior)
*   PostgreSQL
*   npm ou yarn

## Como Configurar e Rodar

1.  Clone o repositório:
    ```bash
    git clone https://github.com/h4rd1ideveloper/who-does-it-api.git
    ```
2.  Navegue até a pasta do backend:
    ```bash
    cd who-does-it-api
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Configure as variáveis de ambiente:
   *   Crie um arquivo `.env` baseado no `.env.example`
   *   Configure a URL do banco de dados PostgreSQL
5.  Execute as migrações do TypeORM:
    ```bash
    npm run typeorm migration:run
    ```

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

O servidor estará disponível em `http://localhost:3000`.

## Rotas da API

### Autenticação (`/auth`)
*   `POST /auth/login` - Login de usuário
*   `POST /auth/register` - Registro de usuário (cliente)

### Administração (`/admin`)
*   `POST /admin/token` - Gerar token de convite para prestador
*   `GET /admin/statistics/general` - Obter métricas gerais da plataforma
*   `GET /admin/metrics/categories` - Obter métricas de visitas recentes por categoria

### Prestadores (`/serviceProvider`)
*   `POST /serviceProvider/register` - Cadastrar novo prestador (com token)
*   `GET /serviceProvider` - Listar prestadores
*   `GET /serviceProvider/:id` - Obter detalhes de um prestador
*   `PUT /serviceProvider/:id` - Atualizar perfil de prestador
*   `GET /serviceProvider/search` - Buscar prestadores por termo ou categoria

### Categorias (`/categories`)
*   `GET /categories` - Listar todas as categorias
*   `POST /categories` - Criar nova categoria (admin)
*   `PUT /categories/:id` - Atualizar categoria (admin)
*   `DELETE /categories/:id` - Remover categoria (admin)

### Serviços (`/services`)
*   `GET /services` - Listar todos os serviços
*   `GET /services/:id` - Obter detalhes de um serviço
*   `POST /services` - Criar novo serviço (prestador)
*   `PUT /services/:id` - Atualizar serviço (prestador)
*   `DELETE /services/:id` - Remover serviço (prestador)
*   `GET /services/provider/:id` - Listar serviços de um prestador

### Avaliações (`/reviews`)
*   `GET /reviews/provider/:id` - Listar avaliações de um prestador
*   `POST /reviews` - Criar nova avaliação
*   `PUT /reviews/:id` - Atualizar avaliação (próprio autor)
*   `DELETE /reviews/:id` - Remover avaliação (próprio autor ou admin)

### Métricas (`/metrics`)
*   `GET /metrics/provider/:id/visits` - Obter métricas de visitas ao perfil
*   `GET /metrics/provider/:id/clicks` - Obter métricas de cliques em contatos

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Todos os endpoints protegidos requerem um token válido no cabeçalho da requisição:

```
Authorization: Bearer <token>
```

O sistema possui três níveis de acesso:

*   **Admin**: Acesso total ao sistema
*   **Prestador**: Gerencia seu perfil e serviços
*   **Cliente/Visitante**: Visualiza e busca prestadores/serviços

## Testes

Para executar os testes:

```bash
npm run test
```

## Documentação da API

A documentação completa da API está disponível através do Swagger UI em:

`http://localhost:3000/api`

(Quando o servidor estiver em execução)



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
````

O servidor estará disponível em `http://localhost:3000`.

## Rotas da API Atualizadas

Com base nos registros de log do NestJS (12/06/2025), as rotas disponíveis são:

### Raiz

- `GET /` - Health check (AppController)

### Autenticação (`/auth`)

- `POST /auth/admin/login` - Login de usuário administrador
- `POST /auth/service-provider/login` - Login de prestador de serviço

### Administração (`/admin`)

- `POST /admin/tokens` - Gerar token de convite para prestador
- `GET /admin/statistics/general` - Obter métricas gerais da plataforma
- `GET /admin/metrics/categories` - Obter métricas de visitas por categoria
- `GET /admin/metrics/serviceProvider` - Obter métricas de prestadores de serviço

### Prestadores (`/service-provider`)

- `GET /service-provider/validate-token` - Validar token de cadastro
- `POST /service-provider` - Cadastrar novo prestador (com token)
- `GET /service-provider` - Listar prestadores
- `GET /service-provider/:id` - Obter detalhes de um prestador
- `GET /service-provider/:id/metrics/visits` - Métricas de visitas a um prestador
- `GET /service-provider/:id/metrics/cliques` - Métricas de cliques em contatos

### Categorias (`/categories`)

- `GET /categories` - Listar todas as categorias
- `POST /categories` - Criar nova categoria (admin)
- `GET /categories/:id` - Obter categoria por ID
- `GET /categories/slug/:slug` - Obter categoria por slug

### Serviços (`/services`)

- `GET /services/service-provider/:id` - Listar serviços de um prestador
- `GET /services/:id` - Obter detalhes de um serviço
- `POST /services` - Criar novo serviço (prestador)
- `PUT /services/:id` - Atualizar serviço (prestador)
- `DELETE /services/:id` - Remover serviço (prestador)

### Avaliações (`/reviews`)

- `GET /reviews/service-provider/:id` - Listar avaliações de um prestador
- `POST /reviews` - Criar nova avaliação
- `GET /reviews/:id` - Obter avaliação por ID

### Métricas (`/metrics`)

- `POST /metrics/view` - Registrar visualização de perfil
- `POST /metrics/click` - Registrar clique em contato
- `POST /metrics/category-visit` - Registrar visita a categoria
- `GET /metrics/views` - Obter estatísticas de visualizações
- `GET /metrics/clicks` - Obter estatísticas de cliques
- `GET /metrics/categories-visit` - Obter visitas por categoria

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Todos os endpoints protegidos requerem um token válido no cabeçalho da requisição:

```
Authorization: Bearer <token>
```

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

`http://localhost:3000/api`

(Quando o servidor estiver em execução)



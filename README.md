# User Management API

API REST para gestão de usuários com autenticação JWT, controle de acesso por perfil (RBAC) e documentação via Swagger.

Projeto desenvolvido com foco em boas práticas de backend, arquitetura modular e simulação de um ambiente corporativo real.

---

## 🚀 Tecnologias

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (Autenticação)
- Passport
- Docker
- Swagger (OpenAPI)

---

## 📌 Funcionalidades

- Registro de usuários
- Autenticação com JWT
- Controle de acesso por perfil (admin/user)
- CRUD completo de usuários
- Paginação de resultados
- Proteção de rotas com Guards
- Documentação automática com Swagger

---

## 🔐 Regras de acesso

| Ação               | Usuário | Admin |
| ------------------ | ------- | ----- |
| Criar usuário      | ❌      | ✅    |
| Listar usuários    | ❌      | ✅    |
| Visualizar próprio | ✅      | ✅    |
| Atualizar próprio  | ✅      | ✅    |
| Deletar usuário    | ❌      | ✅    |

---

## ⚙️ Configuração do ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/erick-jean/user-management-api.git
cd user-management-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

Crie um arquivo .env na raiz:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=meu_banco
POSTGRES_PORT=5432

DATABASE_URL="postgresql://admin:admin123@localhost:5432/meu_banco"

JWT_SECRET=supersecretkey
```

### 4. Configure o banco de dados

```bash
npx prisma migrate dev
```

### 5. Execute o projeto

---

## 🐳 Rodando com Docker

```bash
docker-compose up -d
```

## 📖 Documentação da API

Após iniciar o projeto, acesse:

```http
http://localhost:3000/api
```

---

## 📊 Exemplo de fluxo

1. Criar usuário (admin)
2. Realizar login
3. Receber token JWT
4. Acessar rotas protegidas com `Authorization: Bearer <token>`

---

## 📌 Melhorias futuras

- Refresh Token
- Logs de auditoria
- Rate limiting
- Cache com Redis
- Deploy em cloud (AWS/Azure)

---

## 👨‍💻 Autor

**Erick Jean**  
Desenvolvedor Full Stack

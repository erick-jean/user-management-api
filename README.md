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

| Ação                | Usuário | Admin |
|---------------------|--------|-------|
| Criar usuário       | ❌     | ✅    |
| Listar usuários     | ❌     | ✅    |
| Visualizar próprio  | ✅     | ✅    |
| Atualizar próprio   | ✅     | ✅    |
| Deletar usuário     | ❌     | ✅    |

---

## 📂 Estrutura do projeto

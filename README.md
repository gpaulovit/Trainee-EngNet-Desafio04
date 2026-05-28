# Trainee-EngNet-Desafio04


# PresençaAcadêmica — EngNet

> Sistema de gestão de frequência digital para aulas práticas e laboratoriais.

## O que é este projeto?

O **PresençaAcadêmica** é uma plataforma web desenvolvida pela equipe **EngNet** para substituir o controle manual de presença em instituições de ensino. O sistema elimina listas impressas, assinaturas fraudulentas e retrabalho administrativo.

## Problema resolvido

| Dor do cliente | Solução implementada |
|---|---|
| Alunos assinando por colegas | Registro digital vinculado ao professor autenticado |
| Erros no lançamento manual | Validação automática em tempo real |
| Relatórios demorados | Geração instantânea por turma ou aluno |
| Excesso de papel | Processo 100% digital |
| Sobrecarga administrativa | Dashboard centralizado com alertas |

## Stack

| Camada | Tecnologia |
|---|---|
| **Frontend** | Next.js 14 + Tailwind CSS + TypeScript |
| **Backend** | NestJS + API REST + TypeORM |
| **Banco de dados** | PostgreSQL 15 |
| **Infraestrutura** | Docker + Docker Compose |
| **Deploy** | Vercel (frontend) + Render (backend) |

## Como iniciar

```bash
# Clone o repositório
git clone https://github.com/gpaulovit/Trainee-EngNet-Desafio04.git
cd {Local onde foi clonado}

# Configure as variáveis de ambiente
cp .env.example .env

# Suba todos os serviços com Docker
docker compose up -d
```

Acesse `http://localhost:3001` para o frontend e `http://localhost:3000/api` para a API.

## Navegação da documentação

Use o menu lateral para navegar entre as seções:

- **Produto & Requisitos** — Entenda o problema, os requisitos e as regras de negócio
- **Arquitetura & Infraestrutura** — Decisões técnicas, modelagem e Docker
- **Guia de Desenvolvimento** — Setup local, estrutura de código e fluxo Git
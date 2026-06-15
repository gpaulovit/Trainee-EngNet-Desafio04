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
| **Frontend** | Next.js 16 + Tailwind CSS + TypeScript |
| **Backend** | NestJS + API REST + TypeORM |
| **Banco de dados** | PostgreSQL 15 |
| **Infraestrutura** | Docker + Docker Compose |
| **Deploy** | Frontend e API preparados para publicação em ambiente separado |

## Funcionalidades entregues

- **Dashboard** com total de alunos, total de aulas, taxa média de presença e alertas de baixa frequência;
- **Turmas** com criação, edição, remoção e listagem de alunos por turma;
- **Controle de frequência** com presença, falta, data, horário, observações e histórico;
- **Relatórios** por turma e por aluno, com lista de faltosos e exportação em PDF;
- **Autenticação** com JWT em cookie e proteção de rotas sensíveis.
- **Dark mode** com alternância visual e persistência local.

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

Acesse `http://localhost:3001` para o frontend e `http://localhost:3000` para a API.

## Comandos úteis

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev

# Builds de validação
cd backend && npm run build
cd frontend && npm run build
```

## Entrega

- **Código-fonte completo** presente neste repositório;
- **README** com instruções de execução local;
- **API REST** e persistência com PostgreSQL via TypeORM;
- **UI responsiva** em desktop, tablet e mobile.

## Navegação da documentação

Use o menu lateral para navegar entre as seções:

- **Produto & Requisitos** — Entenda o problema, os requisitos e as regras de negócio
- **Arquitetura & Infraestrutura** — Decisões técnicas, modelagem e Docker
- **Guia de Desenvolvimento** — Setup local, estrutura de código e fluxo Git
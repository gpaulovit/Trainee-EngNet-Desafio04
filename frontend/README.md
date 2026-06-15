# Frontend — PresençaAcadêmica

Interface web do sistema de gestão de frequência para aulas práticas.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

## Como executar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Observações

- O frontend consome a API do backend via `/api/*`.
- As rotas protegidas dependem do cookie `access_token`.
- A interface inclui dashboard, turmas, alunos, controle de presença e relatórios.

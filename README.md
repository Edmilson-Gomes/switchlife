# SwitchLife

PWA pessoal e familiar para organização de conhecimento, estudos, engenharia e
rotina — ver [docs/product/vision.md](docs/product/vision.md).

## Stack

React + TypeScript + Vite + React Router (`HashRouter`) + TanStack Query +
React Hook Form + Zod + Tailwind CSS + Supabase (Auth + PostgreSQL + RLS).
Ver [AGENTS.md](AGENTS.md) para detalhes de arquitetura, comandos e regras.

## Começando

```bash
cp .env.example .env   # preencha com as credenciais do seu projeto Supabase
npm ci
npm run dev
```

Guia completo de configuração local em
[docs/development/local-setup.md](docs/development/local-setup.md).

## Comandos

```bash
npm run dev         # ambiente de desenvolvimento
npm run typecheck    # TypeScript --noEmit
npm run lint          # ESLint
npm run test            # Vitest (unitário + integração)
npm run test:e2e         # Playwright
npm run build              # build de produção (base /switchlife/)
```

## Documentação

- [Visão do produto](docs/product/vision.md)
- [Escopo do MVP](docs/product/scope-mvp.md)
- [Arquitetura](docs/architecture/architecture-overview.md)
- [Modelo de dados](docs/architecture/database-model.md)
- [ADRs](docs/decisions/)
- [AGENTS.md](AGENTS.md) — guia para agentes de IA continuarem o desenvolvimento

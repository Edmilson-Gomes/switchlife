# AGENTS.md — SwitchLife

Guia para agentes de IA (e humanos) que continuam o desenvolvimento deste
repositório.

## Visão do produto

SwitchLife é um PWA pessoal e familiar para organização de conhecimento,
estudos, engenharia, rotina e colaboração seletiva, seguindo o fluxo
`Capturar → Organizar → Estudar → Executar → Revisar → Compartilhar`.
Leitura completa: [docs/product/vision.md](docs/product/vision.md).

## Stack

- Frontend: React + TypeScript + Vite + React Router (`HashRouter`) +
  TanStack Query + React Hook Form + Zod + Tailwind CSS + Lucide Icons +
  `vite-plugin-pwa`.
- Backend: Supabase (Auth + PostgreSQL + RLS + Realtime + Storage; Edge
  Functions só quando necessário).
- Testes: Vitest + React Testing Library + Playwright.
- Qualidade: ESLint + Prettier + TypeScript strict + Husky + lint-staged.

Não adicione dependências sem justificar o uso (comentário no PR ou ADR).

## Comandos

```bash
npm ci                # instalar dependências
npm run dev            # ambiente local
npm run typecheck      # TypeScript --noEmit
npm run lint            # ESLint
npm run test             # Vitest (unit + integração)
npm run test:e2e          # Playwright
npm run build              # build de produção (base /switchlife/)
```

## Estrutura

```text
src/app/         bootstrap, providers, router, config
src/components/  UI genérica (ui, layout, feedback, forms) — sem lógica de domínio
src/features/    lógica de domínio por área (auth, dashboard, profile, notes, lists, sharing)
src/hooks/       hooks compartilhados
src/lib/         supabase client, validação, utils transversais
src/pages/       composição de rotas a partir de features
src/types/       tipos compartilhados
src/test/        setup de testes
supabase/migrations/  migrations SQL versionadas
docs/            documentação orientada a agentes
.ai/             specs, harnesses, skills, workflows, reports
e2e/             testes Playwright
```

## Arquivos obrigatórios para leitura antes de qualquer mudança

1. [docs/product/scope-mvp.md](docs/product/scope-mvp.md) — o que está e
   não está no escopo atual.
2. [docs/architecture/architecture-overview.md](docs/architecture/architecture-overview.md)
3. [docs/architecture/authentication-authorization.md](docs/architecture/authentication-authorization.md)
4. [docs/architecture/database-model.md](docs/architecture/database-model.md)
5. [.ai/specs/switchlife-foundation.spec.md](.ai/specs/switchlife-foundation.spec.md)
6. A skill relevante em `.ai/skills/` para o tipo de tarefa (frontend,
   RLS, compartilhamento, testes).

## Regras de arquitetura

- Uma feature não importa diretamente de outra feature.
- Toda chamada Supabase fica em `features/<x>/api/`, nunca direto num
  componente.
- Estado remoto via TanStack Query; estado global real (auth, tema) via
  Context; nada de store global genérica (Zustand só com necessidade
  concreta documentada em ADR).
- Compartilhamento de um novo contexto ganha sua própria tabela de
  junção — nunca reaproveita `list_shares`.
- Mudança de roteamento (`HashRouter` → outra estratégia) exige novo ADR
  substituindo [ADR-003](docs/decisions/ADR-003-github-pages-routing.md).

## Regras de segurança

- Toda tabela nova tem RLS habilitada com políticas explícitas.
- Nenhuma política confia em valor enviado pelo cliente para decidir
  posse/permissão — sempre `auth.uid()` + relação no banco.
- `service_role` nunca aparece no frontend nem em workflow versionado.
- Nenhum segredo real em `.env`, YAML de workflow ou código — apenas
  `.env.example` com placeholders.
- Convite/compartilhamento nunca expõe se um e-mail existe ou não no
  sistema (ver [ADR-004](docs/decisions/ADR-004-data-sharing-model.md)).

## Padrão de testes

- Unitário: schemas Zod, utilitários de permissão, componentes de estado
  vazio, formulários.
- Integração: fluxos de CRUD de notes/lists/items, bloqueio de viewer.
- E2E: os 5 cenários da SPEC (autenticação, isolamento, viewer, editor,
  revogação) são prioritários.
- RLS só é considerada "validada" com execução real contra um banco
  Supabase — não com mocks de frontend. Se não houver ambiente disponível,
  documentar a lacuna, nunca declarar sucesso presumido.

## Itens proibidos

- Implementar IA/LLM nesta fase.
- Implementar módulos futuros (engenharia, base de conhecimento, violão,
  exercícios, cronograma) além dos cards "Em breve" no dashboard.
- Desabilitar TypeScript/ESLint/testes para o build passar.
- `any` sem justificativa explícita em comentário.
- Backend próprio / microserviços.
- Aplicar migration em Supabase remoto ou fazer deploy em produção sem
  autorização explícita do usuário.
- Commits gigantes sem separação lógica; push direto para `main`.

## Definição de pronto

Ver [Critérios de aceite](.ai/specs/switchlife-foundation.spec.md#critérios-de-aceite)
na SPEC. Resumo: build/typecheck/lint/test passam de verdade (executados,
não presumidos), RLS implementada e documentada, PWA instalável,
documentação coerente com o código, relatório final registrado em
`.ai/reports/`.

## Como registrar decisões

Toda decisão arquitetural relevante (nova dependência, mudança de
roteamento, novo modelo de compartilhamento, troca de backend) vira um ADR
em `docs/decisions/ADR-XXX-titulo.md`, seguindo o formato dos ADRs 001–004
(Status, Contexto, Decisão, Alternativas consideradas, Consequências).

## Como evitar alteração fora de escopo

- Antes de implementar, confira `docs/product/scope-mvp.md`. Se a tarefa
  não estiver lá nem no roadmap da fase atual, pare e sinalize ao invés de
  implementar silenciosamente.
- Uma tarefa nova de módulo futuro (engenharia, IA, violão, exercícios)
  deve, nesta fase, resultar em documentação/ADR — não em tabelas ou telas
  novas, salvo pedido explícito do usuário.

# Testes E2E (Playwright)

Estes testes exigem um projeto Supabase real (local via `supabase start`
ou um projeto de teste na nuvem) com as migrations aplicadas e dois
usuários de teste pré-cadastrados e com e-mail confirmado.

## Variáveis de ambiente necessárias

```bash
E2E_BASE_URL=http://localhost:4173/switchlife/   # opcional, este é o padrão
E2E_USER_A_EMAIL=usuario.a@example.com
E2E_USER_A_PASSWORD=senha-de-teste-123
E2E_USER_B_EMAIL=usuario.b@example.com
E2E_USER_B_PASSWORD=senha-de-teste-123
```

## Rodando

```bash
npm run build
npm run test:e2e
```

O `playwright.config.ts` sobe automaticamente `npm run preview` na porta
4173 antes dos testes, a menos que `E2E_BASE_URL` aponte para outro
ambiente já no ar.

## Cenários (rastreabilidade com a SPEC)

| Arquivo                  | Cenário da SPEC                             |
| ------------------------ | ------------------------------------------- |
| `auth.spec.ts`           | Cenário 1 — Autenticação                    |
| `isolation.spec.ts`      | Cenário 2 — Dados privados                  |
| `sharing-viewer.spec.ts` | Cenário 3 — Lista compartilhada como viewer |
| `sharing-editor.spec.ts` | Cenário 4 — Lista compartilhada como editor |
| `sharing-revoke.spec.ts` | Cenário 5 — Revogação                       |

## Por que estes testes importam mais que os de unidade/integração

Os testes unitários e de integração deste repositório mockam ou isolam o
Supabase — eles validam a UI, não a política de RLS no banco. **Só estes
testes E2E, rodando contra um Postgres real com RLS habilitada, provam
que o isolamento entre usuários e as permissões `viewer`/`editor`
funcionam de verdade.** Ver
[docs/development/testing-strategy.md](../docs/development/testing-strategy.md).

## Status de execução nesta etapa

Estes testes foram escritos, mas não executados neste ambiente de
desenvolvimento por não haver um projeto Supabase disponível para o
agente de IA (a criação de um projeto e a aplicação de migrations em
ambiente remoto exigem autorização explícita do proprietário — ver
`AGENTS.md`). Isso está documentado como pendência no relatório final.

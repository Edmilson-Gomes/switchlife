# Supabase — Migrations

Migrations SQL versionadas, aplicadas em ordem numérica:

1. `0001_profiles.sql` — perfis, trigger de criação automática,
   `find_user_id_by_email`.
2. `0002_notes.sql` — anotações privadas.
3. `0003_lists.sql` — listas (políticas de dono).
4. `0004_list_shares.sql` — compartilhamento, funções `is_list_owner` /
   `list_permission`, política de leitura compartilhada em `lists`.
5. `0005_list_items.sql` — itens de lista.

## Como aplicar

Via Supabase CLI, contra um projeto local ou remoto já criado pelo
proprietário (a aplicação de migrations em ambiente remoto não é feita
automaticamente por agentes — ver regra 14 em `AGENTS.md`):

```bash
supabase link --project-ref <seu-project-ref>
supabase db push
```

Ou, para desenvolvimento local com Docker:

```bash
supabase start
supabase db reset
```

## Extensões necessárias

`gen_random_uuid()` requer a extensão `pgcrypto` (já habilitada por padrão
em projetos Supabase).

-- Lists: owned collections of items, optionally shared with collaborators
-- via list_shares (migration 0005). See docs/architecture/database-model.md.

create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  list_type text not null default 'generic'
    check (list_type in ('shopping', 'checklist', 'study', 'task', 'generic')),
  visibility text not null default 'private'
    check (visibility in ('private', 'shared')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

comment on column public.lists.visibility is
  'Read/UX convenience flag kept in sync by application code when a share is created/revoked. Never the source of truth for authorization — that is always list_shares + RLS.';

create index if not exists lists_owner_active_idx
  on public.lists (owner_id, archived_at);

alter table public.lists enable row level security;

create trigger lists_set_updated_at
  before update on public.lists
  for each row
  execute function public.set_updated_at();

-- The owner-only policies live here. A second SELECT policy allowing
-- collaborators to read a shared list is added in 0004_list_shares.sql,
-- together with the is_list_owner()/list_permission() helper functions it
-- depends on (list_shares does not exist yet at this point).

create policy lists_select_own
  on public.lists for select
  to authenticated
  using (owner_id = auth.uid());

create policy lists_insert_own
  on public.lists for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy lists_update_own
  on public.lists for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy lists_delete_own
  on public.lists for delete
  to authenticated
  using (owner_id = auth.uid());

-- Notes: always private to their owner. No sharing in the foundation MVP.
-- See docs/architecture/database-model.md.

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  content text not null default '',
  category text not null default 'outros',
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on column public.notes.category is
  'Free text, not an enum: the app suggests a known set of categories but the schema stays open for custom categories later.';

create index if not exists notes_owner_active_idx
  on public.notes (owner_id, deleted_at);

create index if not exists notes_owner_pinned_idx
  on public.notes (owner_id, is_pinned);

alter table public.notes enable row level security;

create trigger notes_set_updated_at
  before update on public.notes
  for each row
  execute function public.set_updated_at();

create policy notes_select_own
  on public.notes for select
  to authenticated
  using (owner_id = auth.uid());

create policy notes_insert_own
  on public.notes for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy notes_update_own
  on public.notes for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Physical delete is not exposed to the client; the app performs a soft
-- delete via UPDATE (deleted_at = now()), covered by notes_update_own.

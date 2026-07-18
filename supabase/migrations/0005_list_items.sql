-- List items: owned by their list. Access mirrors list_permission().
-- See docs/architecture/database-model.md.

create table if not exists public.list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  quantity numeric,
  unit text,
  is_completed boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists list_items_list_position_idx
  on public.list_items (list_id, position);

create index if not exists list_items_list_completed_idx
  on public.list_items (list_id, is_completed);

alter table public.list_items enable row level security;

create trigger list_items_set_updated_at
  before update on public.list_items
  for each row
  execute function public.set_updated_at();

-- Keep completed_at in sync with is_completed regardless of what the
-- client sends, so the timestamp can be trusted.
create or replace function public.list_items_sync_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.is_completed and (old is null or not old.is_completed) then
    new.completed_at = now();
  elsif not new.is_completed then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

create trigger list_items_sync_completed_at_trigger
  before insert or update on public.list_items
  for each row
  execute function public.list_items_sync_completed_at();

create policy list_items_select_by_permission
  on public.list_items for select
  to authenticated
  using (public.list_permission(list_id) in ('owner', 'editor', 'viewer'));

create policy list_items_insert_by_permission
  on public.list_items for insert
  to authenticated
  with check (public.list_permission(list_id) in ('owner', 'editor'));

create policy list_items_update_by_permission
  on public.list_items for update
  to authenticated
  using (public.list_permission(list_id) in ('owner', 'editor'))
  with check (public.list_permission(list_id) in ('owner', 'editor'));

create policy list_items_delete_by_permission
  on public.list_items for delete
  to authenticated
  using (public.list_permission(list_id) in ('owner', 'editor'));

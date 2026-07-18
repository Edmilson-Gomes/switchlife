-- List sharing: grants a specific collaborator viewer/editor access to a
-- single list. Never a general-purpose permission table — see
-- docs/architecture/domain-boundaries.md and
-- docs/decisions/ADR-004-data-sharing-model.md.

create table if not exists public.list_shares (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  shared_with_user_id uuid not null references public.profiles (id) on delete cascade,
  permission text not null default 'viewer'
    check (permission in ('viewer', 'editor')),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'revoked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz,
  constraint list_shares_no_self_share check (shared_with_user_id <> owner_id),
  constraint list_shares_unique_target unique (list_id, shared_with_user_id)
);

create index if not exists list_shares_list_idx on public.list_shares (list_id);
create index if not exists list_shares_shared_with_idx on public.list_shares (shared_with_user_id, status);

alter table public.list_shares enable row level security;

create trigger list_shares_set_updated_at
  before update on public.list_shares
  for each row
  execute function public.set_updated_at();

-- owner_id is always derived from lists.owner_id server-side: the client
-- cannot claim ownership of a list it does not own by passing owner_id in
-- the insert payload.
create or replace function public.list_shares_set_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select owner_id into new.owner_id from public.lists where id = new.list_id;
  if new.owner_id is null then
    raise exception 'list % does not exist', new.list_id;
  end if;
  return new;
end;
$$;

create trigger list_shares_set_owner_trigger
  before insert on public.list_shares
  for each row
  execute function public.list_shares_set_owner();

-- Helper functions used by RLS policies on lists and list_items.

create or replace function public.is_list_owner(target_list_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.lists
    where id = target_list_id and owner_id = auth.uid()
  );
$$;

create or replace function public.list_permission(target_list_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select case
    when exists (
      select 1 from public.lists
      where id = target_list_id and owner_id = auth.uid()
    ) then 'owner'
    else (
      select permission from public.list_shares
      where list_id = target_list_id
        and shared_with_user_id = auth.uid()
        and status = 'accepted'
        and revoked_at is null
      limit 1
    )
  end;
$$;

comment on function public.list_permission(uuid) is
  'Returns owner | editor | viewer | NULL for the current user on a given list. Used by list_items RLS policies.';

-- Collaborators can now read a list they have accepted access to. This is
-- the second SELECT policy on lists (see 0003_lists.sql for the owner one);
-- Postgres RLS policies for the same command are OR-combined.
create policy lists_select_shared
  on public.lists for select
  to authenticated
  using (
    exists (
      select 1 from public.list_shares
      where list_shares.list_id = lists.id
        and list_shares.shared_with_user_id = auth.uid()
        and list_shares.status = 'accepted'
        and list_shares.revoked_at is null
    )
  );

-- list_shares policies -------------------------------------------------

create policy list_shares_select_owner_or_recipient
  on public.list_shares for select
  to authenticated
  using (owner_id = auth.uid() or shared_with_user_id = auth.uid());

create policy list_shares_insert_owner_only
  on public.list_shares for insert
  to authenticated
  with check (public.is_list_owner(list_id));

create policy list_shares_update_owner_only
  on public.list_shares for update
  to authenticated
  using (public.is_list_owner(list_id))
  with check (public.is_list_owner(list_id));

-- No delete policy: revocation is always a logical UPDATE
-- (status = 'revoked', revoked_at = now()) to preserve an audit trail of
-- who ever had access to a list.

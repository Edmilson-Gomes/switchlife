-- Profiles: one row per authenticated user, created automatically on signup.
-- See docs/architecture/database-model.md and
-- docs/architecture/authentication-authorization.md for the rationale.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  timezone text not null default 'America/Sao_Paulo',
  locale text not null default 'pt-BR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'One row per auth.users, created automatically by handle_new_user(). Owner-editable subset of profile fields only.';

alter table public.profiles enable row level security;

-- updated_at bookkeeping, reused by every table below.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Profile is created by the platform (trigger), never directly by the client.
create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- No insert/delete policies: profiles are only created by handle_new_user()
-- (SECURITY DEFINER) and never deleted by the client. auth.users cascade
-- handles account deletion.

-- Automatic profile creation on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Resolve an email to a user_id without exposing whether the account exists
-- to the caller in any other way (no listing, no extra fields).
-- See docs/decisions/ADR-004-data-sharing-model.md for the known limitation.
create or replace function public.find_user_id_by_email(lookup_email text)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from auth.users where email = lookup_email limit 1;
$$;

revoke all on function public.find_user_id_by_email(text) from public;
grant execute on function public.find_user_id_by_email(text) to authenticated;

-- Phase 01 baseline schema + RLS
-- Canonical cart table: carts (singular competing "cart" retired)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  items jsonb not null,
  total_minor integer not null check (total_minor >= 0),
  currency text not null default 'usd',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  stripe_session_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now(),
  payload jsonb
);

alter table public.profiles enable row level security;
alter table public.carts enable row level security;
alter table public.orders enable row level security;
alter table public.stripe_events enable row level security;

alter table public.profiles force row level security;
alter table public.carts force row level security;
alter table public.orders force row level security;
alter table public.stripe_events force row level security;

-- Profiles: users manage own row
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_upsert_own on public.profiles;
create policy profiles_upsert_own on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Carts: owner only
drop policy if exists carts_select_own on public.carts;
create policy carts_select_own on public.carts
  for select using (auth.uid() = user_id);

drop policy if exists carts_insert_own on public.carts;
create policy carts_insert_own on public.carts
  for insert with check (auth.uid() = user_id);

drop policy if exists carts_update_own on public.carts;
create policy carts_update_own on public.carts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists carts_delete_own on public.carts;
create policy carts_delete_own on public.carts
  for delete using (auth.uid() = user_id);

-- Orders: users read own; inserts via service role (webhook)
drop policy if exists orders_select_own on public.orders;
create policy orders_select_own on public.orders
  for select using (auth.uid() = user_id);

-- stripe_events: no client access (service role only)
drop policy if exists stripe_events_deny_all on public.stripe_events;
create policy stripe_events_deny_all on public.stripe_events
  for all using (false) with check (false);

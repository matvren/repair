-- CyTECH cloud sync setup
-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- It creates the sync table and row-level-security policy so each user can only read/write their own row.

create table if not exists public.cytech_sync (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.cytech_sync enable row level security;

drop policy if exists "own row" on public.cytech_sync;
create policy "own row"
  on public.cytech_sync
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
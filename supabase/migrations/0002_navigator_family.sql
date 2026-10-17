-- FinHer Phase 1: Challenge Navigator, Career & Family track, country preference.
-- Sensitive data (workplace situations, family planning progress) is owner-only:
-- no policy lets anyone else read it. Supabase encrypts data at rest; operators
-- with database access could still read it, which the app's privacy note says.

-- Country for general legal information.
alter table public.profiles
  add column if not exists jurisdiction text not null default 'BR' check (jurisdiction in ('BR','US'));

grant update (jurisdiction) on public.profiles to authenticated;

-- Saved Challenge Navigator situations.
create table if not exists public.saved_situations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  playbook_id text not null check (char_length(playbook_id) <= 80),
  answers jsonb not null default '{}'::jsonb,
  note text not null default '' check (char_length(note) <= 2000),
  status text not null default 'open' check (status in ('open','resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_situations_user_idx on public.saved_situations (user_id, updated_at desc);

alter table public.saved_situations enable row level security;

create policy "situations: owner can read" on public.saved_situations
  for select using (auth.uid() = user_id);
create policy "situations: owner can insert" on public.saved_situations
  for insert with check (auth.uid() = user_id);
create policy "situations: owner can update" on public.saved_situations
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "situations: owner can delete" on public.saved_situations
  for delete using (auth.uid() = user_id);

create trigger saved_situations_touch before update on public.saved_situations
  for each row execute function public.touch_updated_at();

-- Career & Family checklist progress (item ids only, no free text).
create table if not exists public.checklist_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id text not null check (char_length(item_id) <= 120),
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

alter table public.checklist_progress enable row level security;

create policy "checklist: owner can read" on public.checklist_progress
  for select using (auth.uid() = user_id);
create policy "checklist: owner can insert" on public.checklist_progress
  for insert with check (auth.uid() = user_id);
create policy "checklist: owner can delete" on public.checklist_progress
  for delete using (auth.uid() = user_id);

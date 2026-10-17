-- FinHer: profiles & onboarding (build step 2)
-- Privacy-first: only what the Path to the Market needs. No phone, ID or financial data.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 60),

  -- Onboarding answers (private to the owner)
  university text check (char_length(university) <= 120),
  program text check (program in ('economics','business','accounting','finance','intlTrade','actuarial','other')),
  stage text check (stage in ('y1','y2','y3','y4','grad')),
  interests text[] not null default '{}',
  goals text[] not null default '{}' check (cardinality(goals) <= 3),
  confidence jsonb,
  onboarding_completed_at timestamptz,

  -- Opt-in visibility (everything off by default)
  profile_public boolean not null default false,
  leaderboard_opt_in boolean not null default false,
  university_email_verified boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Owners can read and update only their own row. Inserts happen via the trigger below.
create policy "profiles: owner can read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: owner can update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can't self-verify their university email or touch ids/timestamps:
-- allow updates only on the columns they own. (A column-level revoke would not
-- override Supabase's default table-level grant, so we re-grant explicitly.)
revoke update on public.profiles from authenticated, anon;
grant update (
  display_name, university, program, stage, interests, goals, confidence,
  onboarding_completed_at, profile_public, leaderboard_opt_in
) on public.profiles to authenticated;

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Create a profile row automatically on sign-up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 60));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Self-service account deletion. Cascades to profiles and every table that
-- references auth.users with on delete cascade.
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

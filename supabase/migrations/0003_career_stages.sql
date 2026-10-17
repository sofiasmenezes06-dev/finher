-- FinHer restructure: women at every career stage, not only students.
-- Adds career stage and areas; university and program become optional extras.
-- Existing profiles keep their data but are asked to redo onboarding in the app.

alter table public.profiles
  add column if not exists career_stage text
    check (career_stage in ('exploring','internship','earlyCareer','transition','newcomer','growing','returning')),
  add column if not exists areas text[] not null default '{}'
    check (cardinality(areas) <= 3);

-- Program list changed: allow the new values (and keep old ones readable).
alter table public.profiles drop constraint if exists profiles_program_check;
alter table public.profiles add constraint profiles_program_check
  check (program is null or program in ('economics','business','accounting','finance','intlTrade','engineering','actuarial','other'));

-- Academic year and interests are no longer collected. Remove what we no
-- longer need (data minimization).
alter table public.profiles drop column if exists stage;
alter table public.profiles drop column if exists interests;

grant update (career_stage, areas) on public.profiles to authenticated;

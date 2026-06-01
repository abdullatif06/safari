-- ============================================================================
-- Saifi — database schema (Phase 1)
-- Run this ONCE in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('user', 'business', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type event_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type event_category as enum ('music', 'cultural', 'sports', 'food');
exception when duplicate_object then null; end $$;

do $$ begin
  create type event_cost as enum ('free', 'donation', 'paid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type rsvp_status as enum ('going', 'maybe');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- profiles — extends Supabase auth.users with app-level fields
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text,
  role          user_role not null default 'user',
  business_name text,
  phone         text,
  avatar_url    text,
  created_at    timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- events — replaces the hardcoded EVENTS array
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id                  text primary key,              -- slug, e.g. "jerash-festival"
  owner_id            uuid references public.profiles (id) on delete set null,
  status              event_status not null default 'pending',
  title               text not null,
  title_ar            text not null,
  category            event_category not null,
  cost                event_cost not null default 'free',
  price               numeric,                        -- JOD, when cost = 'paid'
  description         text not null default '',
  description_ar      text not null default '',
  city                text not null,
  city_ar             text not null,
  venue               text not null default '',
  venue_ar            text not null default '',
  event_date          date not null,
  event_time          text not null default '',       -- "18:00"
  lat                 double precision,
  lng                 double precision,
  organizer           text not null default '',
  external_ticket_url text,                            -- payment/registration happens here
  image_url           text,                            -- Supabase Storage URL (optional)
  cover               text not null default '🎉',      -- emoji accent / fallback
  wheelchair          boolean not null default false,
  family_friendly     boolean not null default false,
  sign_language       boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists events_status_date_idx on public.events (status, event_date);
create index if not exists events_owner_idx on public.events (owner_id);

-- ---------------------------------------------------------------------------
-- saves — a user's bookmarked events
-- ---------------------------------------------------------------------------
create table if not exists public.saves (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  event_id   text not null references public.events (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

-- ---------------------------------------------------------------------------
-- rsvps — "I'm going" + the ticket record
-- ---------------------------------------------------------------------------
create table if not exists public.rsvps (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  event_id   text not null references public.events (id) on delete cascade,
  status     rsvp_status not null default 'going',
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

-- ---------------------------------------------------------------------------
-- reviews — post-event reviews
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  event_id   text not null references public.events (id) on delete cascade,
  rating     smallint not null check (rating between 1 and 5),
  body       text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

-- ===========================================================================
-- Row-Level Security
-- ===========================================================================
alter table public.profiles enable row level security;
alter table public.events   enable row level security;
alter table public.saves    enable row level security;
alter table public.rsvps    enable row level security;
alter table public.reviews  enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- --- profiles ---------------------------------------------------------------
drop policy if exists "profiles readable by everyone" on public.profiles;
create policy "profiles readable by everyone"
  on public.profiles for select using (true);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- --- events -----------------------------------------------------------------
drop policy if exists "approved events are public" on public.events;
create policy "approved events are public"
  on public.events for select
  using (status = 'approved' or owner_id = auth.uid() or public.is_admin());

drop policy if exists "business inserts own events" on public.events;
create policy "business inserts own events"
  on public.events for insert
  with check (owner_id = auth.uid());

drop policy if exists "owner or admin updates events" on public.events;
create policy "owner or admin updates events"
  on public.events for update
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "owner or admin deletes events" on public.events;
create policy "owner or admin deletes events"
  on public.events for delete
  using (owner_id = auth.uid() or public.is_admin());

-- --- saves ------------------------------------------------------------------
drop policy if exists "users manage own saves" on public.saves;
create policy "users manage own saves"
  on public.saves for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- --- rsvps ------------------------------------------------------------------
drop policy if exists "users manage own rsvps" on public.rsvps;
create policy "users manage own rsvps"
  on public.rsvps for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- --- reviews ----------------------------------------------------------------
drop policy if exists "reviews readable by everyone" on public.reviews;
create policy "reviews readable by everyone"
  on public.reviews for select using (true);

drop policy if exists "users manage own reviews" on public.reviews;
create policy "users manage own reviews"
  on public.reviews for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===========================================================================
-- Done. Next: run the seed script (npm run seed) to load the sample events.
-- ===========================================================================

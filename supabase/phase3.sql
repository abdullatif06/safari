-- ============================================================================
-- Saifi — database schema (Phase 3): business dashboard + admin queue
-- Run this ONCE in the Supabase SQL Editor, AFTER schema.sql.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- events.admin_notes — reason an admin gives when rejecting an event.
-- Shown back to the business owner in their dashboard.
-- ---------------------------------------------------------------------------
alter table public.events
  add column if not exists admin_notes text;

-- ---------------------------------------------------------------------------
-- organizer_requests — a user's request to become a business/organizer.
-- Admin approves (flips profiles.role -> 'business') or rejects (with a note).
-- One open request per user is enforced in the app; many historical rows are ok.
-- ---------------------------------------------------------------------------
do $$ begin
  create type organizer_request_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

create table if not exists public.organizer_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  business_name text not null,
  phone         text not null default '',
  description   text not null default '',
  status        organizer_request_status not null default 'pending',
  admin_notes   text,                              -- reason on rejection
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz
);

create index if not exists organizer_requests_status_idx
  on public.organizer_requests (status, created_at);
create index if not exists organizer_requests_user_idx
  on public.organizer_requests (user_id);

-- ===========================================================================
-- Row-Level Security
-- ===========================================================================
alter table public.organizer_requests enable row level security;

-- A user can read their own requests; admins can read all.
drop policy if exists "users read own organizer requests" on public.organizer_requests;
create policy "users read own organizer requests"
  on public.organizer_requests for select
  using (user_id = auth.uid() or public.is_admin());

-- A user can create a request for themselves.
drop policy if exists "users create own organizer requests" on public.organizer_requests;
create policy "users create own organizer requests"
  on public.organizer_requests for insert
  with check (user_id = auth.uid());

-- Only admins update requests (approve/reject). The role flip itself is done
-- server-side with the service-role client, so no profile-update policy needed.
drop policy if exists "admins update organizer requests" on public.organizer_requests;
create policy "admins update organizer requests"
  on public.organizer_requests for update
  using (public.is_admin())
  with check (public.is_admin());

-- ===========================================================================
-- Storage — public bucket for uploaded event cover images.
-- Bucket itself is created in the dashboard (Storage → New bucket →
-- name "event-covers", Public = ON). These policies scope writes to the
-- authenticated owner; reads are public.
-- ===========================================================================
drop policy if exists "event covers are public" on storage.objects;
create policy "event covers are public"
  on storage.objects for select
  using (bucket_id = 'event-covers');

drop policy if exists "authed users upload event covers" on storage.objects;
create policy "authed users upload event covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-covers');

drop policy if exists "owners update own event covers" on storage.objects;
create policy "owners update own event covers"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'event-covers' and owner = auth.uid());

drop policy if exists "owners delete own event covers" on storage.objects;
create policy "owners delete own event covers"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'event-covers' and owner = auth.uid());

-- ===========================================================================
-- Done. Next:
--   1. Storage → New bucket → "event-covers", Public ON (if not already).
--   2. Set one user as admin:  update public.profiles set role='admin'
--                              where id = '<your-user-uuid>';
-- ===========================================================================

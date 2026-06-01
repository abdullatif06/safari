-- ============================================================================
-- Saifi — database schema (Phase 4): richer user profiles + avatars
-- Run this ONCE in the Supabase SQL Editor, AFTER schema.sql and phase3.sql.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- profiles.city — the user's home city (free text; used for the profile and,
-- later, to pre-filter events near them). profiles.phone and profiles.avatar_url
-- already exist from schema.sql, so they are not re-added here.
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists city text;

-- ---------------------------------------------------------------------------
-- profiles.lang — the user's preferred UI language ('en' | 'ar'). Persisted so
-- the language choice follows them across devices instead of resetting each
-- visit. Null = no preference yet (fall back to the app default).
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists lang text
  check (lang in ('en', 'ar'));

-- ===========================================================================
-- Storage — public bucket for uploaded avatars.
-- Bucket is created in the dashboard (Storage → New bucket → name "avatars",
-- Public = ON). Writes are scoped to a folder named after the user's id so a
-- user can only manage their own avatar; reads are public.
--   Path convention (enforced below): avatars/{auth.uid()}/<file>
-- ===========================================================================
drop policy if exists "avatars are public" on storage.objects;
create policy "avatars are public"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "users upload own avatar" on storage.objects;
create policy "users upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users update own avatar" on storage.objects;
create policy "users update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users delete own avatar" on storage.objects;
create policy "users delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ===========================================================================
-- Done. Next:
--   1. Storage → New bucket → "avatars", Public ON (if not already).
--   2. (Already present) "users update own profile" policy from schema.sql
--      lets users save full_name / phone / city / lang on their own row.
-- ===========================================================================

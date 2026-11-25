-- ASK TO JOIN — requests made from the portal's front page.
--
-- A visitor who is a club member but has no sign-in fills in a short form
-- (name, email address, an optional line). That makes ONE ROW here and nothing
-- else: no account, no access. A controller sees the row on the Members page
-- (/admin/members) and approves or declines it. Approving is what creates the
-- sign-in.
--
-- Nobody can read or write this table from a browser. Row-level security is on
-- and there are deliberately NO policies, so only the portal's own server,
-- using the secret key, can touch it. It holds names and email addresses.
--
-- Run this once in the Supabase SQL editor. Safe to run again.

create table if not exists public.portal_requests (
  id          bigint generated always as identity primary key,
  name        text        not null check (char_length(name) between 2 and 120),
  email       text        not null check (char_length(email) between 5 and 254),
  note        text                 check (note is null or char_length(note) <= 1000),
  status      text        not null default 'pending'
                          check (status in ('pending', 'approved', 'declined')),
  created_at  timestamptz not null default now(),
  decided_at  timestamptz,
  decided_by  uuid        references auth.users (id) on delete set null
);

-- One waiting request per address. Asking twice does not make two rows.
create unique index if not exists portal_requests_one_waiting
  on public.portal_requests (lower(email))
  where status = 'pending';

create index if not exists portal_requests_waiting
  on public.portal_requests (created_at)
  where status = 'pending';

alter table public.portal_requests enable row level security;

revoke all on table public.portal_requests from anon, authenticated;

-- THE PRIVATE FILE STORE IS FOR MEMBERS — not merely for anybody who has a
-- sign-in. Migration 003 let any signed-in account read the "legacy" bucket,
-- which was right while every account was made by hand. Now that membership is
-- a mark on the account (app_metadata.portal_member, which only the portal's
-- server can set), the store asks for the mark as well.
drop policy if exists "Signed-in members can read legacy files" on storage.objects;
drop policy if exists "Portal members can read legacy files" on storage.objects;
create policy "Portal members can read legacy files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'legacy'
    and coalesce((auth.jwt() -> 'app_metadata' ->> 'portal_member')::boolean, false)
  );

-- READING REMINDERS — a note of each time a controller emailed a member about a
-- required document they had not yet confirmed.
--
-- One row per member per document per email. It is only a note of what was
-- SENT, so that the reading record (/admin/reading) can say "emailed on …" and
-- a controller does not send the same thing twice by accident. It is not a
-- confirmation: those are in reading_confirmations, and only the member's own
-- tick, made signed in, can add one.
--
-- Nobody can read or write this table from a browser. Row-level security is on
-- and there are deliberately NO policies, so only the portal's own server,
-- using the secret key, can touch it.
--
-- Run this once in the Supabase SQL editor. Safe to run again.

create table if not exists public.reading_reminders (
  id       bigint generated always as identity primary key,
  user_id  uuid        not null references auth.users (id) on delete cascade,
  doc_key  text        not null check (char_length(doc_key) between 1 and 200),
  sent_at  timestamptz not null default now(),
  sent_by  uuid        references auth.users (id) on delete set null
);

create index if not exists reading_reminders_latest
  on public.reading_reminders (user_id, doc_key, sent_at desc);

alter table public.reading_reminders enable row level security;

revoke all on table public.reading_reminders from anon, authenticated;

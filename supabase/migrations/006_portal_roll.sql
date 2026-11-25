-- THE CLUB'S LIST — members the club means to invite to the portal.
--
-- One row per person: a name and, where the club has one, an email address.
-- Being on this list gives NOBODY a sign-in. It is only the list a controller
-- invites from, on the Members page (/admin/members): one person at a time, or
-- everybody who is ready in one go once the club's email sending is set up.
--
--   listed    on the list, not yet invited
--   hold      on the list, but somebody should check first (the note says why);
--             never included when everybody is invited at once
--   invited   a sign-in has been made for them (user_id says which)
--   removed   taken off the list; the row is kept as a record
--
-- Nobody can read or write this table from a browser. Row-level security is on
-- and there are deliberately NO policies, so only the portal's own server,
-- using the secret key, can touch it. It holds names and email addresses —
-- THE NAMES THEMSELVES ARE NEVER PUT IN THIS REPOSITORY. They are loaded
-- straight into Supabase, or pasted in on the Members page.
--
-- Run this once in the Supabase SQL editor. Safe to run again.

create table if not exists public.portal_roll (
  id          bigint generated always as identity primary key,
  first_name  text        not null check (char_length(first_name) between 1 and 80),
  surname     text        not null default '' check (char_length(surname) <= 80),
  email       text                 check (email is null or char_length(email) between 5 and 254),
  status      text        not null default 'listed'
                          check (status in ('listed', 'hold', 'invited', 'removed')),
  note        text                 check (note is null or char_length(note) <= 500),
  source      text                 check (source is null or char_length(source) <= 200),
  created_at  timestamptz not null default now(),
  invited_at  timestamptz,
  invited_by  uuid        references auth.users (id) on delete set null,
  user_id     uuid        references auth.users (id) on delete set null
);

create index if not exists portal_roll_email  on public.portal_roll (lower(email));
create index if not exists portal_roll_status on public.portal_roll (status);

alter table public.portal_roll enable row level security;

revoke all on table public.portal_roll from anon, authenticated;

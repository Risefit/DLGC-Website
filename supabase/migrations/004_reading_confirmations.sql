-- REQUIRED READING — who has confirmed reading what.
--
-- One row per member per document version. A row is a record: a member can add
-- one and see their own, and cannot change or remove it. Nobody can see anyone
-- else's through the portal.
--
-- To see who has confirmed what: Supabase → Table Editor → reading_confirmations
-- (the dashboard shows every row; the portal never does).
--
-- Run this once in the Supabase SQL editor. Safe to run again.

create table if not exists public.reading_confirmations (
  user_id      uuid        not null references auth.users (id) on delete cascade,
  doc_key      text        not null check (char_length(doc_key) between 1 and 200),
  doc_title    text        not null check (char_length(doc_title) between 1 and 300),
  doc_version  text                 check (doc_version is null or char_length(doc_version) <= 100),
  member_email text,
  confirmed_at timestamptz not null default now(),
  primary key (user_id, doc_key)
);

alter table public.reading_confirmations enable row level security;

-- Who confirmed, and when, are set here from the signed-in session — never
-- taken from what the browser sends. A member cannot confirm on somebody
-- else's behalf or give a confirmation an earlier date.
create or replace function public.reading_confirmations_stamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.user_id      := auth.uid();
  new.member_email := auth.jwt() ->> 'email';
  new.confirmed_at := now();
  return new;
end;
$$;

drop trigger if exists reading_confirmations_stamp on public.reading_confirmations;
create trigger reading_confirmations_stamp
  before insert on public.reading_confirmations
  for each row execute function public.reading_confirmations_stamp();

drop policy if exists "Members see their own confirmations" on public.reading_confirmations;
create policy "Members see their own confirmations"
  on public.reading_confirmations for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Members record their own confirmations" on public.reading_confirmations;
create policy "Members record their own confirmations"
  on public.reading_confirmations for insert
  to authenticated
  with check (user_id = auth.uid());

-- No update or delete policy, on purpose.
revoke all on public.reading_confirmations from anon;
revoke all on public.reading_confirmations from authenticated;
grant select, insert on public.reading_confirmations to authenticated;

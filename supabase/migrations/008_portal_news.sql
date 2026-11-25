-- NEWS AND NOTICES POSTED FROM THE PORTAL.
--
-- A controller writes a notice on the News page (/club-life/news) and it is
-- stored here. The older notices, brought across from the old site, are in
-- src/content/news.ts; the portal shows the two as one list.
--
--   published   showing
--   removed     taken down by a controller. Kept, and can be put back.
--
-- Nothing is ever deleted from this table by the portal.
--
-- Nobody can read or write it from a browser. Row-level security is on and
-- there are deliberately NO policies, so only the portal's own server, using
-- the secret key, can touch it: it reads the notices when it builds a page for
-- a signed-in member, and writes one only after checking the person asking is
-- a controller.
--
-- Run this once in the Supabase SQL editor. Safe to run again.

create table if not exists public.portal_news (
  id          bigint generated always as identity primary key,
  news_date   date        not null default current_date,
  title       text        not null check (char_length(title) between 2 and 140),
  from_name   text                 check (from_name is null or char_length(from_name) <= 80),
  body        text        not null check (char_length(body) between 1 and 8000),
  links       jsonb       not null default '[]'::jsonb,
  pinned      boolean     not null default false,
  status      text        not null default 'published'
                          check (status in ('published', 'removed')),
  created_at  timestamptz not null default now(),
  created_by  uuid        references auth.users (id) on delete set null,
  updated_at  timestamptz,
  updated_by  uuid        references auth.users (id) on delete set null
);

create index if not exists portal_news_showing
  on public.portal_news (news_date desc, id desc)
  where status = 'published';

alter table public.portal_news enable row level security;

revoke all on table public.portal_news from anon, authenticated;

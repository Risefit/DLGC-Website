-- STORIES AND PHOTOGRAPHS SENT IN BY MEMBERS — who decided, and the copy shown.
--
-- A member sends a flying-blog story or a photograph from the portal and it
-- lands in `submissions` as "pending" (this has been so since August 2026).
-- From November 2026 a controller decides, on /admin/submissions:
--
--   pending     waiting for a controller
--   published   approved: it is on the Flying Blog or in the Gallery
--   declined    not shown (declined, or taken down later). Kept.
--
-- Nothing is deleted. The picture a member sent stays exactly as it arrived;
-- when one is approved the portal makes two smaller copies of it for showing
-- (with the phone's location data stripped out) and notes where they are.
--
-- SAFETY REPORTS AND ADVERTS ARE ALSO ROWS IN THIS TABLE, and this changes
-- nothing about them. The controllers' page reads and writes only rows whose
-- kind is 'blog' or 'photo'. A safety report is for the Safety Officer alone.
--
-- Run this once in the Supabase SQL editor. Safe to run again.

alter table public.submissions
  add column if not exists decided_at timestamptz,
  add column if not exists decided_by uuid references auth.users (id) on delete set null,
  add column if not exists shown_path text,
  add column if not exists thumb_path text;

comment on column public.submissions.shown_path is
  'For an approved story or photograph: the copy the portal shows (resized, location data removed). The original stays at image_path.';

create index if not exists submissions_published
  on public.submissions (kind, created_at desc)
  where status = 'published';

-- Belt and braces. Row-level security is on with no policies, so nobody could
-- read this table from a browser anyway; this takes away the table permission
-- as well. It holds safety reports. Only the portal's server writes or reads it.
revoke all on table public.submissions from anon, authenticated;

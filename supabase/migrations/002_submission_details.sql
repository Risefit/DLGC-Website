-- Run this in Supabase → SQL Editor, once.
--
-- Adds the JSON column that adverts and safety reports use, so a new field on a
-- form never needs another migration. Safe to run more than once.
--
-- Reading submissions: Supabase → Table Editor → submissions.
--   kind = 'blog'   flying blog story, for the website editor
--   kind = 'photo'  gallery photograph, for the website editor
--   kind = 'advert' classified advert, for the website editor
--   kind = 'safety' safety occurrence report, FOR THE SAFETY OFFICER ONLY
--
-- A safety report with details->>'anonymous' = 'true' has no name or email by
-- design. Do not attempt to work out who sent it — the reporting culture
-- depends on that being true in practice as well as on paper.

alter table public.submissions
  add column if not exists details jsonb;

comment on column public.submissions.details is
  'Form fields beyond the common ones: advert kind and price, contact details the advertiser chose to publish, and for safety reports the date, locations ticked and the reporter''s own risk assessment.';

-- Makes the Safety Officer's queue easy to find.
create index if not exists submissions_kind_status_idx
  on public.submissions (kind, status);

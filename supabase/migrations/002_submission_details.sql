-- ALREADY APPLIED to the dlgc-members-portal project on 18 August 2026.
-- Kept here so the repository records the schema. Safe to run again.
--
-- Three changes, all needed together. The first version of this file had only
-- the first, which would have left both new forms failing:
--
--   1. `details` holds the extra form fields as JSON, so a new field on a form
--      never needs another migration.
--   2. `kind` must accept 'advert' and 'safety'. The original check constraint
--      allowed only 'blog' and 'photo' and would have rejected both outright.
--   3. `name` and `email` must be nullable. An anonymous safety report stores
--      nulls by design — the reporting culture depends on that being true in
--      the database, not just on the form.
--
-- Reading submissions: Supabase -> Table Editor -> submissions.
--   kind = 'blog'   flying blog story, for the website editor
--   kind = 'photo'  gallery photograph, for the website editor
--   kind = 'advert' classified advert, for the website editor
--   kind = 'safety' safety occurrence report, FOR THE SAFETY OFFICER ONLY
--
-- A safety report with details->>'anonymous' = 'true' has no name or email by
-- design. Do not attempt to work out who sent it.

alter table public.submissions
  add column if not exists details jsonb;

alter table public.submissions
  drop constraint if exists submissions_kind_check;

alter table public.submissions
  add constraint submissions_kind_check
  check (kind = any (array['blog'::text, 'photo'::text, 'advert'::text, 'safety'::text]));

alter table public.submissions alter column name  drop not null;
alter table public.submissions alter column email drop not null;

comment on column public.submissions.details is
  'Form fields beyond the common ones: advert kind and price, contact details the advertiser chose to publish, and for safety reports the date, locations ticked and the reporter''s own risk assessment.';

comment on column public.submissions.name is
  'NULL for anonymous safety reports. Do not attempt to backfill or infer it.';

create index if not exists submissions_kind_status_idx
  on public.submissions (kind, status);

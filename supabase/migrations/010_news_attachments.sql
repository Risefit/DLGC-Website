-- PHOTOGRAPHS AND FILES ON A NOTICE, and uploads that go straight to the store.
--
-- 1. A notice posted from the News page can carry a few photographs and files.
--    Where each one is kept is noted on the notice, in `attachments`.
--
-- 2. They are kept in a new PRIVATE store called `news`. Nobody can read it
--    from a browser: there are no policies on it, so only the portal's server
--    can, and the server hands a signed-in member a ten-minute link when they
--    open a notice's photograph or file (src/app/files/news).
--
-- 3. Both stores say what they will take — photographs, and for news the usual
--    office files — and how big. The portal checks this as well; this is the
--    store refusing anything else even if the portal were got round.
--    (The `submissions` store also holds the photographs sent with safety
--    reports. Those are pictures too, so nothing changes for them.)
--
-- Run this once in the Supabase SQL editor. Safe to run again.

alter table public.portal_news
  add column if not exists attachments jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news', 'news', false, 26214400,
  array[
    'image/jpeg', 'image/png', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

update storage.buckets
   set public = false,
       file_size_limit = 15728640,
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
 where id = 'submissions';

-- Private home for the files copied from the old members' site.
--
-- Nothing in this bucket is public. The portal hands a signed-in member a
-- link to one file at a time that works for ten minutes
-- (src/app/files/[...path]/route.ts).
--
-- Run this once in the Supabase SQL editor (or let Claude apply it).

insert into storage.buckets (id, name, public, file_size_limit)
values ('legacy', 'legacy', false, 52428800)   -- 50 MB, the free plan's limit per file
on conflict (id) do nothing;

-- Read-only, and only for somebody signed in to the portal. There is
-- deliberately no insert, update or delete policy: files go in with the
-- service key (scripts/upload-legacy.mjs) and members cannot change them.
drop policy if exists "Signed-in members can read legacy files" on storage.objects;
create policy "Signed-in members can read legacy files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'legacy');

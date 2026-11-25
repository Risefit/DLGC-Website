-- ROLES, AND A MEMBER'S OWN PROFILE.
--
-- Three tables.
--
-- 1. portal_member_roles — the duties a member does (winch driver, launch
--    marshal, clerk …). One row a member. A role is ticked by the member on
--    My profile or set by a controller on the Members page. It decides which
--    duty manuals are added to that member's required reading, and it shows
--    beside their name on the Members page. IT OPENS NOTHING: who may see
--    what in the portal is decided by the marks on the account, never by a
--    role, and it is not a record that anybody is qualified.
--
--    A member's browser may READ that member's own row (the count of required
--    reading on every page needs it). No browser can write: changes go
--    through the portal's server, which checks who is asking.
--
-- 2. portal_profiles — what a member chooses to tell the club for an
--    emergency: who to ring, next of kin, blood type, anything a first-aider
--    should know. EVERY FIELD IS OPTIONAL AND SOME OF IT IS HEALTH
--    INFORMATION, so nobody can read or write this table from a browser at
--    all: row-level security is on and there are deliberately NO policies.
--    The member reads and changes their own through the portal's server; a
--    controller can open one member's details from the Members page. When a
--    member clears everything, the row is deleted.
--
-- 3. portal_profile_views — a note of each time a controller opened a
--    member's emergency details: who, whose, when. Nothing of the details
--    themselves. Server only, like the profiles.
--
-- THIS IS SEPARATE FROM FREE FLIGHT. Nothing here is read from it or sent to
-- it, and changing a profile here changes nothing there.
--
-- If the list of roles in src/lib/roles.ts changes, change the list below to
-- match. Run this once in the Supabase SQL editor. Safe to run again.

create table if not exists public.portal_member_roles (
  user_id     uuid        primary key references auth.users (id) on delete cascade,
  roles       text[]      not null default '{}',
  updated_at  timestamptz not null default now(),
  updated_by  uuid        references auth.users (id) on delete set null
);

alter table public.portal_member_roles drop constraint if exists portal_member_roles_known;
alter table public.portal_member_roles add constraint portal_member_roles_known check (
  roles <@ array[
    'winch-master', 'winch-trainer', 'winch-driver', 'winch-trainee',
    'launch-master', 'launch-marshal',
    'head-clerk', 'clerk', 'trainee-clerk'
  ]::text[]
  and cardinality(roles) <= 9
);

alter table public.portal_member_roles enable row level security;

drop policy if exists "Members see their own roles" on public.portal_member_roles;
create policy "Members see their own roles"
  on public.portal_member_roles for select
  to authenticated
  using (user_id = (select auth.uid()));

-- No insert, update or delete policy, on purpose.
revoke all on table public.portal_member_roles from anon, authenticated;
grant select on table public.portal_member_roles to authenticated;


create table if not exists public.portal_profiles (
  user_id               uuid        primary key references auth.users (id) on delete cascade,
  mobile                text        check (mobile is null or char_length(mobile) <= 40),
  contact_name          text        check (contact_name is null or char_length(contact_name) <= 120),
  contact_relationship  text        check (contact_relationship is null or char_length(contact_relationship) <= 60),
  contact_phone         text        check (contact_phone is null or char_length(contact_phone) <= 40),
  contact_phone2        text        check (contact_phone2 is null or char_length(contact_phone2) <= 40),
  kin_name              text        check (kin_name is null or char_length(kin_name) <= 120),
  kin_relationship      text        check (kin_relationship is null or char_length(kin_relationship) <= 60),
  kin_phone             text        check (kin_phone is null or char_length(kin_phone) <= 40),
  blood_type            text        check (blood_type is null or blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  medical               text        check (medical is null or char_length(medical) <= 1000),
  updated_at            timestamptz not null default now()
);

alter table public.portal_profiles enable row level security;
revoke all on table public.portal_profiles from anon, authenticated;


create table if not exists public.portal_profile_views (
  id          bigint generated always as identity primary key,
  subject_id  uuid        not null references auth.users (id) on delete cascade,
  viewer_id   uuid        references auth.users (id) on delete set null,
  viewed_at   timestamptz not null default now()
);

create index if not exists portal_profile_views_subject on public.portal_profile_views (subject_id, viewed_at desc);

alter table public.portal_profile_views enable row level security;
revoke all on table public.portal_profile_views from anon, authenticated;

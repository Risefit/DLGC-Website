-- MORE ROLES, WITHOUT A TRIP TO SUPABASE EACH TIME.
--
-- Migration 011 made the database refuse any role that was not one of the
-- first nine. A day later four more were wanted (Basic Instructor, Flight
-- Instructor, Chief Flying Instructor, Introductory Flight Pilot), and a list
-- written into the database would have needed changing here every time the
-- club thinks of another.
--
-- So the database now checks only the SHAPE of a role: a short name in
-- lower-case letters, digits and hyphens, and no more than forty of them for
-- one member. WHICH roles exist is decided in one place, src/lib/roles.ts,
-- and the portal's server drops anything not on that list before it saves.
-- That is safe because no browser can write to this table at all — only the
-- server can, and it checks who is asking first. Nothing else about the table
-- changes: a member still reads only their own row.
--
-- Rows already saved are untouched and already fit the new rule.
--
-- Run this once in the Supabase SQL editor. Safe to run again.

alter table public.portal_member_roles drop constraint if exists portal_member_roles_known;
alter table public.portal_member_roles add constraint portal_member_roles_known check (
  cardinality(roles) <= 40
  -- no name has a comma in it (the next line joins the names with commas)
  and position(',' in array_to_string(roles, '', '')) = 0
  -- and every name is 1 to 40 of a-z, 0-9 and hyphen, starting with a letter
  and (
    cardinality(roles) = 0
    or (',' || array_to_string(roles, ',', '*') || ',') ~ '^(,[a-z][a-z0-9-]{0,39})+,$'
  )
);

import type { SupabaseClient } from '@supabase/supabase-js';
import { cleanRoles, type RoleId } from '@/lib/roles';

/**
 * A MEMBER'S PROFILE — the duties they do, and what they choose to tell the
 * club for an emergency. The tables are described in
 * supabase/migrations/011_roles_and_profiles.sql.
 *
 * THE EMERGENCY DETAILS ARE THE MOST PERSONAL THING THE PORTAL HOLDS. Blood
 * type and "anything a first-aider should know" are health information, and
 * the contacts are other people's names and numbers. So:
 *   - every field is optional, and the page says who can see it;
 *   - no browser can read the table. A member's own details reach them through
 *     the server (My profile); a controller opens one named member's from the
 *     Members page, and each time is noted in portal_profile_views;
 *   - nothing here is ever written to a log, an email, or this repository;
 *   - a member who clears everything has their row deleted, not blanked.
 *
 * It is separate from Free Flight, which keeps the club's membership records.
 * Nothing is read from it or sent to it.
 *
 * Server only: this file is for "use server" files and server pages.
 */

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

/** What the form holds. Every field is text; an empty one means "not given". */
export type Profile = {
  mobile: string;
  contactName: string;
  contactRelationship: string;
  contactPhone: string;
  contactPhone2: string;
  kinName: string;
  kinRelationship: string;
  kinPhone: string;
  bloodType: string;
  medical: string;
};

export const emptyProfile: Profile = {
  mobile: '',
  contactName: '',
  contactRelationship: '',
  contactPhone: '',
  contactPhone2: '',
  kinName: '',
  kinRelationship: '',
  kinPhone: '',
  bloodType: '',
  medical: '',
};

const COLUMNS: Record<keyof Profile, string> = {
  mobile: 'mobile',
  contactName: 'contact_name',
  contactRelationship: 'contact_relationship',
  contactPhone: 'contact_phone',
  contactPhone2: 'contact_phone2',
  kinName: 'kin_name',
  kinRelationship: 'kin_relationship',
  kinPhone: 'kin_phone',
  bloodType: 'blood_type',
  medical: 'medical',
};
const SELECT = Object.values(COLUMNS).join(', ');

const LIMITS: Record<keyof Profile, number> = {
  mobile: 40,
  contactName: 120,
  contactRelationship: 60,
  contactPhone: 40,
  contactPhone2: 40,
  kinName: 120,
  kinRelationship: 60,
  kinPhone: 40,
  bloodType: 3,
  medical: 1000,
};

// One line of text: no line breaks or control characters, spaces tidied.
const line = (x: unknown) => (typeof x === 'string' ? x.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim() : '');
// Several lines: line breaks kept, other control characters removed.
const lines = (x: unknown) =>
  typeof x === 'string'
    ? x
        .replace(/\r\n?/g, '\n')
        .replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    : '';

// A telephone number as people write one: digits, spaces, + ( ) - . and "ext".
const PHONE = /^(?=(?:.*\d){6,})[0-9+()\-. ]+(?: ?(?:ext|x)\.? ?\d{1,6})?$/i;

/**
 * Check what the form sent. Returns the tidy profile, or the first thing that
 * needs putting right, in words for the member.
 */
export function checkProfile(input: unknown): { ok: true; profile: Profile } | { ok: false; message: string } {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const p: Profile = { ...emptyProfile };
  for (const key of Object.keys(emptyProfile) as (keyof Profile)[]) {
    p[key] = key === 'medical' ? lines(raw[key]) : line(raw[key]);
  }

  const names: Record<keyof Profile, string> = {
    mobile: 'your mobile number',
    contactName: 'your emergency contact’s name',
    contactRelationship: 'who your emergency contact is to you',
    contactPhone: 'your emergency contact’s telephone number',
    contactPhone2: 'your emergency contact’s other number',
    kinName: 'your next of kin’s name',
    kinRelationship: 'who your next of kin is to you',
    kinPhone: 'your next of kin’s telephone number',
    bloodType: 'blood type',
    medical: 'the note for a first-aider',
  };
  for (const key of Object.keys(LIMITS) as (keyof Profile)[]) {
    if (p[key].length > LIMITS[key]) {
      return { ok: false, message: `Please shorten ${names[key]}: it can be up to ${LIMITS[key]} characters.` };
    }
  }
  for (const key of ['mobile', 'contactPhone', 'contactPhone2', 'kinPhone'] as const) {
    if (p[key] && !PHONE.test(p[key])) {
      return { ok: false, message: `Please check ${names[key]}. Use digits and spaces, for example 07700 900123.` };
    }
  }
  if (p.bloodType && !(BLOOD_TYPES as readonly string[]).includes(p.bloodType)) {
    return { ok: false, message: 'Please choose a blood type from the list, or leave it as “Not given”.' };
  }
  // A contact nobody can ring, or a number with nobody's name, helps no one.
  if ((p.contactRelationship || p.contactPhone || p.contactPhone2) && !p.contactName) {
    return { ok: false, message: 'Please give your emergency contact’s name.' };
  }
  if (p.contactName && !p.contactPhone) {
    return { ok: false, message: 'Please give a telephone number for your emergency contact.' };
  }
  if ((p.kinRelationship || p.kinPhone) && !p.kinName) {
    return { ok: false, message: 'Please give your next of kin’s name.' };
  }
  return { ok: true, profile: p };
}

export const profileIsEmpty = (p: Profile) => (Object.keys(emptyProfile) as (keyof Profile)[]).every((k) => !p[k]);

/** One member's emergency details, or null if they have given none. Throws if the table cannot be read. */
export async function readProfile(admin: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data, error } = await admin.from('portal_profiles').select(SELECT).eq('user_id', userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as unknown as Record<string, string | null>;
  const p: Profile = { ...emptyProfile };
  for (const key of Object.keys(COLUMNS) as (keyof Profile)[]) p[key] = row[COLUMNS[key]] ?? '';
  return p;
}

/** Save one member's emergency details; with nothing left in them, remove the row. */
export async function writeProfile(admin: SupabaseClient, userId: string, p: Profile): Promise<void> {
  if (profileIsEmpty(p)) {
    const { error } = await admin.from('portal_profiles').delete().eq('user_id', userId);
    if (error) throw new Error(error.message);
    return;
  }
  const row = {
    user_id: userId,
    mobile: p.mobile || null,
    contact_name: p.contactName || null,
    contact_relationship: p.contactRelationship || null,
    contact_phone: p.contactPhone || null,
    contact_phone2: p.contactPhone2 || null,
    kin_name: p.kinName || null,
    kin_relationship: p.kinRelationship || null,
    kin_phone: p.kinPhone || null,
    blood_type: p.bloodType || null,
    medical: p.medical || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await admin.from('portal_profiles').upsert(row, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
}

/** The roles one member holds. Throws if the table cannot be read. */
export async function readRoles(admin: SupabaseClient, userId: string): Promise<RoleId[]> {
  const { data, error } = await admin.from('portal_member_roles').select('roles').eq('user_id', userId).maybeSingle();
  if (error) throw new Error(error.message);
  return cleanRoles(data?.roles);
}

/** Set the roles one member holds, and note who did it. */
export async function writeRoles(admin: SupabaseClient, userId: string, roles: RoleId[], by: string): Promise<void> {
  const { error } = await admin
    .from('portal_member_roles')
    .upsert({ user_id: userId, roles: cleanRoles(roles), updated_at: new Date().toISOString(), updated_by: by }, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
}

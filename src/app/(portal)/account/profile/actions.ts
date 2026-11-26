'use server';

import { requireMember } from '@/lib/member';
import { logSupabaseProblem } from '@/lib/supabase/admin';
import { checkProfile, readRoles, ROLE_NOT_ALLOWED_YET, writeProfile, writeRoles } from '@/lib/profile';
import { cleanRoles, type RoleId } from '@/lib/roles';

/**
 * A MEMBER SAVES THEIR OWN PROFILE — the duties they do, and their emergency
 * details. (My sign-in → My profile.)
 *
 * WHOSE PROFILE IT IS comes from the sign-in and from nowhere else. The form
 * sends no member id and none would be listened to: requireMember() asks
 * Supabase who is signed in, and that person's record is the only one this
 * can touch. Whatever the form sends is checked and tidied before it is kept
 * (src/lib/profile.ts); a role the club does not have is simply dropped.
 *
 * It does not touch the account itself — not the member mark, not the
 * controller mark, not the password. Roles live in their own table and open
 * nothing.
 *
 * Nothing of what a member types here is written to a log.
 */

export type ProfileSaved =
  | { ok: true; message: string; /** the roles as they now stand */ roles: RoleId[] }
  | { ok: false; message: string };

export async function saveMyProfile(input: { roles?: unknown; profile?: unknown }): Promise<ProfileSaved> {
  let ctx;
  try {
    ctx = await requireMember();
  } catch (e) {
    return {
      ok: false,
      message:
        e instanceof Error && e.message === 'not-configured'
          ? 'Profiles cannot be saved on this copy of the site.'
          : 'Sign in to the portal again, then save.',
    };
  }
  const { me, admin } = ctx;

  const checked = checkProfile(input?.profile);
  if (!checked.ok) return checked;
  const roles = cleanRoles(input?.roles);

  try {
    // Only write the roles when they have changed, so "who last set them"
    // stays true when a member is just correcting a telephone number.
    const before = await readRoles(admin, me.id);
    if (before.join('|') !== roles.join('|')) await writeRoles(admin, me.id, roles, me.id);
    await writeProfile(admin, me.id, checked.profile);
  } catch (e) {
    logSupabaseProblem('my profile, saving', { message: e instanceof Error ? e.message : undefined });
    if (e instanceof Error && e.message === ROLE_NOT_ALLOWED_YET) {
      return {
        ok: false,
        message:
          'The flying duties (instructing, introductory flights, mutual flying) cannot be saved yet: the club’s website editor has one more step to finish. Nothing was changed. Untick those for now and save again.',
      };
    }
    return { ok: false, message: 'Your profile could not be saved just now. Nothing was changed. Please try again.' };
  }

  return {
    ok: true,
    roles,
    message: 'Saved. Your required reading now follows the duties you ticked.',
  };
}

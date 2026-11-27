'use server';

import { requireMember } from '@/lib/member';
import { logSupabaseProblem } from '@/lib/supabase/admin';
import { checkName, checkProfile, readRoles, ROLE_NOT_ALLOWED_YET, writeProfile, writeRoles } from '@/lib/profile';
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
 * THE ONE THING IT CHANGES ON THE ACCOUNT IS THE NAME — the label shown beside
 * the member's email address. It never touches the marks that decide who gets
 * in (the member mark, the controller mark), the email address or the
 * password: those are in a different part of the account that this action
 * does not write to. Roles live in their own table and open nothing.
 *
 * Nothing of what a member types here is written to a log.
 */

export type ProfileSaved =
  | { ok: true; message: string; /** the roles as they now stand */ roles: RoleId[]; /** the name as it now stands */ name: string }
  | { ok: false; message: string };

export async function saveMyProfile(input: { roles?: unknown; profile?: unknown; name?: unknown }): Promise<ProfileSaved> {
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

  // The name: checked first, saved last. A form that sends none leaves it alone.
  const had = typeof me.user_metadata?.name === 'string' ? me.user_metadata.name : '';
  let name = had;
  if (input?.name !== undefined) {
    const named = checkName(input.name);
    if (!named.ok) return named;
    name = named.name;
  }

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

  if (name !== had) {
    // Only the name. The rest of what the account already carries there is
    // kept, and the marks that decide who gets in are not in this part at all.
    const { error } = await admin.auth.admin.updateUserById(me.id, { user_metadata: { ...(me.user_metadata ?? {}), name } });
    if (error) {
      logSupabaseProblem('my profile, saving the name', error);
      return { ok: false, message: 'Everything was saved except your name, which could not be changed just now. Please try again.' };
    }
  }

  return {
    ok: true,
    roles,
    name,
    message: 'Saved. Your required reading now follows what you chose.',
  };
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cleanRoles, type RoleId } from '@/lib/roles';

/**
 * THE ROLES OF THE MEMBER WHO IS SIGNED IN — their own, nobody else's.
 *
 * Read from the table portal_member_roles, where the database lets a member's
 * browser see that member's own row and no other, and lets no browser write
 * anything. The roles are changed on My profile (by the member) or on the
 * Members page (by a controller); both go through the portal's server.
 *
 * `null` means "not known yet". If the table is not there (migration 011 not
 * run), or the member has no row, the answer is "no roles" and everything
 * that depends on it behaves as it did before roles existed.
 *
 * FOR DECIDING WHAT TO SHOW, NOTHING ELSE. A role opens nothing in the portal.
 */
export const ROLES_CHANGED = 'dlgc:roles-changed';

export async function readMyRoles(): Promise<RoleId[] | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data: s } = await supabase.auth.getSession();
  if (!s.session) return null;
  const { data, error } = await supabase.from('portal_member_roles').select('roles').maybeSingle();
  if (error) return [];
  return cleanRoles(data?.roles);
}

export function useMyRoles(): RoleId[] | null {
  const [roles, setRoles] = useState<RoleId[] | null>(null);

  useEffect(() => {
    let live = true;
    const load = () => readMyRoles().then((r) => live && setRoles(r));
    load();
    // My profile says when the member has changed their own.
    window.addEventListener(ROLES_CHANGED, load);
    return () => {
      live = false;
      window.removeEventListener(ROLES_CHANGED, load);
    };
  }, []);

  return roles;
}

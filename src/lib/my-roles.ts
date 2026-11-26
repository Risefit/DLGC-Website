'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
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
 * ONE ANSWER FOR THE WHOLE PAGE. Several things on a page ask this at once —
 * the count under "My sign-in", the line on the dashboard, the required
 * reading list — and they must never disagree. (On the first day they did: the
 * menu said "all 8" while the list beside it said "all 12", because the menu
 * had asked before a role was given and never asked again.) So the answer is
 * kept in one place here and every asker is told when it changes. It is asked
 * for again:
 *   - whenever a page is opened or the member moves to another page;
 *   - when the member comes back to the tab;
 *   - when My profile or the Members page says a role has changed
 *     (the `dlgc:roles-changed` event).
 *
 * `null` means "not known yet". If the table is not there (migration 011 not
 * run), or the member has no row, the answer is "no roles" and everything
 * that depends on it behaves as it did before roles existed.
 *
 * FOR DECIDING WHAT TO SHOW, NOTHING ELSE. A role opens nothing in the portal.
 */
export const ROLES_CHANGED = 'dlgc:roles-changed';

let known: RoleId[] | null = null;
let wired = false;
const listeners = new Set<() => void>();

async function readMyRoles(): Promise<RoleId[] | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data: s } = await supabase.auth.getSession();
  if (!s.session) return null;
  const { data, error } = await supabase.from('portal_member_roles').select('roles').maybeSingle();
  if (error) return [];
  return cleanRoles(data?.roles);
}

/**
 * Ask again. Several parts of a page ask in the same instant; they share one
 * question. If a change is announced while an answer is on its way, one more
 * question follows it, so the last word is always the newest.
 */
let queued = false;
let flying = false;
let again = false;

export function refreshMyRoles() {
  if (flying) {
    again = true;
    return;
  }
  if (queued) return;
  queued = true;
  setTimeout(() => {
    queued = false;
    flying = true;
    readMyRoles()
      .then((roles) => {
        // Same roles as before: keep the same list, so nothing redraws for nothing.
        if (known !== null && roles !== null && known.join('|') === roles.join('|')) return;
        known = roles;
        listeners.forEach((tell) => tell());
      })
      .catch(() => {})
      .finally(() => {
        flying = false;
        if (again) {
          again = false;
          refreshMyRoles();
        }
      });
  }, 0);
}

function subscribe(tell: () => void) {
  listeners.add(tell);
  if (!wired) {
    wired = true;
    window.addEventListener(ROLES_CHANGED, refreshMyRoles);
    document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && refreshMyRoles());
  }
  return () => {
    listeners.delete(tell);
  };
}

export function useMyRoles(): RoleId[] | null {
  const roles = useSyncExternalStore(
    subscribe,
    () => known,
    () => null,
  );
  // Opening a page, or moving to another, asks again.
  const pathname = usePathname();
  useEffect(() => {
    refreshMyRoles();
  }, [pathname]);
  return roles;
}

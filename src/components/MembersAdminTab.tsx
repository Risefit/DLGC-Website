'use client';

import { useEffect, useState } from 'react';
import { AWAREIM_BASE } from '@/content/awareim';

/**
 * ONE MEMBERS' ADMIN TAB, REUSED.
 *
 * Members' Admin (AwareIM) asks for a sign-in every time its logon address is
 * loaded, even when another tab is already signed in. Every button here used to
 * open that address in a fresh tab, so a member who pressed three buttons signed
 * in three times and ended up with three tabs.
 *
 * Now the first button opens Members' Admin in a tab this portal remembers by
 * name, and every later button goes back to THAT tab instead of opening another.
 * Nothing is reloaded, so the member is still signed in there.
 *
 * What this does NOT do, and must not be made to do:
 *   - It does not sign anybody in, keep anybody signed in, or touch Members'
 *     Admin in any way. It only decides which browser tab a link opens in.
 *   - It does not take the member to a particular screen. That needs the real
 *     process names from Mo Bent (see src/content/awareim.ts).
 *
 * A link that DOES land on a particular screen (the airspace re-brief) is left
 * alone: it has to load the logon address to do its job.
 *
 * The remembered tab keeps a link back to the portal (it is opened without
 * "noopener"), which is what lets the portal find it again. That is a deliberate
 * exception to rule 8 in CLAUDE.md, made only for the club's own system.
 *
 * If the browser refuses any of this, the link simply behaves as it always did.
 */

const TAB_NAME = 'dlgcMembersAdmin';

export default function MembersAdminTab() {
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.href !== AWAREIM_BASE) return;

      let tab: Window | null = null;
      try {
        tab = window.open('', TAB_NAME);
      } catch {
        tab = null;
      }
      if (!tab) return; // blocked: let the link open the way it always has

      e.preventDefault();

      // A tab we have just created is blank and readable. One that is already on
      // Members' Admin belongs to another site and refuses to be read — which is
      // how we know it is the one to go back to.
      let blank = false;
      try {
        blank = tab.location.href === 'about:blank';
      } catch {
        blank = false;
      }

      if (blank) {
        tab.location.replace(AWAREIM_BASE);
      } else {
        setNotice(true);
      }
      tab.focus();
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(false), 9000);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <div aria-live="polite" className="no-print">
      {notice && (
        <p className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-card bg-navy px-5 py-4 text-white shadow-panel">
          Members’ Admin is already open in another tab, and you are still signed in there. If this
          tab is still in front, switch to that one.
        </p>
      )}
    </div>
  );
}

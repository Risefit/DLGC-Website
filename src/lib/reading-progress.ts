'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { requiredKeys, type ReadingRule } from '@/lib/roles';
import { useMyRoles } from '@/lib/my-roles';

/**
 * HOW FAR A MEMBER HAS GOT WITH THE REQUIRED READING — their own, nobody
 * else's. Used for the line on the dashboard and the entry under "My sign-in".
 *
 * `rule` says which documents everybody is asked to confirm and which go with
 * each duty (it is handed down from the server; see
 * src/content/required-reading.ts). The count is of everybody's documents
 * plus the ones for the roles this member holds, so it changes the moment a
 * role is ticked on My profile or set by a controller. The database only ever
 * lets a member's browser read that member's own ticks and own roles.
 *
 * `null` means "not known" — still loading, not signed in, or the table is not
 * there — and whatever shows the number should then show nothing at all.
 */
export function useReadingProgress(rule: ReadingRule): { done: number; total: number } | null {
  const [ticked, setTicked] = useState<string[] | null>(null);
  const roles = useMyRoles();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    let live = true;

    async function load() {
      const { data: s } = await supabase!.auth.getSession();
      if (!live) return;
      if (!s.session) return setTicked(null);
      const { data, error } = await supabase!.from('reading_confirmations').select('doc_key');
      if (!live) return;
      setTicked(error ? null : (data ?? []).map((r) => r.doc_key as string));
    }

    load();
    // Ticking a document on the Documents page tells every other part of the
    // page that is showing the count.
    const again = () => load();
    window.addEventListener('dlgc:reading-changed', again);
    return () => {
      live = false;
      window.removeEventListener('dlgc:reading-changed', again);
    };
  }, []);

  if (ticked === null || roles === null) return null;
  const wanted = requiredKeys(rule, roles);
  if (wanted.length === 0) return null;
  const have = new Set(ticked);
  return { done: wanted.filter((k) => have.has(k)).length, total: wanted.length };
}

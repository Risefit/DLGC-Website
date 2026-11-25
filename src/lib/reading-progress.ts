'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * HOW FAR A MEMBER HAS GOT WITH THE REQUIRED READING — their own, nobody
 * else's. Used for the line on the dashboard and the entry under "My sign-in".
 *
 * `keys` are the documents every member is asked to confirm (they are handed
 * down from the server; see src/content/required-reading.ts). The answer is how
 * many of those the signed-in member has ticked. The database only ever lets a
 * member's browser read that member's own ticks.
 *
 * `null` means "not known" — still loading, not signed in, or the table is not
 * there — and whatever shows the number should then show nothing at all.
 */
export function useReadingProgress(keys: string[]): { done: number; total: number } | null {
  const [done, setDone] = useState<number | null>(null);
  const wanted = keys.join('|');

  useEffect(() => {
    const supabase = createClient();
    if (!supabase || !wanted) return;
    let live = true;
    const want = new Set(wanted.split('|'));

    async function load() {
      const { data: s } = await supabase!.auth.getSession();
      if (!live) return;
      if (!s.session) return setDone(null);
      const { data, error } = await supabase!.from('reading_confirmations').select('doc_key');
      if (!live) return;
      setDone(error ? null : (data ?? []).filter((r) => want.has(r.doc_key as string)).length);
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
  }, [wanted]);

  return done === null ? null : { done, total: keys.length };
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isController } from '@/lib/auth';

/**
 * Is the person looking at this page a controller?
 *
 * FOR DECIDING WHAT TO DRAW, NOTHING ELSE. A page built for every member can
 * use this to show a controller the buttons that are theirs. It reads the
 * sign-in the browser already holds, which the person could doctor — so it
 * must never be what stops anybody doing anything. Every controller action
 * checks for itself, on the server (src/lib/controller.ts).
 */
export function useIsController(): boolean {
  const [yes, setYes] = useState(false);
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    let live = true;
    supabase.auth.getSession().then(({ data }) => live && setYes(isController(data.session?.user)));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setYes(isController(session?.user)));
    return () => {
      live = false;
      listener.subscription.unsubscribe();
    };
  }, []);
  return yes;
}

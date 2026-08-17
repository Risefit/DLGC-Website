'use client';

import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfigured } from '@/lib/auth';

/**
 * Browser Supabase client. Returns null when Supabase isn't configured yet,
 * so the site still runs in preview mode before the project exists.
 */
export function createClient() {
  if (!supabaseConfigured) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

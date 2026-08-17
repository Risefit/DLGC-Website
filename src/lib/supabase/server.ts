import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabaseConfigured } from '@/lib/auth';

/**
 * Server Supabase client (App Router). Next 15+ makes cookies() async.
 * Returns null when Supabase isn't configured, so preview mode still works.
 */
export async function createClient() {
  if (!supabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — middleware refreshes the session.
          }
        },
      },
    }
  );
}

/** Current signed-in user, or null. Never throws. */
export async function getUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

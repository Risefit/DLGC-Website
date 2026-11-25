import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

/**
 * THE SERVER'S OWN SUPABASE CLIENT — it holds the secret key.
 *
 * The secret key can read and change every account, so:
 *   - this file must only ever be imported by code that runs on the server
 *     (a route under src/app/api, or a "use server" file). Never a component
 *     that runs in the browser;
 *   - every caller checks who is asking BEFORE using it. See requireController()
 *     in src/app/(portal)/admin/members/actions.ts.
 *
 * Needs SUPABASE_SERVICE_ROLE_KEY in Vercel (no NEXT_PUBLIC_ prefix).
 *
 * WHICH PROJECT IT TALKS TO. The same one members sign in to —
 * NEXT_PUBLIC_SUPABASE_URL — and only if that is missing, SUPABASE_URL. The
 * two were meant to be identical, but they are typed in separately, and on the
 * day the portal was locked the server's own copy turned out not to lead to
 * the project at all: "Ask to join" failed and nothing reached Supabase. The
 * secret key has to belong to the project members sign in to, so that is the
 * address it is used with. Stray spaces or a line break pasted in with either
 * value are trimmed off, because a key with a line break in it cannot be sent.
 */
export function adminClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') throw new Error('adminClient() must never run in the browser');
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Every account in the project, a page at a time. Throws if Supabase refuses. */
export async function everyUser(admin: SupabaseClient): Promise<User[]> {
  const all: User[] = [];
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    all.push(...data.users);
    if (data.users.length < 200) break;
  }
  return all;
}

/** True while an account is shut out ("Remove access" on the Members page). */
export const banned = (u: User) => {
  const until = (u as User & { banned_until?: string | null }).banned_until;
  return Boolean(until && new Date(until).getTime() > Date.now());
};

/**
 * Write down why Supabase refused, where the website editor can find it
 * (Vercel → the project → Logs). Only the reason is recorded — never a name,
 * an address, a password or a key.
 */
export function logSupabaseProblem(where: string, error: { message?: string; code?: string; status?: number } | null) {
  if (!error) return;
  const what = [error.status ? `HTTP ${error.status}` : '', error.code ?? '', error.message || 'no reason given'].filter(Boolean).join(' · ');
  console.error(`[portal] ${where}: ${what}`);
}

/**
 * A temporary password for the controller to pass on: three groups of four,
 * from letters and digits that cannot be mistaken for one another when read
 * out over the telephone (no 0/O, 1/l/I). About 59 bits — far beyond guessing,
 * and it only has to last until the member's first sign-in.
 */
export function temporaryPassword(): string {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const out: string[] = [];
  // Rejection sampling, so every character is equally likely.
  for (let i = 0; out.length < 12; i++) {
    if (i >= bytes.length) {
      crypto.getRandomValues(bytes);
      i = 0;
    }
    if (bytes[i] < 248) out.push(alphabet[bytes[i] % alphabet.length]);
  }
  return `${out.slice(0, 4).join('')}-${out.slice(4, 8).join('')}-${out.slice(8, 12).join('')}`;
}

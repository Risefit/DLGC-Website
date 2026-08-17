/**
 * Auth configuration.
 *
 * IMPORTANT: this portal's authentication is entirely separate from AwareIM
 * (Members' Admin). They share no session, no user table and no database.
 * That separation is deliberate and must be preserved — AwareIM holds
 * personnel and financial data and is administered independently.
 *
 * Sign-in method: email + password, via Supabase Auth.
 *
 * PREVIEW MODE
 * While NEXT_PUBLIC_PREVIEW_OPEN is "true", or while Supabase env vars are
 * absent, the login gate is bypassed so the committee can click through the
 * site without accounts existing. Set NEXT_PUBLIC_PREVIEW_OPEN=false (or remove
 * it) before this goes anywhere near real member data.
 */

export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const previewOpen =
  process.env.NEXT_PUBLIC_PREVIEW_OPEN === 'true' || !supabaseConfigured;

export const authMode: 'supabase' | 'preview' = previewOpen ? 'preview' : 'supabase';

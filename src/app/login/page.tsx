'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { previewOpen } from '@/lib/auth';
import { club } from '@/content/site';

/**
 * Email + password sign-in via Supabase Auth.
 * Entirely separate from Members' Admin (AwareIM) — different system,
 * different database, different credentials. Say so on the page so members
 * aren't confused about which password they need.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (previewOpen) {
      router.push('/dashboard');
      return;
    }

    setBusy(true);
    const supabase = createClient();
    if (!supabase) {
      setError('Sign-in is not configured yet. Contact the website editor.');
      setBusy(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'That email address and password did not match. Check for typos, or use the reset link below.'
          : authError.message
      );
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-navy to-sky">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="mb-6 text-center text-white">
          <span aria-hidden="true" className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-white/15">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M2 14l20-7-9 9-3-2-2 4-1-3-5-1z" fill="currentColor" />
            </svg>
          </span>
          <h1 className="text-2xl text-white">DLGC Members&rsquo; Portal</h1>
          <p className="mt-1 text-sm text-white/80">
            Gliding at Camphill since {club.founded}
          </p>
        </div>

        <div className="card p-6">
          <h2 className="text-xl">Sign in</h2>
          <p className="mt-1 text-sm text-slate2">
            Use your portal email and password. This is <strong>not</strong> your Members&rsquo;
            Admin login — that system has its own separate sign-in.
          </p>

          {previewOpen && (
            <div className="mt-4 rounded-lg border-l-4 border-warn bg-warnTint p-4 text-sm">
              <p className="font-semibold text-warn">Preview mode</p>
              <p className="mt-1 text-slate2">
                Accounts aren&rsquo;t set up yet. Press Sign in to look around.
              </p>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block font-medium text-navy">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required={!previewOpen}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-skyLine px-4 py-3.5 focus:border-sky focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block font-medium text-navy">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required={!previewOpen}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-skyLine px-4 py-3.5 focus:border-sky focus:outline-none"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg border-l-4 border-bad bg-badTint p-3 text-sm text-bad">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="tap w-full justify-center rounded-lg bg-sky px-5 py-4 text-lg font-semibold
                         text-white hover:bg-skyDark disabled:opacity-60 transition-colors"
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 border-t border-skyLine pt-4 text-sm text-slate2">
            Forgotten your password, or need an account? Contact the website editor or the club
            office on{' '}
            <a href="tel:01298871270" className="link">01298 871270</a>.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-white/80">
          <a href={club.publicSite} className="underline decoration-white/40 underline-offset-2 hover:decoration-white">
            Club public website
          </a>
          {' · '}
          <Link href="/dashboard" className="underline decoration-white/40 underline-offset-2 hover:decoration-white">
            Portal home
          </Link>
        </p>
      </main>
    </div>
  );
}

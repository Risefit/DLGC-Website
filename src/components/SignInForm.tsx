'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isMember, mustChangePassword, PASSWORD_PAGE } from '@/lib/auth';

/**
 * The sign-in form. Signs in with Supabase, then goes on to the dashboard —
 * or to the "choose your own password" page if the member is still on the
 * temporary one their controller gave them.
 *
 * It moves on with a full page load, not a soft one, so the lock
 * (middleware.ts) sees the new session straight away.
 *
 * THIS RUNS IN A VISITOR'S BROWSER. It must not import anything from
 * src/content — a content file brought in here is sent, whole, to anybody who
 * opens the sign-in page. The one fact it needs (the office number) is handed
 * to it by the page.
 */
export default function SignInForm({ officeTel }: { officeTel: string }) {
  const why = useSearchParams().get('why');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    why === 'not-a-member'
      ? 'That sign-in does not have access to the portal. If you think it should, ask the club office.'
      : null,
  );
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const supabase = createClient();
    if (!supabase) {
      setError('Sign-in is not set up on this copy of the site yet. Contact the website editor.');
      setBusy(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError || !data.user) {
      setBusy(false);
      const said = authError?.message ?? '';
      setError(
        said === 'Invalid login credentials'
          ? 'That email address and password did not match. Check for typos. If you have forgotten your password, the club can give you a new temporary one.'
          : /banned/i.test(said)
            ? 'That sign-in no longer has access to the portal. If you think it should, ask the club office.'
            : said || 'That did not work. Try again in a moment.',
      );
      return;
    }

    if (!isMember(data.user)) {
      await supabase.auth.signOut();
      setBusy(false);
      setError('That sign-in does not have access to the portal. If you think it should, ask the club office.');
      return;
    }

    window.location.assign(mustChangePassword(data.user) ? PASSWORD_PAGE : '/dashboard');
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl">Sign in</h2>
      <p className="mt-1 text-sm text-inkMuted">
        Use your portal email and password. This is <strong>not</strong> your Free Flight login —
        that system has its own separate sign-in.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block font-medium text-navy">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border-2 border-skyLine px-4 py-3.5 focus:border-sky focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-slate2">
            First time? Use the temporary password you were given. You will be asked to choose
            your own straight away.
          </p>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border-l-4 border-bad bg-badTint p-3 text-sm text-bad">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="tap w-full justify-center rounded-full bg-navy px-5 py-4 text-lg font-semibold
                     text-white transition-colors hover:bg-skyDark disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 border-t border-skyLine pt-4 text-sm text-inkMuted">
        <strong className="text-navy">Forgotten your password?</strong> The club can give you a
        new temporary one: ring the office on{' '}
        <a href={`tel:${officeTel.replace(/\s/g, '')}`} className="link">
          {officeTel}
        </a>
        .
      </p>
      <p className="mt-2 text-sm text-inkMuted">
        <strong className="text-navy">No sign-in yet?</strong>{' '}
        <Link href="/join" className="link">
          Ask to join the portal
        </Link>
        .
      </p>
    </div>
  );
}

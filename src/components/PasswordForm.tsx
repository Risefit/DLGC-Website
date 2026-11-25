'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MIN_PASSWORD } from '@/lib/auth';

/**
 * The form on /account/password. The new password goes to /api/account/password,
 * which changes it for whoever is signed in; then the member is signed in
 * afresh with it, so this browser carries on without interruption.
 */
export default function PasswordForm({ email, first }: { email: string; first: boolean }) {
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD) {
      setError(`Please use at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== again) {
      setError('The two boxes do not match. Type the new password again in both.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setError(data.message ?? 'That could not be saved. Try again in a moment.');
        setBusy(false);
        return;
      }
      // Sign in again with the new password, so this browser holds a session
      // that knows the temporary one has gone.
      const supabase = createClient();
      if (supabase && email) await supabase.auth.signInWithPassword({ email, password });
      if (first) {
        window.location.assign('/dashboard');
        return;
      }
      setDone(true);
      setPassword('');
      setAgain('');
      setBusy(false);
    } catch {
      setError('That could not be saved. Check your connection and try again.');
      setBusy(false);
    }
  }

  const box =
    'w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3.5 focus:border-sky focus:outline-none';

  return (
    <div className="card max-w-xl p-6">
      {email && (
        <p className="mb-4 text-sm text-inkMuted">
          Signed in as <strong className="break-all text-navy">{email}</strong>
        </p>
      )}

      {done && (
        <p role="status" className="mb-4 rounded-lg border-l-4 border-good bg-goodTint p-3 text-sm text-ink">
          Your password has been changed. Use the new one from now on.
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="mb-1.5 block font-medium text-navy">
            New password
          </label>
          <input
            id="new-password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="new-password-hint"
            className={box}
          />
          <p id="new-password-hint" className="mt-1.5 text-sm text-slate2">
            At least {MIN_PASSWORD} characters. Three or four unrelated words run together is
            both strong and easy to remember.
          </p>
        </div>

        <div>
          <label htmlFor="new-password-again" className="mb-1.5 block font-medium text-navy">
            The same again
          </label>
          <input
            id="new-password-again"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={again}
            onChange={(e) => setAgain(e.target.value)}
            className={box}
          />
        </div>

        <label className="tap cursor-pointer gap-3 text-sm text-navy">
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
            className="h-5 w-5 rounded border-2 border-skyLine text-sky focus:ring-sky"
          />
          Show what I am typing
        </label>

        {error && (
          <p role="alert" className="rounded-lg border-l-4 border-bad bg-badTint p-3 text-sm text-bad">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="pill-solid disabled:opacity-60">
          {busy ? 'Saving…' : first ? 'Save and open the portal' : 'Change my password'}
        </button>
      </form>
    </div>
  );
}

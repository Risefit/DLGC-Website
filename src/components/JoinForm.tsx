'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * The "ask to join" form. It sends a name, an email address and an optional
 * line to /api/join, where the request is stored for a controller to look at.
 *
 * The answer is the same whoever asks — it never says whether an address
 * already has a sign-in, so the form cannot be used to find out who is a
 * member.
 */
export default function JoinForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [website, setWebsite] = useState(''); // a trap for robots; people never see it
  const [state, setState] = useState<'idle' | 'busy' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setState('busy');
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, note, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setError(data.message ?? 'That could not be sent. Try again in a moment.');
        setState('idle');
        return;
      }
      setState('sent');
    } catch {
      setError('That could not be sent. Check your connection and try again.');
      setState('idle');
    }
  }

  if (state === 'sent') {
    return (
      <div className="card p-6" role="status">
        <h2 className="text-xl">Thank you — that has gone to the club</h2>
        <p className="mt-2 text-inkMuted">
          Somebody will check that you are a member and set up your sign-in. They will then get
          in touch with a temporary password, which you change the first time you use it.
        </p>
        <p className="mt-3 text-inkMuted">There is nothing more to do until you hear from them.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl">Ask to join</h2>
      <p className="mt-1 text-sm text-inkMuted">
        For club members who have not been given a sign-in yet. Tell us who you are and the club
        will set one up.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="join-name" className="mb-1.5 block font-medium text-navy">
            Your name
          </label>
          <input
            id="join-name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border-2 border-skyLine px-4 py-3.5 focus:border-sky focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="join-email" className="mb-1.5 block font-medium text-navy">
            Email address
          </label>
          <input
            id="join-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border-2 border-skyLine px-4 py-3.5 focus:border-sky focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-slate2">This becomes what you sign in with.</p>
        </div>

        <div>
          <label htmlFor="join-note" className="mb-1.5 block font-medium text-navy">
            Anything that helps us know it is you <span className="font-normal text-slate2">(optional)</span>
          </label>
          <textarea
            id="join-note"
            rows={3}
            maxLength={1000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How long you have been a member, or a telephone number to ring"
            className="w-full rounded-lg border-2 border-skyLine px-4 py-3 placeholder:text-slate2/70 focus:border-sky focus:outline-none"
          />
        </div>

        {/* Hidden from people and from screen readers. Robots fill it in. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="join-website">Website</label>
          <input
            id="join-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg border-l-4 border-bad bg-badTint p-3 text-sm text-bad">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={state === 'busy'}
          className="tap w-full justify-center rounded-full bg-navy px-5 py-4 text-lg font-semibold
                     text-white transition-colors hover:bg-skyDark disabled:opacity-60"
        >
          {state === 'busy' ? 'Sending…' : 'Send my request'}
        </button>
      </form>

      <p className="mt-5 border-t border-skyLine pt-4 text-sm text-inkMuted">
        Already have a sign-in?{' '}
        <Link href="/login" className="link">
          Sign in
        </Link>
        .
      </p>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  addMember,
  approveRequest,
  declineRequest,
  newTemporaryPassword,
  setAccess,
  setController,
  type ClubListData,
  type JoinRequest,
  type Member,
  type Outcome,
} from '@/app/(portal)/admin/members/actions';
import { Badge } from '@/components/ui';
import ClubList from '@/components/ClubList';

/**
 * The Members page as a controller uses it. Four parts, in the order they are
 * needed: people waiting to join, a form to add somebody, the club's list of
 * people still to invite (src/components/ClubList.tsx), and everyone who has a
 * sign-in.
 *
 * A TEMPORARY PASSWORD IS SHOWN ONCE, in the panel at the top, straight after
 * it is made. It is not stored anywhere it could be read again — if it is
 * lost, make another. The controller passes it on (in person, by telephone or
 * by text) and the member has to choose their own the first time they sign in.
 */

const day = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'never';

export default function MemberAdmin({
  members,
  requests,
  requestsReady,
  list,
}: {
  members: Member[];
  requests: JoinRequest[];
  requestsReady: boolean;
  list: ClubListData;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<Outcome | null>(null);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busyKey, setBusyKey] = useState<string | null>(null);

  function run(key: string, job: () => Promise<Outcome>, after?: (o: Outcome) => void) {
    setBusyKey(key);
    setCopied(false);
    startTransition(async () => {
      let outcome: Outcome;
      try {
        outcome = await job();
      } catch {
        outcome = { ok: false, message: 'That did not go through. Check your connection and try again.' };
      }
      setResult(outcome);
      setBusyKey(null);
      after?.(outcome);
      router.refresh();
      // Bring the result (and any temporary password) into view.
      document.getElementById('member-result')?.scrollIntoView({ block: 'center' });
    });
  }

  const busy = (key: string) => pending && busyKey === key;
  const small =
    'tap rounded-lg border-2 border-skyLine bg-white px-3.5 py-2 text-sm font-semibold text-navy transition-colors hover:border-sky disabled:opacity-50';
  const box = 'w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3 focus:border-sky focus:outline-none';

  const withAccess = members.filter((m) => m.access);
  const without = members.filter((m) => !m.access);

  return (
    <div className="space-y-10">
      {/* ── What just happened ─────────────────────────────────────────── */}
      <div id="member-result" aria-live="polite" className="scroll-mt-6">
        {result && !result.ok && (
          <p role="alert" className="rounded-card border-l-4 border-bad bg-badTint px-5 py-4 text-bad">
            {result.message}
          </p>
        )}
        {result?.ok && !result.password && (
          <p className="rounded-card border-l-4 border-good bg-goodTint px-5 py-4 text-ink">{result.message}</p>
        )}
        {result?.ok && result.password && (
          <div className="card-panel border-l-4 border-good p-5 lg:p-6">
            <p className="font-semibold text-navy">{result.message}</p>
            <p className="mt-3 text-sm text-inkMuted">Temporary password for {result.forName}:</p>
            <p className="mt-1 flex flex-wrap items-center gap-3">
              <code className="rounded-control bg-sunken px-3 py-2 font-mono text-xl tracking-wider text-navy">
                {result.password}
              </code>
              <button
                type="button"
                className={small}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(result.password!);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </p>
            <p className="mt-3 max-w-prose2 text-sm text-ink">
              <strong>This is shown once.</strong> Pass it to {result.forName} yourself — in person, by
              telephone or by text. They sign in with their email address and this password, and
              are asked to choose their own straight away. If it gets lost, use &ldquo;New
              temporary password&rdquo; beside their name.
            </p>
            <button type="button" className="link tap mt-2 text-sm" onClick={() => setResult(null)}>
              I have passed it on — hide it
            </button>
          </div>
        )}
      </div>

      {/* ── Waiting to join ────────────────────────────────────────────── */}
      <section aria-labelledby="waiting-h">
        <h2 id="waiting-h" className="display text-2xl lg:text-3xl">
          Waiting to join{' '}
          <span className="font-sans text-base font-normal tracking-normal text-slate2">{requests.length}</span>
        </h2>
        <p className="mb-3 mt-1 max-w-prose2 text-inkMuted">
          People who filled in &ldquo;Ask to join&rdquo; on the front page. Check each one is a club
          member before you approve — approving creates their sign-in.
        </p>
        {!requestsReady ? (
          <p className="card border-l-4 border-warn px-5 py-4 text-sm text-ink">
            Requests cannot be read yet: the <code>portal_requests</code> table has not been
            created in Supabase. Run <code>supabase/migrations/005_portal_requests.sql</code>.
            Adding members below works without it.
          </p>
        ) : requests.length === 0 ? (
          <p className="card px-5 py-4 text-inkMuted">Nobody is waiting.</p>
        ) : (
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {requests.map((r) => (
              <li key={r.id} className="grid gap-x-6 gap-y-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="min-w-0">
                  <p className="font-semibold text-navy">{r.name}</p>
                  <p className="break-all text-sm text-ink">{r.email}</p>
                  {r.note && <p className="mt-1 max-w-prose2 text-sm text-inkMuted">&ldquo;{r.note}&rdquo;</p>}
                  <p className="mt-1 text-xs text-slate2">Asked {day(r.asked)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="pill-solid !min-h-[44px] !py-2 text-sm disabled:opacity-50"
                    disabled={pending}
                    onClick={() => run(`a${r.id}`, () => approveRequest(r.id))}
                  >
                    {busy(`a${r.id}`) ? 'Approving…' : 'Approve'}
                    <span className="sr-only"> {r.name}</span>
                  </button>
                  <button
                    type="button"
                    className={small}
                    disabled={pending}
                    onClick={() => run(`d${r.id}`, () => declineRequest(r.id))}
                  >
                    {busy(`d${r.id}`) ? 'Declining…' : 'Decline'}
                    <span className="sr-only"> {r.name}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Add a member ───────────────────────────────────────────────── */}
      <section aria-labelledby="add-h">
        <h2 id="add-h" className="display text-2xl lg:text-3xl">
          Add a member
        </h2>
        <p className="mb-3 mt-1 max-w-prose2 text-inkMuted">
          For somebody the club is inviting. Their sign-in is created now and you are shown a
          temporary password to pass on.
        </p>
        <form
          className="card grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            run(
              'add',
              () => addMember(name, email),
              (o) => {
                if (o.ok) {
                  setName('');
                  setEmail('');
                }
              },
            );
          }}
        >
          <div>
            <label htmlFor="add-name" className="mb-1.5 block text-sm font-medium text-navy">
              Name
            </label>
            <input
              id="add-name"
              type="text"
              required
              minLength={2}
              maxLength={120}
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={box}
            />
          </div>
          <div>
            <label htmlFor="add-email" className="mb-1.5 block text-sm font-medium text-navy">
              Email address
            </label>
            <input
              id="add-email"
              type="email"
              required
              maxLength={254}
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={box}
            />
          </div>
          <button type="submit" className="pill-solid disabled:opacity-50" disabled={pending}>
            {busy('add') ? 'Adding…' : 'Add member'}
          </button>
        </form>
      </section>

      {/* ── The club's list: people still to invite ────────────────────── */}
      <ClubList list={list} run={run} pending={pending} busy={busy} />

      {/* ── Everyone with a sign-in ────────────────────────────────────── */}
      <section aria-labelledby="members-h">
        <h2 id="members-h" className="display text-2xl lg:text-3xl">
          Members{' '}
          <span className="font-sans text-base font-normal tracking-normal text-slate2">{withAccess.length}</span>
        </h2>
        <p className="mb-3 mt-1 max-w-prose2 text-inkMuted">Everyone who can sign in to the portal today.</p>
        <MemberList
          members={withAccess}
          render={(m) => (
            <>
              <button
                type="button"
                className={small}
                disabled={pending}
                onClick={() => run(`p${m.id}`, () => newTemporaryPassword(m.id))}
              >
                {busy(`p${m.id}`) ? 'Making…' : 'New temporary password'}
                <span className="sr-only"> for {m.name || m.email}</span>
              </button>
              {!m.you && (
                <button
                  type="button"
                  className={small}
                  disabled={pending}
                  onClick={() => run(`c${m.id}`, () => setController(m.id, !m.controller))}
                >
                  {m.controller ? 'Stop being a controller' : 'Make a controller'}
                  <span className="sr-only">: {m.name || m.email}</span>
                </button>
              )}
              {!m.you && (
                <button
                  type="button"
                  className={`${small} !text-bad hover:!border-bad`}
                  disabled={pending}
                  onClick={() => {
                    if (window.confirm(`Remove ${m.name || m.email}'s access to the portal?`)) {
                      run(`x${m.id}`, () => setAccess(m.id, false));
                    }
                  }}
                >
                  Remove access
                  <span className="sr-only"> from {m.name || m.email}</span>
                </button>
              )}
            </>
          )}
        />
      </section>

      {without.length > 0 && (
        <section aria-labelledby="removed-h">
          <h2 id="removed-h" className="display text-2xl lg:text-3xl">
            No access{' '}
            <span className="font-sans text-base font-normal tracking-normal text-slate2">{without.length}</span>
          </h2>
          <p className="mb-3 mt-1 max-w-prose2 text-inkMuted">
            Sign-ins that exist but cannot get in: access was removed, or the account was made
            outside this page.
          </p>
          <MemberList
            members={without}
            render={(m) => (
              <button
                type="button"
                className={small}
                disabled={pending}
                onClick={() => run(`r${m.id}`, () => setAccess(m.id, true))}
              >
                Restore access
                <span className="sr-only"> to {m.name || m.email}</span>
              </button>
            )}
          />
        </section>
      )}
    </div>
  );
}

function MemberList({ members, render }: { members: Member[]; render: (m: Member) => React.ReactNode }) {
  if (members.length === 0) return <p className="card px-5 py-4 text-inkMuted">Nobody yet.</p>;
  return (
    <ul className="card divide-y divide-skyLine overflow-hidden">
      {members.map((m) => (
        <li key={m.id} className="grid gap-x-6 gap-y-3 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <span className="font-semibold text-navy">{m.name || 'No name given'}</span>
              {m.you && <Badge tone="neutral">You</Badge>}
              {m.controller && <Badge tone="live">Controller</Badge>}
              {m.temporary && m.access && <Badge tone="warn">Temporary password</Badge>}
            </p>
            <p className="break-all text-sm text-ink">{m.email}</p>
            <p className="mt-1 text-xs text-slate2">
              Added {day(m.added)} · Last signed in {day(m.lastSignIn)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">{render(m)}</div>
        </li>
      ))}
    </ul>
  );
}

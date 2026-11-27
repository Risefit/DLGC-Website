'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  addMember,
  approveRequest,
  declineRequest,
  emergencyDetails,
  newTemporaryPassword,
  setAccess,
  setController,
  setMemberRole,
  type ClubListData,
  type DetailsOutcome,
  type JoinRequest,
  type Member,
  type Outcome,
} from '@/app/(portal)/admin/members/actions';
import { Badge } from '@/components/ui';
import ClubList from '@/components/ClubList';
import { PILOT_TONE, ROLES, TEAMS, withRole, type RoleId } from '@/lib/roles';
import { ROLES_CHANGED } from '@/lib/my-roles';

/**
 * The Members page as a controller uses it. Four parts, in the order they are
 * needed: people waiting to join, a form to add somebody, the club's list of
 * people still to invite (src/components/ClubList.tsx), and everyone who has a
 * sign-in.
 *
 * ROLES. Under each member's name are the club's roles, in their groups
 * (src/lib/roles.ts). The first group, Pilot, is one choice: student pilot or
 * one flying card, each card in its own colour. Giving one takes the other off. A controller clicks one to give it and clicks again to take it off;
 * it is saved at once and that member's required reading follows. A role that
 * is held is filled in AND carries a tick, so it is not told by colour alone.
 * Members can tick their own on My profile, and the two are the same list.
 *
 * EMERGENCY DETAILS are not on this list. "Emergency details" beside a member
 * fetches that one member's, shows them here until hidden, and the portal
 * notes that it was opened. The telephone numbers are links, so they can be
 * rung straight from a phone on the airfield.
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
  rolesReady = true,
}: {
  members: Member[];
  requests: JoinRequest[];
  requestsReady: boolean;
  list: ClubListData;
  /** false until migration 011 has been run */
  rolesReady?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<Outcome | null>(null);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busyKey, setBusyKey] = useState<string | null>(null);
  // Roles as changed on this page since it loaded, and anything that went wrong.
  const [roleNow, setRoleNow] = useState<Record<string, RoleId[]>>({});
  const [roleSaid, setRoleSaid] = useState<Record<string, string>>({});
  // Emergency details a controller has opened, member by member.
  const [opened, setOpened] = useState<Record<string, Extract<DetailsOutcome, { ok: true }>>>({});
  const [openSaid, setOpenSaid] = useState<Record<string, string>>({});
  const [, startQuiet] = useTransition();
  const [quietKey, setQuietKey] = useState<string | null>(null);

  const rolesOf = (m: Member) => roleNow[m.id] ?? m.roles;

  /** One click on a role: shown at once, saved, and put right if the save fails. */
  function toggleRole(m: Member, role: RoleId) {
    const held = rolesOf(m);
    const on = !held.includes(role);
    // withRole also takes off any other flying card when one is given.
    setRoleNow((r) => ({ ...r, [m.id]: withRole(held, role, on) }));
    setRoleSaid((r) => ({ ...r, [m.id]: '' }));
    startQuiet(async () => {
      let outcome;
      try {
        outcome = await setMemberRole(m.id, role, on);
      } catch {
        outcome = { ok: false as const, message: 'That did not go through. Check your connection and try again.' };
      }
      if (outcome.ok) {
        setRoleNow((r) => ({ ...r, [m.id]: outcome.roles }));
        // A controller changing their own role: their own count of required
        // reading, in the menu above, follows at once.
        if (m.you) window.dispatchEvent(new Event(ROLES_CHANGED));
      } else {
        setRoleNow((r) => ({ ...r, [m.id]: held }));
        setRoleSaid((r) => ({ ...r, [m.id]: outcome.message }));
      }
    });
  }

  function openDetails(m: Member) {
    setQuietKey(`e${m.id}`);
    setOpenSaid((r) => ({ ...r, [m.id]: '' }));
    startQuiet(async () => {
      let outcome: DetailsOutcome;
      try {
        outcome = await emergencyDetails(m.id);
      } catch {
        outcome = { ok: false, message: 'That did not go through. Check your connection and try again.' };
      }
      setQuietKey(null);
      if (outcome.ok) setOpened((o) => ({ ...o, [m.id]: outcome }));
      else setOpenSaid((r) => ({ ...r, [m.id]: outcome.message }));
    });
  }

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
  // The buttons beside each member: smaller, so nine roles and four buttons fit
  // a row. Still 44px tall on a touch screen (rule 7) — see .tap-sm.
  const tiny =
    'tap-sm rounded-lg border border-skyLine bg-white px-2.5 text-[0.8rem] font-semibold text-navy transition-colors hover:border-sky disabled:opacity-50';
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
        <p className="mb-3 mt-1 max-w-prose2 text-inkMuted">
          Everyone who can sign in to the portal today. Click a role to give it to a member, and again to take it
          off: it is saved at once and any reading that goes with it is added to their required reading. Under
          Pilot a member is a student or holds one flying card, so choosing one replaces another. Members can
          set their own on My profile. A role or card shown here is a note, not the club’s record of who is
          cleared for what.
        </p>
        {!rolesReady && (
          <p className="card mb-3 border-l-4 border-warn px-5 py-4 text-sm text-ink">
            Roles cannot be saved yet: the <code>portal_member_roles</code> table has not been created in Supabase.
            Run <code>supabase/migrations/011_roles_and_profiles.sql</code>.
          </p>
        )}
        <MemberList
          members={withAccess}
          render={(m) => (
            <>
              <button
                type="button"
                className={tiny}
                disabled={pending}
                onClick={() => run(`p${m.id}`, () => newTemporaryPassword(m.id))}
              >
                {busy(`p${m.id}`) ? 'Making…' : 'Temp password'}
                <span className="sr-only">: a new temporary password for {m.name || m.email}</span>
              </button>
              {!m.you && (
                <button
                  type="button"
                  className={tiny}
                  disabled={pending}
                  onClick={() => run(`c${m.id}`, () => setController(m.id, !m.controller))}
                >
                  {m.controller ? 'Stop controller' : 'Make controller'}
                  <span className="sr-only">: {m.name || m.email}</span>
                </button>
              )}
              {!m.you && (
                <button
                  type="button"
                  className={`${tiny} !text-bad hover:!border-bad`}
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
              {m.details && !opened[m.id] && (
                <button type="button" className={tiny} disabled={quietKey === `e${m.id}`} onClick={() => openDetails(m)}>
                  {quietKey === `e${m.id}` ? 'Opening…' : 'Emergency details'}
                  <span className="sr-only"> of {m.name || m.email}</span>
                </button>
              )}
            </>
          )}
          below={(m) => {
            const held = rolesOf(m);
            const shown = opened[m.id];
            return (
              <>
                <div role="group" aria-label={`Roles of ${m.name || m.email}`} className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
                  {TEAMS.map((team) => (
                    <div key={team} className="flex flex-wrap items-center gap-1.5">
                      {/* On a phone the chips wrap, and "Trainee" alone on a line could be
                          either team's — so there each chip carries its full name and the
                          team label is dropped. */}
                      <span aria-hidden="true" className="hidden text-xs font-semibold uppercase tracking-wide text-slate2 sm:inline">
                        {team}
                      </span>
                      {ROLES.filter((r) => r.team === team).map((r) => {
                        const on = held.includes(r.id);
                        // A flying card is shown in its own colour — and always by name.
                        const tone = PILOT_TONE[r.id];
                        return (
                          <button
                            key={r.id}
                            type="button"
                            aria-pressed={on}
                            disabled={!rolesReady}
                            onClick={() => toggleRole(m, r.id)}
                            className={`tap-sm min-w-[44px] justify-center gap-1 rounded-full border px-2.5 text-[0.8rem] font-semibold transition-colors disabled:opacity-50 ${
                              on
                                ? (tone?.on ?? 'border-navy bg-navy text-white hover:bg-skyDark')
                                : 'border-skyLine bg-white text-navy hover:border-sky'
                            }`}
                          >
                            {!on && tone && <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone.dot}`} />}
                            {on && (
                              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M3 8.5l3.2 3.2L13 4.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                            <span aria-hidden="true" className="hidden sm:inline">
                              {r.short}
                            </span>
                            <span aria-hidden="true" className="sm:hidden">
                              {r.label}
                            </span>
                            <span className="sr-only">
                              {r.label}: {m.name || m.email}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                {roleSaid[m.id] && (
                  <p role="alert" className="mt-2 max-w-prose2 rounded-card border-l-4 border-bad bg-badTint px-4 py-2.5 text-sm text-bad">
                    {roleSaid[m.id]}
                  </p>
                )}
                {openSaid[m.id] && (
                  <p role="alert" className="mt-2 max-w-prose2 rounded-card border-l-4 border-bad bg-badTint px-4 py-2.5 text-sm text-bad">
                    {openSaid[m.id]}
                  </p>
                )}
                {shown && (
                  <EmergencyCard
                    shown={shown}
                    hide={() =>
                      setOpened((o) => {
                        const rest = { ...o };
                        delete rest[m.id];
                        return rest;
                      })
                    }
                    tiny={tiny}
                  />
                )}
              </>
            );
          }}
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

function MemberList({
  members,
  render,
  below,
}: {
  members: Member[];
  /** the buttons beside the name */
  render: (m: Member) => React.ReactNode;
  /** anything that runs the full width of the block, under the name: the roles */
  below?: (m: Member) => React.ReactNode;
}) {
  if (members.length === 0) return <p className="card px-5 py-4 text-inkMuted">Nobody yet.</p>;
  return (
    <ul className="card divide-y divide-skyLine overflow-hidden">
      {members.map((m) => (
        <li key={m.id} className="px-5 py-4">
          <div className="grid gap-x-6 gap-y-2.5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
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
                {below && !m.details && ' · No emergency details given yet'}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">{render(m)}</div>
          </div>
          {below?.(m)}
        </li>
      ))}
    </ul>
  );
}

/** One member's emergency details, as a controller sees them once opened. */
function EmergencyCard({
  shown,
  hide,
  tiny,
}: {
  shown: Extract<DetailsOutcome, { ok: true }>;
  hide: () => void;
  tiny: string;
}) {
  const d = shown.details;
  const ring = (n: string) => (
    <a href={`tel:${n.replace(/[^0-9+]/g, '')}`} className="link whitespace-nowrap font-semibold">
      {n}
    </a>
  );
  const row = (title: string, body: React.ReactNode) => (
    <div className="grid gap-x-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
      <dt className="text-sm font-semibold text-navy">{title}</dt>
      <dd className="min-w-0 text-ink">{body}</dd>
    </div>
  );
  return (
    <div className="mt-3 max-w-3xl rounded-card border-l-4 border-bad bg-white px-4 py-3 shadow-card ring-1 ring-skyLine" role="region" aria-label={`Emergency details of ${shown.name}`}>
      <p className="font-semibold text-navy">Emergency details: {shown.name}</p>
      {!d ? (
        <p className="mt-1 text-sm text-inkMuted">They have not filled any in.</p>
      ) : (
        <dl className="mt-2 space-y-2">
          {d.contactName &&
            row(
              'Ring first',
              <>
                {d.contactName}
                {d.contactRelationship && ` (${d.contactRelationship})`} · {ring(d.contactPhone)}
                {d.contactPhone2 && <> · {ring(d.contactPhone2)}</>}
              </>,
            )}
          {d.kinName &&
            row(
              'Next of kin',
              <>
                {d.kinName}
                {d.kinRelationship && ` (${d.kinRelationship})`}
                {d.kinPhone && <> · {ring(d.kinPhone)}</>}
              </>,
            )}
          {d.mobile && row('Their own mobile', ring(d.mobile))}
          {d.bloodType && row('Blood type', d.bloodType.replace('+', ' positive').replace('-', ' negative'))}
          {d.medical && row('For a first-aider', <span className="whitespace-pre-line">{d.medical}</span>)}
        </dl>
      )}
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate2">
        <button type="button" className={tiny} onClick={hide}>
          Hide
          <span className="sr-only"> the emergency details of {shown.name}</span>
        </button>
        {d && <span>As the member gave them. The portal has noted that you opened this.</span>}
      </p>
    </div>
  );
}

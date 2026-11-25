'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import {
  addToList,
  inviteBatch,
  inviteFromList,
  sendSample,
  setListEmail,
  setListStatus,
  type BatchOutcome,
  type ClubListData,
  type ListPerson,
  type Outcome,
} from '@/app/(portal)/admin/members/actions';
import { TEMP_PASSWORD_DAYS } from '@/lib/auth';

/**
 * THE CLUB'S LIST, on the Members page — people the club means to invite.
 *
 * Nobody on it has a sign-in, and nothing is sent to anybody until a
 * controller presses a button here. Two ways to invite:
 *
 *   one person    always available. With email set up the invitation is
 *                 emailed; without it the temporary password is shown once,
 *                 exactly as for "Add a member".
 *   everybody     only when the club's email sending is set up. It asks
 *                 "are you sure" first, then works through the list a few at a
 *                 time, showing how far it has got. It can be stopped, and
 *                 pressing it again carries on with whoever is left.
 *
 * The names themselves come from Supabase (table portal_roll). They are never
 * written into this repository.
 */

type Filter = 'ready' | 'address' | 'hold' | 'removed';
type Bulk =
  | { state: 'idle' }
  | { state: 'asking' }
  | { state: 'running'; sent: number; left: number }
  | { state: 'done'; sent: number; left: number; note?: string; bad?: boolean };

const kind = (p: ListPerson): Filter =>
  p.status === 'removed' ? 'removed' : p.status === 'hold' ? 'hold' : p.blocker ? 'address' : 'ready';

const FIRST = 25;

export default function ClubList({
  list,
  run,
  pending,
  busy,
}: {
  list: ClubListData;
  run: (key: string, job: () => Promise<Outcome>, after?: (o: Outcome) => void) => void;
  pending: boolean;
  busy: (key: string) => boolean;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('ready');
  const [query, setQuery] = useState('');
  const [all, setAll] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [pasted, setPasted] = useState('');
  const [bulk, setBulk] = useState<Bulk>({ state: 'idle' });
  const stop = useRef(false);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { ready: 0, address: 0, hold: 0, removed: 0 };
    for (const p of list.people) c[kind(p)]++;
    return c;
  }, [list.people]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.people.filter(
      (p) =>
        kind(p) === filter &&
        (!q || `${p.firstName} ${p.surname} ${p.email ?? ''}`.toLowerCase().includes(q)),
    );
  }, [list.people, filter, query]);

  async function inviteEverybody() {
    stop.current = false;
    let sent = 0;
    let left = counts.ready;
    setBulk({ state: 'running', sent, left });
    for (;;) {
      if (stop.current) {
        setBulk({ state: 'done', sent, left, note: 'Stopped. Press “Invite everybody” again to carry on with the rest.' });
        break;
      }
      let r: BatchOutcome;
      try {
        r = await inviteBatch();
      } catch {
        r = { ok: false, message: 'The connection dropped. Check it and press “Invite everybody” again; nobody is invited twice.' };
      }
      if (!r.ok) {
        setBulk({ state: 'done', sent, left, note: r.message, bad: true });
        break;
      }
      sent += r.sent;
      const stuck = !r.stopped && r.left >= left && r.left > 0;
      left = r.left;
      if (r.stopped || left === 0 || stuck) {
        setBulk({
          state: 'done',
          sent,
          left,
          note: r.stopped ?? (stuck ? 'It stopped making progress. Try again in a few minutes.' : undefined),
          bad: Boolean(r.stopped) || stuck,
        });
        break;
      }
      setBulk({ state: 'running', sent, left });
    }
    router.refresh();
  }

  const small =
    'tap rounded-lg border-2 border-skyLine bg-white px-3.5 py-2 text-sm font-semibold text-navy transition-colors hover:border-sky disabled:opacity-50';
  const box = 'w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3 text-ink focus:border-sky focus:outline-none';
  const running = bulk.state === 'running';
  const locked = pending || running;

  const chips: { key: Filter; label: string }[] = [
    { key: 'ready', label: 'Ready to invite' },
    { key: 'address', label: 'Need an email address' },
    { key: 'hold', label: 'Check first' },
    { key: 'removed', label: 'Taken off' },
  ];

  if (!list.ready) {
    return (
      <section aria-labelledby="list-h">
        <h2 id="list-h" className="display text-2xl lg:text-3xl">
          The club’s list
        </h2>
        <p className="card mt-3 border-l-4 border-warn px-5 py-4 text-sm text-ink">
          The list cannot be read yet: the <code>portal_roll</code> table has not been created in
          Supabase. Run <code>supabase/migrations/006_portal_roll.sql</code>. Everything else on
          this page works without it.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="list-h">
      <h2 id="list-h" className="display text-2xl lg:text-3xl">
        The club’s list{' '}
        <span className="font-sans text-base font-normal tracking-normal text-slate2">
          {counts.ready + counts.address + counts.hold} not yet invited
        </span>
      </h2>
      <p className="mb-3 mt-1 max-w-prose2 text-inkMuted">
        Members the club means to invite. Nobody here has a sign-in yet and nothing has been sent
        to them. {list.invited > 0 && <>{list.invited} more from the list already have a sign-in and are under Members below.</>}
      </p>

      {/* ── Inviting everybody ─────────────────────────────────────────── */}
      <div className="card-panel p-5 lg:p-6">
        <p className="font-semibold text-navy">
          {counts.ready} {counts.ready === 1 ? 'person is' : 'people are'} ready to invite
        </p>
        {list.mail ? (
          <p className="mt-1 max-w-prose2 text-sm text-ink">
            Each one is emailed the portal’s address and a temporary password, which lasts{' '}
            {TEMP_PASSWORD_DAYS} days and has to be changed the first time they sign in. People who
            need an email address, or are marked “check first”, are not included.
          </p>
        ) : (
          <p id="no-mail" className="mt-1 max-w-prose2 text-sm text-ink">
            <strong>Everybody cannot be invited at once yet</strong>, because the club’s email
            sending is not set up (it needs <code>RESEND_API_KEY</code> and <code>MAIL_FROM</code>{' '}
            in Vercel). Until it is, invite one person at a time from the list below: you are shown
            a temporary password to pass on yourself.
          </p>
        )}

        {bulk.state !== 'asking' && (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="pill-solid disabled:opacity-50"
              disabled={!list.mail || locked || counts.ready === 0}
              aria-describedby={list.mail ? undefined : 'no-mail'}
              onClick={() => setBulk({ state: 'asking' })}
            >
              Invite everybody who is ready ({counts.ready})
            </button>
            {list.mail && (
              <button type="button" className={small} disabled={locked} onClick={() => run('sample', () => sendSample())}>
                {busy('sample') ? 'Sending…' : 'Email me a sample first'}
              </button>
            )}
          </div>
        )}

        {bulk.state === 'asking' && (
          <div role="alertdialog" aria-labelledby="sure-h" className="mt-4 rounded-card border-l-4 border-warn bg-warnTint px-5 py-4">
            <p id="sure-h" className="font-semibold text-navy">
              Email an invitation to {counts.ready} {counts.ready === 1 ? 'person' : 'people'} now?
            </p>
            <p className="mt-1 max-w-prose2 text-sm text-ink">
              This makes a sign-in for each of them and sends the email straight away. It cannot be
              unsent. On the free email plan 100 can go in a day — if it stops there, press the
              button again tomorrow and it carries on with whoever is left.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className="pill-solid" onClick={inviteEverybody}>
                Yes, invite {counts.ready} {counts.ready === 1 ? 'person' : 'people'}
              </button>
              <button type="button" className={small} onClick={() => setBulk({ state: 'idle' })}>
                No, go back
              </button>
            </div>
          </div>
        )}

        <div aria-live="polite">
          {bulk.state === 'running' && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p className="font-medium text-navy">
                Inviting… {bulk.sent} sent, {bulk.left} to go. Keep this page open.
              </p>
              <button
                type="button"
                className={small}
                onClick={() => {
                  stop.current = true;
                }}
              >
                Stop
              </button>
            </div>
          )}
          {bulk.state === 'done' && (
            <p
              role={bulk.bad ? 'alert' : undefined}
              className={`mt-4 rounded-card border-l-4 px-5 py-4 ${bulk.bad ? 'border-bad bg-badTint text-bad' : 'border-good bg-goodTint text-ink'}`}
            >
              <strong>
                {bulk.sent} {bulk.sent === 1 ? 'invitation' : 'invitations'} sent
                {bulk.left > 0 ? `, ${bulk.left} still to go.` : '. Everybody who was ready has been invited.'}
              </strong>
              {bulk.note && <span className="mt-1 block">{bulk.note}</span>}
            </p>
          )}
        </div>
      </div>

      {/* ── The people ─────────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1 basis-64">
          <label htmlFor="list-find" className="mb-1.5 block text-sm font-medium text-navy">
            Find somebody on the list
          </label>
          <input
            id="list-find"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setAll(false);
            }}
            className={box}
          />
        </div>
        <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={filter === c.key}
              onClick={() => {
                setFilter(c.key);
                setAll(false);
              }}
              className={`tap rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                filter === c.key ? 'border-navy bg-navy text-white' : 'border-skyLine bg-white text-navy hover:border-sky'
              }`}
            >
              {c.label} <span className="ml-1.5 font-normal">{counts[c.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="card mt-3 px-5 py-4 text-inkMuted">Nobody here{query ? ' matches that' : ''}.</p>
      ) : (
        <ul className="card mt-3 divide-y divide-skyLine overflow-hidden">
          {(all ? shown : shown.slice(0, FIRST)).map((p) => {
            const name = `${p.firstName} ${p.surname}`.trim();
            const k = kind(p);
            return (
              <li key={p.id} className="grid gap-x-6 gap-y-3 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="min-w-0">
                  <p className="font-semibold text-navy">{name}</p>
                  <p className="break-all text-sm text-ink">{p.email ?? 'No email address'}</p>
                  {p.note && <p className="mt-1 max-w-prose2 text-sm text-inkMuted">{p.note}</p>}
                  {editing === p.id && (
                    <form
                      className="mt-3 flex flex-wrap items-end gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        run(`e${p.id}`, () => setListEmail(p.id, address), (o) => o.ok && setEditing(null));
                      }}
                    >
                      <div className="min-w-0 flex-1 basis-56">
                        <label htmlFor={`addr-${p.id}`} className="mb-1 block text-sm font-medium text-navy">
                          Email address for {name}
                        </label>
                        <input
                          id={`addr-${p.id}`}
                          type="email"
                          required
                          maxLength={254}
                          autoComplete="off"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className={box}
                        />
                      </div>
                      <button type="submit" className={small} disabled={locked}>
                        {busy(`e${p.id}`) ? 'Saving…' : 'Save address'}
                      </button>
                      <button type="button" className={small} onClick={() => setEditing(null)}>
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {k === 'ready' && (
                    <button
                      type="button"
                      className="pill-solid !min-h-[44px] !py-2 text-sm disabled:opacity-50"
                      disabled={locked}
                      onClick={() => run(`i${p.id}`, () => inviteFromList(p.id))}
                    >
                      {busy(`i${p.id}`) ? 'Inviting…' : 'Invite'}
                      <span className="sr-only"> {name}</span>
                    </button>
                  )}
                  {k === 'hold' && (
                    <button
                      type="button"
                      className={small}
                      disabled={locked}
                      onClick={() => run(`l${p.id}`, () => setListStatus(p.id, 'listed'))}
                    >
                      Still a member — make ready
                      <span className="sr-only">: {name}</span>
                    </button>
                  )}
                  {k !== 'removed' && editing !== p.id && (
                    <button
                      type="button"
                      className={small}
                      disabled={locked}
                      onClick={() => {
                        setEditing(p.id);
                        setAddress(p.blocker ? '' : (p.email ?? ''));
                      }}
                    >
                      {p.email ? 'Change address' : 'Add address'}
                      <span className="sr-only"> for {name}</span>
                    </button>
                  )}
                  {k !== 'removed' ? (
                    <button
                      type="button"
                      className={`${small} !text-bad hover:!border-bad`}
                      disabled={locked}
                      onClick={() => run(`x${p.id}`, () => setListStatus(p.id, 'removed'))}
                    >
                      Take off the list
                      <span className="sr-only">: {name}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={small}
                      disabled={locked}
                      onClick={() => run(`b${p.id}`, () => setListStatus(p.id, 'listed'))}
                    >
                      Put back on the list
                      <span className="sr-only">: {name}</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {!all && shown.length > FIRST && (
        <button type="button" className={`${small} mt-3`} onClick={() => setAll(true)}>
          Show all {shown.length}
        </button>
      )}

      {/* ── Adding names ───────────────────────────────────────────────── */}
      <form
        className="card mt-6 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          run('paste', () => addToList(pasted), (o) => o.ok && setPasted(''));
        }}
      >
        <label htmlFor="list-paste" className="block font-semibold text-navy">
          Add names to the list
        </label>
        <p id="list-paste-hint" className="mb-2 mt-1 max-w-prose2 text-sm text-inkMuted">
          One person to a line: first name, surname, email address — as it pastes from a
          spreadsheet or a membership export. Anybody already on the list, or already signed up,
          is left out. Adding a name invites nobody.
        </p>
        <textarea
          id="list-paste"
          aria-describedby="list-paste-hint"
          rows={4}
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className={`${box} font-mono text-sm`}
        />
        <button type="submit" className={`${small} mt-3`} disabled={locked || !pasted.trim()}>
          {busy('paste') ? 'Adding…' : 'Add to the list'}
        </button>
      </form>
    </section>
  );
}

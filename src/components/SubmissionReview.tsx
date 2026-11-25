'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { decideSubmission, type Decision } from '@/app/(portal)/admin/submissions/actions';
import { Badge } from '@/components/ui';

/**
 * The controllers' page for what members have sent in (/admin/submissions).
 *
 * Three lists: waiting, on the site, and not shown. A waiting story or
 * photograph can be tidied (title, text, the name it is shown as from) and
 * then approved, which publishes it at once, or declined. One that is on the
 * site can be taken down; one that is not shown can be published after all.
 * Nothing is deleted.
 *
 * The member's email address is shown here so a controller can write back. It
 * is never shown on the site.
 */

export type Waiting = {
  id: number;
  kind: 'blog' | 'photo';
  name: string;
  email: string;
  title: string;
  body: string;
  hasImage: boolean;
  status: 'pending' | 'published' | 'declined';
  sent: string;
};

const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const what = (k: Waiting['kind']) => (k === 'blog' ? 'Flying-blog story' : 'Photograph');
const small =
  'tap rounded-lg border-2 border-skyLine bg-white px-3.5 py-2 text-sm font-semibold text-navy transition-colors hover:border-sky disabled:opacity-50';
const box = 'w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3 text-ink focus:border-sky focus:outline-none';

function Card({ item, onDone, locked, setLocked }: { item: Waiting; onDone: (d: Decision) => void; locked: boolean; setLocked: (b: boolean) => void }) {
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);
  const [name, setName] = useState(item.name);
  const [busy, setBusy] = useState<'publish' | 'decline' | null>(null);
  const [, startTransition] = useTransition();
  const id = `sub-${item.id}`;

  const decide = (publish: boolean) => {
    setBusy(publish ? 'publish' : 'decline');
    setLocked(true);
    startTransition(async () => {
      const d = await decideSubmission(item.id, publish, publish ? { title, body, name } : undefined).catch(
        () => ({ ok: false as const, message: 'That did not go through. Check your connection and try again.' }),
      );
      setBusy(null);
      setLocked(false);
      onDone(d);
    });
  };

  return (
    <li className="card p-5 lg:p-6">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Badge tone="neutral">{what(item.kind)}</Badge>
        <span className="text-sm text-inkMuted">Sent {day(item.sent)}</span>
      </p>
      <p className="mt-2 text-sm text-ink">
        From <strong className="text-navy">{item.name || 'no name given'}</strong>
        {item.email && (
          <>
            {' · '}
            <a href={`mailto:${item.email}`} className="link break-all">
              {item.email}
            </a>
          </>
        )}
      </p>

      <div className={`mt-4 grid gap-6 ${item.hasImage ? 'lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]' : ''}`}>
        {item.hasImage && (
          <a href={`/files/sent-in/${item.id}`} target="_blank" rel="noopener noreferrer" className="block self-start">
            {/* A private picture behind the sign-in: a plain <img>, which sends the member's sign-in with it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/files/sent-in/${item.id}`}
              alt={`The photograph sent in by ${item.name || 'a member'}${item.title ? `: ${item.title}` : ''}`}
              className="max-h-[22rem] w-full rounded-card border border-skyLine bg-sunken object-contain"
            />
            <span className="mt-1 block text-sm font-medium text-skyDark underline underline-offset-4">
              Open it full size<span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor={`${id}-title`} className="mb-1.5 block font-medium text-navy">
              Title <span className="font-normal text-inkMuted">(may be left empty)</span>
            </label>
            <input id={`${id}-title`} type="text" maxLength={140} autoComplete="off" value={title} onChange={(e) => setTitle(e.target.value)} className={box} />
          </div>
          <div>
            <label htmlFor={`${id}-body`} className="mb-1.5 block font-medium text-navy">
              {item.kind === 'blog' ? 'The story' : 'What it says about the photograph'}
            </label>
            <textarea
              id={`${id}-body`}
              rows={item.kind === 'blog' ? 10 : 3}
              maxLength={20000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={box}
            />
          </div>
          <div>
            <label htmlFor={`${id}-name`} className="mb-1.5 block font-medium text-navy">
              Shown as from
            </label>
            <input id={`${id}-name`} type="text" maxLength={120} autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} className={`${box} max-w-md`} />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" className="pill-solid disabled:opacity-50" disabled={locked} onClick={() => decide(true)}>
          {busy === 'publish' ? 'Publishing…' : 'Approve and publish'}
          <span className="sr-only">: {what(item.kind).toLowerCase()} from {item.name}</span>
        </button>
        <button type="button" className={`${small} !text-bad hover:!border-bad`} disabled={locked} onClick={() => decide(false)}>
          {busy === 'decline' ? 'Declining…' : 'Decline'}
          <span className="sr-only">: {what(item.kind).toLowerCase()} from {item.name}</span>
        </button>
        <span className="text-sm text-inkMuted">
          Approving puts it on the {item.kind === 'blog' ? 'Flying Blog' : 'Gallery'} page at once. You can tidy the words above first.
        </span>
      </div>
    </li>
  );
}

export default function SubmissionReview({ items }: { items: Waiting[] }) {
  const router = useRouter();
  const [said, setSaid] = useState<Decision | null>(null);
  const [locked, setLocked] = useState(false);
  const [, startTransition] = useTransition();

  const done = (d: Decision) => {
    setSaid(d);
    router.refresh();
    // The count beside "My sign-in" follows.
    window.dispatchEvent(new Event('dlgc:sent-in-changed'));
    document.getElementById('decision')?.scrollIntoView({ block: 'center' });
  };
  const quick = (id: number, publish: boolean) => {
    setLocked(true);
    startTransition(async () => {
      const d = await decideSubmission(id, publish).catch(() => ({ ok: false as const, message: 'That did not go through. Try again.' }));
      setLocked(false);
      done(d);
    });
  };

  const waiting = items.filter((i) => i.status === 'pending');
  const shown = items.filter((i) => i.status === 'published');
  const hidden = items.filter((i) => i.status === 'declined');

  const Row = ({ item, publish }: { item: Waiting; publish: boolean }) => (
    <li className="grid gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <p className="font-semibold text-navy">{item.title || (item.kind === 'blog' ? 'Story without a title' : 'Photograph without a title')}</p>
        <p className="text-sm text-inkMuted">
          {what(item.kind)} from {item.name || 'no name given'} · sent {day(item.sent)}
        </p>
      </div>
      <button type="button" className={publish ? small : `${small} !text-bad hover:!border-bad`} disabled={locked} onClick={() => quick(item.id, publish)}>
        {publish ? 'Publish it' : 'Take it down'}
        <span className="sr-only">: {item.title || what(item.kind)} from {item.name}</span>
      </button>
    </li>
  );

  return (
    <div className="space-y-10">
      <div id="decision" aria-live="polite" className="scroll-mt-6">
        {said && (
          <p
            role={said.ok ? 'status' : 'alert'}
            className={`rounded-card border-l-4 px-5 py-4 ${said.ok ? 'border-good bg-goodTint text-ink' : 'border-bad bg-badTint text-bad'}`}
          >
            {said.message}
          </p>
        )}
      </div>

      <section aria-labelledby="waiting-h">
        <h2 id="waiting-h" className="display text-2xl lg:text-3xl">
          Waiting for you <span className="font-sans text-base font-normal tracking-normal text-slate2">{waiting.length}</span>
        </h2>
        <p className="mb-3 mt-1 max-w-prose2 text-inkMuted">
          Read each one. Members can be recognised in photographs, and a story may be copied to the club’s public website, so
          approve only what the club is happy to show.
        </p>
        {waiting.length === 0 ? (
          <p className="card px-5 py-4 text-inkMuted">Nothing is waiting.</p>
        ) : (
          <ul className="space-y-5">
            {waiting.map((i) => (
              <Card key={i.id} item={i} onDone={done} locked={locked} setLocked={setLocked} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="shown-h">
        <h2 id="shown-h" className="display text-2xl lg:text-3xl">
          On the site <span className="font-sans text-base font-normal tracking-normal text-slate2">{shown.length}</span>
        </h2>
        <p className="mb-3 mt-1 max-w-prose2 text-inkMuted">Approved, and showing on the Flying Blog or in the Gallery.</p>
        {shown.length === 0 ? (
          <p className="card px-5 py-4 text-inkMuted">Nothing yet.</p>
        ) : (
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {shown.map((i) => (
              <Row key={i.id} item={i} publish={false} />
            ))}
          </ul>
        )}
      </section>

      {hidden.length > 0 && (
        <section aria-labelledby="hidden-h">
          <h2 id="hidden-h" className="display text-2xl lg:text-3xl">
            Not shown <span className="font-sans text-base font-normal tracking-normal text-slate2">{hidden.length}</span>
          </h2>
          <p className="mb-3 mt-1 max-w-prose2 text-inkMuted">Declined, or taken down. Kept, and can be published after all.</p>
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {hidden.map((i) => (
              <Row key={i.id} item={i} publish />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

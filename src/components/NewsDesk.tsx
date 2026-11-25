'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, useTransition } from 'react';
import {
  saveNotice,
  showNotice,
  takenDown,
  type NoticeInput,
  type NoticeOutcome,
} from '@/app/(portal)/club-life/news/actions';
import type { PostedNotice } from '@/lib/news';
import { useIsController } from '@/lib/use-controller';

/**
 * POSTING NEWS FROM THE NEWS PAGE — for controllers.
 *
 * Three pieces, all invisible to anybody who is not a controller:
 *
 *   <NewsDesk />        at the top of the News page: "Add a notice", the form,
 *                       and the list of notices that have been taken down.
 *   <NoticeTools />     under each notice that was posted from the portal:
 *                       "Edit" and "Take down".
 *   <NoticeForm />      the form itself, shared by both.
 *
 * The page these sit on is built once for every member, so they decide what to
 * draw from the sign-in the browser holds. That is only what to DRAW: the
 * actions they call check on the server that the person is a controller, and
 * refuse anybody else whatever their browser says.
 *
 * Notices that came across from the old site are in src/content/news.ts and
 * have no buttons; they are edited in that file.
 *
 * THE HOUSE STYLE still applies, and the form says so: dated, attributed,
 * warm and specific; links named for what they open.
 */

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const small =
  'tap rounded-lg border-2 border-skyLine bg-white px-3.5 py-2 text-sm font-semibold text-navy transition-colors hover:border-sky disabled:opacity-50';
const box = 'w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3 text-ink focus:border-sky focus:outline-none';
const label = 'mb-1.5 block font-medium text-navy';
const hint = 'mb-1.5 text-sm text-inkMuted';
const MAX_LINKS = 6;

function Said({ outcome }: { outcome: NoticeOutcome | null }) {
  if (!outcome) return null;
  return (
    <p
      role={outcome.ok ? 'status' : 'alert'}
      className={`rounded-card border-l-4 px-4 py-3 ${
        outcome.ok ? 'border-good bg-goodTint text-ink' : 'border-bad bg-badTint text-bad'
      }`}
    >
      {outcome.message}
    </p>
  );
}

export function NoticeForm({
  notice,
  onSaved,
  onCancel,
}: {
  /** Editing this one. Leave out for a new notice. */
  notice?: PostedNotice;
  onSaved: (o: NoticeOutcome) => void;
  onCancel: () => void;
}) {
  const id = useId();
  const [date, setDate] = useState(notice?.date ?? today());
  const [title, setTitle] = useState(notice?.title ?? '');
  const [from, setFrom] = useState(notice?.from ?? '');
  const [body, setBody] = useState(notice?.body ?? '');
  const [links, setLinks] = useState(notice?.links.length ? notice.links : [{ label: '', href: '' }]);
  const [pinned, setPinned] = useState(notice?.pinned ?? false);
  const [pending, startTransition] = useTransition();
  const [problem, setProblem] = useState<NoticeOutcome | null>(null);

  const setLink = (i: number, part: 'label' | 'href', value: string) =>
    setLinks((all) => all.map((l, n) => (n === i ? { ...l, [part]: value } : l)));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setProblem(null);
    const input: NoticeInput = { date, title, from, body, links, pinned };
    startTransition(async () => {
      let outcome: NoticeOutcome;
      try {
        outcome = await saveNotice(input, notice?.id);
      } catch {
        outcome = { ok: false, message: 'That did not go through. Check your connection and try again — what you typed is still here.' };
      }
      if (outcome.ok) onSaved(outcome);
      else setProblem(outcome);
    });
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-5 lg:p-6" aria-label={notice ? `Edit “${notice.title}”` : 'Add a notice'}>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <div>
          <label htmlFor={`${id}-title`} className={label}>
            Heading
          </label>
          <input
            id={`${id}-title`}
            type="text"
            required
            minLength={2}
            maxLength={140}
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={box}
          />
        </div>
        <div>
          <label htmlFor={`${id}-date`} className={label}>
            Date
          </label>
          <input
            id={`${id}-date`}
            type="date"
            required
            min="2016-01-01"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={box}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-from`} className={label}>
          From <span className="font-normal text-inkMuted">(leave empty if nobody in particular)</span>
        </label>
        <p id={`${id}-from-hint`} className={hint}>
          Who sent it in, as the club writes it: “Dave Salmon”, “the Chairman”, “the CFI”.
        </p>
        <input
          id={`${id}-from`}
          type="text"
          maxLength={80}
          autoComplete="off"
          aria-describedby={`${id}-from-hint`}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className={`${box} max-w-md`}
        />
      </div>

      <div>
        <label htmlFor={`${id}-body`} className={label}>
          The notice
        </label>
        <p id={`${id}-body-hint`} className={hint}>
          Plain words, as you would say it at the launch point. Name people. Leave an empty line between paragraphs.
        </p>
        <textarea
          id={`${id}-body`}
          required
          rows={8}
          maxLength={8000}
          aria-describedby={`${id}-body-hint`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={box}
        />
      </div>

      <fieldset>
        <legend className={label}>
          Links <span className="font-normal text-inkMuted">(if the notice points at anything)</span>
        </legend>
        <p className={hint}>
          Say what each one opens — “Committee minutes, October 2026”, not “this link”. The address starts{' '}
          <code>https://</code>, or with <code>/</code> for a page of this portal, such as <code>/flying/roster</code>.
        </p>
        <ul className="space-y-3">
          {links.map((l, i) => (
            <li key={i} className="grid gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] sm:items-end">
              <div>
                <label htmlFor={`${id}-l${i}`} className="mb-1 block text-sm font-medium text-navy">
                  Link {i + 1}: what it opens
                </label>
                <input
                  id={`${id}-l${i}`}
                  type="text"
                  maxLength={120}
                  autoComplete="off"
                  value={l.label}
                  onChange={(e) => setLink(i, 'label', e.target.value)}
                  className={box}
                />
              </div>
              <div>
                <label htmlFor={`${id}-h${i}`} className="mb-1 block text-sm font-medium text-navy">
                  Link {i + 1}: address
                </label>
                <input
                  id={`${id}-h${i}`}
                  type="text"
                  inputMode="url"
                  maxLength={600}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={l.href}
                  onChange={(e) => setLink(i, 'href', e.target.value)}
                  className={box}
                />
              </div>
              {links.length > 1 && (
                <button type="button" className={small} onClick={() => setLinks((all) => all.filter((_, n) => n !== i))}>
                  Remove<span className="sr-only"> link {i + 1}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
        {links.length < MAX_LINKS && (
          <button type="button" className={`${small} mt-3`} onClick={() => setLinks((all) => [...all, { label: '', href: '' }])}>
            Add another link
          </button>
        )}
      </fieldset>

      <div>
        <label htmlFor={`${id}-pin`} className="tap cursor-pointer gap-3 font-medium text-navy">
          <input
            id={`${id}-pin`}
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="h-6 w-6 rounded border-2 border-skyLine text-navy focus:ring-sky"
          />
          Mark it “Worth knowing now”
        </label>
        <p className="text-sm text-inkMuted">
          For something members need to act on. Only the two newest notices marked this way carry the badge, so use it
          sparingly.
        </p>
      </div>

      <Said outcome={problem} />

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="pill-solid disabled:opacity-50" disabled={pending}>
          {pending ? (notice ? 'Saving…' : 'Publishing…') : notice ? 'Save changes' : 'Publish to all members'}
        </button>
        <button type="button" className={small} disabled={pending} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/** At the top of the News page. Draws nothing unless a controller is looking. */
export default function NewsDesk() {
  const controller = useIsController();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [said, setSaid] = useState<NoticeOutcome | null>(null);
  const [gone, setGone] = useState<PostedNotice[] | null>(null);
  const [pending, startTransition] = useTransition();

  if (!controller) return null;

  const loadGone = () =>
    startTransition(async () => {
      const r = await takenDown().catch(() => null);
      if (r?.ok) setGone(r.notices);
      else setSaid({ ok: false, message: r?.message ?? 'The list could not be read. Try again.' });
    });

  const putBack = (n: PostedNotice) =>
    startTransition(async () => {
      const r = await showNotice(n.id, true).catch(() => ({ ok: false as const, message: 'That did not go through. Try again.' }));
      setSaid(r);
      if (r.ok) {
        setGone((all) => (all ?? []).filter((x) => x.id !== n.id));
        router.refresh();
      }
    });

  return (
    <div className="mb-10 space-y-4" aria-label="For controllers">
      {!adding && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="pill-solid"
            onClick={() => {
              setAdding(true);
              setSaid(null);
            }}
          >
            Add a notice
          </button>
          <button type="button" className={small} disabled={pending} onClick={() => (gone ? setGone(null) : loadGone())}>
            {gone ? 'Hide notices taken down' : 'Notices taken down'}
          </button>
          <span className="text-sm text-inkMuted">Only controllers see these buttons.</span>
        </div>
      )}

      {adding && (
        <NoticeForm
          onCancel={() => setAdding(false)}
          onSaved={(o) => {
            setAdding(false);
            setSaid(o);
            router.refresh();
          }}
        />
      )}

      <Said outcome={said} />

      {gone && !adding && (
        <div className="card p-5">
          <p className="font-semibold text-navy">Notices taken down</p>
          {gone.length === 0 ? (
            <p className="mt-1 text-inkMuted">None. A notice that is taken down is kept here so it can be put back.</p>
          ) : (
            <ul className="mt-2 divide-y divide-skyLine">
              {gone.map((n) => (
                <li key={n.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
                  <span className="min-w-0">
                    <span className="block font-medium text-navy">{n.title}</span>
                    <span className="block text-sm text-inkMuted">
                      {new Date(`${n.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
                    </span>
                  </span>
                  <button type="button" className={small} disabled={pending} onClick={() => putBack(n)}>
                    Put it back<span className="sr-only">: {n.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/** Under a notice that was posted from the portal. Draws nothing unless a controller is looking. */
export function NoticeTools({ notice }: { notice: PostedNotice }) {
  const controller = useIsController();
  const router = useRouter();
  const [mode, setMode] = useState<'idle' | 'editing' | 'asking'>('idle');
  const [said, setSaid] = useState<NoticeOutcome | null>(null);
  const [pending, startTransition] = useTransition();

  if (!controller) return null;

  const takeDown = () =>
    startTransition(async () => {
      const r = await showNotice(notice.id, false).catch(() => ({ ok: false as const, message: 'That did not go through. Try again.' }));
      setSaid(r);
      setMode('idle');
      if (r.ok) router.refresh();
    });

  return (
    <div className="mt-4 space-y-3">
      {mode === 'idle' && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={small}
            onClick={() => {
              setMode('editing');
              setSaid(null);
            }}
          >
            Edit<span className="sr-only"> “{notice.title}”</span>
          </button>
          <button type="button" className={`${small} !text-bad hover:!border-bad`} onClick={() => setMode('asking')}>
            Take down<span className="sr-only"> “{notice.title}”</span>
          </button>
          <span className="text-xs text-slate2">Posted from the portal. Only controllers see these buttons.</span>
        </div>
      )}

      {mode === 'asking' && (
        <div role="alertdialog" aria-label={`Take down “${notice.title}”?`} className="rounded-card border-l-4 border-warn bg-warnTint px-5 py-4">
          <p className="font-semibold text-navy">Take this notice down?</p>
          <p className="mt-1 text-sm text-ink">
            Members will stop seeing it. It is kept, and you can put it back from “Notices taken down” at the top of the page.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" className="pill-solid !min-h-[44px] !py-2 text-sm disabled:opacity-50" disabled={pending} onClick={takeDown}>
              {pending ? 'Taking it down…' : 'Yes, take it down'}
            </button>
            <button type="button" className={small} disabled={pending} onClick={() => setMode('idle')}>
              No, leave it
            </button>
          </div>
        </div>
      )}

      {mode === 'editing' && (
        <NoticeForm
          notice={notice}
          onCancel={() => setMode('idle')}
          onSaved={(o) => {
            setMode('idle');
            setSaid(o);
            router.refresh();
          }}
        />
      )}

      <Said outcome={said} />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, useTransition } from 'react';
import {
  newsUploads,
  saveNotice,
  showNotice,
  takenDown,
  type NoticeInput,
  type NoticeOutcome,
} from '@/app/(portal)/club-life/news/actions';
import type { PostedNotice } from '@/lib/news';
import { createClient } from '@/lib/supabase/client';
import {
  FILE_TYPES,
  MAX_FILE,
  MAX_NOTICE_FILES,
  MAX_NOTICE_PHOTOS,
  MAX_PHOTO,
  MB,
  PHOTO_TYPES,
  uploadProblem,
  type UploadKind,
} from '@/lib/uploads';
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
 * PHOTOGRAPHS AND FILES. The form takes a few of each. They are sent straight
 * from the controller's browser to the private store (src/lib/uploads.ts says
 * why), each with a one-time permission from the server, and only then is the
 * notice saved — the server checks every one before it accepts it. Each needs
 * a few words: for a photograph, what it shows (that is what a member who
 * cannot see it is read); for a file, what it is.
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
  // What the notice already carries, and what has been chosen to add.
  const [kept, setKept] = useState(notice?.attachments ?? []);
  const [adding, setAdding] = useState<{ file: File; kind: UploadKind; label: string }[]>([]);
  const [progress, setProgress] = useState('');
  const [pending, startTransition] = useTransition();
  const [problem, setProblem] = useState<NoticeOutcome | null>(null);

  const count = (kind: UploadKind) => kept.filter((a) => a.kind === kind).length + adding.filter((a) => a.kind === kind).length;

  /** Files chosen in one of the two pickers. Anything that cannot go is refused here, before any upload. */
  function choose(kind: UploadKind, list: FileList | null) {
    if (!list) return;
    setProblem(null);
    const room = (kind === 'photo' ? MAX_NOTICE_PHOTOS : MAX_NOTICE_FILES) - count(kind);
    const chosen = [...list];
    const bad = chosen.map((f) => uploadProblem(kind, f)).find(Boolean);
    if (bad) return setProblem({ ok: false, message: bad });
    if (chosen.length > room) {
      return setProblem({
        ok: false,
        message: `A notice can carry up to ${kind === 'photo' ? `${MAX_NOTICE_PHOTOS} photographs` : `${MAX_NOTICE_FILES} files`}.`,
      });
    }
    setAdding((all) => [
      ...all,
      // A file starts with its own name as what it is called; a photograph has to be described.
      ...chosen.map((file) => ({ file, kind, label: kind === 'file' ? file.name.replace(/\.[A-Za-z0-9]+$/, '').replace(/[_-]+/g, ' ').trim() : '' })),
    ]);
  }

  const setLink = (i: number, part: 'label' | 'href', value: string) =>
    setLinks((all) => all.map((l, n) => (n === i ? { ...l, [part]: value } : l)));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setProblem(null);
    const unnamed = adding.find((a) => a.label.trim().length < 3);
    if (unnamed) {
      return setProblem({
        ok: false,
        message: unnamed.kind === 'photo' ? 'Say in a few words what each photograph shows.' : 'Say in a few words what each file is.',
      });
    }
    startTransition(async () => {
      let outcome: NoticeOutcome;
      try {
        // 1. Put the new photographs and files in the store, straight from this browser.
        const add: { kind: UploadKind; path: string; label: string }[] = [];
        if (adding.length > 0) {
          setProgress('Getting ready to upload…');
          const tickets = await newsUploads(adding.map((a) => ({ kind: a.kind, name: a.file.name, type: a.file.type, size: a.file.size })));
          if (!tickets.ok) {
            setProgress('');
            return setProblem(tickets);
          }
          const supabase = createClient();
          if (!supabase) {
            setProgress('');
            return setProblem({ ok: false, message: 'Files cannot be uploaded from this copy of the site.' });
          }
          for (let i = 0; i < adding.length; i++) {
            setProgress(`Uploading ${i + 1} of ${adding.length}: ${adding[i].file.name}`);
            const { error } = await supabase.storage
              .from('news')
              .uploadToSignedUrl(tickets.tickets[i].path, tickets.tickets[i].token, adding[i].file, { contentType: adding[i].file.type });
            if (error) {
              setProgress('');
              return setProblem({
                ok: false,
                message: `“${adding[i].file.name}” could not be uploaded (${error.message}). Nothing has been published; what you typed is still here.`,
              });
            }
            add.push({ kind: adding[i].kind, path: tickets.tickets[i].path, label: adding[i].label.trim() });
          }
          setProgress('Saving the notice…');
        }
        // 2. Save the notice. The server checks each file before it accepts it.
        const input: NoticeInput = { date, title, from, body, links, pinned, attachments: { keep: kept.map((a) => a.n), add } };
        outcome = await saveNotice(input, notice?.id);
      } catch {
        outcome = { ok: false, message: 'That did not go through. Check your connection and try again — what you typed is still here.' };
      }
      setProgress('');
      if (outcome.ok) onSaved(outcome);
      else setProblem(outcome);
    });
  }

  const fileBox =
    'w-full rounded-lg border-2 border-dashed border-skyLine bg-cloud px-4 py-3 text-ink file:mr-4 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:font-medium file:text-white';
  const size = (b: number) => (b >= MB ? `${(b / MB).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

  /** One of the two pickers, with what is already on the notice and what has been chosen. */
  const attach = (kind: UploadKind) => {
    const photo = kind === 'photo';
    const max = photo ? MAX_NOTICE_PHOTOS : MAX_NOTICE_FILES;
    const mine = adding.map((a, i) => ({ a, i })).filter(({ a }) => a.kind === kind);
    const old = kept.filter((a) => a.kind === kind);
    return (
      <fieldset>
        <legend className={label}>
          {photo ? 'Photographs' : 'Files'} <span className="font-normal text-inkMuted">(optional)</span>
        </legend>
        <p id={`${id}-${kind}-hint`} className={hint}>
          {photo
            ? `Up to ${max}. JPG, PNG or WEBP, each up to ${MAX_PHOTO / MB} MB — straight off a phone is fine; the portal makes a smaller copy and takes out where it was taken.`
            : `Up to ${max}, each up to ${MAX_FILE / MB} MB. A PDF opens in the member’s browser; a Word, Excel or PowerPoint file downloads, so use a PDF where you can.`}
        </p>
        {(old.length > 0 || mine.length > 0) && (
          <ul className="mb-3 space-y-3">
            {old.map((a) => (
              <li key={`k${a.n}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-card border border-skyLine bg-white px-4 py-3">
                <span className="min-w-0">
                  <span className="block font-medium text-navy">{a.label}</span>
                  <span className="block text-sm text-inkMuted">Already on the notice</span>
                </span>
                <button type="button" className={small} onClick={() => setKept((all) => all.filter((x) => x.n !== a.n))}>
                  Take it off<span className="sr-only">: {a.label}</span>
                </button>
              </li>
            ))}
            {mine.map(({ a, i }) => (
              <li key={`a${i}`} className="grid gap-2 rounded-card border border-skyLine bg-white px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div>
                  <label htmlFor={`${id}-a${i}`} className="mb-1 block text-sm font-medium text-navy">
                    {photo ? 'What this photograph shows' : 'What this file is'}
                    <span className="ml-2 font-normal text-inkMuted">
                      {a.file.name} · {size(a.file.size)}
                    </span>
                  </label>
                  <input
                    id={`${id}-a${i}`}
                    type="text"
                    required
                    minLength={3}
                    maxLength={140}
                    autoComplete="off"
                    value={a.label}
                    onChange={(e) => setAdding((all) => all.map((x, n) => (n === i ? { ...x, label: e.target.value } : x)))}
                    className={box}
                  />
                </div>
                <button type="button" className={small} onClick={() => setAdding((all) => all.filter((_, n) => n !== i))}>
                  Take it off<span className="sr-only">: {a.file.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {count(kind) < max && (
          <>
            <label htmlFor={`${id}-${kind}`} className="sr-only">
              {photo ? 'Choose photographs to add' : 'Choose files to add'}
            </label>
            <input
              id={`${id}-${kind}`}
              type="file"
              multiple
              accept={photo ? PHOTO_TYPES.join(',') : Object.keys(FILE_TYPES).join(',')}
              aria-describedby={`${id}-${kind}-hint`}
              // Cleared after each choice, so the same file can be picked again after being taken off.
              onChange={(e) => {
                choose(kind, e.target.files);
                e.target.value = '';
              }}
              className={fileBox}
            />
          </>
        )}
      </fieldset>
    );
  };

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

      {attach('photo')}
      {attach('file')}

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
      <p aria-live="polite" className={progress ? 'font-medium text-navy' : 'sr-only'}>
        {progress}
      </p>

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

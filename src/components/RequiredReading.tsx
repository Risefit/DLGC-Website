'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isPortalPage } from '@/lib/files';
import type { ReadingGroup, ReadingItem } from '@/content/required-reading';
import { requiredKeys, roleLabel, type ReadingRule } from '@/lib/roles';
import { useMyRoles } from '@/lib/my-roles';

/**
 * REQUIRED READING — open it, then tick to say you have read it.
 *
 * The list itself is in src/content/required-reading.ts. This component only
 * shows it and records confirmations.
 *
 *   - The tick box stays greyed out until the member has opened the document
 *     from this page, so a confirmation always follows a look at the document.
 *   - A confirmation is a record. Once given it shows the date and cannot be
 *     un-ticked here; the database refuses changes too.
 *   - It belongs to one version: re-issue a manual and everyone is asked again.
 *   - A member sees only their own confirmations. The portal's controllers see
 *     everybody's, on /admin/reading — the page says so, because a member is
 *     entitled to know who can see the record.
 *
 * THE LIST FOLLOWS THE MEMBER'S ROLES. A manual that goes with a duty (an item
 * with `roles`) is moved up into "For the duties on your profile" for a member
 * who holds one of those roles, and is counted with everybody's. The roles are
 * the member's own, read by src/lib/my-roles.ts; they are ticked on My profile
 * or set by a controller. Everybody else still sees the manual lower down, as
 * reading for a duty they do not do, with a way to My profile.
 *
 * Not signed in, the list still works as a reading list; the tick box is
 * replaced by a link to sign in.
 */

type State = 'loading' | 'signed-out' | 'ready' | 'unavailable';

const TABLE = 'reading_confirmations';

const when = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default function RequiredReading({
  groups,
  rule,
}: {
  groups: ReadingGroup[];
  /** Which documents are asked of everybody and of each duty, for the progress line. */
  rule: ReadingRule;
}) {
  const roles = useMyRoles();
  const [state, setState] = useState<State>('loading');
  const [confirmed, setConfirmed] = useState<Record<string, string>>({});
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setState('signed-out');
      return;
    }
    let live = true;

    async function load() {
      const { data: s } = await supabase!.auth.getSession();
      if (!live) return;
      if (!s.session) {
        setConfirmed({});
        setState('signed-out');
        return;
      }
      const { data, error } = await supabase!.from(TABLE).select('doc_key, confirmed_at');
      if (!live) return;
      if (error) {
        setState('unavailable');
        return;
      }
      setConfirmed(Object.fromEntries((data ?? []).map((r) => [r.doc_key as string, r.confirmed_at as string])));
      setState('ready');
    }

    load();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') load();
    });
    return () => {
      live = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function confirm(item: ReadingItem) {
    const supabase = createClient();
    if (!supabase) return;
    setProblem(null);
    setSaving(item.key);
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ doc_key: item.key, doc_title: item.title, doc_version: item.version ?? null })
      .select('doc_key, confirmed_at')
      .single();
    setSaving(null);
    if (error || !data) {
      setProblem(`That could not be saved for “${item.title}”. Check your connection and tick it again.`);
      return;
    }
    setConfirmed((c) => ({ ...c, [data.doc_key as string]: data.confirmed_at as string }));
    // The count under "My sign-in" follows along.
    window.dispatchEvent(new Event('dlgc:reading-changed'));
  }

  // What this member is asked to confirm: everybody's, and their duties'.
  const mine = useMemo(() => requiredKeys(rule, roles ?? []), [rule, roles]);
  const forDuties = mine.length - rule.everyone.length;
  const doneOfMine = useMemo(() => mine.filter((k) => confirmed[k]).length, [mine, confirmed]);

  // The same groups, with the manuals for this member's duties lifted out into
  // a group of their own, placed straight after the groups that are everybody's.
  const shown = useMemo(() => {
    const held = new Set<string>(roles ?? []);
    const lifted: ReadingItem[] = [];
    const rest: (ReadingGroup & { duties: boolean })[] = [];
    for (const g of groups) {
      const forMe = g.items.filter((i) => i.roles?.some((r) => held.has(r)));
      lifted.push(...forMe);
      const others = g.items.filter((i) => !forMe.includes(i));
      if (others.length > 0) rest.push({ ...g, items: others, duties: others.some((i) => (i.roles?.length ?? 0) > 0) });
    }
    if (lifted.length === 0) return rest;
    const everyone = new Set(rule.everyone);
    const at = rest.findIndex((g) => !g.items.some((i) => everyone.has(i.key)));
    const because = [...held].map(roleLabel).join(', ');
    const own = {
      group: 'For the duties on your profile',
      blurb: `Your profile says: ${because}. These count towards your required reading.`,
      items: lifted,
      duties: true,
    };
    return at === -1 ? [...rest, own] : [...rest.slice(0, at), own, ...rest.slice(at)];
  }, [groups, roles, rule]);

  return (
    <div>
      {state === 'ready' && roles !== null && (
        <p className="mb-6 text-inkMuted" aria-live="polite">
          {doneOfMine === mine.length ? (
            <>
              <strong className="text-good">You have confirmed all {mine.length}</strong> that apply to{' '}
              {forDuties > 0 ? 'you' : 'every member'}.
            </>
          ) : (
            <>
              You have confirmed <strong className="text-navy">{doneOfMine} of the {mine.length}</strong>{' '}
              that apply to {forDuties > 0 ? 'you' : 'every member'}. Open each one, then tick it.
            </>
          )}
          {forDuties > 0 && (
            <>
              {' '}
              That is the {rule.everyone.length} for every member and {forDuties} for the duties on your profile.
            </>
          )}
        </p>
      )}
      {state === 'signed-out' && (
        <p className="mb-6 text-inkMuted">
          <Link href="/login" className="link">Sign in to the portal</Link> to confirm what you have read.
        </p>
      )}
      {state === 'unavailable' && (
        <p className="mb-6 text-inkMuted">
          Confirmations cannot be recorded at the moment. The documents below still open as normal.
        </p>
      )}
      {problem && (
        <p role="alert" className="mb-6 rounded-card border-l-4 border-bad bg-badTint px-4 py-3 text-sm text-bad">
          {problem}
        </p>
      )}

      <div className="space-y-9">
        {shown.map((g) => (
          <section key={g.group} aria-label={g.group}>
            <h3 className="text-xl">{g.group}</h3>
            <p className="mb-3 mt-0.5 text-sm text-inkMuted">
              {g.blurb}
              {g.duties && state !== 'signed-out' && (
                <>
                  {' '}
                  <Link href="/account/profile#duties" className="link">
                    {g.group === 'For the duties on your profile'
                      ? 'Change the duties on my profile'
                      : 'Tick the duties you do on My profile'}
                  </Link>
                  {g.group === 'For the duties on your profile' ? '.' : ' and their manuals join your list.'}
                </>
              )}
            </p>
            <ul className="card divide-y divide-skyLine overflow-hidden">
              {g.items.map((item) => {
                const isPage = isPortalPage(item.href);
                const date = confirmed[item.key];
                const canTick = opened.has(item.key);
                const boxId = `read-${item.key.replace(/[^a-z0-9]+/gi, '-')}`;
                return (
                  <li key={item.key} className="grid gap-x-6 gap-y-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                    <div className="min-w-0">
                      <p className="font-semibold text-navy">
                        {item.title}
                        {item.version && <span className="ml-2 text-sm font-normal text-slate2">{item.version}</span>}
                      </p>
                      <p className="mt-0.5 max-w-prose2 text-sm text-inkMuted">
                        {item.who && <strong className="font-semibold text-ink">{item.who}. </strong>}
                        {item.why}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      {/* Always a new tab, so this list is still here to tick when they come back. */}
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpened((o) => new Set(o).add(item.key))}
                        className="pill-line"
                      >
                        {isPage ? 'Open the page' : 'Open the document'}
                        <span className="sr-only">
                          : {item.title} (opens in a new tab)
                        </span>
                      </a>

                      {date ? (
                        <p className="tap gap-2 text-sm font-semibold text-good">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M7.5 12.5l3 3 6-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>
                            Read and confirmed
                            <span className="block text-xs font-normal text-inkMuted">{when(date)}</span>
                          </span>
                        </p>
                      ) : state === 'ready' ? (
                        <div>
                          <label
                            htmlFor={boxId}
                            className={`tap gap-3 text-sm font-medium ${canTick ? 'cursor-pointer text-navy' : 'text-slate2'}`}
                          >
                            <input
                              id={boxId}
                              type="checkbox"
                              checked={false}
                              disabled={!canTick || saving === item.key}
                              onChange={() => confirm(item)}
                              aria-describedby={canTick ? undefined : `${boxId}-hint`}
                              className="h-6 w-6 rounded border-2 border-skyLine text-good focus:ring-good disabled:opacity-50"
                            />
                            {saving === item.key ? 'Saving…' : 'I have read this'}
                          </label>
                          {!canTick && (
                            <p id={`${boxId}-hint`} className="text-xs text-slate2">
                              Open it first
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

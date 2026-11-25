'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { saveMyProfile } from '@/app/(portal)/account/profile/actions';
import { ROLES, TEAMS, TEAM_NAMES, type RoleId } from '@/lib/roles';
import { ROLES_CHANGED } from '@/lib/my-roles';

/**
 * MY PROFILE, as the member fills it in. One form, one Save button.
 *
 *   - The duties I do: nine tick boxes in the club's three duty teams. Ticking
 *     one adds that duty's manuals to the member's required reading, and the
 *     count in the menu and on the dashboard follows as soon as it is saved
 *     (the form tells the rest of the page with a `dlgc:roles-changed` event).
 *   - In an emergency: who to ring, next of kin if that is somebody else.
 *   - For a first-aider: the member's own mobile, blood type, anything to know.
 *
 * Everything is optional. What is typed goes to the portal's own server and
 * nowhere else; this component never talks to the database itself.
 *
 * Blood type is a list, with the sign written out in words as well, so it is
 * never told apart by a "+" or "−" alone.
 */

type Fields = {
  mobile: string;
  contactName: string;
  contactRelationship: string;
  contactPhone: string;
  contactPhone2: string;
  kinName: string;
  kinRelationship: string;
  kinPhone: string;
  bloodType: string;
  medical: string;
};

const BLOOD: [string, string][] = [
  ['A+', 'A positive (A+)'],
  ['A-', 'A negative (A−)'],
  ['B+', 'B positive (B+)'],
  ['B-', 'B negative (B−)'],
  ['AB+', 'AB positive (AB+)'],
  ['AB-', 'AB negative (AB−)'],
  ['O+', 'O positive (O+)'],
  ['O-', 'O negative (O−)'],
];

const box = 'w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3 text-ink focus:border-sky focus:outline-none';
const label = 'mb-1.5 block font-medium text-navy';
const hint = 'mt-1.5 text-sm text-slate2';

export default function ProfileForm({
  name,
  email,
  roles: rolesAtStart,
  profile,
}: {
  name: string;
  email: string;
  roles: RoleId[];
  profile: Fields;
}) {
  const [roles, setRoles] = useState<RoleId[]>(rolesAtStart);
  const [f, setF] = useState<Fields>(profile);
  const [pending, startTransition] = useTransition();
  const [said, setSaid] = useState<{ ok: boolean; message: string } | null>(null);

  const set = (key: keyof Fields) => (e: { target: { value: string } }) => {
    setF((was) => ({ ...was, [key]: e.target.value }));
    setSaid(null);
  };
  const toggle = (id: RoleId) => {
    setRoles((was) => (was.includes(id) ? was.filter((r) => r !== id) : [...was, id]));
    setSaid(null);
  };

  function save(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      let r;
      try {
        r = await saveMyProfile({ roles, profile: f });
      } catch {
        r = { ok: false as const, message: 'That did not go through. Check your connection and save again.' };
      }
      setSaid({ ok: r.ok, message: r.message });
      if (r.ok) {
        setRoles(r.roles);
        // The count of required reading in the menu follows the new duties.
        window.dispatchEvent(new Event(ROLES_CHANGED));
      }
      document.getElementById('profile-result')?.scrollIntoView({ block: 'center' });
    });
  }

  const text = (id: string, key: keyof Fields, title: string, opts: { type?: string; auto?: string; max: number; hint?: string }) => (
    <div>
      <label htmlFor={id} className={label}>
        {title}
      </label>
      <input
        id={id}
        type={opts.type ?? 'text'}
        inputMode={opts.type === 'tel' ? 'tel' : undefined}
        autoComplete={opts.auto ?? 'off'}
        maxLength={opts.max}
        value={f[key]}
        onChange={set(key)}
        aria-describedby={opts.hint ? `${id}-hint` : undefined}
        className={box}
      />
      {opts.hint && (
        <p id={`${id}-hint`} className={hint}>
          {opts.hint}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={save} className="max-w-3xl space-y-10" noValidate>
      <p className="text-inkMuted">
        Signed in as <strong className="text-navy">{name || 'a member'}</strong>
        {email && (
          <>
            {' '}
            (<span className="break-all">{email}</span>)
          </>
        )}
        . Everything on this page is optional.
      </p>

      {/* ── The duties I do ─────────────────────────────────────────────── */}
      <section id="duties" aria-labelledby="duties-h" className="scroll-mt-6">
        <h2 id="duties-h" className="display text-2xl lg:text-3xl">
          The duties I do
        </h2>
        <p className="mb-4 mt-1 max-w-prose2 text-inkMuted">
          Tick every duty you do or are training for. Each one adds that duty’s manuals to{' '}
          <Link href="/documents#required-reading" className="link">
            your required reading
          </Link>
          . A portal controller can set these for you as well. Ticking a duty here does not clear you to do it; the
          CFI and the duty’s own lead decide that.
        </p>
        <div className="card grid gap-x-8 gap-y-5 p-5 sm:grid-cols-3">
          {TEAMS.map((team) => (
            <fieldset key={team}>
              <legend className="mb-1 font-semibold text-navy">{TEAM_NAMES[team]}</legend>
              {ROLES.filter((r) => r.team === team).map((r) => (
                <label key={r.id} htmlFor={`role-${r.id}`} className="tap w-full cursor-pointer gap-3 text-ink">
                  <input
                    id={`role-${r.id}`}
                    type="checkbox"
                    checked={roles.includes(r.id)}
                    onChange={() => toggle(r.id)}
                    className="h-6 w-6 shrink-0 rounded border-2 border-skyLine text-navy focus:ring-sky"
                  />
                  {r.label}
                </label>
              ))}
            </fieldset>
          ))}
        </div>
      </section>

      {/* ── In an emergency ─────────────────────────────────────────────── */}
      <section aria-labelledby="emergency-h">
        <h2 id="emergency-h" className="display text-2xl lg:text-3xl">
          If something happens to me
        </h2>
        <p className="mb-4 mt-1 max-w-prose2 text-inkMuted">
          Who the club should ring. Tell them you have given their name and number.
        </p>
        <div className="card space-y-6 p-5">
          <fieldset>
            <legend className="mb-3 font-semibold text-navy">Emergency contact: the person to ring first</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {text('contact-name', 'contactName', 'Their name', { max: 120 })}
              {text('contact-relationship', 'contactRelationship', 'Who they are to you', {
                max: 60,
                hint: 'For example: wife, son, friend.',
              })}
              {text('contact-phone', 'contactPhone', 'Their telephone number', { type: 'tel', max: 40 })}
              {text('contact-phone2', 'contactPhone2', 'Another number for them, if they have one', { type: 'tel', max: 40 })}
            </div>
          </fieldset>
          <fieldset className="border-t border-skyLine pt-5">
            <legend className="mb-1 font-semibold text-navy">Next of kin</legend>
            <p className="mb-3 text-sm text-inkMuted">Only if that is somebody other than your emergency contact.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {text('kin-name', 'kinName', 'Their name', { max: 120 })}
              {text('kin-relationship', 'kinRelationship', 'Who they are to you', { max: 60 })}
              {text('kin-phone', 'kinPhone', 'Their telephone number', { type: 'tel', max: 40 })}
            </div>
          </fieldset>
        </div>
      </section>

      {/* ── For a first-aider ───────────────────────────────────────────── */}
      <section aria-labelledby="medical-h">
        <h2 id="medical-h" className="display text-2xl lg:text-3xl">
          For a first-aider or an ambulance crew
        </h2>
        <p className="mb-4 mt-1 max-w-prose2 text-inkMuted">
          Only what you would want them to know on the airfield. Leave any of it empty.
        </p>
        <div className="card space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {text('my-mobile', 'mobile', 'My mobile number', { type: 'tel', auto: 'tel', max: 40 })}
            <div>
              <label htmlFor="blood-type" className={label}>
                My blood type
              </label>
              <select id="blood-type" value={f.bloodType} onChange={set('bloodType')} className={box}>
                <option value="">Not given, or I do not know</option>
                {BLOOD.map(([value, words]) => (
                  <option key={value} value={value}>
                    {words}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="medical" className={label}>
              Anything they should know
            </label>
            <textarea
              id="medical"
              rows={4}
              maxLength={1000}
              value={f.medical}
              onChange={set('medical')}
              aria-describedby="medical-hint"
              className={box}
            />
            <p id="medical-hint" className={hint}>
              For example: an allergy, a condition such as diabetes or epilepsy, medication you carry and where you keep
              it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Who can see this ────────────────────────────────────────────── */}
      <section aria-labelledby="who-h">
        <h2 id="who-h" className="text-xl">
          Who can see this
        </h2>
        <ul className="mt-2 max-w-prose2 list-disc space-y-1.5 pl-5 text-ink">
          <li>
            <strong>Your duties</strong> are seen by the portal’s controllers, beside your name on their members list.
          </li>
          <li>
            <strong>Your emergency details</strong> are seen by you, and by a portal controller who opens them for you
            by name. Each time one does, the portal notes who and when. No other member can see them.
          </li>
          <li>To remove something, clear the box and save. Clear them all and the record is deleted.</li>
          <li>
            This is separate from Free Flight. Nothing here comes from it or changes it; keep your details there up to
            date as well.
          </li>
        </ul>
      </section>

      <div>
        <div id="profile-result" aria-live="polite" className="scroll-mt-6">
          {said && (
            <p
              role={said.ok ? 'status' : 'alert'}
              className={`mb-4 max-w-prose2 rounded-card border-l-4 px-5 py-4 ${
                said.ok ? 'border-good bg-goodTint text-ink' : 'border-bad bg-badTint text-bad'
              }`}
            >
              {said.message}{' '}
              {said.ok && (
                <Link href="/documents#required-reading" className="link">
                  Open my required reading
                </Link>
              )}
            </p>
          )}
        </div>
        <button type="submit" className="pill-solid disabled:opacity-60" disabled={pending}>
          {pending ? 'Saving…' : 'Save my profile'}
        </button>
      </div>
    </form>
  );
}

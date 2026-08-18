'use client';

import { useState } from 'react';

/**
 * SAFETY OCCURRENCE REPORT.
 *
 * Two things make or break a club reporting form, and both are design decisions
 * rather than details:
 *
 *  1. ANONYMOUS MUST BE A REAL OPTION, and it must be the same form. If a
 *     member has to hunt for a different route to report without their name on
 *     it, they will not report. Choosing anonymous removes the name and email
 *     fields entirely — nothing is collected that could identify the reporter.
 *  2. NO BLAME LANGUAGE. The wording asks what happened, not who erred. The
 *     club's Safety Lessons Log exists because people were willing to say "I got
 *     this wrong" — protect that.
 *
 * The severity grid is the standard aviation risk matrix: likelihood against
 * consequence. It is a prompt for thinking, not a verdict — the Safety Officer
 * decides the real classification.
 */

const LIKELIHOOD = [
  { key: 'frequent', label: 'Frequent', hint: 'Likely to happen often' },
  { key: 'occasional', label: 'Occasional', hint: 'Likely sometimes' },
  { key: 'remote', label: 'Remote', hint: 'Unlikely, but possible' },
  { key: 'improbable', label: 'Improbable', hint: 'Very unlikely' },
];

const CONSEQUENCE = [
  { key: 'negligible', label: 'Negligible', hint: 'Little or no effect' },
  { key: 'minor', label: 'Minor', hint: 'Nuisance, minor damage' },
  { key: 'major', label: 'Major', hint: 'Serious incident or injury' },
  { key: 'catastrophic', label: 'Catastrophic', hint: 'Loss of aircraft or life' },
];

/** Row = likelihood index, column = consequence index. */
const RISK: ('low' | 'medium' | 'high' | 'extreme')[][] = [
  ['medium', 'high', 'extreme', 'extreme'],
  ['low', 'medium', 'high', 'extreme'],
  ['low', 'low', 'medium', 'high'],
  ['low', 'low', 'low', 'medium'],
];

const RISK_STYLE: Record<string, string> = {
  low: 'bg-goodTint text-good hover:bg-good hover:text-white',
  medium: 'bg-warnTint text-warn hover:bg-warn hover:text-white',
  high: 'bg-badTint text-bad hover:bg-bad hover:text-white',
  extreme: 'bg-bad/25 text-bad hover:bg-bad hover:text-white',
};

const WHERE = [
  'In flight',
  'Launching — winch or cable',
  'Landing or circuit',
  'On the airfield',
  'Hangar or trailer park',
  'Clubhouse or grounds',
  'Vehicle or ground equipment',
  'Car park or access road',
  'Something else',
];

export default function SafetyReportForm({
  safetyOfficerEmail,
  safetyOfficerName,
}: {
  safetyOfficerEmail: string;
  safetyOfficerName?: string;
}) {
  const [anonymous, setAnonymous] = useState(false);
  const [risk, setRisk] = useState<{ l: number; c: number } | null>(null);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState('sending');
    setMessage('');
    try {
      const data = new FormData(form);
      data.set('kind', 'safety');
      data.set('anonymous', anonymous ? 'yes' : 'no');
      if (anonymous) {
        data.delete('name');
        data.delete('email');
      }
      if (risk) {
        data.set('likelihood', LIKELIHOOD[risk.l].label);
        data.set('consequence', CONSEQUENCE[risk.c].label);
        data.set('riskLevel', RISK[risk.l][risk.c]);
      }
      const res = await fetch('/api/submit', { method: 'POST', body: data });
      const json = await res.json();
      if (res.ok && json.ok) {
        setState('sent');
        setMessage(json.message);
        form.reset();
        setRisk(null);
      } else {
        setState('error');
        setMessage(json.message ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setState('error');
      setMessage('Could not reach the server. Please check your connection and try again.');
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-card border-2 border-good bg-goodTint p-6">
        <h3 className="text-lg text-good">Report sent</h3>
        <p className="mt-1 text-sm">{message}</p>
        <p className="mt-2 text-sm text-slate2">
          Thank you. Reports like this are why the Safety Lessons Log exists.
        </p>
        <button type="button" onClick={() => setState('idle')} className="link tap mt-3 text-sm">
          Report something else
        </button>
      </div>
    );
  }

  const field =
    'w-full rounded-lg border-2 border-good/40 bg-white px-4 py-3.5 placeholder:text-slate2/70 focus:border-good focus:outline-none';
  const label = 'mb-1.5 block text-sm font-medium text-navy';

  return (
    <form
      onSubmit={onSubmit}
      id="report-an-occurrence"
      className="overflow-hidden rounded-card border-2 border-good/60 bg-goodTint/40 shadow-card"
    >
      <div className="border-b-2 border-good/40 bg-good/10 px-6 py-4">
        <h2 className="text-2xl text-good">Report a safety occurrence</h2>
        <p className="mt-1 max-w-prose2 text-sm text-ink/80">
          Anything that did go wrong, or nearly did. Near misses are the most useful reports we
          get — nobody has to be hurt for it to be worth telling us.
        </p>
        <p className="mt-2 text-sm text-ink/70">
          Goes to {safetyOfficerName ? `${safetyOfficerName}, ` : ''}the Safety Officer
          {' '}(<a href={`mailto:${safetyOfficerEmail}`} className="link">{safetyOfficerEmail}</a>).
          Not published, and not seen by the website editor.
        </p>
      </div>

      <div className="px-6 py-6">
        {/* Who — or nobody */}
        <fieldset className="mb-6 min-w-0">
          <legend className="mb-2 text-sm font-medium text-navy">Do you want your name on it?</legend>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setAnonymous(false)}
              aria-pressed={!anonymous}
              className={`tap rounded-lg border-2 px-5 py-3 text-sm font-medium transition-colors ${
                !anonymous ? 'border-good bg-good text-white' : 'border-good/40 bg-white text-navy hover:border-good'
              }`}
            >
              Give my name
            </button>
            <button
              type="button"
              onClick={() => setAnonymous(true)}
              aria-pressed={anonymous}
              className={`tap rounded-lg border-2 px-5 py-3 text-sm font-medium transition-colors ${
                anonymous ? 'border-good bg-good text-white' : 'border-good/40 bg-white text-navy hover:border-good'
              }`}
            >
              Report anonymously
            </button>
          </div>
          <p className="mt-2 max-w-prose2 text-xs text-slate2">
            {anonymous
              ? 'Nothing identifying you is collected or sent. The Safety Officer will not be able to ask you follow-up questions, so please put anything relevant in the report itself.'
              : 'Your name and email go to the Safety Officer only, so they can ask you follow-up questions. They are not published.'}
          </p>
        </fieldset>

        {!anonymous && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sr-name" className={label}>Your name</label>
              <input id="sr-name" name="name" required autoComplete="name" className={field} />
            </div>
            <div>
              <label htmlFor="sr-email" className={label}>Your email</label>
              <input id="sr-email" name="email" type="email" required autoComplete="email" className={field} />
            </div>
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sr-title" className={label}>What happened, in a few words</label>
            <input
              id="sr-title"
              name="title"
              required
              placeholder="e.g. Cable caught on the fence during retrieve"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="sr-when" className={label}>When</label>
            <input id="sr-when" name="occurredOn" type="date" className={field} />
          </div>
        </div>

        {/* Where */}
        <fieldset className="mb-6 min-w-0">
          <legend className={label}>Where did it happen? Tick all that apply.</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {WHERE.map((w) => (
              <label
                key={w}
                className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-good/30 bg-white px-4 py-3 text-sm transition-colors hover:border-good"
              >
                <input type="checkbox" name="where" value={w} className="h-5 w-5 accent-[#1E7F4F]" />
                <span>{w}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Risk matrix */}
        {/* min-w-0: a fieldset defaults to min-width:min-content, so without this
            the wide matrix pushes the whole page sideways instead of scrolling
            inside its own container (CLAUDE.md rule 2). */}
        <fieldset className="mb-6 min-w-0">
          <legend className={label}>How serious do you think it was?</legend>
          <p className="mb-3 max-w-prose2 text-xs text-slate2">
            Pick the square where your view of how likely it is to happen again meets how bad it
            could have been. It is a prompt, not a verdict — the Safety Officer decides the real
            classification. Skip it if you would rather not guess.
          </p>
          {/* On a phone a 4×4 grid of buttons is unusable and a sideways-scrolling
              table is worse. Two selects say exactly the same thing. */}
          <div className="grid gap-4 sm:hidden">
            <div>
              <label htmlFor="sr-likelihood" className={label}>How likely is it to happen again?</label>
              <select
                id="sr-likelihood"
                value={risk ? String(risk.l) : ''}
                onChange={(e) =>
                  setRisk(e.target.value === '' ? null : { l: Number(e.target.value), c: risk?.c ?? 0 })
                }
                className={field}
              >
                <option value="">Not sure — skip this</option>
                {LIKELIHOOD.map((l, i) => (
                  <option key={l.key} value={i}>{l.label} — {l.hint}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sr-consequence" className={label}>How bad could it have been?</label>
              <select
                id="sr-consequence"
                value={risk ? String(risk.c) : ''}
                onChange={(e) =>
                  setRisk(e.target.value === '' ? null : { l: risk?.l ?? 0, c: Number(e.target.value) })
                }
                className={field}
              >
                <option value="">Not sure — skip this</option>
                {CONSEQUENCE.map((c, i) => (
                  <option key={c.key} value={i}>{c.label} — {c.hint}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden w-full overflow-x-auto sm:block">
            <table className="w-full border-separate border-spacing-1 text-sm">
              <caption className="sr-only">
                Risk matrix: rows are how likely, columns are how bad the consequence could be
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-32 text-left text-xs font-medium text-slate2">
                    Likelihood ↓ / consequence →
                  </th>
                  {CONSEQUENCE.map((c) => (
                    <th key={c.key} scope="col" className="px-1 pb-1 text-center text-xs font-semibold text-navy">
                      {c.label}
                      <span className="block font-normal text-slate2">{c.hint}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LIKELIHOOD.map((l, li) => (
                  <tr key={l.key}>
                    <th scope="row" className="pr-2 text-left text-xs font-semibold text-navy">
                      {l.label}
                      <span className="block font-normal text-slate2">{l.hint}</span>
                    </th>
                    {CONSEQUENCE.map((c, ci) => {
                      const level = RISK[li][ci];
                      const chosen = risk?.l === li && risk?.c === ci;
                      return (
                        <td key={c.key} className="p-0">
                          <button
                            type="button"
                            onClick={() => setRisk(chosen ? null : { l: li, c: ci })}
                            aria-pressed={chosen}
                            className={`w-full rounded-md px-2 py-3 text-xs font-semibold capitalize transition-colors ${
                              chosen ? 'bg-navy text-white ring-2 ring-navy' : RISK_STYLE[level]
                            }`}
                          >
                            {level}
                            <span className="sr-only">
                              {' '}— {l.label} likelihood, {c.label} consequence
                            </span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm" aria-live="polite">
            {risk ? (
              <span className="font-medium text-navy">
                Selected: {LIKELIHOOD[risk.l].label} likelihood, {CONSEQUENCE[risk.c].label}{' '}
                consequence — <span className="capitalize">{RISK[risk.l][risk.c]}</span> risk.
              </span>
            ) : (
              <span className="text-slate2">Nothing selected — that is fine.</span>
            )}
          </p>
        </fieldset>

        <div className="mb-6">
          <label htmlFor="sr-body" className={label}>What happened</label>
          <textarea
            id="sr-body"
            name="body"
            rows={8}
            required
            placeholder="What led up to it, what happened, and what you think would stop it happening again. Plain words are fine — this is not a form to be good at."
            className={field}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="sr-image" className={label}>
            Photograph <span className="font-normal text-slate2">(optional)</span>
          </label>
          <input
            id="sr-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full rounded-lg border-2 border-dashed border-good/40 bg-white px-4 py-3.5 file:mr-4 file:rounded-md file:border-0 file:bg-goodTint file:px-4 file:py-2 file:font-medium file:text-good"
          />
          <p className="mt-1 text-xs text-slate2">
            Damage, the spot on the field, the cable — whatever helps. Up to 8 MB.
          </p>
        </div>

        {state === 'error' && (
          <div className="mb-4 rounded-lg border-l-4 border-bad bg-badTint p-4 text-sm">
            <p>{message}</p>
            <p className="mt-1">
              Please do not let the form stop the report —{' '}
              <a href={`mailto:${safetyOfficerEmail}`} className="link">
                email the Safety Officer
              </a>{' '}
              instead.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={state === 'sending'}
          className="tap rounded-lg bg-good px-6 py-3.5 font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-60"
        >
          {state === 'sending' ? 'Sending…' : 'Send to the Safety Officer'}
        </button>
        <p className="mt-3 max-w-prose2 text-xs text-slate2">
          This goes to the Safety Officer. It is not published. If it needs to become a Safety
          Lessons Log entry, they will write it up with identifying detail removed.
        </p>
      </div>
    </form>
  );
}

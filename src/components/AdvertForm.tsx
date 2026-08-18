'use client';

import { useState } from 'react';
import { advertKinds } from '@/content/adverts';

/**
 * Place an advert. Same gate as the blog and the gallery: it goes to the
 * website editor as a pending row, and nothing appears on the page until a
 * person has read it.
 *
 * The contact fields are deliberately opt-in per field. A member may want their
 * mobile on the page, or may prefer everything to come via the editor — CLAUDE
 * rule 6 says personal data goes in only when someone chooses to put it there.
 */
export default function AdvertForm({ editorEmail }: { editorEmail: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState('sending');
    setMessage('');
    try {
      const data = new FormData(form);
      data.set('kind', 'advert');
      const res = await fetch('/api/submit', { method: 'POST', body: data });
      const json = await res.json();
      if (res.ok && json.ok) {
        setState('sent');
        setMessage(json.message);
        form.reset();
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
      <div className="rounded-card border-l-4 border-good bg-goodTint p-6">
        <h3 className="text-lg text-good">Sent to the editor</h3>
        <p className="mt-1 text-sm">{message}</p>
        <button type="button" onClick={() => setState('idle')} className="link tap mt-3 text-sm">
          Place another advert
        </button>
      </div>
    );
  }

  const field =
    'w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3.5 placeholder:text-slate2/70 focus:border-sky focus:outline-none';
  const label = 'mb-1.5 block text-sm font-medium text-navy';

  return (
    <form onSubmit={onSubmit} id="place-an-advert" className="card p-6">
      <h3 className="text-xl">Place an advert</h3>
      <p className="mt-1 max-w-prose2 text-sm text-inkMuted">
        Selling, wanting, giving away or announcing something. It goes to the website editor, who
        will put it on this page.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ad-name" className={label}>Your name</label>
          <input id="ad-name" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="ad-email" className={label}>Your email</label>
          <input id="ad-email" name="email" type="email" required autoComplete="email" className={field} />
          <p className="mt-1 text-xs text-slate2">So the editor can come back to you.</p>
        </div>

        <div>
          <label htmlFor="ad-kind" className={label}>What kind of advert</label>
          <select id="ad-kind" name="advertKind" className={field} defaultValue="For sale">
            {advertKinds.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ad-price" className={label}>
            Price <span className="font-normal text-inkMuted">(leave blank if not selling)</span>
          </label>
          <input id="ad-price" name="price" placeholder="e.g. £25, or offers" className={field} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="ad-title" className={label}>What is it</label>
          <input id="ad-title" name="title" required placeholder="e.g. Glider Guider" className={field} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="ad-body" className={label}>Details</label>
          <textarea
            id="ad-body"
            name="body"
            rows={5}
            required
            placeholder="Condition, what it comes with, anything a buyer would want to know."
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="ad-image" className={label}>
            Photograph <span className="font-normal text-inkMuted">(optional, but it helps)</span>
          </label>
          <input
            id="ad-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full rounded-lg border-2 border-dashed border-skyLine bg-white px-4 py-3.5 file:mr-4 file:rounded-md file:border-0 file:bg-skyTint file:px-4 file:py-2 file:font-medium file:text-navy"
          />
          <p className="mt-1 text-xs text-slate2">JPG, PNG or WEBP, up to 8 MB.</p>
        </div>

        <fieldset className="min-w-0 sm:col-span-2 rounded-lg border-2 border-skyLine p-4">
          <legend className="px-2 text-sm font-medium text-navy">How buyers should reach you</legend>
          <p className="mb-3 text-xs text-slate2">
            Anything you put here is published on the page. Leave both blank and the editor will
            pass enquiries on to you instead.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ad-phone" className={label}>Phone to publish</label>
              <input id="ad-phone" name="contactPhone" className={field} />
            </div>
            <div>
              <label htmlFor="ad-pubemail" className={label}>Email to publish</label>
              <input id="ad-pubemail" name="contactEmail" type="email" className={field} />
            </div>
          </div>
        </fieldset>
      </div>

      {state === 'error' && (
        <div className="mt-4 rounded-lg border-l-4 border-bad bg-badTint p-4 text-sm">
          <p>{message}</p>
          <p className="mt-1">
            You can always email{' '}
            <a href={`mailto:${editorEmail}`} className="link">the website editor</a> instead.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="tap mt-5 rounded-lg bg-sky px-6 py-3.5 font-semibold text-white transition-colors hover:bg-skyDark disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending…' : 'Send to the editor'}
      </button>
    </form>
  );
}

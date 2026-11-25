'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Member submission form — used for both flying blog stories and gallery
 * photographs. Nothing publishes automatically; everything goes to the
 * portal's controllers, who approve it on /admin/submissions.
 */
export default function SubmitForm({
  kind,
  heading,
  intro,
  bodyLabel,
  bodyPlaceholder,
  imageRequired = false,
  editorEmail,
}: {
  kind: 'blog' | 'photo';
  heading: string;
  intro: string;
  bodyLabel: string;
  bodyPlaceholder: string;
  imageRequired?: boolean;
  editorEmail: string;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState('sending');
    setMessage('');

    try {
      const data = new FormData(form);
      data.set('kind', kind);

      // A photograph goes straight to the private store, not through the
      // portal: one off a phone is bigger than the portal's host will take in
      // a single request. The form then only says where it is.
      const picture = data.get('image');
      if (picture instanceof File && picture.size > 0) {
        if (picture.size > 15 * 1024 * 1024) {
          setState('error');
          setMessage('That photograph is over 15 MB. Please send a smaller version.');
          return;
        }
        const ticket = await fetch('/api/submit/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kind, name: picture.name, type: picture.type, size: picture.size }),
        }).then((r) => r.json());
        const supabase = createClient();
        if (!ticket?.ok || !supabase) {
          setState('error');
          setMessage(ticket?.message ?? 'The photograph could not be uploaded. Please try again.');
          return;
        }
        const { error } = await supabase.storage
          .from('submissions')
          .uploadToSignedUrl(ticket.path, ticket.token, picture, { contentType: picture.type });
        if (error) {
          setState('error');
          setMessage('The photograph could not be uploaded. Check your connection and try again — what you wrote is still here.');
          return;
        }
        data.delete('image');
        data.set('imagePath', ticket.path);
      } else {
        data.delete('image');
      }

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
        <h3 className="text-lg text-good">Sent</h3>
        <p className="mt-1 text-sm">{message}</p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="link tap mt-3 text-sm"
        >
          Send another
        </button>
      </div>
    );
  }

  const field =
    'w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3.5 placeholder:text-slate2/70 focus:border-sky focus:outline-none';

  return (
    <form onSubmit={onSubmit} className="card p-6">
      <h3 className="text-xl">{heading}</h3>
      <p className="mt-1 max-w-prose2 text-sm text-inkMuted">{intro}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${kind}-name`} className="mb-1.5 block font-medium text-navy">
            Your name
          </label>
          <input id={`${kind}-name`} name="name" required className={field} autoComplete="name" />
        </div>
        <div>
          <label htmlFor={`${kind}-email`} className="mb-1.5 block font-medium text-navy">
            Your email
          </label>
          <input
            id={`${kind}-email`}
            name="email"
            type="email"
            required
            className={field}
            autoComplete="email"
          />
          <p className="mt-1 text-xs text-slate2">So a controller can come back to you. It is not shown on the site.</p>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={`${kind}-title`} className="mb-1.5 block font-medium text-navy">
          Title <span className="font-normal text-inkMuted">(optional)</span>
        </label>
        <input
          id={`${kind}-title`}
          name="title"
          className={field}
          placeholder={kind === 'blog' ? 'e.g. Wave day, 29 November' : 'e.g. K13 over Win Hill'}
        />
      </div>

      <div className="mt-4">
        <label htmlFor={`${kind}-body`} className="mb-1.5 block font-medium text-navy">
          {bodyLabel}
        </label>
        <textarea
          id={`${kind}-body`}
          name="body"
          rows={kind === 'blog' ? 9 : 3}
          required={kind === 'blog'}
          className={`${field} resize-y`}
          placeholder={bodyPlaceholder}
        />
        {kind === 'blog' && (
          <p className="mt-1 text-xs text-slate2">
            Any length is fine — most contributors write the story of the day in 200 words or so.
            It may also be used on the club&rsquo;s public website, so bear that in mind.
          </p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor={`${kind}-image`} className="mb-1.5 block font-medium text-navy">
          {imageRequired ? 'Photograph' : 'Add a photograph'}{' '}
          {!imageRequired && <span className="font-normal text-inkMuted">(optional)</span>}
        </label>
        <input
          id={`${kind}-image`}
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required={imageRequired}
          className="w-full rounded-lg border-2 border-dashed border-skyLine bg-cloud px-4 py-3.5
                     file:mr-4 file:rounded-lg file:border-0 file:bg-sky file:px-4 file:py-2
                     file:font-medium file:text-white hover:file:bg-skyDark"
        />
        <p className="mt-1 text-xs text-slate2">JPG, PNG, WEBP or GIF, up to 15 MB. Straight off a phone is fine.</p>
      </div>

      {state === 'error' && (
        <p role="alert" className="mt-4 rounded-lg border-l-4 border-bad bg-badTint p-4 text-sm text-bad">
          {message}{' '}
          <a href={`mailto:${editorEmail}`} className="link">
            Email the editor instead
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="tap mt-6 w-full justify-center rounded-lg bg-sky px-6 py-4 text-lg font-semibold
                   text-white hover:bg-skyDark disabled:opacity-60 transition-colors sm:w-auto"
      >
        {state === 'sending' ? 'Sending…' : 'Send it in'}
      </button>

      <p className="mt-3 text-xs text-slate2">
        Nothing is published automatically — one of the portal’s controllers reads everything first.
      </p>
    </form>
  );
}

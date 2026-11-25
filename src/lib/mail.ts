/**
 * EMAIL FROM THE PORTAL — one place that talks to Resend.
 *
 * Runs on the server only. Needs two settings in Vercel:
 *   RESEND_API_KEY   the club's Resend key (never in this repository)
 *   MAIL_FROM        the sender, e.g. "DLGC Members Portal <noreply@…>", on a
 *                    domain Resend has verified
 *
 * Until both exist, `mailReady()` is false and nothing here sends anything;
 * the pages that use it say so and offer the by-hand way instead.
 *
 * WHAT RESEND ALLOWS (checked 25 November 2026). The free plan sends 100
 * emails a day and 3,000 a month, counted from midnight GMT (UTC). When the day's
 * allowance is used up Resend answers 429 "daily_quota_exceeded", and
 * `sendMail` reports `quota: true` so the caller can stop cleanly and say
 * "carry on tomorrow" rather than fail one person at a time.
 *
 * Nothing here writes an address, a name or the text of an email to a log.
 */

import { contacts } from '@/content/site';

export const mailReady = () => Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);

export type Sent =
  | { ok: true }
  | { ok: false; reason: string; /** the day's or month's allowance is used up */ quota: boolean };

export async function sendMail(mail: { to: string; subject: string; text: string }): Promise<Sent> {
  if (typeof window !== 'undefined') throw new Error('sendMail() must never run in the browser');
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const from = (process.env.MAIL_FROM || '').trim();
  if (!apiKey || !from) return { ok: false, reason: 'Email sending is not set up.', quota: false };

  // One retry, and only for "slow down" — never for a refusal.
  for (let attempt = 0; attempt < 2; attempt++) {
    let res: Response;
    try {
      res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [mail.to], subject: mail.subject, text: mail.text }),
      });
    } catch {
      return { ok: false, reason: 'The email service could not be reached.', quota: false };
    }
    if (res.ok) return { ok: true };

    let name = '';
    let message = '';
    try {
      const said = (await res.json()) as { name?: string; message?: string };
      name = said.name ?? '';
      message = said.message ?? '';
    } catch {
      // No explanation given; the status will have to do.
    }

    if (res.status === 429 && /quota/.test(name)) {
      return {
        ok: false,
        quota: true,
        reason:
          name === 'monthly_quota_exceeded'
            ? 'The email service has sent its allowance for this month.'
            : 'The email service has sent its allowance for today (100 a day on the free plan). It starts again at midnight GMT.',
      };
    }
    if (res.status === 429 && attempt === 0) {
      await new Promise((r) => setTimeout(r, 1200));
      continue;
    }
    console.error(`[portal] sending email: HTTP ${res.status} ${name}`.trim());
    return {
      ok: false,
      quota: false,
      reason:
        res.status === 401 || res.status === 403
          ? `The email service refused the portal (${message || name || res.status}). Check RESEND_API_KEY and that the MAIL_FROM domain is verified in Resend.`
          : `The email service refused that message (${message || name || res.status}).`,
    };
  }
  return { ok: false, reason: 'The email service is busy. Try again in a minute.', quota: false };
}

/** Where the portal lives, for the link in an email. No trailing slash. */
export function portalAddress(): string {
  const set = (process.env.PORTAL_URL || '').trim().replace(/\/+$/, '');
  if (set) return set;
  // Vercel supplies this itself: the project's own production address.
  const vercel = (process.env.VERCEL_PROJECT_PRODUCTION_URL || '').trim();
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}

/** The invitation a member receives. Plain text, so it reads the same everywhere. */
export function invitation(p: { firstName: string; email: string; password: string; days: number }) {
  const at = portalAddress();
  return {
    subject: 'Your sign-in for the DLGC Members’ Portal',
    text: [
      `Dear ${p.firstName},`,
      '',
      'The Derbyshire & Lancashire Gliding Club has a new members’ portal: news and notices, the duty rota, weather, manuals and every club document in one place. A sign-in has been made for you.',
      '',
      `Go to:               ${at}/login`,
      `Email address:       ${p.email}`,
      `Temporary password:  ${p.password}`,
      '',
      `The first time you sign in you will be asked to choose a password of your own. The temporary one above stops working after ${p.days} days; if that happens, ask the club for a new one.`,
      '',
      'This is separate from Free Flight. Your Free Flight username and password are unchanged, and the portal will never ask for them.',
      '',
      `If you were not expecting this, or have any trouble signing in, contact the club office: ${contacts.office.email} or ${contacts.office.tel}.`,
      '',
      'Derbyshire & Lancashire Gliding Club',
      'Camphill, Great Hucklow',
    ].join('\n'),
  };
}

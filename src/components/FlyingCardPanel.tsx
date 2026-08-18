'use client';

import { useState } from 'react';
import type { FlyingCard } from '@/content/flying-cards';

/**
 * The flying card system, one panel per card. The heading is the control: click
 * it and the card opens to show what you need to hold it and what it lets you
 * do, plus a link to the club's own card PDF.
 *
 * Closed by default, one open at a time, so it is always clear where one card
 * ends and the next begins — the same reason the emergency procedures work this
 * way.
 *
 * WCAG 1.4.1: the colour band is never the only signal. Every card carries its
 * name in text, and the open/closed state has both a caret and a label.
 */
export default function FlyingCardPanel({ cards }: { cards: FlyingCard[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {cards.map((c) => {
        const isOpen = open === c.slug;
        return (
          <div key={c.slug} className={`card overflow-hidden border-2 ${isOpen ? c.tone.border : 'border-skyLine'}`}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : c.slug)}
                aria-expanded={isOpen}
                aria-controls={`card-${c.slug}`}
                className="flex w-full items-center gap-4 text-left transition-colors hover:bg-sky50"
              >
                <span className={`w-2 self-stretch ${c.tone.band}`} aria-hidden="true" />
                <span className="min-w-0 flex-1 py-4">
                  <span className="block text-lg font-semibold text-navy">{c.name}</span>
                  <span className="block text-sm text-inkMuted">{c.who}</span>
                </span>
                <span className="shrink-0 pr-5 text-sm font-medium text-sky">
                  {isOpen ? 'Close' : 'What it means'}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className={`mr-5 shrink-0 text-inkMuted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M2 5l6 6 6-6" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </h3>

            {isOpen && (
              <div id={`card-${c.slug}`} className={`border-t-2 ${c.tone.border} ${c.tone.tint} px-5 py-5 sm:px-6`}>
                <p className="max-w-prose2 leading-relaxed text-ink">{c.synopsis}</p>

                <div className="mt-5 grid gap-6 lg:grid-cols-2">
                  <div>
                    <h4 className={`mb-2 text-sm font-bold uppercase tracking-wide ${c.tone.text}`}>
                      Qualifications and tests passed
                    </h4>
                    <ul className="space-y-1.5">
                      {c.qualifications.map((q, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate2" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className={`mb-2 text-sm font-bold uppercase tracking-wide ${c.tone.text}`}>
                      Permissions and restrictions
                    </h4>
                    <ul className="space-y-1.5">
                      {c.permissions.map((p, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate2" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-skyLine pt-4">
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap gap-2 rounded-lg bg-sky px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-skyDark"
                  >
                    See the {c.name} itself (PDF)
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    className="tap rounded-lg border-2 border-skyLine px-4 py-2.5 text-sm font-medium text-navy hover:border-sky"
                  >
                    Close this card
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

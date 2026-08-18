'use client';

import { useState } from 'react';
import type { Procedure } from '@/content/emergency';

/**
 * One procedure at a time. On the old site, and in the first version of this
 * page, four procedures ran together down the page — in an emergency it was not
 * obvious where one finished and the next began. Only the chosen one opens.
 */
export default function ProcedureAccordion({ procedures }: { procedures: Procedure[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {procedures.map((p) => {
        const isOpen = open === p.slug;
        return (
          <section
            key={p.slug}
            id={p.slug}
            className={`scroll-mt-24 overflow-hidden rounded-card border-2 transition-colors ${
              isOpen ? 'border-bad bg-white' : 'border-skyLine bg-white hover:border-bad/50'
            }`}
          >
            <h2>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : p.slug)}
                aria-expanded={isOpen}
                aria-controls={`panel-${p.slug}`}
                className="flex w-full items-center gap-4 px-5 py-5 text-left"
              >
                <span
                  aria-hidden="true"
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                    isOpen ? 'bg-bad text-white' : 'bg-badTint text-bad'
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l9.5 17H2.5L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 9v5M12 17.2v.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-semibold text-navy">{p.when}</span>
                  <span className="mt-0.5 block text-sm text-inkMuted">
                    {isOpen ? p.title : 'Tap to open this procedure'}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-inkMuted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M5 8l7 7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </h2>

            {isOpen && (
              <div id={`panel-${p.slug}`} className="border-t-2 border-bad/30 px-5 pb-6 pt-5">
                <p className="mb-3 text-sm text-inkMuted">
                  {p.revised && `Revised ${p.revised}. `}
                  <a href={p.source} target="_blank" rel="noopener noreferrer" className="link">
                    Original procedure on the old site
                  </a>
                </p>

                {p.intro && <p className="prose-club mb-4">{p.intro}</p>}

                <ol className="overflow-hidden rounded-card border border-skyLine">
                  {p.steps.map((s, i) => (
                    <li
                      key={i}
                      className={`flex gap-4 border-b border-skyLine px-4 py-3.5 last:border-b-0 ${
                        s.emphasis ? 'bg-badTint' : ''
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                          s.emphasis ? 'bg-bad text-white' : 'bg-skyTint text-navy'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span>
                        <span className={`block ${s.emphasis ? 'font-semibold text-bad' : 'text-ink'}`}>
                          {s.text}
                        </span>
                        {s.detail && <span className="mt-0.5 block text-sm text-inkMuted">{s.detail}</span>}
                      </span>
                    </li>
                  ))}
                </ol>

                {p.after && (
                  <div className="mt-4 space-y-3">
                    {p.after.map((a, i) => (
                      <p key={i} className="rounded-card border-l-4 border-warn bg-warnTint px-5 py-3 text-sm">
                        {a}
                      </p>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="link tap mt-5 text-sm"
                >
                  Close this procedure
                </button>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

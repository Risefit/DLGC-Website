import Link from 'next/link';
import { PageHeader, Callout } from '@/components/ui';
import SafetyLogBrowser from '@/components/SafetyLogBrowser';
import {
  safetyLessons,
  safetyLessonYears,
  SAFETY_LOG_RECENT_YEARS,
  safetyLogSource,
} from '@/content/safety-log';

export const metadata = { title: 'Safety Lessons Log' };

/**
 * PRESERVED FROM THE OLD SITE, and one of the best things on it: both volumes
 * of the Safety Lessons Log, in full.
 *
 * The old version was two enormous tables on two separate pages, one of which
 * you had to know existed. Here it is one log, newest first, five years at a
 * time, searchable.
 */
export default function SafetyLessonsPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/safety" className="link">Safety</Link>
        <span className="mx-2 text-inkMuted" aria-hidden="true">/</span>
        <span className="text-inkMuted">Safety Lessons Log</span>
      </nav>

      <PageHeader
        eyebrow="Learn from what has happened to others"
        title="Safety Lessons Log"
        lead={`Every occurrence the club has recorded and what was learned from it — ${safetyLessons.length} entries from ${safetyLessonYears[safetyLessonYears.length - 1]} to ${safetyLessonYears[0]}.`}
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-[3fr_2fr]">
        <Callout tone="info" title="Why this log exists">
          <p>
            Almost every entry here was written because somebody was willing to say what went
            wrong, including when it was their own mistake. That is the only reason the log is any
            use. If something happens to you, report it — the club learns, and nobody is named.
          </p>
        </Callout>
        <div className="card flex flex-col justify-center p-5">
          <p className="text-sm text-inkMuted">Got something to add to it?</p>
          <Link
            href="/safety#report-an-occurrence"
            className="tap mt-2 gap-2 rounded-lg bg-good px-5 py-3 font-semibold text-white transition-colors hover:brightness-110"
          >
            Report a safety occurrence
          </Link>
          <p className="mt-2 text-xs text-slate2">You can report anonymously.</p>
        </div>
      </div>

      <SafetyLogBrowser
        lessons={safetyLessons}
        years={safetyLessonYears}
        initialYears={SAFETY_LOG_RECENT_YEARS}
      />

      <p className="mt-10 border-t border-skyLine pt-6 text-sm text-inkMuted">
        Both volumes of the log are reproduced here.{' '}
        <a href={safetyLogSource} target="_blank" rel="noopener noreferrer" className="link">
          The original page is still on the old site
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
      </p>
    </>
  );
}

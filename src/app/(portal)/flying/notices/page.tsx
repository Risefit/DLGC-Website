import Link from 'next/link';
import { PageHeader, Section, Callout } from '@/components/ui';
import NoticeBrowser from '@/components/NoticeBrowser';
import {
  cfiNotices,
  clmBulletins,
  clmIntro,
  cfiNoticesSource,
  clmNoticesSource,
} from '@/content/notices';

export const metadata = { title: 'CFI and Launch Marshal Notices' };

/**
 * PORTED FROM CFI_Notices.asp and CLM_Notices.asp.
 *
 * These are instructions, not advice — how we check, how we launch, how we
 * report. The old site had them on two separate pages, each one long scroll.
 */
export default function NoticesPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/flying" className="link">Flying</Link>
        <span className="mx-2 text-slate2" aria-hidden="true">/</span>
        <span className="text-slate2">Notices</span>
      </nav>

      <PageHeader
        eyebrow="How we operate, from the people who run it"
        title="CFI and Launch Marshal Notices"
        lead="The Chief Flying Instructor's notices and the Chief Launch Marshal's bulletins. Several of these stay in force for years — worth a read even when they are not new."
      />

      <div className="mb-8">
        <Callout tone="warn" title="These are instructions">
          <p>
            A CFI&rsquo;s notice is not a suggestion. If one contradicts something you were taught,
            or something on another page of this site, the notice wins — and tell the CFI so the
            other page gets fixed.
          </p>
        </Callout>
      </div>

      <Section title={`CFI's Notices`} description={`${cfiNotices.length} notices, newest first.`}>
        <NoticeBrowser notices={cfiNotices} />
      </Section>

      <Section
        title="Chief Launch Marshal's Bulletins and Notices"
        description={clmIntro}
      >
        <ul className="card divide-y divide-skyLine overflow-hidden">
          {clmBulletins.map((b) => (
            <li key={b.href}>
              <a
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-5 py-4 transition-colors hover:bg-skyTint"
              >
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-medium text-navy">{b.title}</span>
                  <span className="rounded bg-skyTint px-2 py-0.5 text-xs font-medium text-navy">
                    {b.kind}
                  </span>
                  {b.when && <span className="text-xs text-slate2">{b.when}</span>}
                </span>
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <p className="border-t border-skyLine pt-6 text-sm text-slate2">
        Rebuilt from{' '}
        <a href={cfiNoticesSource} target="_blank" rel="noopener noreferrer" className="link">
          the CFI&rsquo;s Notices page
        </a>{' '}
        and{' '}
        <a href={clmNoticesSource} target="_blank" rel="noopener noreferrer" className="link">
          the Chief Launch Marshal&rsquo;s page
        </a>
        , both still on the old site.
      </p>
    </>
  );
}

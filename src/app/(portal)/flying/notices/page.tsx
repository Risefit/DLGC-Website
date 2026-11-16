import Link from 'next/link';
import { Band, BandSection, outIcon } from '@/components/ui';
import NoticeBrowser from '@/components/NoticeBrowser';
import {
  cfiNotices,
  currentCfiNotices,
  currentCfiNoticesIntro,
  clmBulletins,
  clmIntro,
  cfiNoticesSource,
  clmNoticesSource,
} from '@/content/notices';

export const metadata = { title: 'CFI and Launch Marshal Notices' };

/**
 * PORTED FROM cfis_notices_new.asp (the CFI's current notices), the earlier
 * cfis_notices.asp (the 28 notices to 2019) and CLM_Notices.asp.
 *
 * These are instructions, not advice — how we check, how we launch, how we
 * report. The wording is the CFI's and is never edited here; only the setting
 * of it is ours. Current notices are set as reading text at a comfortable line
 * length, because they are meant to be read through, not scanned.
 */
export default function NoticesPage() {
  return (
    <>
      <Band
        eyebrow="How we operate, from the people who run it"
        title={
          <>
            CFI and Launch Marshal <em>notices</em>
          </>
        }
        lead="A CFI’s notice is not a suggestion. If one contradicts something you were taught, or something on another page of this site, the notice wins — and tell the CFI so the other page gets fixed."
      >
        <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-3">
          <a href="#current" className="pill-accent">{currentCfiNotices.length} current notices</a>
          <a href="#earlier" className="pill-ghost">{cfiNotices.length} earlier notices</a>
          <a href="#clm" className="pill-ghost">{clmBulletins.length} launch marshal bulletins</a>
        </nav>
        <p className="mt-4 text-sm">
          <Link href="/flying" className="tap text-white/85 underline decoration-white/40 underline-offset-4 hover:decoration-white">
            Back to Flying
          </Link>
        </p>
      </Band>

      <section id="current" className="band-white scroll-mt-4 py-10 lg:py-14">
        <h2 className="display text-3xl lg:text-[2.6rem]">
          The CFI’s <em>current notices</em>
        </h2>
        <p className="mt-2 max-w-prose2 text-inkMuted">{currentCfiNoticesIntro}</p>

        <div className="mt-8 space-y-12">
          {currentCfiNotices.map((n) => (
            <article
              key={n.num}
              aria-labelledby={`cfi-current-${n.num}`}
              className="grid gap-x-10 gap-y-3 border-t-2 border-navy pt-6 lg:grid-cols-[9rem_minmax(0,62ch)]"
            >
              <p className="flex items-baseline gap-2 lg:block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate2">Notice</span>
                <span className="figure block text-5xl text-navy lg:mt-1 lg:text-6xl">No. {n.num}</span>
              </p>
              <div className="min-w-0">
                <h3 id={`cfi-current-${n.num}`} className="display text-2xl text-navy lg:text-[2rem]">
                  {n.title}
                </h3>
                {n.subtitle && <p className="mt-1 text-inkMuted">{n.subtitle}</p>}
                <div className="mt-4 space-y-4 leading-relaxed">
                  {n.blocks.map((b, i) =>
                    b.kind === 'p' ? (
                      <p key={i}>{b.text}</p>
                    ) : (
                      <div key={i}>
                        <h4 className="text-base text-navy">{b.heading}</h4>
                        <ul className="mt-1.5 list-disc space-y-1.5 pl-6 marker:text-sky">
                          {b.items.map((it) => (
                            <li key={it}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
                <p className="mt-5 border-t border-skyLine pt-3 text-sm font-medium text-inkMuted">{n.signed}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <BandSection
        id="earlier"
        tone="contour"
        title={
          <>
            Earlier <em>CFI’s notices</em>
          </>
        }
        description={`${cfiNotices.length} notices from 2011 to 2019, newest first. The old site’s current page now lists only the two above — ask the CFI if you are unsure whether an earlier notice still applies.`}
      >
        <NoticeBrowser notices={cfiNotices} />
      </BandSection>

      <section id="clm" className="band-white -mb-8 scroll-mt-4 py-10 lg:-mb-10 lg:py-14">
        <h2 className="display text-3xl lg:text-[2.6rem]">
          Chief Launch Marshal’s <em>bulletins</em>
        </h2>
        <p className="mt-2 max-w-prose2 text-inkMuted">{clmIntro}</p>
        <ul className="mt-6 border-t-2 border-navy">
          {clmBulletins.map((b) => (
            <li key={b.href} className="border-b border-skyLine">
              <a
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid items-baseline gap-x-6 gap-y-0.5 py-3.5 hover:text-skyDark sm:grid-cols-[6rem_1fr_auto]"
              >
                <span className="text-sm font-semibold text-slate2">{b.when}</span>
                <span className="font-medium text-navy">{b.title}</span>
                <span className="flex items-center gap-2 text-sm text-slate2">
                  {b.kind} · PDF {outIcon}
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-inkMuted">
          Rebuilt from{' '}
          <a href={cfiNoticesSource} target="_blank" rel="noopener noreferrer" className="link">
            the CFI’s Notices page
          </a>{' '}
          and{' '}
          <a href={clmNoticesSource} target="_blank" rel="noopener noreferrer" className="link">
            the Chief Launch Marshal’s page
          </a>
          , both still on the old site.
        </p>
      </section>
    </>
  );
}

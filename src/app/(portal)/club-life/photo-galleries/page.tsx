import Link from 'next/link';
import { PageHeader, Callout } from '@/components/ui';
import { photoGalleries, photoGalleriesSource } from '@/content/photo-galleries';

export const metadata = { title: 'Photo Galleries' };

/**
 * PORTED FROM photogalleries.asp — the club's six curated galleries.
 *
 * Deliberately NOT merged into /gallery. Those are the photographs recovered
 * from the mirror; these are maintained by hand and still growing, and First
 * Solos in particular gains a picture every time somebody goes solo.
 */
export default function PhotoGalleriesPage() {
  const total = photoGalleries.reduce((a, g) => a + g.count, 0);

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/club-life" className="link">Club Life</Link>
        <span className="mx-2 text-slate2" aria-hidden="true">/</span>
        <span className="text-slate2">Photo Galleries</span>
      </nav>

      <PageHeader
        eyebrow={`Six galleries, ${total} photographs`}
        title="Photo Galleries"
        lead="The club's own curated galleries, kept by hand over many years. First Solos gains a picture every time somebody goes solo."
      />

      <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photoGalleries.map((g) => {
          const inner = (
            <>
              <span className="flex items-start justify-between gap-3">
                <span className="text-lg font-semibold text-navy">{g.name}</span>
                <span className="shrink-0 rounded bg-skyTint px-2.5 py-0.5 text-sm font-semibold text-navy">
                  {g.count}
                </span>
              </span>
              <span className="mt-2 flex-1 text-sm text-slate2">{g.blurb}</span>
              <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-sky">
                {g.internal ? 'Open' : 'Open on the old site'}
                <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {!g.internal && <span className="sr-only">(opens in a new tab)</span>}
            </>
          );
          const cls = 'card flex h-full flex-col p-5 transition-all hover:border-sky hover:shadow-lift';
          return (
            <li key={g.name}>
              {g.internal ? (
                <Link href={g.href} className={cls}>{inner}</Link>
              ) : (
                <a href={g.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              )}
            </li>
          );
        })}
      </ul>

      <Callout tone="info" title="There is a second, larger gallery">
        <p>
          These six are the club&rsquo;s hand-kept galleries. Separately, 881 photographs recovered
          from the old site are laid out as albums in this portal, with an upload box so members can
          send their own. <Link href="/gallery" className="link">Open the photo gallery</Link>.
        </p>
      </Callout>

      <p className="mt-8 border-t border-skyLine pt-6 text-sm text-slate2">
        <a href={photoGalleriesSource} target="_blank" rel="noopener noreferrer" className="link">
          The original index is still on the old site
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
      </p>
    </>
  );
}

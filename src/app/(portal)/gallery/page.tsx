import Link from 'next/link';
import { PageHeader, Section, Callout } from '@/components/ui';
import SubmitForm from '@/components/SubmitForm';
import GalleryBrowser from '@/components/GalleryBrowser';
import { albums, totalPhotos } from '@/content/gallery';
import { photoGalleries, photoGalleriesSource } from '@/content/photo-galleries';
import { LEGACY_BASE, servedFromOldSite } from '@/content/documents';
import { contacts } from '@/content/site';

export const metadata = { title: 'Gallery' };

/**
 * ONE GALLERY PAGE. It used to be two: this one, and "Photo Galleries" under
 * Club Life (photogalleries.asp). Both are here now, in the order a member
 * wants them:
 *
 *   1. the club's own six galleries, kept by hand and still growing — First
 *      Solos gains a picture every time somebody goes solo;
 *   2. the albums recovered from the old site;
 *   3. the form for sending a photograph in. It comes last because most
 *      visitors are here to look, and it has its own button at the top.
 *
 * /club-life/photo-galleries redirects here (next.config.mjs).
 */
export default function GalleryPage() {
  return (
    <>
      <PageHeader
        back={{ href: '/club-life', label: 'Club Life' }}
        eyebrow={`${totalPhotos} photographs · ${albums.length} albums · ${photoGalleries.length} club galleries`}
        title={
          <>
            The <em>gallery</em>
          </>
        }
        lead="First solos, wave days, snow, aerial shots, vintage rallies and everything in between."
      />

      <Section
        id="galleries"
        title={
          <>
            The club’s <em>own galleries</em>
          </>
        }
        description="Kept by hand over many years. First Solos gains a picture every time somebody goes solo."
        action={<a href="#send-us-your-best" className="pill-line">Send us a photograph</a>}
      >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photoGalleries.map((g) => {
          const inner = (
            <>
              <span className="flex items-start justify-between gap-3">
                <span className="text-lg font-semibold text-navy">{g.name}</span>
                <span className="shrink-0 rounded bg-skyTint px-2.5 py-0.5 text-sm font-semibold text-navy">
                  {g.count}
                </span>
              </span>
              <span className="mt-2 flex-1 text-sm text-inkMuted">{g.blurb}</span>
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
        <p className="mt-4 text-sm text-inkMuted">
          <a href={photoGalleriesSource} target="_blank" rel="noopener noreferrer" className="link">
            The original index is still on the old site
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </Section>

      <Section
        id="albums"
        title={
          <>
            Albums <em>from the old site</em>
          </>
        }
        description={`${totalPhotos} photographs in ${albums.length} albums. Choose an album to see its pictures.`}
      >
        {servedFromOldSite && (
          <div className="mb-6">
            <Callout tone="warn" title="Photographs still load from the old site">
              <p>
                The images have not moved yet, so they load from the old members’ site and your
                browser may ask for the members’ password the first time — after which the
                thumbnails appear normally. That step disappears once the archive is hosted.
              </p>
            </Callout>
          </div>
        )}
        <GalleryBrowser base={LEGACY_BASE} />
      </Section>

      <Section
        id="send-us-your-best"
        title={
          <>
            Send us <em>a photograph</em>
          </>
        }
      >
        <SubmitForm
          kind="photo"
          heading="Add a photograph to the gallery"
          intro="Taken something good at Camphill? Send it in — the website editor checks everything before it goes up."
          bodyLabel="Tell us about it"
          bodyPlaceholder="Where, when, who is in it, and anything worth knowing."
          imageRequired
          editorEmail={contacts.websiteEditor.email}
        />
      </Section>
    </>
  );
}

import Link from 'next/link';
import { PageHeader, Section } from '@/components/ui';
import SubmitForm from '@/components/SubmitForm';
import GalleryBrowser from '@/components/GalleryBrowser';
import { albums, totalPhotos } from '@/content/gallery';
import { photoGalleries } from '@/content/photo-galleries';
import { FILES_BASE } from '@/lib/files';
import { contacts } from '@/content/site';
import { publishedPhotos, sentInImage } from '@/lib/sent-in';

export const metadata = { title: 'Gallery' };

/**
 * ONE GALLERY PAGE. It used to be two: this one, and "Photo Galleries" under
 * Club Life (photogalleries.asp). Both are here now, in the order a member
 * wants them:
 *
 *   1. the club's own six galleries, kept by hand and still growing — First
 *      Solos gains a picture every time somebody goes solo;
 *   2. the albums recovered from the old site;
 *   (between 1 and 2, once there are any) photographs members have sent in and
 *      a controller has approved — src/lib/sent-in.ts;
 *   3. the form for sending a photograph in. It comes last because most
 *      visitors are here to look, and it has its own button at the top.
 *
 * /club-life/photo-galleries redirects here (next.config.mjs).
 */
/** Rebuilt at once when a controller approves a photograph, and hourly in any case. */
export const revalidate = 3600;

export default async function GalleryPage() {
  const sentIn = await publishedPhotos();
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
      </Section>

      {sentIn.length > 0 && (
        <Section
          id="from-members"
          title={
            <>
              Sent in <em>by members</em>
            </>
          }
          description="The newest first. Each one opens full size in a new tab."
        >
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sentIn.map((p) => (
              <li key={p.id}>
                <figure className="card flex h-full flex-col overflow-hidden">
                  <a href={sentInImage(p.id)} target="_blank" rel="noopener noreferrer" className="block bg-sunken">
                    {/* A private picture behind the sign-in, so a plain <img>: the member's browser fetches it. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sentInImage(p.id, 'small')}
                      alt={p.title ? `${p.title}, from ${p.from}` : `Photograph from ${p.from}`}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <span className="sr-only">Open it full size (opens in a new tab)</span>
                  </a>
                  <figcaption className="flex-1 p-4">
                    {p.title && <span className="block font-semibold text-navy">{p.title}</span>}
                    <span className="block text-sm italic text-inkMuted">from {p.from}</span>
                    {p.body.map((t, i) => (
                      <span key={i} className="mt-1.5 block text-sm text-ink">
                        {t}
                      </span>
                    ))}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        id="albums"
        title={
          <>
            The <em>albums</em>
          </>
        }
        description={`${totalPhotos} photographs in ${albums.length} albums. Choose an album to see its pictures.`}
      >
        <GalleryBrowser base={FILES_BASE} />
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
          intro="Taken something good at Camphill? Send it in — one of the portal’s controllers checks everything before it goes up."
          bodyLabel="Tell us about it"
          bodyPlaceholder="Where, when, who is in it, and anything worth knowing."
          imageRequired
          editorEmail={contacts.websiteEditor.email}
        />
      </Section>
    </>
  );
}

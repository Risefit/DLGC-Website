import { PageHeader, Section, Callout } from '@/components/ui';
import SubmitForm from '@/components/SubmitForm';
import { albums, totalPhotos } from '@/content/gallery';
import { LEGACY_BASE, servedFromOldSite } from '@/content/documents';
import { contacts } from '@/content/site';

export const metadata = { title: 'Gallery' };

const src = (p: string) => (p.startsWith('/legacy/') ? LEGACY_BASE + p.slice('/legacy'.length) : p);

/**
 * Every photograph recovered from the old site, grouped into the albums the
 * old site used. Images are lazy-loaded — 888 of them would otherwise be a
 * miserable experience on a phone at the launch point.
 */
export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${totalPhotos} photographs · ${albums.length} albums`}
        title="Gallery"
        lead="The club's photography, recovered in full from the old site — first solos, aerial shots, snow, buildings, vintage rallies and everything in between."
      />

      {servedFromOldSite && (
        <div className="mb-8">
          <Callout tone="warn" title="Photographs still load from the old site">
            <p>
              The images have not moved yet, so they load from the old members&rsquo; site and your
              browser may ask for the members&rsquo; password the first time. That goes away once
              the archive is hosted.
            </p>
          </Callout>
        </div>
      )}

      <nav aria-label="Albums" className="mb-10">
        <h2 className="mb-3 text-xl">Jump to an album</h2>
        <ul className="flex flex-wrap gap-2">
          {albums.map((a) => (
            <li key={a.slug}>
              <a
                href={`#${a.slug}`}
                className="tap rounded-lg border-2 border-skyLine bg-white px-3.5 py-2 text-sm
                           font-medium text-navy hover:border-sky transition-colors"
              >
                {a.title}{' '}
                <span className="font-normal text-slate2">{a.photos.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {albums.map((a) => (
        <Section key={a.slug} title={a.title} description={`${a.photos.length} photographs`}>
          <div id={a.slug} className="scroll-mt-24 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {a.photos.map((p) => (
              <a
                key={p.src}
                href={src(p.src)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-card border border-skyLine bg-white
                           hover:border-sky hover:shadow-lift transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src(p.src)}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full bg-cloud object-cover"
                />
                <span className="block truncate px-3 py-2 text-xs text-slate2">{p.name}</span>
                <span className="sr-only">(opens full size in a new tab)</span>
              </a>
            ))}
          </div>
        </Section>
      ))}

      <Section title="Send us your best" description="Photographs from members are always welcome.">
        <SubmitForm
          kind="photo"
          heading="Add a photograph to the gallery"
          intro="Taken something good at Camphill? Send it in. The website editor checks everything before it goes up."
          bodyLabel="Tell us about it"
          bodyPlaceholder="Where, when, who is in it, and anything worth knowing."
          imageRequired
          editorEmail={contacts.office.email}
        />
      </Section>
    </>
  );
}

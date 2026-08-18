import { PageHeader, Callout } from '@/components/ui';
import SubmitForm from '@/components/SubmitForm';
import GalleryBrowser from '@/components/GalleryBrowser';
import { albums, totalPhotos } from '@/content/gallery';
import { LEGACY_BASE, servedFromOldSite } from '@/content/documents';
import { contacts } from '@/content/site';

export const metadata = { title: 'Gallery' };

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${totalPhotos} photographs · ${albums.length} albums`}
        title="Gallery"
        lead="The club's photography, recovered in full from the old site — first solos, wave days, snow, aerial shots, vintage rallies and everything in between."
      />

      {/* Upload first: members are here to contribute as often as to browse. */}
      <section id="send-us-your-best" className="mb-10 scroll-mt-24">
        <SubmitForm
          kind="photo"
          heading="Add a photograph to the gallery"
          intro="Taken something good at Camphill? Send it in — the website editor checks everything before it goes up."
          bodyLabel="Tell us about it"
          bodyPlaceholder="Where, when, who is in it, and anything worth knowing."
          imageRequired
          editorEmail={contacts.websiteEditor.email}
        />
      </section>

      {servedFromOldSite && (
        <div className="mb-8">
          <Callout tone="warn" title="Photographs still load from the old site">
            <p>
              The images have not moved yet, so they load from the old members&rsquo; site and your
              browser may ask for the members&rsquo; password the first time — after which the
              thumbnails appear normally. That step disappears once the archive is hosted.
            </p>
          </Callout>
        </div>
      )}

      <GalleryBrowser base={LEGACY_BASE} />
    </>
  );
}

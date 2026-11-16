import { PageHeader, BandSection } from '@/components/ui';
import RequiredReading from '@/components/RequiredReading';
import { requiredReading, requiredOfEveryone } from '@/content/required-reading';
import DocumentLibrary from '@/components/DocumentLibrary';
import { type Tier } from '@/content/documents';

export const metadata = { title: 'Documents' };

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tier?: string; review?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const tier = (['live', 'reference', 'archive', 'all'].includes(sp.tier ?? '')
    ? sp.tier
    : 'current') as Tier | 'all' | 'current';

  return (
    <>
      <PageHeader
        eyebrow="One place, searchable"
        title={
          <>
            Club <em>documents</em>
          </>
        }
        lead="Every manual, rule, policy, briefing and notice the club holds."
      />

      <BandSection
        tone="white"
        id="required-reading"
        title={
          <>
            Required <em>reading</em>
          </>
        }
        description="The manuals, rules and procedures members are asked to read. Open each one, then tick to confirm you have read it. When one is re-issued you will be asked again."
        action={<a href="#library" className="pill-line">Search all documents</a>}
      >
        <RequiredReading groups={requiredReading} everyoneKeys={requiredOfEveryone.map((i) => i.key)} />
      </BandSection>

      <DocumentLibrary
        initialQuery={sp.q ?? ''}
        initialTier={tier}
        initialReview={sp.review ?? ''}
        initialCategory={sp.category ?? 'all'}
      />
    </>
  );
}

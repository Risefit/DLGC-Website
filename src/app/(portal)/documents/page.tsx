import { PageHeader, BandSection } from '@/components/ui';
import RequiredReading from '@/components/RequiredReading';
import { requiredReading, readingRule } from '@/content/required-reading';
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
        lead="Every manual, rule, policy, briefing and notice the club holds. Search first; browse if you would rather."
      />

      <DocumentLibrary
        initialQuery={sp.q ?? ''}
        initialTier={tier}
        initialReview={sp.review ?? ''}
        initialCategory={sp.category ?? 'all'}
      >
      {/* Required reading sits under the search and steps aside while a member
          is searching or browsing — see DocumentLibrary. */}
      <BandSection
        tone="white"
        id="required-reading"
        title={
          <>
            Required <em>reading</em>
          </>
        }
        description="The manuals, rules and procedures members are asked to read. Open each one, then tick to confirm you have read it. When one is re-issued you will be asked again. Your ticks are a record: you can see them here at any time, and so can the club’s portal controllers."
      >
        <RequiredReading groups={requiredReading} rule={readingRule} />
      </BandSection>
      </DocumentLibrary>
    </>
  );
}

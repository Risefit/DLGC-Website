import { PageHeader } from '@/components/ui';
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

      <DocumentLibrary
        initialQuery={sp.q ?? ''}
        initialTier={tier}
        initialReview={sp.review ?? ''}
        initialCategory={sp.category ?? 'all'}
      />
    </>
  );
}

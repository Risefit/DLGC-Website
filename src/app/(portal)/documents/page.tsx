import { PageHeader, Callout } from '@/components/ui';
import DocumentLibrary from '@/components/DocumentLibrary';
import type { Tier } from '@/content/documents';

export const metadata = { title: 'Documents' };

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tier?: string; review?: string }>;
}) {
  const sp = await searchParams;
  const tier = (['live', 'reference', 'archive', 'all'].includes(sp.tier ?? '')
    ? sp.tier
    : 'current') as Tier | 'all' | 'current';

  return (
    <>
      <PageHeader
        eyebrow="One place, searchable"
        title="Club Documents"
        lead="Every manual, rule, policy, briefing and notice the club holds. This replaces the old Links Library, Manuals and Find It pages — search rather than hunt."
      />

      <div className="mb-6">
        <Callout tone="info" title="How this is organised">
          <p>
            Documents are grouped into three tiers. <strong>This season</strong> changes during the
            year — fees, rotas, current notices. <strong>Reference</strong> is current and in force
            — manuals, rules, policies. <strong>Archive</strong> is historic: kept forever, fully
            searchable, but out of your way.
          </p>
          <p>
            Anything marked <em>No longer in force</em> is retained for the record only. Anything
            marked <em>Overdue for review</em> needs someone to check it is still correct — that flag
            is automatic, which is what stops this library quietly filling up with withdrawn advice.
          </p>
        </Callout>
      </div>

      <DocumentLibrary initialQuery={sp.q ?? ''} initialTier={tier} initialReview={sp.review ?? ''} />
    </>
  );
}

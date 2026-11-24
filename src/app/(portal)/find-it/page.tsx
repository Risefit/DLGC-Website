import { PageHeader } from '@/components/ui';
import FindItBrowser from '@/components/FindItBrowser';

export const metadata = { title: 'Find It' };

/**
 * The old site's "Find It" A–Z, kept as a safety net, and the place the
 * dashboard's search box lands (`/find-it?q=winch`).
 *
 * The old site NEEDED the A–Z because its navigation didn't work. We don't —
 * but members spent years learning this vocabulary, and these ~130 entries are
 * free, hard-won evidence of what people actually look for. The list is
 * `findIt` in src/content/site.ts; the page itself is FindItBrowser.
 */
export default async function FindItPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.slice(0, 80) : '';

  return (
    <>
      <PageHeader
        eyebrow="A to Z"
        title={
          <>
            Find <em>it</em>
          </>
        }
        lead="Look up a subject by the name you know it by, or search the titles of every document."
      />
      <FindItBrowser initialQuery={q} />
    </>
  );
}

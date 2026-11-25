import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageHeader, Section } from '@/components/ui';
import RequiredReading from '@/components/RequiredReading';
import { requiredReading, readingRule } from '@/content/required-reading';

export const metadata = { title: 'Read and confirm' };

/**
 * ONE DOCUMENT TO READ AND CONFIRM — where the button in a reminder email
 * lands (/account/reading?doc=…; the email is written in src/lib/mail.ts).
 *
 * It is the same list as the top of the Documents page, cut down to the one
 * document the member was emailed about, and it works the same way: open the
 * document, then tick. The tick is made by the member, signed in, exactly as
 * it would be on the Documents page — the email does not confirm anything by
 * itself, and neither does arriving here.
 *
 * Somebody who is not signed in is sent to sign in first and brought back
 * (middleware.ts and the sign-in form look after that).
 *
 * If the document has been re-issued since the email was sent, its key no
 * longer matches anything. The page says so and points at the current list
 * rather than offering a tick for a version that has been replaced.
 */
export default async function ReadAndConfirmPage({ searchParams }: { searchParams: Promise<{ doc?: string }> }) {
  const { doc } = await searchParams;
  // Nothing asked for: the full list is on the Documents page.
  if (!doc) redirect('/documents#required-reading');

  const group = requiredReading.find((g) => g.items.some((i) => i.key === doc));
  const item = group?.items.find((i) => i.key === doc);

  return (
    <>
      <PageHeader
        eyebrow="Required reading"
        title={
          <>
            Read and <em>confirm</em>
          </>
        }
        lead={
          item
            ? 'Open it, read it, then tick to say you have. Your record is updated straight away.'
            : 'The document you were sent has been replaced by a newer one, or is no longer on the list.'
        }
      />

      {item && group ? (
        <Section title={item.title} description={item.who ? `For ${item.who.toLowerCase()}.` : undefined}>
          <RequiredReading
            groups={[{ group: group.group, blurb: group.blurb, items: [item] }]}
            rule={readingRule}
          />
          <p className="mt-8">
            <Link href="/documents#required-reading" className="pill-line">
              See all your required reading
            </Link>
          </p>
        </Section>
      ) : (
        <Section title="Your current list">
          <p className="max-w-prose2 text-ink">
            When a manual is re-issued the club asks everybody to read the new one. Your up-to-date list, with what you
            have already confirmed, is at the top of the Documents page.
          </p>
          <p className="mt-5">
            <Link href="/documents#required-reading" className="pill-solid">
              Open my required reading
            </Link>
          </p>
        </Section>
      )}
    </>
  );
}

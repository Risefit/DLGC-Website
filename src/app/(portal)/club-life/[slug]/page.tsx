import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader, Section } from '@/components/ui';
import { clubPages, clubPageBySlug, type ClubSection } from '@/content/club-life';
import { isPortalPage } from '@/lib/files';

export function generateStaticParams() {
  return clubPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: clubPageBySlug(slug)?.title ?? 'Club Life' };
}

const COLS: Record<number, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
};

function LinkGrid({ section }: { section: ClubSection }) {
  const cols = COLS[section.columns ?? 1] ?? '';
  return (
    <ul className={`grid gap-3 ${cols}`}>
      {section.links!.map((l) => {
        const internal = isPortalPage(l.href);
        return (
          <li key={l.href + l.label}>
            <a
              href={l.href}
              target={internal ? undefined : '_blank'}
              rel={internal ? undefined : 'noopener noreferrer'}
              className="card-interactive flex h-full flex-col p-4"
            >
              <span className="font-medium text-navy">{l.label}</span>
              {l.note && <span className="mt-1 text-sm text-inkMuted">{l.note}</span>}
              {!internal && <span className="sr-only">(opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * A club life page as the club wrote it: the prose first, the links beside it.
 *
 * The first version of this portal turned these into document searches, which
 * is how you lose the part a member actually wanted — the bit where somebody
 * explains what the Ladder is for, or admits the soaring was variable.
 */
export default async function ClubLifeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = clubPageBySlug(slug);
  if (!page) notFound();

  const siblings = clubPages.filter((p) => p.group === page.group && p.slug !== page.slug);

  return (
    <>

      <PageHeader
        back={{ href: '/club-life', label: 'Club Life' }}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={
          page.steward ? (
            <>
              {page.lead}
              <span className="mt-3 block text-base text-white/80">
                <strong className="font-semibold text-white">{page.steward.name}</strong> — {page.steward.role}
                {page.steward.contact && <> · {page.steward.contact}</>}
              </span>
            </>
          ) : (
            page.lead
          )
        }
      />

      {page.sections.map((s, i) => {
        const body = (
          <>
            {s.paras && (
              <div className={`prose-club ${s.links && s.links.length > 0 ? 'mb-6' : ''}`}>
                {s.paras.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            )}
            {s.links && s.links.length > 0 && <LinkGrid section={s} />}
          </>
        );
        return s.heading ? (
          <Section key={i} title={s.heading}>
            {body}
          </Section>
        ) : (
          <section key={i} className="sec">
            {body}
          </section>
        );
      })}

      {siblings.length > 0 && (
        <Section title={`More under ${page.group}`}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((p) => (
              <li key={p.slug}>
                <Link href={`/club-life/${p.slug}`} className="card-interactive flex h-full flex-col p-4">
                  <span className="font-medium text-navy">{p.title}</span>
                  <span className="mt-1 text-sm text-inkMuted">{p.cardBlurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

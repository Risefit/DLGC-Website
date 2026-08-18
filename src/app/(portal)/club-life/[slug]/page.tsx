import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader, Section } from '@/components/ui';
import { clubPages, clubPageBySlug, type ClubSection } from '@/content/club-life';

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
        const internal = l.href.startsWith('/');
        return (
          <li key={l.href + l.label}>
            <a
              href={l.href}
              target={internal ? undefined : '_blank'}
              rel={internal ? undefined : 'noopener noreferrer'}
              className="card flex h-full flex-col p-4 transition-all hover:border-sky hover:shadow-lift"
            >
              <span className="font-medium text-navy">{l.label}</span>
              {l.note && <span className="mt-1 text-sm text-slate2">{l.note}</span>}
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
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/club-life" className="link">Club Life</Link>
        <span className="mx-2 text-slate2" aria-hidden="true">/</span>
        <span className="text-slate2">{page.title}</span>
      </nav>

      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      {page.steward && (
        <div className="mb-8 rounded-card border-l-4 border-sky bg-skyTint px-5 py-4">
          <p className="text-sm">
            <strong className="text-navy">{page.steward.name}</strong>
            <span className="text-slate2"> — {page.steward.role}</span>
            {page.steward.contact && <span className="text-slate2"> · {page.steward.contact}</span>}
          </p>
        </div>
      )}

      {page.sections.map((s, i) => (
        <section key={i} className="mb-10">
          {s.heading && <h2 className="mb-3 text-2xl">{s.heading}</h2>}
          {s.paras && (
            <div className="prose-club mb-4">
              {s.paras.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          )}
          {s.links && s.links.length > 0 && <LinkGrid section={s} />}
        </section>
      ))}

      <div className="mt-10 border-t border-skyLine pt-6">
        <p className="text-sm text-slate2">
          Rebuilt from the club&rsquo;s own page.{' '}
          <a href={page.source} target="_blank" rel="noopener noreferrer" className="link">
            The original is still there
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
        {siblings.length > 0 && (
          <Section title={`More under ${page.group}`}>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/club-life/${p.slug}`}
                    className="card flex h-full flex-col p-4 transition-all hover:border-sky hover:shadow-lift"
                  >
                    <span className="font-medium text-navy">{p.title}</span>
                    <span className="mt-1 text-sm text-slate2">{p.cardBlurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </>
  );
}

import Link from 'next/link';
import { PageHeader, Section, ActionTile, icons } from '@/components/ui';
import { news } from '@/content/news';
import { clubPages, clubPageGroups } from '@/content/club-life';
import { adverts } from '@/content/adverts';

export const metadata = { title: 'Club Life' };

/**
 * The index. Each card goes to a real page with the club's own writing on it,
 * not to a document search — that was the complaint about the first version and
 * it was a fair one.
 */
export default function ClubLifePage() {
  return (
    <>
      <PageHeader
        eyebrow="More than flying"
        title="Club Life"
        lead="News, flying reports, the calendar, competitions, the vintage rally and everything else that makes Camphill a club rather than an airfield."
      />

      <Section title="What is happening">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionTile href="/club-life/news" label="News and Notices" hint={`${news.length} notices, 2016 to date`} icon={icons.book} />
          <ActionTile href="/club-life/blog" label="Flying Blog" hint="Reports of flying days" icon={icons.plane} />
          <ActionTile href="/calendar" label="Calendar" hint="Courses, meetings, events" icon={icons.calendar} />
          <ActionTile href="/buy-and-sell" label="Buy and Sell" hint={`${adverts.length} member adverts`} icon={icons.people} />
          <ActionTile href="/club-life/roles" label="Roles and Role Holders" hint="Who does what, and what is vacant" icon={icons.people} />
        </div>
      </Section>

      {clubPageGroups.map((group) => {
        const pages = clubPages.filter((p) => p.group === group);
        if (!pages.length) return null;
        return (
          <Section key={group} title={group}>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/club-life/${p.slug}`}
                    className="card flex h-full flex-col p-5 transition-all hover:border-sky hover:shadow-lift"
                  >
                    <span className="text-lg font-semibold text-navy">{p.title}</span>
                    <span className="mt-1 text-xs uppercase tracking-wide text-sky">{p.eyebrow}</span>
                    <span className="mt-2 flex-1 text-sm text-inkMuted">{p.cardBlurb}</span>
                    <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-sky">
                      Open the page
                      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      <Section title="Photographs">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionTile
            href="/club-life/photo-galleries"
            label="Photo Galleries"
            hint="The club's six curated galleries"
            icon={icons.archive}
          />
          <ActionTile
            href="/gallery"
            label="Photo Gallery"
            hint="881 photographs across 67 albums"
            icon={icons.archive}
          />
          <ActionTile
            href="/gallery#send-us-your-best"
            label="Send us a photograph"
            hint="Your best shots, for the gallery"
            icon={icons.people}
          />
        </div>
      </Section>
    </>
  );
}

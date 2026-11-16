import Link from 'next/link';
import { Band, Figures, Section, ActionTile, icons } from '@/components/ui';
import { roles, vacantRoles } from '@/content/roles';
import { news } from '@/content/news';
import { clubPages, clubPageGroups } from '@/content/club-life';
import { adverts, isAdvertExpired } from '@/content/adverts';
import { totalPhotos } from '@/content/gallery';

export const metadata = { title: 'Club Life' };

/**
 * The index. Each card goes to a real page with the club's own writing on it,
 * not to a document search — that was the complaint about the first version and
 * it was a fair one.
 */
export default function ClubLifePage() {
  const liveAdverts = adverts.filter((a) => !isAdvertExpired(a)).length;
  const latest = news[0];

  return (
    <>
      <Band
        eyebrow="More than flying"
        title={
          <>
            Club <em>life</em>
          </>
        }
        lead="News, flying reports, the calendar, competitions, the vintage rally and everything else that makes Camphill a club rather than an airfield."
        figures={
          <Figures
            items={[
              {
                label: 'Latest notice',
                value: latest
                  ? new Date(latest.date + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
                  : '—',
                note: latest?.title ?? 'Nothing posted yet',
                href: '/club-life/news',
              },
              {
                label: 'Photographs',
                value: String(totalPhotos),
                note: 'The gallery, and how to add to it',
                href: '/gallery',
              },
              {
                label: 'Roles',
                value: String(roles.length),
                note:
                  vacantRoles.length > 0
                    ? `${vacantRoles.length} vacant — could one be yours?`
                    : 'Who does what',
                href: '/directory#roles',
              },
            ]}
          />
        }
      >
        <nav aria-label="What is happening" className="mt-7 flex flex-wrap gap-3">
          <Link href="/club-life/news" className="pill-accent">News and Notices</Link>
          <Link href="/calendar" className="pill-ghost">Calendar</Link>
          <Link href="/gallery" className="pill-ghost">Gallery</Link>
          <Link href="/directory" className="pill-ghost">Directory</Link>
        </nav>
      </Band>

      <Section title="What is happening">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionTile href="/club-life/news" label="News and Notices" hint={`${news.length} notices, 2016 to date`} icon={icons.book} />
          <ActionTile href="/club-life/blog" label="Flying Blog" hint="Reports of flying days" icon={icons.plane} />
          <ActionTile href="/calendar" label="Calendar" hint="Courses, meetings, events" icon={icons.calendar} />
          <ActionTile
            href="/buy-and-sell"
            label="Buy and Sell"
            hint={liveAdverts === 0 ? 'Nothing advertised at the moment' : `${liveAdverts} member advert${liveAdverts === 1 ? '' : 's'}`}
            icon={icons.people}
          />
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
                    className="card-interactive flex h-full flex-col p-5"
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

      <Section title="People, pictures and the record">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionTile href="/gallery" label="Gallery" hint={`${totalPhotos} photographs, and the club’s own galleries`} icon={icons.archive} />
          <ActionTile href="/directory" label="Directory" hint="Club numbers, roles and who holds them" icon={icons.people} />
          <ActionTile href="/archive" label="Archive" hint="Minutes, newsletters and past news" icon={icons.book} />
          <ActionTile href="/gallery#send-us-your-best" label="Send us a photograph" hint="Your best shots, for the gallery" icon={icons.people} />
        </div>
      </Section>
    </>
  );
}

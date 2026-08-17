import Link from 'next/link';
import { PageHeader, Section, ActionTile, icons, ToMigrate } from '@/components/ui';
import { news } from '@/content/news';
import { club } from '@/content/site';

export const metadata = { title: 'Club Life' };

export default function ClubLifePage() {
  return (
    <>
      <PageHeader
        eyebrow="More than flying"
        title="Club Life"
        lead="News, flying reports, the calendar, galleries, trophies and everything else that makes Camphill a club rather than an airfield."
      />

      <Section title="Read">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionTile href="/club-life/news" label="News and Notices" hint={`${news.length} recent items`} icon={icons.book} />
          <ActionTile href="/club-life/blog" label="Flying Blog" hint="Reports of flying days" icon={icons.plane} />
          <ActionTile href="/calendar" label="Calendar" hint="Courses, meetings, events" icon={icons.calendar} />
          <ActionTile href="/archive?q=newsletter" label="Newsletters" hint="Camphill Newsletter, 2004 on" icon={icons.archive} />
        </div>
      </Section>

      <Section title="Competition and achievement">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionTile href={club.bgaLadder} external label="BGA Ladder" hint="National cross-country ladder" icon={icons.plane} />
          <ActionTile href="/archive?q=inter-club" label="Inter-Club League" hint="Results and past seasons" icon={icons.people} />
          <ActionTile href="/archive?q=trophies" label="Trophy Winners" hint="Historic record" icon={icons.archive} />
          <ActionTile href="/documents?q=blake" label="Blake-Robertshaw Trophy" hint="Briefing and turnpoint photos" icon={icons.book} />
        </div>
      </Section>

      <Section title="Groups and events">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionTile href="/archive?q=vintage" label="Vintage Rally" hint="The club's flagship vintage event" icon={icons.plane} />
          <ActionTile href="/documents?q=junior" label="Junior Gliding" hint="For younger members" icon={icons.people} />
          <ActionTile href="/documents?q=silver" label="Silver Seekers" hint="Working towards Silver" icon={icons.graduation} />
        </div>
      </Section>

      <Section
        title="Members' classifieds"
        description="Anything to sell or hire? Seeking something to buy? Something to give away to a good home?"
      >
        <div className="card p-6">
          <h3 className="text-lg">Items for sale</h3>
          <div className="mt-3 border-l-4 border-skyLine pl-4">
            <p className="font-medium text-navy">Glider Guider — £25</p>
            <p className="mt-1 text-sm text-slate2">
              Can be loaded with SeeYou Mobile, XCSoar and LK8000. A great little nav aid. Comes with
              the full manual.
            </p>
            <p className="mt-1 text-xs text-slate2">Placed 7 November 2025 · Peter Gill</p>
          </div>
          <p className="mt-5 text-sm text-slate2">
            No items wanted and no other notices at present. To place an advert, contact the website
            editor.
          </p>
        </div>
      </Section>

      <Section title="Photographs">
        <ToMigrate what="All photo galleries from the old site — first solos, aerial shots, vintage rallies, club events and new winch drivers. Several hundred images across many gallery pages." />
        <p className="mt-3 text-sm text-slate2">
          Once imported these will live in{' '}
          <Link href="/archive" className="link">the Archive</Link>, browsable by year and event.
        </p>
      </Section>
    </>
  );
}

import Link from 'next/link';
import { PageHeader, Callout, ToMigrate, Section } from '@/components/ui';
import SubmitForm from '@/components/SubmitForm';
import { contacts } from '@/content/site';

export const metadata = { title: 'Flying Blog' };

/** Sample entries carried across so the page has real content and the voice is
 *  visible. The full archive imports with the mirror. */
const entries = [
  {
    date: '2024-11-29',
    display: 'Friday 29 November 2024',
    from: 'Dave Salmon',
    body: [
      '2024 has not been the best of flying years, and the last few weeks of low grey cloud, followed by snow, followed by rain have conspired to maintain this uninspiring record. The field became waterlogged so preventing flying, but today, walking on the field it is mostly in remarkably good condition, and we flew.',
      'The wind was a cold, brisk SE, not usually our best direction; there was evidence of wave clouds, though they were not classically formed. We had just enough to fly and operate the K13 and a K18. Brian opted for launching from the bungee gates, and the first launch was to 1400 ft. After a few minutes we realised that they weren’t coming back, and a look at Glide and Seek showed them climbing strongly through 2000 ft at Eyam. They eventually reached over 5000 ft altitude.',
      'Two flights in the K13 and two in the K18, all of over an hour, resulted in almost 5 hours of enjoyable and unexpected wave flying. We also had several weak link failures.',
      'The usual lesson of course — you have to be there!',
    ],
  },
  {
    date: '2023-01-02',
    display: 'Monday 2 January 2023',
    from: 'Dave Salmon',
    body: [
      'This was the first flying day of the year, thanks to Richard Dance for starting the ball rolling. It was a clear blue day with a light westerly, that freshened a little. The paragliders were soaring the ridge; we had to wait quite a time for the canopies to clear and the ice film on the wings to melt.',
      'Initially it was circuits, but around mid-day the blue wave clicked in and a number of pilots had soaring flights up to several thousand feet. About 18 pilots, including 2 visiting pilots, took 18 launches and flew for a little over 10 hours. It could have been a lot more, but it was important to get everyone airborne who wanted to fly.',
    ],
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="What the flying was like"
        title="Flying Blog"
        lead="Members' reports of flying days at Camphill. Any length is welcome — most contributors write the story of the day in 200 words or so."
      />

      <div className="mb-8 rounded-card border-2 border-sky bg-skyTint px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <p className="font-medium text-navy">
          Flown something worth telling people about?
        </p>
        <a
          href="#write-one"
          className="tap mt-3 gap-2 rounded-lg bg-sky px-5 py-3 font-semibold text-white
                     hover:bg-skyDark transition-colors sm:mt-0 sm:shrink-0"
        >
          Write a story
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 4v14m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <Callout tone="info" title="Write one">
          <p>
            Anyone is welcome to send a report about the day to the website editor. The text is also
            copied onto the club&rsquo;s public website as promotional material, so it&rsquo;s worth
            bearing that in mind.
          </p>
        </Callout>
        <Callout tone="warn" title="This needs restarting">
          <p>
            The blog&rsquo;s last entry was November 2024. It is one of the best things on the old
            site and worth reviving — the wave day below is exactly the sort of thing that gets
            people to the airfield.
          </p>
        </Callout>
      </div>

      <div className="space-y-6">
        {entries.map((e) => (
          <article key={e.date} className="card p-6">
            <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
              <time dateTime={e.date} className="text-lg font-semibold text-navy">{e.display}</time>
              <span className="text-sm italic text-inkMuted">from {e.from}</span>
            </div>
            <div className="prose-club mt-3">
              {e.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </article>
        ))}
      </div>

      <div id="write-one" className="scroll-mt-24" />
      <Section
        title="Write one"
        description="The blog only keeps going if members send things in. Two paragraphs is plenty."
      >
        <SubmitForm
          kind="blog"
          heading="Send a flying story"
          intro="Tell other members what the flying was like. The website editor reads everything and publishes it — nothing goes up automatically."
          bodyLabel="Your story"
          bodyPlaceholder="What the day was like, who flew, what the conditions did, anything that made it worth being there…"
          editorEmail={contacts.websiteEditor.email}
        />
      </Section>

      <div className="mt-8">
        <ToMigrate what="The full Flying Blog archive (home and away), including the soaring week write-ups from 2013 to 2024." />
        <p className="mt-3 text-sm text-inkMuted">
          Everything imports into <Link href="/archive" className="link">the Archive</Link>, searchable by year.
        </p>
      </div>
    </>
  );
}

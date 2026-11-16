import { PageHeader, Section } from '@/components/ui';
import SubmitForm from '@/components/SubmitForm';
import { contacts } from '@/content/site';

export const metadata = { title: 'Flying Blog' };

/** The entries carried across from the old site so far. Add new ones at the top. */
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
        back={{ href: '/club-life', label: 'Club Life' }}
        eyebrow="What the flying was like"
        title={
          <>
            The flying <em>blog</em>
          </>
        }
        lead="Members' reports of flying days at Camphill. Any length is welcome — most contributors write the story of the day in 200 words or so."
      />

      <Section
        title={
          <>
            From <em>the airfield</em>
          </>
        }
        action={<a href="#write-one" className="pill-line">Write a story</a>}
      >
        <div className="max-w-4xl">
          {entries.map((e) => (
            <article key={e.date} className="story">
              <time dateTime={e.date} className="block text-sm font-semibold uppercase tracking-[0.12em] text-slate2">
                {e.display}
              </time>
              <p className="mt-1 text-sm italic text-inkMuted">from {e.from}</p>
              <div className="prose-club mt-3">
                {e.body.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="write-one"
        title={
          <>
            Write <em>one</em>
          </>
        }
        description="The blog only keeps going if members send things in. Two paragraphs is plenty. The text is also copied onto the club’s public website as promotional material, so it’s worth bearing that in mind."
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
    </>
  );
}

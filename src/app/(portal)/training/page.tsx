import Link from 'next/link';
import { Band, BandPhoto, Figures, Section, Callout, outIcon } from '@/components/ui';
import { aim } from '@/content/awareim';
import type { Doc } from '@/content/documents';
import { flyingCards, flyingCardSummary, redCardTheoryTest } from '@/content/flying-cards';
import { startHere, towardsSolo, onTheGround, simulator, medical, briefings, libraryCount } from '@/content/training';
import FlyingCardPanel from '@/components/FlyingCardPanel';
import { isPortalPage } from '@/lib/files';

export const metadata = { title: 'Training' };

/**
 * This page shows a student what they need, not everything the club holds.
 * The full set is in the document library; each section ends with a button
 * that opens the library already filtered. The lists are in
 * src/content/training.ts.
 */
export default function TrainingPage() {
  const list = (docs: Doc[]) => (
    <ul className="card divide-y divide-skyLine overflow-hidden">
      {docs.map((d) => {
        const external = !isPortalPage(d.href);
        return (
          <li key={d.id}>
            <a
              href={d.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="block px-5 py-4 transition-colors hover:bg-sky50"
            >
              <span className="font-medium text-navy">{d.title}</span>
              {d.version && <span className="ml-2 text-sm text-slate2">{d.version}</span>}
              {d.note && <span className="mt-0.5 block max-w-prose2 text-sm text-inkMuted">{d.note}</span>}
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );

  const more = (category: Doc['category'], label: string) => (
    <Link href={`/documents?category=${encodeURIComponent(category)}`} className="pill-line">
      All {libraryCount(category)} {label}
    </Link>
  );

  return (
    <>
      <Band
        eyebrow="Learning to fly, and getting better at it"
        title={
          <>
            Training <em>at Camphill</em>
          </>
        }
        lead="Your progress, the flying card system, the SPL syllabus, theory briefings and medicals."
        aside={
          <BandPhoto
            src="/img/camphill-puchacz-briefing.jpg"
            alt="Members gathered round the club’s Puchacz two-seater at the launch point on a sunny day, a red parasol shading the cockpit."
            caption="The club’s Puchacz two-seater, between flights."
            width={1280}
            height={960}
            focus="center 55%"
            priority
          />
        }
        figures={
          <Figures
            items={[
              {
                label: 'Flying cards',
                value: String(flyingCards.length),
                note: flyingCards.map((c) => c.name.replace(' Card', '')).join(' · '),
                href: '#flying-cards',
              },
              briefings
                ? {
                    label: 'Classroom briefings',
                    value: briefings.code,
                    note: `Schedule for ${briefings.label}`,
                    href: '/flying/roster',
                  }
                : { label: 'Classroom briefings', value: '—', note: 'No schedule published yet' },
              {
                label: 'In the library',
                value: String(libraryCount('Flight Training') + libraryCount('Ground Training')),
                note: 'Training documents, searchable',
                href: '/documents?category=Flight%20Training',
              },
            ]}
          />
        }
      >
        <nav aria-label="Your record" className="mt-7 flex flex-wrap gap-3">
          <a href={aim('splReport')} target="_blank" rel="noopener noreferrer" className="pill-accent">
            My SPL Rolling Report {outIcon}
            <span className="sr-only">(opens Members’ Admin in a new tab)</span>
          </a>
          <a href={aim('logbook')} target="_blank" rel="noopener noreferrer" className="pill-ghost">
            My Log Book {outIcon}
            <span className="sr-only">(opens Members’ Admin in a new tab)</span>
          </a>
          <a href="#flying-cards" className="pill-ghost">Flying cards</a>
          <a href="#start-here" className="pill-ghost">New to the club</a>
        </nav>
      </Band>

      <Section
        id="flying-cards"
        title={
          <>
            The flying <em>card system</em>
          </>
        }
        description="Your card colour decides what you may fly and in what conditions. Open a card to see what it takes to hold it, and what it lets you do."
      >
        <FlyingCardPanel cards={flyingCards} />

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <a
            href={flyingCardSummary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="card-interactive flex flex-col p-5"
          >
            <span className="font-semibold text-navy">All four cards on one page</span>
            <span className="mt-1 text-sm text-inkMuted">
              The club&rsquo;s summary card — White, Red, Yellow and Green side by side, as the CFI
              publishes it. This is the authoritative version.
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={redCardTheoryTest.href}
            target="_blank"
            rel="noopener noreferrer"
            className="card-interactive flex flex-col p-5"
          >
            <span className="font-semibold text-navy">Red Card Theory Test</span>
            <span className="mt-1 text-sm text-inkMuted">
              One of the requirements to move to the Yellow card. Talk to any instructor when you
              are ready to sit it.
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        <div className="mt-4">
          <Callout tone="info">
            <p>
              The wording above is transcribed from the club&rsquo;s own cards. The CFI owns this
              system and the printed card you carry is what counts — where the two differ, the card
              wins. Tell the CFI if you spot a difference.
            </p>
          </Callout>
        </div>
      </Section>

      <Section
        id="start-here"
        title={
          <>
            New to the club? <em>Start here</em>
          </>
        }
        description="Four things to read before your first few days on the airfield."
      >
        {list(startHere)}
      </Section>

      <Section
        title={
          <>
            Towards solo <em>and the SPL</em>
          </>
        }
        description="The progress cards your instructor signs, the pre-solo theory briefings, and the forms you will meet on the way."
        action={more('Flight Training', 'flight training documents')}
      >
        {list(towardsSolo)}
        {briefings?.briefings && (
          <p className="mt-4 text-inkMuted">
            Classroom briefings for {briefings.label}:{' '}
            <a href={briefings.briefings.href} target="_blank" rel="noopener noreferrer" className="link">
              topics and schedule
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            . Instructors&rsquo; briefing notes, the Bronze theory presentations and the mentor
            material are all in the library.
          </p>
        )}
      </Section>

      <Section
        title={
          <>
            On the ground <em>and in the simulator</em>
          </>
        }
        description="What every member should know about handling gliders and looking after the airfield."
        action={more('Ground Training', 'ground training documents')}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg">Ground handling</h3>
            {list(onTheGround)}
          </div>
          <div>
            <h3 className="mb-3 text-lg">Simulator</h3>
            {list(simulator)}
            <h3 className="mb-3 mt-6 text-lg">Medicals</h3>
            {list([medical])}
            <p className="mt-3 text-sm text-inkMuted">
              <Link href="/documents?category=Medicals" className="link">Every medical document</Link>
              {' · '}
              <Link href="/documents?category=Simulator" className="link">Every simulator document</Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

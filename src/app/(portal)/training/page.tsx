import { PageHeader, Section, ActionTile, icons, Callout } from '@/components/ui';
import { aim } from '@/content/awareim';
import { documents } from '@/content/documents';
import { flyingCards, flyingCardSummary, redCardTheoryTest } from '@/content/flying-cards';
import FlyingCardPanel from '@/components/FlyingCardPanel';

export const metadata = { title: 'Training' };

export default function TrainingPage() {
  const flight = documents.filter((d) => d.category === 'Flight Training');
  const ground = documents.filter((d) => d.category === 'Ground Training');
  const medicals = documents.filter((d) => d.category === 'Medicals');
  const sim = documents.filter((d) => d.category === 'Simulator');

  const list = (docs: typeof documents) => (
    <ul className="card divide-y divide-skyLine overflow-hidden">
      {docs.map((d) => {
        const external = !d.href.startsWith('/');
        return (
          <li key={d.id}>
            <a
              href={d.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="block px-5 py-4 hover:bg-sky50 transition-colors"
            >
              <span className="font-medium text-navy">{d.title}</span>
              {d.note && <span className="mt-0.5 block max-w-prose2 text-sm text-inkMuted">{d.note}</span>}
              <span className="mt-1 block text-xs text-slate2">{d.audience.join(' · ')}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <PageHeader
        eyebrow="Learning to fly, and getting better at it"
        title="Training"
        lead="Your progress, the flying card system, the SPL syllabus, theory tests and medicals."
      />

      <Section title="Your record">
        <div className="grid gap-4 sm:grid-cols-2">
          <ActionTile href={aim('splReport')} external label="My SPL Rolling Report" hint="Your licence currency, in Members’ Admin" icon={icons.graduation} />
          <ActionTile href={aim('logbook')} external label="My Log Book" hint="Your recorded flights" icon={icons.book} />
        </div>
      </Section>

      <Section
        title="The flying card system"
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

      <Section title="Flight training" description="SPL syllabus, progress cards, theory tests and instructor material.">
        {list(flight)}
      </Section>

      <Section title="Ground training" description="What every member should know about handling gliders and looking after the airfield.">
        {list(ground)}
      </Section>

      <Section title="Simulator" description="Access, guidance and instruction at home.">
        {list(sim)}
      </Section>

      <Section title="Medicals" description="Declarations, procedures and guidance you can hand to your GP.">
        {list(medicals)}
      </Section>
    </>
  );
}

import { PageHeader, Section, ActionTile, icons, Callout } from '@/components/ui';
import { aim } from '@/content/awareim';
import { documents } from '@/content/documents';

export const metadata = { title: 'Training' };

/** The flying card system governs what you may fly and in what conditions.
 *  WCAG 1.4.1: never rely on the colour alone — always pair it with text. */
const CARDS = [
  { colour: 'White', swatch: 'bg-white border-2 border-skyLine', text: 'text-navy', meaning: 'Pre-solo and early solo. Tightest limits, closest supervision.' },
  { colour: 'Red', swatch: 'bg-bad', text: 'text-white', meaning: 'Consolidating solo flying under defined conditions.' },
  { colour: 'Yellow', swatch: 'bg-[#E0A800]', text: 'text-ink', meaning: 'Wider privileges as experience builds.' },
  { colour: 'Green', swatch: 'bg-good', text: 'text-white', meaning: 'Most experienced club pilots, widest privileges.' },
];

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
              className="block px-5 py-4 hover:bg-skyTint transition-colors"
            >
              <span className="font-medium text-navy">{d.title}</span>
              {d.note && <span className="mt-0.5 block max-w-prose2 text-sm text-slate2">{d.note}</span>}
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
        title="Flying cards"
        description="Your card colour determines what you may fly and in what conditions. Always check the current summary — the rules change."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <div key={c.colour} className="card overflow-hidden">
              <div className={`${c.swatch} ${c.text} px-4 py-3 font-semibold`}>{c.colour} Card</div>
              <p className="p-4 text-sm text-slate2">{c.meaning}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Callout tone="info">
            <p>
              The summaries above are a plain-English orientation only. The authoritative document is{' '}
              <a
                href={documents.find((d) => d.id === 'flying-cards')?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Flying Cards — all colours explained
              </a>
              , maintained by the CFI. Where the two differ, the CFI&rsquo;s document wins.
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

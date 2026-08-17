import { PageHeader, Callout } from '@/components/ui';
import { feeGroups, feeNotes, feesMeta, partYearScale } from '@/content/site';
import { AWAREIM_BASE } from '@/content/awareim';

export const metadata = { title: 'Fees and Charges' };

/**
 * Converted from PDF to a real web page — one of the top-20 documents members
 * read on a phone. Tables scroll horizontally inside their own container so the
 * page itself never scrolls sideways (WCAG 1.4.10).
 */
export default function FeesPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Effective ${feesMeta.effective}`}
        title="Fees and Charges"
        lead="Membership, flying, hangarage, workshop and accommodation. Previous year shown alongside for comparison."
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <Callout tone="info" title="Paying">
          <p>
            Your flying account balance, statements and payments are in Members&rsquo; Admin.{' '}
            <a href={AWAREIM_BASE} target="_blank" rel="noopener noreferrer" className="link">
              Open Members&rsquo; Admin
            </a>{' '}
            (new tab)
          </p>
        </Callout>
        <Callout tone="warn" title="Check the date">
          <p>
            This page was last updated {feesMeta.updated} for fees effective from{' '}
            {feesMeta.effective}. If today&rsquo;s date is well past the start of a new club year,
            check with the office before relying on it.
          </p>
        </Callout>
      </div>

      {feeGroups.map((g) => (
        <section key={g.group} className="mb-8">
          <h2 className="mb-3 text-2xl">{g.group}</h2>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">{g.group} fees</caption>
              <thead>
                <tr className="border-b-2 border-skyLine bg-skyTint">
                  <th scope="col" className="px-5 py-3 text-sm font-semibold text-navy">Item</th>
                  <th scope="col" className="px-5 py-3 text-sm font-semibold text-navy">Basis</th>
                  <th scope="col" className="px-5 py-3 text-right text-sm font-semibold text-navy">
                    From {feesMeta.effective.replace(' 2026', ' 26')}
                  </th>
                  <th scope="col" className="px-5 py-3 text-right text-sm font-semibold text-slate2">
                    Previous
                  </th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r, i) => (
                  <tr key={r.item} className={i % 2 ? 'bg-cloud/60' : ''}>
                    <th scope="row" className="px-5 py-3 text-sm font-normal text-ink">{r.item}</th>
                    <td className="px-5 py-3 text-sm text-slate2">{r.basis ?? '—'}</td>
                    <td className="px-5 py-3 text-right text-sm font-semibold tabular-nums text-navy">{r.now}</td>
                    <td className="px-5 py-3 text-right text-sm tabular-nums text-slate2">{r.prev ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="mb-8">
        <h2 className="mb-3 text-2xl">Part-year membership</h2>
        <p className="mb-3 max-w-prose2 text-sm text-slate2">
          Joining part way through the club year? Annual membership and rental fees are charged by
          month of joining, rounded to the nearest pound.
        </p>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[24rem] border-collapse text-left">
            <caption className="sr-only">Part-year membership percentage by month of joining</caption>
            <thead>
              <tr className="border-b-2 border-skyLine bg-skyTint">
                <th scope="col" className="px-5 py-3 text-sm font-semibold text-navy">Month of joining</th>
                <th scope="col" className="px-5 py-3 text-right text-sm font-semibold text-navy">Percentage due</th>
              </tr>
            </thead>
            <tbody>
              {partYearScale.map(([month, pct], i) => (
                <tr key={month} className={i % 2 ? 'bg-cloud/60' : ''}>
                  <th scope="row" className="px-5 py-3 text-sm font-normal text-ink">{month}</th>
                  <td className="px-5 py-3 text-right text-sm font-semibold tabular-nums text-navy">{pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl">Notes</h2>
        <ul className="card space-y-3 p-6 text-sm text-slate2">
          {feeNotes.map((n) => (
            <li key={n} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

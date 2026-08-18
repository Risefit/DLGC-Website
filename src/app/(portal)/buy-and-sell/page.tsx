import { PageHeader, Section, Callout } from '@/components/ui';
import { adverts, advertRules, isAdvertExpired } from '@/content/adverts';
import { contacts } from '@/content/site';
import AdvertForm from '@/components/AdvertForm';

export const metadata = { title: 'Buy and Sell' };

/**
 * PRESERVED FROM THE OLD SITE: adverts.asp, including the club's own rules —
 * members only, no commercial adverts, six months and renewable.
 *
 * The old page needed you to email Bob wording and wait. This one takes the
 * advert, the picture and the price, and sends it to the editor to approve.
 */
export default function BuyAndSellPage() {
  const live = adverts.filter((a) => !isAdvertExpired(a));
  const groups = ['For sale', 'Wanted', 'Free to a good home', 'Notice'] as const;

  return (
    <>
      <PageHeader
        eyebrow="Members’ classifieds"
        title="Buy and Sell"
        lead="Something to sell or hire, something you are looking for, something to give away to a good home, or something to announce."
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-[3fr_2fr]">
        <div>
          {live.length === 0 ? (
            <div className="card p-6">
              <p className="text-slate2">
                Nothing is advertised at the moment. Yours would be the first — use the form.
              </p>
            </div>
          ) : (
            groups.map((g) => {
              const items = live.filter((a) => a.kind === g);
              if (!items.length) return null;
              return (
                <Section key={g} title={g}>
                  <ul className="space-y-4">
                    {items.map((a) => (
                      <li key={a.id} className="card p-5">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="text-lg font-semibold text-navy">{a.title}</h3>
                          {a.price && (
                            <span className="rounded bg-goodTint px-2.5 py-0.5 font-semibold text-good">
                              {a.price}
                            </span>
                          )}
                        </div>
                        <div className="prose-club mt-2 text-sm">
                          {a.details.map((d, i) => (
                            <p key={i}>{d}</p>
                          ))}
                        </div>
                        {a.contact && (
                          <p className="mt-3 border-t border-skyLine pt-3 text-sm">
                            <span className="font-medium text-navy">{a.contact.name}</span>
                            {a.contact.phone?.map((t) => (
                              <span key={t}>
                                {' · '}
                                <a href={`tel:${t.replace(/\s/g, '')}`} className="link">{t}</a>
                              </span>
                            ))}
                            {a.contact.email && (
                              <span>
                                {' · '}
                                <a href={`mailto:${a.contact.email}`} className="link">
                                  {a.contact.email}
                                </a>
                              </span>
                            )}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-slate2">Placed {a.displayPlaced}</p>
                      </li>
                    ))}
                  </ul>
                </Section>
              );
            })
          )}
        </div>

        <aside>
          <Callout tone="info" title="How this page works">
            <ul className="space-y-1.5 text-sm">
              {advertRules.map((r) => (
                <li key={r} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Callout>
          <div className="mt-4 card p-5">
            <p className="text-sm text-slate2">
              Sold it, or found what you were after? Tell the editor and the advert comes down —
              nobody enjoys ringing about something that went weeks ago.
            </p>
            <a href={`mailto:${contacts.websiteEditor.email}`} className="link mt-2 inline-block text-sm">
              Email the website editor
            </a>
          </div>
        </aside>
      </div>

      <Section title="Advertise something">
        <AdvertForm editorEmail={contacts.websiteEditor.email} />
      </Section>
    </>
  );
}

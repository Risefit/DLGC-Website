/**
 * THE FLYING CARD SYSTEM — the thing that decides what you may fly and in what
 * conditions. Transcribed from the club's own documents:
 *
 *   pdfs/Flying Cards Summary-1.pdf              (White, Red, Yellow, Green)
 *   misc_pages/Flying Cards/BlueCard1406.pdf     (Blue — solo visitors)
 *   flyingcards.asp                              (the index of card PDFs)
 *
 * The old site gave you six PDF links and nothing else, so you had to open a
 * PDF to find out whether it was the one you wanted. The synopsis and the
 * qualifications/permissions below come straight from the summary card, so a
 * member can read the whole system on one screen and open a card only when they
 * need the detail.
 *
 * RULE 4 (see CLAUDE.md): never rely on colour alone. Every card is named as
 * well as coloured, everywhere it appears.
 *
 * SAFETY-CRITICAL. The CFI owns this content. Do not reword it to read better —
 * if something here is wrong, fix it against the club's PDF, not from memory.
 */

const OLD = 'https://www.dlgc.org.uk/members';

export type FlyingCard = {
  slug: string;
  name: string;
  /** One line: who holds this card. Shown on the closed card. */
  who: string;
  /** Two or three sentences of plain-English orientation. */
  synopsis: string;
  qualifications: string[];
  permissions: string[];
  /** The club's own card PDF. */
  href: string;
  /** Tailwind tokens for the colour band — paired with the name, never alone. */
  tone: {
    band: string;
    text: string;
    tint: string;
    border: string;
  };
};

export const flyingCards: FlyingCard[] = [
  {
    slug: 'white',
    name: 'White Card',
    who: 'Newly solo pilots',
    synopsis:
      'The first card after going solo. You fly within gliding range of Camphill, launching north or south only, with a pre-flight briefing from an instructor every time and daily checks until an instructor signs you off. It is deliberately tight: the limits come off one at a time as experience builds.',
    qualifications: [
      'Solo',
      'Gliding certificate issued',
      'Trainee pilot theory test passed',
    ],
    permissions: [
      'Must submit to daily checks before flying until signed off daily checks by an instructor (15 solo flights, no recurring issues arising during check flights, no observed issues with solo flying, currency — at least 5 solo flights in the past month)',
      'Must have pre-flight briefing from an instructor',
      'May fly only within gliding range of the site',
      'May launch to North or South only',
      'Maximum flight time 45 minutes',
      'Max 90° crosswind 5kts (until crosswind sign off)',
      'May fly only glider types for which approved',
    ],
    href: `${OLD}/misc_pages/Flying%20Cards/WhiteCard%20for%20Website%20Oct%202025.pdf`,
    tone: { band: 'bg-slate-100 text-navy', text: 'text-navy', tint: 'bg-white', border: 'border-slate-300' },
  },
  {
    slug: 'red',
    name: 'Red Card',
    who: 'Consolidating solo pilots',
    synopsis:
      'Awarded once you have 25 solo flights and can handle crosswind launches and landings, launch failures at low and medium level, and stall and spin recovery. You still fly within gliding range and still take a pre-flight briefing, but the handling standard expected of you has stepped up considerably.',
    qualifications: [
      '25 solo flights (minimum)',
      'Off daily checks',
      'Launch and landing, 8 to 10 kts 90° crosswind component',
      'Landing to West in West wind 10kts–15kts',
      'Speed control (±5 kts) on circuit, approach, no wind',
      'Accurate reference point control using airfield markers',
      'Consistent and complete lookout',
      'Recovery from low level launch failure',
      'Recovery from medium level launch failure',
      'Stall set up and recovery (1G)',
      'Spin recovery (½ turn)',
    ],
    permissions: [
      'May fly only within gliding range of the site until XCE or LAPL XC completed',
      'Must have pre-flight briefing from an instructor',
      'May launch to West when qualified (see Yellow Card qualifications) and satisfactory check flight or approval on the day',
      'May not soar below circuit height of the day or above cloud base',
      'Subject to specified currency, annual checks and weather conditions / limits',
      'May only fly glider types for which approved',
    ],
    href: `${OLD}/misc_pages/Flying%20Cards/Red%20Card%20V7.4%20Jan%202026%20All%20Sides%20for%20Website.pdf`,
    tone: { band: 'bg-bad text-white', text: 'text-bad', tint: 'bg-badTint', border: 'border-bad' },
  },
  {
    slug: 'yellow',
    name: 'Yellow Card',
    who: 'Cross-country pilots in the making',
    synopsis:
      'The card that lets you leave the hill. It covers west launch failures high and low, west crosswind landings, low ridge flying, navigation, field selection and landing, and the Red Card Theory Test. You still need a pre-flight briefing until your LAPL or SPL is issued, and a cross-country briefing before any XC until Silver or licence is complete.',
    qualifications: [
      'West launch failure — high and low',
      'West crosswind low landing',
      'East crosswind (10–15kts)',
      'Low ridge flying',
      'Red Card Theory Test',
      'DI club solo types',
      'De-rig, rig club solo types',
      'Bronze endorsement',
      'Navigation',
      'Field select and land',
      'XCE / LAPL XC',
    ],
    permissions: [
      'Must obtain pre-flight briefing from instructor until LAPL / SPL obtained',
      'Must get XC briefing from qualified instructor before any XC until Silver Badge or Licence complete',
      'Subject to specified currency, annual checks, and weather conditions / limits',
      'May fly only glider types for which approved',
    ],
    href: `${OLD}/misc_pages/Flying%20Cards/YellowCard1403.pdf`,
    tone: { band: 'bg-warn text-white', text: 'text-warn', tint: 'bg-warnTint', border: 'border-warn' },
  },
  {
    slug: 'green',
    name: 'Green Card',
    who: 'Fully self-briefing pilots',
    synopsis:
      'The top of the system. Silver Badge, a licence, 150 hours P1 or an instructor rating, a westerly 30kt flight at 600 feet and repeated Bronze-level stall and spin tests. From here you brief yourself and fly in any safe conditions, subject only to currency and annual checks.',
    qualifications: [
      'Silver Badge',
      'LAPL / SPL',
      '150 hrs P1 or Assistant Rated Instructor or EASA FI rating',
      'Westerly 30kts at 600 feet flight',
      'Bronze level stalls and spins flying test repeated',
    ],
    permissions: [
      'Self briefing',
      'May fly in any safe conditions subject to specified currency, annual checks',
    ],
    href: `${OLD}/misc_pages/Flying%20Cards/GreenCard1403.pdf`,
    tone: { band: 'bg-good text-white', text: 'text-good', tint: 'bg-goodTint', border: 'border-good' },
  },
  {
    slug: 'blue',
    name: 'Blue Card',
    who: 'Solo visitors and new solo members',
    synopsis:
      'Not a rung on the ladder — a way in. A visiting solo pilot, or a new solo member, records their experience and an instructor allocates the DLGC card colour that matches it. Solo flying starts restricted to north/south launches in benign conditions, with test flights before solo unless the instructor waives them.',
    qualifications: [
      'Membership form completed, medical certification valid, and for a private glider a valid ARC and insurance',
      'Pilot records solo experience: Camphill launches, ridge experience, other hill sites, wave flying, winch currency, date of last spin / stall or annual checks, and gliders currently flown solo',
      'Instructor reviews the log book, then specifies which test flights must be flown and which are waived',
      'Test flights before solo north/south: site check; solo standard handling and lookout; normal launch, circuit, approach and landing N/S; recovery from medium level launch failure N/S; stall set up and recovery (1G); spin recovery (½ turn)',
    ],
    permissions: [
      'Instructor allocates an equivalent DLGC card colour based on the pilot information section',
      'Solo flying restricted to launches north/south in benign conditions only, until extra tests are completed for more challenging conditions and launch directions',
      'Instructor records the glider types the pilot is approved to fly, and any endorsements',
      'Must seek the advice of an instructor before solo flight if the prevailing conditions are as specified on the card',
      'Must produce this card with the log book when a briefing is required or a test completed',
      'Should ask for an instructor briefing if wave conditions are reported',
    ],
    href: `${OLD}/misc_pages/Flying%20Cards/BlueCard1406.pdf`,
    tone: { band: 'bg-sky text-white', text: 'text-sky', tint: 'bg-skyTint', border: 'border-sky' },
  },
];

/** The one-page comparison of all four main cards, as the club publishes it. */
export const flyingCardSummary = {
  label: 'Flying Cards Summary — all four cards on one page',
  href: `${OLD}/pdfs/Flying%20Cards%20Summary-1.pdf`,
};

/** The old site's index page, kept so nothing is lost. */
export const flyingCardsIndex = `${OLD}/flyingcards.asp`;

export const redCardTheoryTest = {
  label: 'Red Card Theory Test',
  href: `${OLD}/pdfs/Red%20Card%20Theory%20test%20V23%20final.pdf`,
};

/**
 * CLUB LIFE — the parts of the club that are not flying training.
 *
 * The old site had a real page for each of these, written by the member who
 * ran it, with its own voice. The first version of this portal replaced them
 * with a document search, which lost the writing and left members with a list
 * of filenames. These are those pages, rebuilt: the prose from the original,
 * the links alongside it, in the new format.
 *
 * Text is transcribed from the old pages, lightly tidied for typos only. Where
 * a page named its author or steward, that name is kept — it is how a member
 * knows who to ask.
 *
 *   VintageRally.asp · silvrskrs.asp · junior_gliding.asp · bgaladder.asp
 *   blake-rbshw/blake_rbshw_briefA.asp · trophies 2025.asp · i-clb-lg.asp
 *   newsletters/newsletters.asp
 */

const OLD = 'https://www.dlgc.org.uk/members';

export type ClubLink = { label: string; href: string; note?: string };
export type ClubSection = { heading?: string; paras?: string[]; links?: ClubLink[]; columns?: 1 | 2 | 3 };

export type ClubPage = {
  slug: string;
  title: string;
  eyebrow: string;
  lead: string;
  /** Who runs it, so a member knows who to ask. */
  steward?: { name: string; role: string; contact?: string };
  sections: ClubSection[];
  /** The original page, kept so nothing is lost. */
  source: string;
  /** Which grouping it belongs to on /club-life. */
  group: 'Read' | 'Competition' | 'Groups and events';
  /** One line for the card on the Club Life index. */
  cardBlurb: string;
};

export const clubPages: ClubPage[] = [
  // ── Groups and events ────────────────────────────────────────────────────
  {
    slug: 'vintage-rally',
    title: 'Annual Vintage Rally',
    eyebrow: 'A week in June, every year',
    lead:
      'Camphill’s vintage gliding week — pilots and aircraft from across the UK and beyond, flying every day and eating rather well in the evenings.',
    group: 'Groups and events',
    cardBlurb: 'The club’s vintage week — who comes, what flies, and what the evenings look like.',
    steward: { name: 'Mike Armstrong and Steve Marlor', role: 'Rally organisers' },
    sections: [
      {
        heading: 'What the week is like',
        paras: [
          'A recent rally drew 20 pilots plus crew from eleven different gliding sites around the UK, and one each from Australia and the Netherlands. There were no flying or ground accidents and the club flew every day, even though the soaring was variable.',
          'The entertainment starts with the Welcome Buffet and live music, and runs through the week: the quiz, curry night, the Senior Members Lunch, the Gala Dinner and horseshoes on the Friday. Accommodation books up early — regulars tend to reserve for the following year before they leave.',
          'It takes a lot of volunteers. If you can give a few hours to ground operations during the week, the rally team would be glad of it, and the Volunteers Rota is published on the club website each year.',
        ],
      },
      {
        heading: 'By the numbers, from a recent rally',
        paras: [
          'Total launches 291 · Hours flown 102 · Tasks set and completed 4 of 10, set by Mike Stephens and Pete Gray. Alongside the flying: outlandings, first solos, conversions to new types and a Silver distance.',
          'The rally is a meaningful revenue stream for the club as well as a good week — launch fees, soaring fees in club aircraft, rally fees, bedrooms, camping and the bar all contribute.',
        ],
      },
      {
        heading: 'Rally pages and reports',
        links: [
          { label: 'The original Vintage Rally page', href: `${OLD}/VintageRally.asp`, note: 'Reports and photographs from previous years' },
        ],
      },
    ],
    source: `${OLD}/VintageRally.asp`,
  },
  {
    slug: 'junior-gliding',
    title: 'Junior Gliding',
    eyebrow: 'If you are under 26',
    lead:
      'Camphill is a BGA Junior Gliding Centre — accredited for having the policies, procedures and support in place to encourage pilots under 26. There are discounts, a credit scheme and a bursary.',
    group: 'Groups and events',
    cardBlurb: 'Discounts, the Junior Credit Scheme, the bursary, and where the junior events are.',
    sections: [
      {
        heading: 'What you get at Camphill',
        paras: [
          'Flying members under 18, between 18 and 21, or under 26 and in full-time education are eligible for discounts on membership, launches and soaring fees. The rates are on the Fees page.',
          'The club also runs a Junior Credit Scheme. Flying members under 21 — or under 26 and still in full-time education — earn credit tokens for completing a specified task of at least three hours. A three-hour task earns two tokens, each exchangeable at the launch point for a free launch. Tokens expire three months after the issue date, and completed tasks need logging on a Junior Credits Log Sheet.',
          'There is a Junior Gliding Bursary too. If you are eligible and want the help it offers, print and complete the application form.',
        ],
        links: [
          { label: 'Junior Credit Log Sheet', href: `${OLD}/pdfs/Junior%20Credit%20Log%20Sheet.pdf`, note: 'Example — log your completed tasks on this' },
          { label: 'Junior Fund Application Form', href: `${OLD}/pdfs/Junior%20Fund%20Application%20Form.pdf`, note: 'The club’s bursary scheme' },
        ],
      },
      {
        heading: 'Beyond Camphill',
        paras: [
          'UK Junior Gliding runs events throughout the year where young pilots join in for a weekend away — a different site, pilots from across the country, new flying experiences. The annual UK Junior Nationals is open to any junior pilot with a Silver Badge. To join in, contact UKJG for the arrangements, and the host club for site details.',
        ],
        links: [
          { label: 'UK Junior Gliding', href: 'http://www.juniorgliding.co.uk/', note: 'Events, contacts and what is on' },
          { label: 'BGA Junior Gliding', href: 'https://members.gliding.co.uk/pilot-resources-flying-training/junior-gliding/' },
          { label: 'BGA Junior Gliding — funding opportunities', href: 'https://members.gliding.co.uk/junior-gliding/funding-opportunities/' },
          { label: 'BGA Junior Gliding Centre resources', href: 'https://members.gliding.co.uk/club-development/jgc-resources/', note: 'What the accreditation means' },
          { label: 'Email UK Junior Gliding', href: 'mailto:ukjuniorgliding@gmail.com' },
        ],
        columns: 2,
      },
    ],
    source: `${OLD}/junior_gliding.asp`,
  },

  // ── Read ─────────────────────────────────────────────────────────────────
  {
    slug: 'silver-seekers',
    title: 'Society of Silver Seekers',
    eyebrow: 'Members writing for members',
    lead:
      'A record compiled by members of their own experience getting to the Silver badge — what helped, what went wrong, and what they wish they had known. Useful at any level, not just to badge hunters.',
    group: 'Read',
    cardBlurb: 'Members’ own accounts of getting to Silver, plus a library on cross-country flying.',
    steward: { name: 'John McKenzie', role: 'Contributions welcome — get in touch' },
    sections: [
      {
        paras: [
          'The information on this page was compiled by members as a record of their experiences. It offers ideas, information and suggestions about how the path to the Silver badge can be made a little easier. It also covers soaring and cross-country skills and techniques that are of interest to all members, whatever their level of experience.',
          'Why not fly your Silver distance as a Blake Robertshaw task and collect points towards the trophy at the same time? There is good advice in the Notes for Badge Hunters on the Blake Robertshaw page.',
        ],
      },
      {
        heading: 'Getting there — the collected articles',
        links: [
          { label: 'Secrets of "Getting Away"', href: `${OLD}/sossfiles/sossarticles/The%20Secrets%20of%20Getting%20Away%20v2.pdf`, note: 'Leaving the hill is a scary thought, but people do it. What are the secrets?' },
          { label: 'Preparation — Silver distance, part A', href: `${OLD}/sossfiles/sossarticles/Coaching_Corner1.pdf` },
          { label: 'The Flight — Silver distance, part B', href: `${OLD}/sossfiles/sossarticles/Coaching%20Corner2.pdf` },
          { label: 'Silver Distance Pitfalls', href: `${OLD}/sossfiles/sossarticles/SilvDistWhatCanGoWrong.pdf`, note: 'Plenty of solo practice on modest tasks first' },
          { label: 'Silver Distance Landings', href: `${OLD}/sossfiles/sossarticles/Silver%20landings-1.pdf`, note: 'Nearby club sites to consider, with contact and access details' },
          { label: 'Syllabus', href: `${OLD}/sossfiles/sossarticles/syllabus.pdf`, note: 'Things to do, things to know, who needs to know, what to prepare' },
          { label: 'Training', href: `${OLD}/sossfiles/sossarticles/SilverBadgeTraining.pdf`, note: 'Opportunities to improve knowledge and skills' },
          { label: 'Logging the Flight', href: `${OLD}/sossfiles/sossarticles/ew_logger_brief.pdf`, note: 'How to use the club’s logger' },
          { label: 'Making a Claim', href: `${OLD}/sossfiles/sossarticles/Making%20a%20claim.pdf`, note: 'Claims and declarations' },
          { label: 'The 1% Rule', href: `${OLD}/sossfiles/sossarticles/Height%20problems%20OO.pdf` },
          { label: 'Mountain Flying Safety', href: `${OLD}/sossfiles/sossarticles/St%20Auban%20Mountain%20flying%20safety.pdf`, note: 'Flying low on ridges, in mountains and in wave — applicable at Camphill' },
          { label: 'Matlock and back', href: `${OLD}/sossfiles/sossarticles/Matlock&BackbyJS.htm`, note: 'An inspirational tale of a hill soaring flight' },
        ],
        columns: 2,
      },
      {
        heading: 'Members’ own Silver distance accounts',
        paras: ['Different pilots, different days, same badge. Worth reading more than one.'],
        links: [
          { label: 'Silver Distance — AO', href: `${OLD}/sossfiles/sossarticles/Silver%20C_How%20did%20that%20happen.docx` },
          { label: 'Silver Distance — CH', href: `${OLD}/sossfiles/sossarticles/MySilvDist-ClnH%5B1%5D.pdf` },
          { label: 'Silver Distance — SD', href: `${OLD}/sossfiles/sossarticles/SlvrDstStrtDdsn.doc` },
          { label: 'Silver Distance — PM', href: `${OLD}/sossfiles/sossarticles/pmsilverc.pdf` },
          { label: 'Silver Distance — CK', href: `${OLD}/sossfiles/sossarticles/SilverDistChrisKnapp%5B1%5D.pdf` },
          { label: 'Silver Distance — CK, again', href: `${OLD}/sossfiles/sossarticles/SilverDistChrisKnapp2%5B1%5D.pdf` },
          { label: 'Silver Distance — PH', href: `${OLD}/sossfiles/sossarticles/Silver%20Distance%20PH%5B1%5D.pdf` },
          { label: 'Silver Distance — DJ', href: `${OLD}/sossfiles/sossarticles/SlvrDistDJones%5B1%5D.pdf` },
          { label: 'Silver Distance — GL', href: `${OLD}/sossfiles/sossarticles/Silver%20Journey%20(GW)%5B1%5D.pdf` },
          { label: 'Silver Distance — LM', href: `${OLD}/sossfiles/sossarticles/SilverDistLizMartin.pdf` },
          { label: 'Silver Distance — MW', href: `${OLD}/sossfiles/sossarticles/SilverDistMartinWilcox.pdf` },
          { label: 'Silver Distance — SM', href: `${OLD}/sossfiles/sossarticles/Silver%20distance%20SM.pdf` },
          { label: 'A Silver distance attempt, and a field landing', href: `${OLD}/sossfiles/sossarticles/Field_landing_Martin_Fr.pdf` },
        ],
        columns: 3,
      },
      {
        heading: 'Hints, tips and checklists',
        links: [
          { label: 'Landing Out Kit', href: `${OLD}/sossfiles/sosshintstips/Landing%20Out%20Kit.doc` },
          { label: 'Notes for 50K — checklist', href: `${OLD}/sossfiles/sosshintstips/NOTES%20FOR%2050K.doc` },
          { label: 'Notes on the Cross Country Endorsement', href: `${OLD}/sossfiles/sosshintstips/Notes%20on%20Cross%20Country%20Endorsement.doc` },
          { label: 'Getting the CCE — a personal view', href: `${OLD}/sossfiles/sosshintstips/A%20personal%20view%20-%20C%20C%20E.doc` },
          { label: 'Trailer towing checklist', href: `${OLD}/sossfiles/sosshintstips/Trailer%20towing%20check%20list.doc` },
          { label: 'Travel checklist, page 1', href: `${OLD}/sossfiles/sosshintstips/Travel%20Check%20List,%20Page1.doc` },
          { label: 'Travel checklist, page 2', href: `${OLD}/sossfiles/sosshintstips/Travel%20Check%20List%20Page%202.doc` },
          { label: 'The Hairpin Bend, going down', href: `${OLD}/sossfiles/sosshintstips/HAIRPIN%20DOWN.jpg` },
          { label: 'The Hairpin Bend, going up', href: `${OLD}/sossfiles/sosshintstips/HAIRPIN%20UP.jpg` },
          { label: 'Miscellaneous comments received', href: `${OLD}/sossfiles/sosshintstips/comments%20received.doc` },
        ],
        columns: 2,
      },
      {
        heading: 'From the BGA and elsewhere',
        links: [
          { label: 'Breaking the site barrier', href: 'https://members.gliding.co.uk/wp-content/uploads/sites/3/2015/04/1430311842_Breakingthesitebarrier.pdf', note: 'BGA' },
          { label: 'Prepare for some fun — early cross country', href: 'https://members.gliding.co.uk/wp-content/uploads/sites/3/2015/04/1430311859_Prepareforsomefun.pdf', note: 'BGA' },
          { label: 'Guidance following a field landing', href: 'https://members.gliding.co.uk/wp-content/uploads/sites/3/2015/04/1430311903_Guidancefollowingafieldlanding.pdf', note: 'BGA' },
          { label: 'Navigation — BGA guidance', href: 'https://members.gliding.co.uk/wp-content/uploads/sites/3/2017/08/7-25-NAVIGATION-V3-2017.pdf', note: 'BGA' },
          { label: 'Field landing tutorials', href: 'https://members.gliding.co.uk/library-search-results/?bgasearch_keyword=field+landing+tutorial', note: 'BGA library search' },
          { label: 'CAA Safety Sense leaflet 25', href: 'http://publicapps.caa.co.uk/docs/33/ga_srg_09webSSL25October.pdf', note: 'CAA' },
          { label: 'Aerodrome Traffic Zones explained', href: 'https://airspacesafety.com/wp-content/uploads/2019/04/AerodromeTrafficZone.pdf', note: 'Airspace & Safety Initiative' },
          { label: 'Radio frequencies and outlandings', href: 'https://www.ruskin.me.uk/gliding-data' },
          { label: 'Sporting Code Section 3C (2017)', href: 'https://www.fai.org/sites/default/files/basic_page/document/sc3c_2017.pdf', note: 'FAI' },
          { label: 'Pilot conspicuity', href: `${OLD}/pdfs/Pilot%20conspicuity.pdf` },
          { label: 'Chart folding', href: 'https://youtu.be/NJgN_opXEEo', note: 'Video' },
        ],
        columns: 2,
      },
    ],
    source: `${OLD}/silvrskrs.asp`,
  },
  {
    slug: 'newsletters',
    title: 'Camphill Newsletters',
    eyebrow: 'The club, quarter by quarter',
    lead:
      'The club newsletter, running back to 2004. Reports, photographs, obituaries and the small detail of club life that nothing else records.',
    group: 'Read',
    cardBlurb: 'Every issue back to 2004, in the archive.',
    sections: [
      {
        paras: [
          'Every issue has been kept. They are held as a collection in the archive, newest first, so you can read a run of them rather than hunting one at a time.',
        ],
        links: [
          { label: 'Camphill Newsletters in the archive', href: '/archive/camphill-newsletters', note: 'Every issue, grouped by year' },
        ],
      },
    ],
    source: `${OLD}/newsletters/newsletters.asp`,
  },

  // ── Competition ──────────────────────────────────────────────────────────
  {
    slug: 'bga-ladder',
    title: 'BGA Ladder',
    eyebrow: 'A national competition we can all enter',
    lead:
      'The BGA National Ladder runs annually from October. Camphill pilots usually occupy the higher positions in the Height section — and there are four other categories for the summer cross-country season.',
    group: 'Competition',
    cardBlurb: 'The national ladder, where Camphill does rather well in the Height section.',
    steward: { name: 'John McKenzie', role: 'BGA Ladder Steward', contact: '01663 734162' },
    sections: [
      {
        paras: [
          'We have a really good opportunity to score well in the Height section of the Ladder, and Camphill pilots usually occupy the higher positions in that category. There are four other categories which are more relevant to the summer cross-country season.',
          'Although the Ladder is primarily a competition — with many prizes — it is also an interesting way of communicating enthusiasm, expertise and knowledge between like-minded people. It offers clever ways to plan tasks, calculate points for cross-country flights, and analyse flights, glider types, soaring days and different sites. It gives an insight into the handicapping system and lets you discreetly see how your flights compare, even if you do not want to record them.',
          'The Ladder complements our own Notable Flights board, the cross-country book, our trophy system and the Blake Robertshaw competition — the Blake Robertshaw is itself registered on the BGA Ladder. Not only are our flights and scores published nationally, but some of our local tasks can be flown without a declaration as though they had been pre-declared. It is a small bonus that adds points.',
          'The BGA use the statistics on the site anonymously to justify their campaigns over airspace restrictions. Putting your flights on the Ladder is another opportunity to get the club noticed and show off how talented we all are.',
        ],
      },
      {
        links: [
          { label: 'BGA National Ladder', href: 'https://www.bgaladder.net/', note: 'Enter your flights and see how the club is doing' },
        ],
      },
    ],
    source: `${OLD}/bgaladder.asp`,
  },
  {
    slug: 'blake-robertshaw',
    title: 'Blake Robertshaw Trophy',
    eyebrow: '1 April to 30 September, every year',
    lead:
      'The club’s own cross-country task competition, run over the summer season. Fly the tasks, score the points — and a Silver distance flown as a Blake Robertshaw task counts for both.',
    group: 'Competition',
    cardBlurb: 'The club’s summer task competition — task list, turn points, rules and scoring.',
    steward: { name: 'Owen Brown', role: 'Competition steward' },
    sections: [
      {
        paras: [
          'The season runs from 1 April to 30 September. The competition is registered on the BGA Ladder, so flights entered there count here too.',
          'If you are working towards Silver, the Notes for Badge Hunters section is worth reading before you plan anything — flying your Silver distance as a Blake Robertshaw task collects points towards the trophy at the same time.',
        ],
      },
      {
        heading: 'The competition pages',
        links: [
          { label: 'Introduction, latest news and results', href: `${OLD}/blake-rbshw/blake_rbshw_briefA_Aor22.asp` },
          { label: 'Task list', href: `${OLD}/blake-rbshw/blake_rbshw_briefB.asp` },
          { label: 'Local turn points', href: `${OLD}/blake-rbshw/blake_rbshw_briefC.asp` },
          { label: 'Rules and scoring', href: `${OLD}/blake-rbshw/blake_rbshw_briefD.asp` },
          { label: 'Notes for badge hunters', href: `${OLD}/blake-rbshw/blake_rbshw_briefE.asp`, note: 'Read this if you are chasing Silver' },
        ],
        columns: 2,
      },
    ],
    source: `${OLD}/blake-rbshw/blake_rbshw_briefA.asp`,
  },
  {
    slug: 'inter-club-league',
    title: 'Inter-Club League',
    eyebrow: 'Camphill against the neighbours',
    lead:
      'The regional inter-club league — a friendly competition against nearby clubs, and the easiest way into competition flying if you have never done it.',
    group: 'Competition',
    cardBlurb: 'Friendly regional competition, and the gentlest way into competition flying.',
    sections: [
      {
        paras: [
          'The league runs across the season with rounds hosted by the participating clubs in turn. It is genuinely approachable — you do not need a glass ship or a competition number, and there is usually someone who will crew for you if you ask.',
        ],
        links: [
          { label: 'Inter-Club League page on the old site', href: `${OLD}/i-clb-lg.asp`, note: 'Fixtures, teams and results' },
        ],
      },
    ],
    source: `${OLD}/i-clb-lg.asp`,
  },
  {
    slug: 'trophies',
    title: 'Trophies and Trophy Winners',
    eyebrow: 'Presented at the AGM',
    lead:
      'Thirteen club trophies for flying achievement, presented each year at the Annual General Meeting, plus the record of who has won what.',
    group: 'Competition',
    cardBlurb: 'The club’s trophies, what each is for, and every winner on record.',
    sections: [
      {
        paras: [
          'At the AGM the clubroom fills up to applaud the winners of the club’s trophies for flying achievements. The full list of trophies, what each one recognises, and the winners of each going back through the club’s history is maintained on the trophies page.',
        ],
        links: [
          { label: 'Trophies and winners', href: `${OLD}/trophies%202025.asp`, note: 'Every trophy and every winner on record' },
          { label: 'Awards scheme details', href: `${OLD}/trophies.asp` },
        ],
        columns: 2,
      },
    ],
    source: `${OLD}/trophies%202025.asp`,
  },
];

export const clubPageGroups: ClubPage['group'][] = ['Groups and events', 'Competition', 'Read'];

export const clubPageBySlug = (slug: string) => clubPages.find((p) => p.slug === slug);

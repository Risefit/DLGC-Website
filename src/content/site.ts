/**
 * Club facts, contact details, weather links, fees, calendar and the legacy
 * "Find It" index. All captured from the existing members' site.
 */

export const club = {
  name: 'Derbyshire & Lancashire Gliding Club',
  short: 'DLGC',
  site: 'Camphill, Great Hucklow',
  founded: 1935,
  publicSite: 'https://www.glidingclub.org.uk/',
  facebookPage: 'https://www.facebook.com/camphillglidingclub/',
  bga: 'https://www.gliding.co.uk/',
  bgaLadder: 'https://bgaladder.net/',
  /**
   * The live met station page. `met_page.asp` was wrong — that is the old site's
   * index of weather links, not the station itself.
   */
  weatherStation: 'https://dlgc.org.uk/members/metstation.html',
  /**
   * The club's Davis weather station, via WeatherLink's public embeddable page
   * — the same feed metstation.html frames. No credentials, so it can be shown
   * inside the portal instead of bouncing members to the old site.
   */
  weatherStationEmbed:
    'https://www.weatherlink.com/embeddablePage/show/8afbe67f6cb640b488cf7d1c06487900/wide',
  /**
   * What the station page says about itself, and what to scroll for. From
   * metstation.html — the widget is the same one, but the old page's framing
   * text is the bit that tells you the trends are further down the panel.
   */
  weatherStationNote:
    'Data from the DSC/DLGC weather station on West Edge. Scroll inside the panel for trends of average wind speed, gusts and wind direction; the other readings are at the lower left.',
  /**
   * SECURITY: the old site's direct webcam URL embeds a shared username and
   * password in clear text over unencrypted HTTP. That must not be committed to
   * this repository, which is why this points at the met station page instead.
   * Once the club rotates the camera credential and puts it behind HTTPS, point
   * this at the real stream.
   */
  webcam: 'https://dlgc.org.uk/members/metstation.html',
};

export const contacts = {
  postal: ['Derbyshire and Lancashire Gliding Club', 'Camphill', 'Great Hucklow', 'BUXTON', 'SK17 8RQ'],
  office: { tel: '01298 871270', email: 'dlgc@glidingclub.org.uk' },
  /** Safety occurrence reports go here, not to the website editor. */
  safetyOfficer: { name: 'Bob Bollom', email: 'rsbollom@gmail.com' },
  /** The website editor — blog stories, gallery photographs, adverts. */
  websiteEditor: { name: 'Bob Bollom', email: 'rsbollom@gmail.com' },
  officeHours:
    'Normally staffed 8:30am to noon every weekday morning from May to September, and three weekday mornings from October to April. Occasional weekend mornings throughout the year. Planned hours are in the Daily Flying Planner. Out of hours, leave a message on the answerphone or send an email.',
  clubhouse: '01298 871207',
  launchPoint: '01298 405019',
  catering: [
    { name: 'John Sconce', tel: '07989 349606' },
    { name: 'Sylvia Insley', tel: '07855 247170' },
  ],
};

/**
 * PRESERVED FROM THE OLD SITE: the weather page's curation.
 * Someone thought hard about which forecast serves which purpose, and wrote
 * genuinely useful notes on each. The presentation was the problem, not the
 * content. Keep the annotations.
 */
/**
 * A UK number in the form WhatsApp needs: no spaces, no leading zero, 44 in
 * front. wa.me opens the chat if — and only if — that number is registered on
 * WhatsApp. All three club numbers are landlines, so these work only once the
 * club registers them with WhatsApp Business. The call link always works, which
 * is why both are offered rather than replacing one with the other.
 */
export const whatsappNumber = (tel: string): string =>
  '44' + tel.replace(/[^\d]/g, '').replace(/^0/, '');

export const whatsappHref = (tel: string): string => `https://wa.me/${whatsappNumber(tel)}`;

export const telHref = (tel: string): string => `tel:${tel.replace(/\s/g, '')}`;

/** The club's own numbers, in the order a member is most likely to want them. */
export const clubNumbers: { label: string; tel: string; note: string }[] = [
  { label: 'Launch Point', tel: '01298 405019', note: 'When flying is on' },
  { label: 'Clubhouse', tel: '01298 871207', note: 'Bar and clubroom' },
  { label: 'Office', tel: '01298 871270', note: 'Weekday mornings — see hours' },
];

export type WeatherLink = {
  name: string;
  source: string;
  href: string;
  note: string;
  /** True where the target needs a login or registration before it is useful. */
  login?: boolean;
};

/**
 * Every href below is the club's OWN curated deep link, taken from the old
 * met_page.asp — not a homepage. That page's links pointed at a specific
 * location: Bretton Youth Hostel rather than "Met Office", Abney rather than
 * "Meteoblue". The first version of this portal replaced several of them with
 * homepages, which is why forecasts opened on the wrong area.
 *
 * If you change one, keep it location-specific. A forecast for the wrong part
 * of the country is worse than no link.
 */
export const weatherGroups: { group: string; blurb: string; links: WeatherLink[] }[] = [
  {
    group: 'Flying forecasts',
    blurb: 'Soaring-specific. Start here on a flying day.',
    links: [
      { name: 'RASP Soaring Forecast — Camphill', source: 'RASP UK (Stratus)', href: 'https://rasp.stratus.org.uk/index.php/rasp-by-turn-point', note: 'Graphical hourly forecasts for the parameters that matter to soaring. Select "CPH" from the turn point list, then Get Results.' },
      { name: 'RASP Tephigram — Camphill', source: 'RASP UK (Stratus)', href: 'https://rasp.stratus.org.uk/index.php/soundings', note: 'Skew-T tephigrams for today and tomorrow. Click "Camphill" at the bottom of the locations list, then pick date and time. Click within the tephigram to step forward an hour.' },
      { name: 'RASP UK Map', source: 'RASP UK (Stratus)', href: 'https://rasp.stratus.org.uk/index.php/rasptable-desktop', note: 'UK map with selectable predictions of all gliding meteorological data.' },
      { name: 'RASP Index', source: 'RASP UK (Stratus)', href: 'https://rasp.stratus.org.uk/index.php', note: 'Index to the full range of forecast data affecting gliding.' },
      { name: 'RASP BLIPMAP explained', source: 'Dr Jack', href: 'http://www.drjack.info/RASP/INFO/parameters.html', note: 'What each RASP parameter actually means. Worth reading once.' },
      { name: 'GA F214 / F215 via MAVIS', source: 'Met Office', href: 'http://mavis.metoffice.gov.uk/', note: 'Cloud, visibility, weather and wind forecasts geared to General Aviation. After login: General Aviation → Briefing Charts → Significant Weather.', login: true },
      { name: 'Met Office aviation services', source: 'Met Office', href: 'https://register.metoffice.gov.uk/WaveRegistrationClient/public/register.do?service=generalaviation', note: 'Register once for free General Aviation access, then use MAVIS above.', login: true },
      { name: 'XC Weather', source: 'XCWeather', href: 'https://www.xcweather.co.uk/GB/forecast', note: 'Basic wind, temperature and weather on a UK map. Aimed at hang gliders and paragliders, but a quick read of the day.' },
    ],
  },
  {
    group: 'Local forecasts',
    blurb: 'Places within a few miles of Camphill, at similar elevation.',
    links: [
      { name: 'Bretton Youth Hostel', source: 'Met Office', href: 'https://weather.metoffice.gov.uk/forecast/gcqz1nqtx', note: 'Hourly then three-hourly for the week ahead. One mile east of Camphill and at much the same height.' },
      { name: 'Abney meteogram', source: 'Meteoblue', href: 'https://www.meteoblue.com/en/weather/forecast/air/abney-and-abney-grange_united-kingdom_7293236', note: 'Graphical forecast by time AND altitude for today plus two days. Abney is one mile east of the airfield.' },
      { name: 'Abney — rainfall and cloud', source: 'Meteoblue', href: 'https://www.meteoblue.com/en/weather/forecast/current/abney-and-abney-grange_united-kingdom_7293236', note: 'Current conditions and precipitation for the same point.' },
      { name: 'Crag forecasts — pick Bamford Edge', source: 'MetCheck', href: 'https://www.metcheck.com/HOBBIES/climbing_forecast.asp', note: 'Seven-day forecast for a point 5km north-east of Camphill at the same elevation, so the wind and temperature are realistic for us. MetCheck retired the direct link, so choose Bamford Edge from the crag list.' },
      { name: 'Peak District mountain forecast', source: 'Met Office', href: 'https://weather.metoffice.gov.uk/specialist-forecasts/mountain/peak-district', note: 'Cloud base, wind, temperature and hazards for the uplands rather than the valleys.' },
      { name: 'Peak District', source: 'MWIS', href: 'https://www.mwis.org.uk/forecasts/english-and-welsh/peak-district', note: 'Mountain Weather Information Service, written for walkers and climbers. The cloud base and hill wind assessments are useful to us.' },
      { name: 'Recent rain', source: 'RainToday', href: 'http://www.raintoday.co.uk/', note: 'Where it has actually rained in the last few hours — useful for judging the state of the field.' },
    ],
  },
  {
    group: 'National forecasts',
    blurb: 'The bigger picture, for planning further ahead.',
    links: [
      { name: 'Surface pressure charts', source: 'Met Office', href: 'https://weather.metoffice.gov.uk/maps-and-charts/surface-pressure', note: 'Atlantic synoptic charts for the next three days and more, with animation.' },
      { name: 'UK weather', source: 'BBC', href: 'https://www.bbc.co.uk/weather', note: 'Hourly for 14 days. Search for Tideswell or Buxton — BBC Weather has no stable link for a named place, so this is the one link on this page that starts on a search box.' },
      { name: 'North England map', source: 'Meteoblue', href: 'https://www.meteoblue.com/en/weather-maps/abney-and-abney-grange_united-kingdom_7293236?variable=precipitation3h_cloudcover_pressure&level=surface&lines=none&mapcenter=53.3132N-1.7069&zoom=8', note: 'Cloud and rain across the north for today and the next three days in one-hour steps, centred on Camphill.' },
      { name: 'Jetstream', source: 'Netweather.tv', href: 'https://www.netweather.tv/charts-and-data/jetstream', note: 'Position and velocity of high level winds every three hours for the next 16 days.' },
    ],
  },
  {
    group: 'Observations and webcams',
    blurb: 'What is happening right now, rather than what is forecast.',
    links: [
      { name: 'Camphill weather station', source: 'DLGC', href: 'https://www.dlgc.org.uk/members/metstation.html', note: 'The club\u2019s own Davis station — current observations plus 24 hours of wind averages. Also embedded at the top of this page.' },
      { name: 'Bradwell webcam', source: 'Derbyshire Soaring Club', href: 'https://derbyshiresoaringclub.org.uk/brad-cam/', note: 'Looking at the Bradwell slope, four miles north-east. A useful second opinion on the hill cloud.' },
      { name: 'Cloud cover', source: 'Sat24', href: 'https://en.sat24.com/en/gb/visual', note: 'Satellite cloud video for the last 90 minutes. Visible for UK and Ireland, or infra-red for Europe.' },
      { name: 'Rainfall radar', source: 'Met Office', href: 'https://weather.metoffice.gov.uk/maps-and-charts/rainfall-radar-forecast-map', note: 'Precipitation of any kind and intensity, centred on the Peak District.' },
      { name: 'Lightning strikes', source: 'Blitzortung', href: 'https://www.blitzortung.org/en/live_lightning_maps.php?map=12', note: 'Instantaneous location of lightning strikes up to two hours old.' },
      { name: 'Wind streamlines', source: 'earth.nullschool.net', href: 'https://earth.nullschool.net/#current/wind/isobaric/1000hPa/orthographic=-1.18,55.34,1970', note: 'Wind at the 1000hPa level every three hours, centred on the UK.' },
    ],
  },
];

/** PRESERVED FROM THE OLD SITE: the safety culture statement. Four clear principles. */
export const safetyCulture = [
  'Everyone should be pro-actively responsible not only for their own safety but also the safety of others.',
  'Nobody should take on, or be asked to undertake, a task — especially where safety is involved — without being briefed or trained.',
  'Published safety procedures should always be followed.',
  'Anyone taking responsibility for carrying out an important safety related task must give it proper attention.',
];

// ── Fees ───────────────────────────────────────────────────────────────────

export const feesMeta = { effective: '1 March 2026', updated: '24 January 2026' };

export const feeGroups: { group: string; rows: { item: string; basis?: string; now: string; prev?: string }[] }[] = [
  {
    group: 'Membership',
    rows: [
      { item: 'Flying — Full', basis: 'Annual', now: '£565.00', prev: '£540.00' },
      { item: 'Flying — Country', basis: 'Annual', now: '£400.00', prev: '£380.00' },
      { item: 'Flying — Family', basis: 'Annual', now: '£400.00', prev: '£380.00' },
      { item: 'Flying — Student (Under 21, Under 26 or FTE student, by arrangement)', basis: 'Annual', now: '£110.00', prev: '£107.50' },
      { item: 'Flying — Under 18', basis: 'Annual', now: '£100.00', prev: '£97.50' },
      { item: 'Flying — Temporary (pilot from a BGA club)', basis: 'Per day', now: '£9.00', prev: '£8.00' },
      { item: 'Flying — Temporary (pilot from a reciprocal-scheme club)', basis: 'Per day', now: 'Nil', prev: 'Nil' },
      { item: "Flying — Temporary (members' guests / family)", basis: 'Per day', now: '£9.00', prev: '£8.00' },
      { item: 'Flying Start (12 months from join date, includes £200 added to flying account)', basis: '12 months', now: '£565.00', prev: '£540.00' },
      { item: 'Associate', basis: 'Annual', now: '£70.00', prev: '£67.00' },
      { item: 'Members Course', now: '£160.00', prev: '£150.00' },
    ],
  },
  {
    group: 'Flying',
    rows: [
      { item: 'Launches (including SLMG & TMG) — any day, no variations', now: '£13.00', prev: '£12.50' },
      { item: 'Flying time — all club two-seaters', basis: 'Per minute', now: '£0.52', prev: '£0.50' },
      { item: 'Flying time — ASW 15', basis: 'Per minute', now: '£0.52', prev: 'N/A' },
      { item: 'Flying time — K18', basis: 'Per minute', now: '£0.43', prev: '£0.42' },
      { item: 'Flying time — K8 (included in launch charge for first 30 mins, White Card pilots only, from 1/8/2026)', basis: 'Per minute', now: '£0.29', prev: '£0.28' },
      { item: 'Flying time — T21, dual or solo (reduced rate to end of season; normally £0.52)', basis: 'Per minute', now: '£0.40', prev: '£0.50' },
      { item: 'Flying time — Motor Glider', basis: 'Per minute', now: 'tba', prev: 'tba' },
      { item: 'Discount on launches and flying time — under 18 / 21 / 26, or student in FTE', now: '25%', prev: '25%' },
      { item: 'Simulator (from 7/4/26)', basis: 'Per 30 min block', now: '£2.50' },
      { item: 'Aircraft hire — 1 or 2 seater', basis: 'Per day', now: '2 hrs time' },
    ],
  },
  {
    group: 'Introductory flights',
    rows: [{ item: 'Introductory Flight (Trial Lesson) — weekday or weekend', now: '£119.00', prev: '£119.00' }],
  },
  {
    group: 'Private gliders, hangarage & workshop',
    rows: [
      { item: 'Facilitation Fee (allows members to operate a private glider from Camphill)', basis: 'Per year', now: '£405.00', prev: '£390.00' },
      { item: 'Club Hangar', basis: 'Per year', now: '£635.00', prev: '£615.00' },
      { item: 'T-Hangar', basis: 'Per year', now: '£635.00', prev: '£615.00' },
      { item: 'Facilitation Fee plus either hangar', basis: 'Per year', now: '£930.00', prev: '£900.00' },
      { item: 'Trailer pitch — visitors', basis: 'Per day', now: '£9.50', prev: '£9.00' },
      { item: 'Aircraft Workshop (from 1/3/26)', basis: 'Per day or half day', now: 'See Workshop Charges' },
      { item: 'Other workshop', basis: 'Per day', now: '£21.00', prev: '£20.00' },
    ],
  },
  {
    group: 'Accommodation',
    rows: [
      { item: 'Caravan — static site', basis: 'Per year', now: '£510.00', prev: '£490.00' },
      { item: 'Caravan / motor caravan — members', basis: 'Per night', now: '£11.50', prev: '£11.00' },
      { item: 'Caravan / motor caravan — non-members', basis: 'Per night', now: '£21.00', prev: '£20.00' },
      { item: 'Bedroom, single — member', basis: 'Per occupant', now: '£25.00', prev: '£30.00' },
      { item: 'Bedroom, single — non-member', basis: 'Per occupant', now: '£30.00', prev: '£30.00' },
      { item: 'Bedroom, double — member', basis: 'Per occupant', now: '£22.50', prev: '£27.50' },
      { item: 'Bedroom, double — non-member', basis: 'Per occupant', now: '£27.50', prev: '£27.50' },
      { item: 'Tent — members', basis: 'Per tent per night', now: '£0.00', prev: '£0.00' },
      { item: 'Tent — non-members', basis: 'Per tent per night', now: '£17.50', prev: '£17.50' },
    ],
  },
];

export const feeNotes = [
  'Unless otherwise stated, "members" above means DLGC Flying or Associate members only.',
  'BGA fees: over 21 £40 (up from £37); junior £0; temporary £9.00. Included in the membership fees above, but charged to life and honorary flying members who fly.',
  'Prompt payment discounts are not applicable this year.',
];

export const partYearScale = [
  ['March', '100%'], ['April', '95%'], ['May', '90%'], ['June', '85%'],
  ['July', '75%'], ['August', '65%'], ['September', '45%'], ['October', '30%'],
  ['November', '20%'], ['December', '10%'], ['January', '5%'], ['February', '0%'],
];

// ── Calendar ───────────────────────────────────────────────────────────────

export const calendarNote =
  'These are the most significant dates only. The master Events Planner lives in Members’ Admin and is maintained by the office and committee — check there for critical dates and full detail. Anyone arranging an event and needing facilities (e.g. the clubroom) must contact the office or a committee member to check availability and book.';

export type CalendarEvent = {
  when: string;
  what: string;
  kind?: 'course' | 'committee' | 'social' | 'season';
};

export const calendar: { month: string; events: CalendarEvent[] }[] = [
  { month: 'August 2026', events: [
    { when: 'Mon 10 – Fri 14', what: 'Public Course', kind: 'course' },
    { when: 'Fri 14, 18:30', what: 'Committee Meeting (Zoom) — or TBC 19:30 face-to-face at Camphill', kind: 'committee' },
    { when: 'Sat 15 – Mon 17', what: 'Duke of Edinburgh Camping', kind: 'social' },
    { when: 'Sun 23 – Fri 28', what: 'HCAP Course', kind: 'course' },
    { when: 'Mon 31', what: 'Sheffield Venture Scouts Flying Day', kind: 'social' },
  ]},
  { month: 'September 2026', events: [
    { when: 'Fri 11', what: 'Summer Season — last day', kind: 'season' },
    { when: 'Fri 11, 19:00', what: 'Committee Meeting (face-to-face at Camphill) — Flying Staff End of Season Reports', kind: 'committee' },
  ]},
  { month: 'October 2026', events: [{ when: 'Fri 23, 19:00', what: 'Committee Meeting (Zoom)', kind: 'committee' }] },
  { month: 'November 2026', events: [{ when: 'Fri 20, 19:00', what: 'Committee Meeting (face-to-face at Camphill)', kind: 'committee' }] },
  { month: 'January 2027', events: [{ when: 'Fri 15, 19:00', what: 'Committee Meeting (Zoom)', kind: 'committee' }] },
  { month: 'February 2027', events: [{ when: 'Sat 13, 17:00', what: 'Annual General Meeting', kind: 'committee' }] },
];

/**
 * The same events with the month and year folded into the date, because "Fri
 * 11" on a dashboard tells a member nothing — "Fri 11 September 2026" does.
 * A `when` that already names its month (a range spanning two) is left alone.
 */
export const upcomingEvents: (CalendarEvent & { displayWhen: string; month: string })[] =
  calendar.flatMap(({ month, events }) =>
    events.map((e) => {
      const named = new RegExp(month.split(' ')[0], 'i').test(e.when);
      const [time] = e.when.match(/,\s*\d{1,2}[:.]\d{2}/) ?? [];
      const dayPart = time ? e.when.slice(0, e.when.length - time.length) : e.when;
      const displayWhen = named ? e.when : `${dayPart} ${month}${time ?? ''}`;
      return { ...e, month, displayWhen };
    })
  );

// ── Legacy "Find It" index ─────────────────────────────────────────────────
/**
 * PRESERVED FROM THE OLD SITE — but repurposed.
 *
 * The old site needed this hand-maintained A–Z because its navigation didn't
 * work. We keep the ~130 entries because they are free, hard-won evidence of
 * what members actually look for; they now seed the search and provide a
 * safety net for anyone who learnt the old vocabulary.
 *
 * Each entry maps an old subject term to where it now lives.
 */
export const findIt: { term: string; to: string; label: string }[] = [
  { term: '833 Radio Transceivers', to: '/documents?q=833', label: 'Documents' },
  { term: 'Accident Reports and Analysis', to: '/archive?q=accident', label: 'Archive → Safety' },
  { term: 'Accident Procedures', to: '/safety/emergency', label: 'Emergency Procedures' },
  { term: 'Accounts — Club, Annual', to: '/archive?q=accounts', label: 'Archive → AGM' },
  { term: 'AGM Minutes', to: '/archive?q=AGM', label: 'Archive → AGM' },
  { term: 'Airprox Reporting', to: '/safety', label: 'Safety' },
  { term: 'Airfield Hazards Briefing', to: '/safety', label: 'Safety' },
  { term: 'Airfield, Care of', to: '/documents?q=airfield', label: 'Documents' },
  { term: 'Airspace and NOTAMs', to: '/flying', label: 'Flying' },
  { term: 'Annual Club Reports', to: '/archive?q=annual+report', label: 'Archive → AGM' },
  { term: 'BGA Safety Bulletins and Briefings', to: '/safety', label: 'Safety' },
  { term: 'Blake Robertshaw Trophy', to: '/club-life', label: 'Club Life' },
  { term: 'Bronze Theory Presentations', to: '/training', label: 'Training' },
  { term: 'Bronze General Skills Test Preparation', to: '/training', label: 'Training' },
  { term: 'Canopy Care and Washing', to: '/documents?q=canopy', label: 'Documents' },
  { term: 'Caravans — Rules and Waiting List', to: '/documents?q=caravan', label: 'Documents' },
  { term: 'Child Protection Policy and Guidance', to: '/documents?q=child+protection', label: 'Documents → Policies' },
  { term: 'CHIRP (Confidential Incident Reporting)', to: '/safety', label: 'Safety' },
  { term: 'Club Rules', to: '/documents?q=rules', label: 'Documents → Rules' },
  { term: 'Code of Conduct', to: '/documents?q=conduct', label: 'Documents → Policies' },
  { term: 'Constitution (Memorandum & Articles)', to: '/documents?q=memorandum', label: 'Documents → Rules' },
  { term: 'Daily Flying Planner (DFP)', to: '/account', label: "Members' Admin" },
  { term: 'Daily Mentor Role', to: '/documents?q=mentor', label: 'Documents' },
  { term: 'Data Protection Policy', to: '/documents?q=data+protection', label: 'Documents → Policies' },
  { term: 'Distress & Diversion Service', to: '/safety', label: 'Safety' },
  { term: 'Duty Clerk Manual', to: '/documents?q=duty+clerk', label: 'Documents → Manuals' },
  { term: 'Duty Rotas', to: '/flying/roster', label: 'Flying → Roster' },
  { term: 'Dyneema Splicing', to: '/documents?q=dyneema', label: 'Documents → Manuals' },
  { term: 'Email Addresses (Members)', to: '/directory', label: 'Directory' },
  { term: 'Emergency Procedures', to: '/safety/emergency', label: 'Emergency Procedures' },
  { term: 'Equity and Opportunities Policy', to: '/documents?q=equity', label: 'Documents → Policies' },
  { term: 'Fees and Charges', to: '/fees', label: 'Fees' },
  { term: 'Fields — Crops and Local Landing', to: '/documents?q=field', label: 'Documents' },
  { term: 'Financial Rules', to: '/documents?q=financial', label: 'Documents → Rules' },
  { term: 'FLARM — Understanding FLARM', to: '/documents?q=flarm', label: 'Documents' },
  { term: 'Flying Blog', to: '/club-life/blog', label: 'Club Life → Blog' },
  { term: 'Flying Cards — all colours', to: '/training', label: 'Training' },
  { term: 'Flying Calendar', to: '/calendar', label: 'Calendar' },
  { term: 'GASCo Flight Safety Extra', to: '/safety', label: 'Safety' },
  { term: 'Glider Hire Fee Rules', to: '/documents?q=glider+hire', label: 'Documents' },
  { term: 'Glider Maintenance', to: '/documents?q=maintenance', label: 'Documents → Aircraft' },
  { term: 'Ground Training Manual', to: '/documents?q=ground+training', label: 'Documents → Manuals' },
  { term: 'Hairpin Bend', to: '/documents?q=hairpin', label: 'Documents' },
  { term: 'Hangar Packing Layouts', to: '/documents?q=hangar', label: 'Documents' },
  { term: 'Hangar Rash Prevention', to: '/documents?q=hangar+rash', label: 'Documents' },
  { term: 'Harassment & Bullying Policy', to: '/documents?q=harassment', label: 'Documents → Policies' },
  { term: 'Health & Safety Policy', to: '/documents?q=health', label: 'Documents → Policies' },
  { term: 'Introductory Flights / Trial Lessons Booking', to: '/documents?q=introductory', label: 'Documents' },
  { term: 'LAPL Medicals — GP Guidance', to: '/documents?q=LAPL', label: 'Documents → Medicals' },
  { term: 'Launch Marshals — Manual and Authorised List', to: '/documents?q=launch+marshal', label: 'Documents' },
  { term: 'Launch Speeds & Weak Links', to: '/documents?q=launch+speeds', label: 'Documents → Manuals' },
  { term: 'Licences for Glider Pilots', to: '/documents?q=licencing', label: 'Documents → Medicals' },
  { term: 'Log Book', to: '/account', label: "Members' Admin" },
  { term: 'Medical Certification Guidance', to: '/documents?q=medical', label: 'Documents → Medicals' },
  { term: 'Members Contact Info', to: '/directory', label: 'Directory' },
  { term: 'Membership — Reciprocal', to: '/documents?q=reciprocal', label: 'Documents' },
  { term: 'Moles — Trapping', to: '/documents?q=mole', label: 'Documents' },
  { term: 'Mutual Flying — Guidelines and Preparation', to: '/documents?q=mutual', label: 'Documents' },
  { term: 'Newsletters (Camphill)', to: '/archive?q=newsletter', label: 'Archive → Newsletters' },
  { term: 'News and Notices', to: '/club-life/news', label: 'Club Life → News' },
  { term: 'Official Observers', to: '/documents?q=observer', label: 'Documents' },
  { term: 'Parachutes and AirPol', to: '/documents?q=parachute', label: 'Documents → Manuals' },
  { term: 'Phone Numbers (Members & Club)', to: '/directory', label: 'Directory' },
  { term: 'Photo Galleries', to: '/archive?q=gallery', label: 'Archive → Galleries' },
  { term: 'Pilots Manual', to: '/documents?q=pilots+manual', label: 'Documents → Manuals' },
  { term: 'Privacy Policy', to: '/documents?q=privacy', label: 'Documents → Policies' },
  { term: 'Radio Calls', to: '/safety', label: 'Safety' },
  { term: 'Red Card Theory Test', to: '/training', label: 'Training' },
  { term: 'Roles and Role Holders', to: '/directory', label: 'Directory' },
  { term: 'Safety Briefing — New Members', to: '/safety', label: 'Safety' },
  { term: 'Safety Lessons Log', to: '/safety', label: 'Safety' },
  { term: 'Safety Officer', to: '/safety', label: 'Safety' },
  { term: 'Simulator — Use Guidelines', to: '/documents?q=simulator', label: 'Documents → Simulator' },
  { term: 'Splicing Manual', to: '/documents?q=splicing', label: 'Documents → Manuals' },
  { term: 'Sports Development Plan', to: '/documents?q=development', label: 'Documents' },
  { term: 'Statements / Flying Account', to: '/account', label: "Members' Admin" },
  { term: 'Student Pilot Theory Test', to: '/training', label: 'Training' },
  { term: 'Student Pilots Guide', to: '/documents?q=student+pilots+guide', label: 'Documents → Manuals' },
  { term: 'T21 Explanatory Notes', to: '/documents?q=T21', label: 'Documents → Aircraft' },
  { term: 'Trailer Park Rules', to: '/documents?q=trailer', label: 'Documents → Rules' },
  { term: 'Training Record Cards', to: '/training', label: 'Training' },
  { term: 'Trophies Scheme and Winners', to: '/club-life', label: 'Club Life' },
  { term: 'Turnpoint Photos (Blake-Robertshaw)', to: '/documents?q=turnpoint', label: 'Documents' },
  { term: 'Vintage Rally', to: '/club-life', label: 'Club Life' },
  { term: 'Wave Box', to: '/flying', label: 'Flying → Airspace' },
  { term: 'Weather Minima', to: '/documents?q=minima', label: 'Documents' },
  { term: 'Weather Station and Webcam', to: '/flying/weather', label: 'Flying → Weather' },
  { term: 'Webcam Viewer Instructions', to: '/documents?q=webcam', label: 'Documents' },
  { term: 'Winch Launching Safety', to: '/safety', label: 'Safety' },
  { term: 'Winch Driving Safety', to: '/safety', label: 'Safety' },
  { term: 'Winch Operating Manual', to: '/documents?q=winch+operating', label: 'Documents → Manuals' },
  { term: 'Winch Training Record Sheet', to: '/documents?q=winch+training', label: 'Documents' },
  { term: 'Workshop (Aircraft) Charges', to: '/documents?q=workshop', label: 'Documents → Aircraft' },
];

/** Role holders — names only, no personal contact details in source control. */
export const roles = [
  { role: 'Chairman', holder: 'Garry Lewis' },
  { role: 'Chief Flying Instructor (CFI)', holder: 'See Directory' },
  { role: 'Safety Officer', holder: 'See Directory' },
  { role: 'Aircraft Officer', holder: 'Warwick Horne' },
  { role: 'Chief Launch Marshal', holder: 'See Directory' },
  { role: 'Treasurer', holder: 'See Directory' },
  { role: 'Membership Secretary', holder: 'Peter Gill' },
  { role: 'Secretary', holder: 'See Directory' },
  { role: "Members' Admin (AwareIM)", holder: 'Mo Bent' },
  { role: 'Website Editor', holder: 'Bob Bollom' },
];

/**
 * News and Notices.
 *
 * PRESERVED FROM THE OLD SITE: the dated, attributed, warm house style.
 * Always keep the `from` field — "From Dave Salmon" is how the club speaks.
 * Newest first. Add a new entry at the top of the array.
 */

export type NewsItem = {
  date: string;          // ISO, for sorting and <time>
  displayDate: string;   // as the club writes it
  title: string;
  from?: string;
  body: string[];        // one string per paragraph
  pinned?: boolean;
};

export const news: NewsItem[] = [
  {
    date: '2026-08-13',
    displayDate: 'Thursday 13th August 2026',
    title: 'SPTT Success',
    from: 'Alex Oldham',
    body: [
      'Congratulations to Colin Fray, who passed the Student Pilot Theory Test on the morning of Friday 7 August, followed by going solo at Camphill for the first time later the same day.',
    ],
  },
  {
    date: '2026-08-13',
    displayDate: 'Thursday 13th August 2026',
    title: 'Electronic Conspicuity (EC) Mandate',
    from: 'Dave Salmon',
    body: [
      "The CAA's consultation ends on 22nd September. There are several significant concerns within the CAA's proposals, including technical, operational and financial issues.",
      "The BGA airspace committee is working to develop response guidance for clubs and their members, which it aims to publish in early September. The BGA will then strongly encourage as many glider pilots as it can to respond to the CAA's consultation.",
    ],
    pinned: true,
  },
  {
    date: '2026-08-07',
    displayDate: 'Friday 7th August 2026',
    title: 'Public & HCAP Courses',
    from: 'the Chairman',
    body: [
      "These and TLs are an important revenue stream for the club and contribute significantly to keeping your subs under control. Over the next 2 weeks we have the final Public & HCAP courses of the season.",
      'Our instructor teams need help with ground operations. Please help if you have some free time and contribute to keeping your subs under control. Thanks, Garry.',
    ],
  },
  {
    date: '2026-08-07',
    displayDate: 'Friday 7th August 2026',
    title: 'Flying the T21',
    from: 'the Chairman',
    body: [
      'Following a check flight with either Brian Allen (Wednesdays from 12/8/26) or Mike Armstrong (Saturdays from 15/8/26), all Red, Yellow or Green card pilots can fly the T-21 at the reduced rate of 40 ppm, either solo or dual, subject to the usual mutual flying rules.',
      'Many thanks to the CFI, Brian and Mike for supporting this initiative. If you are coming for a T21 check out, please indicate that on the DFP in good time so that Mike and Brian can plan accordingly.',
    ],
  },
  {
    date: '2026-08-07',
    displayDate: 'Friday 7th August 2026',
    title: 'Reciprocal Membership',
    body: [
      'The latest updated list of clubs with which we have agreements on day membership, and the limitations on that agreement, is in the document library under Administrative.',
    ],
  },
  {
    date: '2026-07-30',
    displayDate: 'Thursday 30th July 2026',
    title: 'Airfield Condition',
    from: 'Belle Tyler',
    body: [
      'A number of deep holes have been found on the airfield, in the area where long landings to the north can be made alongside the north rough patch. A notice from Belle describing the problem and what action has been taken is in the document library.',
    ],
    pinned: true,
  },
  {
    date: '2026-07-28',
    displayDate: 'Tuesday 28th July 2026',
    title: 'K8 Flying Fees',
    body: [
      'The discounted flying fees for both K8s have been reviewed and from 1st August will be for White Card Pilots only and limited to 30 minutes per flight. See the Fees page.',
    ],
  },
  {
    date: '2026-07-28',
    displayDate: 'Tuesday 28th July 2026',
    title: 'Committee Meeting — Recognitions',
    body: [
      'The minutes of the meeting on 17th July have been published and are available in the document library.',
      'At the meeting the Committee recorded the following contributions by members:',
      'Vintage Week Team — Mike Armstrong, Steve & Kate Marlor, John Sconce, Sylvia Insley, Peter Gray, Fiona Aldred, Bob Carlisle, plus the army of other volunteers.',
      'Supporting FXO repairs — Colin Fray, Paul Smith & Dave Spencer. Course Tractor Training — Dave Spencer. Painting the Windsock pole — Colin Harper.',
    ],
  },
  {
    date: '2026-07-26',
    displayDate: 'Sunday 26th July 2026',
    title: 'Special Thanks',
    from: 'Garry Lewis',
    body: [
      'Everyone knows how much John Sconce does for the club over and above his employment for mechanic duties, but clearing the drains around the outside loos after our Vintage Week and DofE camping visitors deserves a special thank you from your committee and members. Thank you John.',
    ],
  },
  {
    date: '2026-07-26',
    displayDate: 'Sunday 26th July 2026',
    title: 'First Solo — at Camphill',
    body: [
      'Whilst visiting the club during last week, Christina Naylor, a member at Aston Down, made her first solo flight with us. A photo of her being congratulated by Alan Jolly is in the Solos gallery.',
    ],
  },
  {
    date: '2026-07-15',
    displayDate: 'Wednesday 15th July 2026',
    title: 'New Member',
    body: [
      'We welcome Geoff Telford to the club as a Flying Start member. Geoff is a retired RAF pilot who has recently moved to Derbyshire (Wingerworth). He has expressed an interest in getting involved in glider maintenance, aircraft workshop activity, and similar.',
    ],
  },
  {
    date: '2026-07-11',
    displayDate: 'Saturday 11th July 2026',
    title: 'First Solo',
    body: [
      "Congratulations to Jingtian Wang, who was sent on his first solo flight on Wednesday 8th July. There's a photo in the First Solos gallery of Jingtian being congratulated by his instructor Alan Jolly after his flight.",
    ],
  },
];

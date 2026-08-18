/**
 * THE OLD SITE'S PHOTO GALLERIES — photogalleries.asp.
 *
 * These are distinct from /gallery, which holds the 881 photographs recovered
 * from the mirror and laid out as albums. These six are the club's own curated
 * galleries, still living on the old site with their own captions, and several
 * are actively maintained — First Solos gains a picture every time somebody
 * goes solo. Linking to them beats copying them badly.
 */

const OLD = 'https://www.dlgc.org.uk/members';

export type PhotoGallery = {
  name: string;
  blurb: string;
  count: number;
  href: string;
  /** True where the gallery lives inside this portal rather than the old site. */
  internal?: boolean;
};

export const photoGalleries: PhotoGallery[] = [
  {
    name: 'First (and re-) solos',
    blurb: 'The handshake photograph, every time somebody goes solo at Camphill. The best thing on the old site.',
    count: 118,
    href: `${OLD}/galleries/solos/Solos(118).htm`,
  },
  {
    name: 'Snippets',
    blurb: 'Odds and ends of club life — visitors, weather, jobs being done, things worth a second look.',
    count: 222,
    href: `${OLD}/galleries/snippets/Snippets221024.htm`,
  },
  {
    name: 'Aerial shots',
    blurb: 'Camphill and the Peak from the air, as only we get to see it.',
    count: 70,
    href: `${OLD}/galleries/aerialshots/AerialShots(70).htm`,
  },
  {
    name: 'Clouds',
    blurb: 'Wave bars, lenticulars and the rest — what the sky was doing on the good days.',
    count: 27,
    href: `${OLD}/galleries/clouds/Clouds170406.htm`,
  },
  {
    name: 'Solo winch drivers',
    blurb: 'Members who have qualified to winch solo. Also listed on the Duty Roster page.',
    count: 11,
    href: '/flying/roster',
    internal: true,
  },
  {
    name: 'Field landings — wine winners',
    blurb: 'The club tradition: land out, buy the wine. Photographic evidence.',
    count: 10,
    href: `${OLD}/galleries/fields%20&%20wine/F&W%20Gallery%202021.htm`,
  },
];

export const photoGalleriesSource = `${OLD}/photogalleries.asp`;

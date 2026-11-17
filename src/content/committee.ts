/**
 * THE COMMITTEE — from the old site's committee page (committee2026.2.asp).
 *
 * NAMES AND ROLES ONLY (CLAUDE.md rule 6). No telephone numbers, no personal
 * email addresses. The committee is reached at one shared address, below.
 *
 * Update this after each AGM: change `effective`, `term` and the list. The
 * roles are the club's own wording — keep it, including the working-party
 * shorthand, which the footnote explains.
 */

export const committee = {
  /** The club's own sentence about what the committee is. */
  standing: 'The Committee forms the Board of Directors of the Derbyshire and Lancashire Gliding Club Ltd.',
  effective: 'the AGM, 21st February 2026',
  term: '2026 / 2027',
  email: 'committee@glidingclub.org.uk',
  members: [
    { name: 'Garry Lewis', role: 'Chairman, Hon. Treasurer, Office Administration, & Ground Equipment' },
    { name: 'Warwick Horne', role: 'BGA Aircraft Inspector' },
    { name: 'Meurig Thomas', role: 'Junior Liaison' },
    { name: 'Dave Salmon', role: 'Hon. Secretary & Minutes' },
    { name: 'Nikil Paradkar', role: 'Publicity and Marketing Officer' },
    { name: 'Mike Stephens', role: 'Assistant to GL re WP2 of CV&S*' },
    { name: 'Michael Carter', role: 'Assistant to GL re WP3 of CV&S*' },
    // No role is given against this name on the club's own page.
    { name: 'Peter Gill', role: '' },
    { name: 'Dave Upcott', role: 'Technical Officer, BGA Returns and Medicals (Off Committee)' },
  ],
  footnote: '* CV&S = Club Vision and Strategy',
};

/** "I could help with …" — an email to the committee, ready to send. */
export function volunteerMailto(roles: string[]): string {
  const subject = roles.length === 1 ? `Vacant role: ${roles[0]}` : 'A vacant club role';
  const body =
    roles.length === 1
      ? `I would like to know more about helping with ${roles[0]}.\n\nMy name: `
      : `I would like to know more about helping with one of the vacant roles:\n\n${roles.map((r) => `- ${r}`).join('\n')}\n\nThe one I am interested in: \nMy name: `;
  return `mailto:${committee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

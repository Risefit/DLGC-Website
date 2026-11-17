/**
 * WHO IS EMAILED A SAFETY REPORT.
 *
 * The addresses are NOT in this repository (CLAUDE.md rule 6 — they are
 * people's own addresses). They live in one setting in Vercel:
 *
 *   SAFETY_OFFICER_EMAIL = first@example.org, second@example.org
 *
 * One address or several, separated by commas. Everyone listed gets the same
 * email. To add or remove somebody, edit that setting in Vercel and redeploy —
 * no change to the code.
 *
 * The names of the people who receive reports ARE shown on the form
 * (contacts.safetyOfficer and contacts.safetyReportsAlso in site.ts), because a
 * member deciding whether to report is entitled to know who will read it.
 * Keep the two in step: if somebody is added to the setting, add their name.
 */
export function safetyRecipients(raw: string | undefined): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[,;\s]+/)) {
    const a = part.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a)) continue;
    const key = a.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(a);
  }
  return out;
}

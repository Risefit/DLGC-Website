import { adminClient, logSupabaseProblem } from '@/lib/supabase/admin';

/**
 * WHAT MEMBERS HAVE SENT IN — flying-blog stories and photographs.
 *
 * A member sends one from the Flying Blog or the Gallery page. It is stored in
 * the Supabase table `submissions` as "pending" and shows nowhere. A
 * controller reads it on /admin/submissions and approves or declines it;
 * approving is what puts it on the site, at once.
 *
 * THIS FILE NEVER TOUCHES A SAFETY REPORT OR AN ADVERT. They are rows in the
 * same table, so every query here names the two kinds it is for (`KINDS`).
 * Keep it that way: a safety report is for the Safety Officer and nobody else.
 *
 * A member's email address is never returned by the "published" functions —
 * only the name they gave, which is what is shown beside their story.
 *
 * Server only (it reads with the secret key).
 */

export const KINDS = ['blog', 'photo'] as const;
export type SentInKind = (typeof KINDS)[number];

/** The address of a sent-in picture. Only a signed-in member can open it (src/app/files/sent-in). */
export const sentInImage = (id: number, size: 'small' | 'full' = 'full') =>
  `/files/sent-in/${id}${size === 'small' ? '?size=small' : ''}`;

export type Published = {
  id: number;
  kind: SentInKind;
  /** when it was sent in, ISO */
  date: string;
  from: string;
  title: string;
  body: string[];
  hasImage: boolean;
};

const paragraphs = (body: string | null) =>
  (body ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

async function published(kind: SentInKind): Promise<Published[]> {
  const admin = adminClient();
  if (!admin) return [];
  try {
    const { data, error } = await admin
      .from('submissions')
      .select('id, kind, name, title, body, image_path, created_at')
      .eq('kind', kind)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) {
      logSupabaseProblem(`reading published ${kind} submissions`, error);
      return [];
    }
    return (data ?? []).map((r) => ({
      id: r.id as number,
      kind,
      date: r.created_at as string,
      from: ((r.name as string | null) ?? '').trim() || 'a member',
      title: ((r.title as string | null) ?? '').trim(),
      body: paragraphs(r.body as string | null),
      hasImage: Boolean(r.image_path),
    }));
  } catch {
    return [];
  }
}

/** Approved stories for the Flying Blog, newest first. */
export const publishedStories = () => published('blog');
/** Approved photographs for the Gallery, newest first. */
export const publishedPhotos = () => published('photo');

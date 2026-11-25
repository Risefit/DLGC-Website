import type { SupabaseClient } from '@supabase/supabase-js';
import { logSupabaseProblem } from '@/lib/supabase/admin';

/**
 * MAKE THE COPIES OF A PICTURE THAT THE PORTAL SHOWS.
 *
 * A photograph straight off a phone is several megabytes and carries where it
 * was taken. When a controller approves one a member sent in, or attaches one
 * to a notice, two copies are made in the same private store:
 *
 *   <base>.jpg     at most 1800 pixels on its long side
 *   <base>-s.jpg   at most 700, for grids
 *
 * Both are turned the right way up and saved WITHOUT the camera's hidden data,
 * so the location a phone records does not go out with the picture. The
 * original is left exactly as it arrived.
 *
 * If anything goes wrong the answer is null and the portal shows the original
 * instead — a picture a little too big is better than an approval that fails.
 *
 * Server only.
 */
export async function makeShownCopies(
  admin: SupabaseClient,
  /** the private store the picture is in: 'submissions' or 'news' */
  bucket: string,
  originalPath: string,
  /** where the copies go, without the ending: 'shown/12' gives shown/12.jpg and shown/12-s.jpg */
  base: string,
): Promise<{ shown: string; thumb: string } | null> {
  try {
    const { data: blob, error } = await admin.storage.from(bucket).download(originalPath);
    if (error || !blob) return null;
    const input = Buffer.from(await blob.arrayBuffer());
    const sharp = (await import('sharp')).default;
    const resized = (edge: number, quality: number) =>
      sharp(input, { failOn: 'none' })
        .rotate() // the right way up, as the camera meant
        .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();
    const [big, little] = await Promise.all([resized(1800, 82), resized(700, 76)]);

    const shown = `${base}.jpg`;
    const thumb = `${base}-s.jpg`;
    const options = { contentType: 'image/jpeg', upsert: true };
    const a = await admin.storage.from(bucket).upload(shown, big, options);
    const b = await admin.storage.from(bucket).upload(thumb, little, options);
    if (a.error || b.error) {
      logSupabaseProblem('saving the copies of an approved picture', a.error ?? b.error);
      return null;
    }
    return { shown, thumb };
  } catch (e) {
    console.error(`[portal] preparing an approved picture: ${e instanceof Error ? e.message : 'failed'}`);
    return null;
  }
}

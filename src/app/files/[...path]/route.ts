import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { previewOpen } from '@/lib/auth';
import { FILES_BUCKET, fileKind, oldSiteUrl, pdfCopyKey, storageKey } from '@/lib/files';

/**
 * ONE ADDRESS FOR EVERY FILE FROM THE OLD SITE:  /files/members/…
 *
 *   Signed in to the portal, and the file has been copied across
 *     → a link to the club's private copy that works for ten minutes.
 *       No second password box.
 *       A Word or PowerPoint file comes as its PDF copy, if one is stored.
 *   Signed in, but the file was never copied (too big, or added to the old
 *   site after the copy was made)
 *     → the old site, exactly as before.
 *   Not signed in, while the portal is in preview
 *     → the old site, exactly as before. The old site asks for the members'
 *       password, so nothing is exposed by the preview being open.
 *   Not signed in, once the login gate is on
 *     → the sign-in page.
 *
 * The private copy is NEVER handed to somebody who is not signed in. That is
 * the whole point of this file: the bucket is private, and the only way to a
 * document is through this check. Do not add a shortcut round it, and do not
 * make the bucket public — it holds committee minutes, accounts and lists of
 * named members.
 *
 * Nothing here needs a secret key. The link is made with the member's own
 * session, and storage only allows that for somebody signed in
 * (supabase/migrations/003_legacy_files.sql).
 */

const LINK_LIFETIME_SECONDS = 600;

export const dynamic = 'force-dynamic';

function send(url: string) {
  const res = NextResponse.redirect(url, 307);
  // The link is personal and short-lived: nothing between the member and the
  // file should keep a copy of where it pointed.
  res.headers.set('Cache-Control', 'private, no-store');
  res.headers.set('Referrer-Policy', 'no-referrer');
  return res;
}

/**
 * Some of the club's PDFs were saved to open with a bookmarks panel down the
 * left, which on a phone covers the page. This asks the browser's PDF viewer
 * to open the document without it. It is only a request written after the "#"
 * — nothing is sent to any server — and a viewer that does not know it ignores it.
 */
function tidyPdf(url: string, isPdf = /\.pdf$/i.test(url.split(/[?#]/)[0])) {
  return isPdf && !url.includes('#') ? `${url}#pagemode=none&navpanes=0` : url;
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;

  // Only the old members' area is served this way.
  if (!path?.length || path[0].toLowerCase() !== 'members' || path.some((p) => p === '..' || p === '.')) {
    return new NextResponse('Not found', { status: 404 });
  }

  const fallback = oldSiteUrl(path);

  const supabase = await createClient();
  if (!supabase) return send(tidyPdf(fallback)); // storage not configured at all

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (previewOpen) return send(tidyPdf(fallback));
    const login = request.nextUrl.clone();
    login.pathname = '/login';
    login.search = '';
    return send(login.toString());
  }

  const key = storageKey(path);
  const store = supabase.storage.from(FILES_BUCKET);

  // A Word, PowerPoint or Excel file cannot be shown by a browser. If the club
  // has stored a PDF copy beside it ("…/report.doc.pdf"), hand over that, so
  // the document opens like any other. No copy: the original, as before.
  if (fileKind(path[path.length - 1])) {
    const pdf = await store.createSignedUrl(pdfCopyKey(key), LINK_LIFETIME_SECONDS);
    if (!pdf.error && pdf.data?.signedUrl) return send(tidyPdf(pdf.data.signedUrl, true));
  }

  const { data, error } = await store.createSignedUrl(key, LINK_LIFETIME_SECONDS);

  if (error || !data?.signedUrl) return send(tidyPdf(fallback)); // not copied across

  return send(tidyPdf(data.signedUrl));
}

import { NextResponse } from 'next/server';

/**
 * WEBCAM PROXY.
 *
 * The hangar camera is reached at a URL that carries a shared username and
 * password as query parameters, over unencrypted HTTP. That URL must never
 * appear in this repository — it is public, and anyone reading the page source
 * on the old site can already take the camera's credentials.
 *
 * This route keeps the secret server-side: the browser calls /api/webcam, the
 * server fetches the snapshot using WEBCAM_SNAPSHOT_URL from the environment,
 * and returns just the image. Members see the camera inside the portal, over
 * HTTPS, and the credential is never sent to them.
 *
 * TO ENABLE — in Vercel, Settings → Environment Variables, add:
 *
 *   WEBCAM_SNAPSHOT_URL = http://<camera-host>/img/snapshot.cgi?username=…&password=…
 *
 * Note this is NOT prefixed NEXT_PUBLIC_, which is what keeps it server-only.
 *
 * The club should also rotate that camera password — it has been readable in
 * the old site's page source for years.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const src = process.env.WEBCAM_SNAPSHOT_URL;

  if (!src) {
    return NextResponse.json(
      {
        error: 'not_configured',
        message:
          'The webcam is not connected yet. Set WEBCAM_SNAPSHOT_URL in the site environment variables.',
      },
      { status: 503 }
    );
  }

  try {
    const upstream = await fetch(src, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'camera_error', message: `Camera returned ${upstream.status}.` },
        { status: 502 }
      );
    }

    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'image/jpeg',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'unreachable', message: 'The camera did not respond.' },
      { status: 504 }
    );
  }
}

'use client';

import { useEffect, useState } from 'react';

/**
 * Live view from the hangar camera, proxied through /api/webcam so the camera's
 * shared credential stays on the server. Refreshes on a timer because the
 * camera serves single snapshots, not a stream.
 *
 * Degrades honestly: if the camera isn't configured or doesn't answer, it says
 * so and offers the old site's met station page, rather than showing a broken
 * image icon.
 */
export default function Webcam({
  refreshSeconds = 30,
  fallbackHref,
  /** Height of the picture area. Set to match a neighbouring panel so the two
   *  line up on the same row instead of one hanging below the other. */
  mediaClassName = '',
}: {
  refreshSeconds?: number;
  fallbackHref: string;
  mediaClassName?: string;
}) {
  const [stamp, setStamp] = useState(0);
  const [failed, setFailed] = useState(false);
  const [updated, setUpdated] = useState<string | null>(null);

  useEffect(() => {
    // First load happens on mount; avoids a hydration mismatch from Date.now().
    setStamp(Date.now());
    const id = setInterval(() => setStamp(Date.now()), refreshSeconds * 1000);
    return () => clearInterval(id);
  }, [refreshSeconds]);

  if (failed) {
    return (
      <div className="card flex flex-col justify-center p-6">
        <h3 className="text-lg">Camphill Webcam</h3>
        <p className="mt-2 text-sm text-slate2">
          The camera isn&rsquo;t reachable from the portal yet. It still works on the old site.
        </p>
        <a
          href={fallbackHref}
          target="_blank"
          rel="noopener noreferrer"
          className="link tap mt-2 text-sm"
        >
          Open the met station page
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    );
  }

  return (
    <figure className="card flex flex-col overflow-hidden">
      <div className={`relative flex-1 bg-ink/5 ${mediaClassName}`}>
        {stamp > 0 && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/api/webcam?t=${stamp}`}
            alt="Live view from the Camphill webcam, looking north across the front of the hangar"
            className="block h-full w-full object-cover"
            onError={() => setFailed(true)}
            onLoad={() =>
              setUpdated(
                new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
              )
            }
          />
        )}
      </div>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3 text-sm">
        <span className="font-medium text-navy">
          Camphill Webcam — looking north across the hangar
        </span>
        <span className="text-xs text-slate2">
          {updated ? `Updated ${updated}, refreshes every ${refreshSeconds}s` : 'Loading…'}
        </span>
      </figcaption>
    </figure>
  );
}

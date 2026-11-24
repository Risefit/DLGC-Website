'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { albums, totalPhotos, type Album } from '@/content/gallery';

/**
 * Album picker. Photographs render only for the chosen album — 881 full-size
 * images at once would be punishing on a phone at the launch point, which is
 * where members actually use this.
 *
 * Clicking the selected album again clears it, and "All photographs" shows
 * everything for anyone who wants to scroll.
 *
 * Choosing an album MOVES THE PAGE DOWN to its photographs. With thirty album
 * buttons the pictures appeared below the bottom of the screen, and a member
 * reasonably concluded the buttons did nothing (November 2026).
 */
export default function GalleryBrowser({ base }: { base: string }) {
  const [selected, setSelected] = useState<string | null>(null);

  const src = (p: string) => (p.startsWith('/legacy/') ? base + p.slice('/legacy'.length) : p);

  const shown: { title: string; photos: Album['photos'] }[] = useMemo(() => {
    if (selected === '__all__') return albums.map((a) => ({ title: a.title, photos: a.photos }));
    const a = albums.find((x) => x.slug === selected);
    return a ? [{ title: a.title, photos: a.photos }] : [];
  }, [selected]);

  const count = shown.reduce((n, s) => n + s.photos.length, 0);

  const photosRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selected) return;
    const el = photosRef.current;
    if (!el) return;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  }, [selected]);

  const chosen = selected === '__all__' ? 'All photographs' : albums.find((a) => a.slug === selected)?.title;

  return (
    <>
      <section aria-labelledby="albums-h" className="mb-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="albums-h" className="text-2xl">Albums</h2>
          {selected && (
            <button type="button" onClick={() => setSelected(null)} className="link tap text-sm">
              Close and show all albums
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelected((s) => (s === '__all__' ? null : '__all__'))}
            aria-pressed={selected === '__all__'}
            className={`tap rounded-lg border-2 px-4 py-2.5 font-medium transition-colors ${
              selected === '__all__'
                ? 'border-sky bg-sky text-white'
                : 'border-skyLine bg-white text-navy hover:border-sky'
            }`}
          >
            All photographs{' '}
            <span className={selected === '__all__' ? 'text-white/80' : 'text-slate2'}>
              {totalPhotos}
            </span>
          </button>

          {albums.map((a) => {
            const on = selected === a.slug;
            return (
              <button
                key={a.slug}
                type="button"
                onClick={() => setSelected((s) => (s === a.slug ? null : a.slug))}
                aria-pressed={on}
                className={`tap rounded-lg border-2 px-4 py-2.5 font-medium transition-colors ${
                  on
                    ? 'border-sky bg-sky text-white'
                    : 'border-skyLine bg-white text-navy hover:border-sky'
                }`}
              >
                {a.title}{' '}
                <span className={`ml-1.5 ${on ? 'text-white/80' : 'text-slate2'}`}>{a.photos.length}</span>
                {on && <span aria-hidden="true" className="ml-2">✕</span>}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-sm text-inkMuted">
          {selected
            ? `Showing ${count} photograph${count === 1 ? '' : 's'} below. Press the album again to close it.`
            : 'Choose an album and its photographs appear underneath.'}
        </p>
      </section>

      {selected && (
        <div ref={photosRef} tabIndex={-1} className="mb-5 scroll-mt-4 border-t-2 border-navy pt-5 outline-none">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="display text-2xl lg:text-3xl">{chosen}</h2>
              <p className="mt-1 text-inkMuted">
                {count} photograph{count === 1 ? '' : 's'}. Press any one to open it full size in a new tab.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                document.getElementById('albums-h')?.scrollIntoView({ block: 'start' });
              }}
              className="pill-line"
            >
              Back to the albums
            </button>
          </div>
        </div>
      )}

      {shown.map((s) => (
        <section key={s.title} className="mb-10">
          {shown.length > 1 && <h3 className="mb-3 text-xl">{s.title}</h3>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {s.photos.map((p) => (
              <a
                key={p.src}
                href={src(p.src)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-card-interactive border border-skyLine bg-white"
              >
                <span className="block aspect-[4/3] w-full overflow-hidden bg-skyTint">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src(p.src)}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </span>
                <span className="block truncate px-3 py-2 text-xs text-slate2" title={p.name}>
                  {p.name}
                </span>
                <span className="sr-only">(opens full size in a new tab)</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

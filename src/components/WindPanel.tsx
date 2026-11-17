'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * THE WIND PANEL — compass, 24 hours of wind and gusts, wind direction, and the
 * day's readings, live from the DSC/DLGC station on West Edge.
 *
 * It is somebody else's script (the station's "weather hub" widget), so it runs
 * in a SANDBOXED frame showing /embed/weather-hub.html. `sandbox="allow-scripts"`
 * without `allow-same-origin` means the widget cannot read the portal page, its
 * cookies or a member's sign-in. Never add `allow-same-origin` here, and never
 * load the widget script into a portal page directly.
 *
 * The widget chooses its layout from the SHAPE of its frame — taller than wide
 * stacks everything in one column, wider than tall puts the compass beside the
 * charts — so this component picks the shape first (side by side only where
 * there is room for it to be legible), then lets the frame tell it how tall the
 * content turned out to be.
 */

const SIDE_BY_SIDE_FROM = 1000; // px of available width
const MESSAGE = 'dlgc-wind-panel';

export default function WindPanel() {
  const holder = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [layout, setLayout] = useState<'stacked' | 'wide' | null>(null);
  const [height, setHeight] = useState(0);
  // The widget draws itself once, for the width it was given. When the width
  // really changes (a phone turned on its side, a window resized) it is given a
  // fresh frame; `drawnAt` is the width the current frame was drawn for.
  const [drawnAt, setDrawnAt] = useState(0);

  // Decide the layout from the room available, and again if that changes.
  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const decide = () => {
      const w = el.clientWidth;
      const next = w >= SIDE_BY_SIDE_FROM ? 'wide' : 'stacked';
      setLayout(next);
      setDrawnAt((prev) => {
        if (Math.abs(prev - w) < 24) return prev; // a scrollbar appearing is not a resize
        setHeight(next === 'wide' ? Math.min(Math.round(w * 0.5), 640) : 1600);
        return w;
      });
    };
    decide();
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(decide, 350);
    });
    ro.observe(el);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  // The frame reports its own content height. Only our frame is listened to.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      const d = e.data as { kind?: string; height?: number } | null;
      if (!d || d.kind !== MESSAGE || typeof d.height !== 'number') return;
      setHeight(Math.min(Math.max(Math.ceil(d.height), 240), 2600));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div ref={holder} className="card overflow-hidden bg-white">
      {layout && (
        <iframe
          // A new frame whenever the shape or width changes, so the widget starts from the right one.
          key={`${layout}-${drawnAt}`}
          ref={frame}
          src={`/embed/weather-hub.html?layout=${layout}`}
          sandbox="allow-scripts"
          title="Camphill wind: live compass, 24 hours of average wind and gusts, wind direction and today’s readings"
          className="block w-full border-0"
          style={{ height }}
        />
      )}
    </div>
  );
}

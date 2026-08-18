import { clubNumbers, telHref, whatsappHref } from '@/content/site';

/**
 * The three club numbers, each with a call link and a WhatsApp link.
 *
 * A note that matters: all three are landlines. wa.me opens WhatsApp, but the
 * chat only works if the club registers that number with WhatsApp Business.
 * Until it does, the WhatsApp button will report the number is not on WhatsApp.
 * That is why the call link is always there beside it and always first — the
 * one that definitely works should not be the harder one to hit.
 */
export default function ClubNumbers({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <ul className="space-y-1.5 text-inkMuted">
        {clubNumbers.map((n) => (
          <li key={n.label} className="flex flex-wrap items-baseline gap-x-2">
            <span>{n.label}</span>
            <a href={telHref(n.tel)} className="link">{n.tel}</a>
            <a
              href={whatsappHref(n.tel)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-good hover:underline"
            >
              <WhatsAppIcon />
              WhatsApp
              <span className="sr-only"> {n.label} (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="card divide-y divide-skyLine overflow-hidden">
      {clubNumbers.map((n) => (
        <li key={n.label} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <span className="min-w-0">
            <span className="block font-medium text-navy">{n.label}</span>
            <span className="block text-sm text-inkMuted">{n.note}</span>
          </span>
          <span className="flex flex-wrap items-center gap-2">
            <a
              href={telHref(n.tel)}
              className="tap gap-2 rounded-lg bg-sky px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-skyDark"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 4h3l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              {n.tel}
            </a>
            <a
              href={whatsappHref(n.tel)}
              target="_blank"
              rel="noopener noreferrer"
              className="tap gap-2 rounded-lg border-2 border-good px-4 py-2.5 text-sm font-semibold text-good transition-colors hover:bg-goodTint"
            >
              <WhatsAppIcon />
              WhatsApp
              <span className="sr-only"> {n.label} (opens in a new tab)</span>
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}

import { socials } from '@/content/community';

const ICONS: Record<string, React.ReactNode> = {
  Facebook: (
    <path d="M14 8.5h2.2V5.6C15.8 5.5 14.9 5.4 13.9 5.4c-2.1 0-3.5 1.3-3.5 3.6v2H7.6v3.2h2.8V22h3.4v-7.8h2.7l.4-3.2h-3.1V9.3c0-.9.3-1.6 1.2-1.6z" />
  ),
  'Facebook Group': (
    <path d="M9 11a3 3 0 100-6 3 3 0 000 6zm8 .5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5H3zm13.5 0c0-2-.6-3.6-1.6-4.8 2.9-.5 6.1 1.2 6.1 4.8h-4.5z" />
  ),
  Instagram: (
    <path d="M12 7.6A4.4 4.4 0 1016.4 12 4.4 4.4 0 0012 7.6zm0 7.2A2.8 2.8 0 1114.8 12 2.8 2.8 0 0112 14.8zM17.8 7.4a1 1 0 11-1-1 1 1 0 011 1zM21 8.2a6.3 6.3 0 00-1.7-4.5A6.3 6.3 0 0014.8 2c-1.8-.1-7.1-.1-8.9 0a6.3 6.3 0 00-4.5 1.7A6.3 6.3 0 00.7 8.2c-.1 1.8-.1 7.1 0 8.9a6.3 6.3 0 001.7 4.5 6.3 6.3 0 004.5 1.7c1.8.1 7.1.1 8.9 0a6.3 6.3 0 004.5-1.7 6.3 6.3 0 001.7-4.5c.1-1.8.1-7.1 0-8.9zm-2 10.9a2.8 2.8 0 01-1.6 1.6c-1.1.4-3.8.3-5.1.3s-4 .1-5.1-.3a2.8 2.8 0 01-1.6-1.6c-.4-1.1-.3-3.8-.3-5.1s-.1-4 .3-5.1A2.8 2.8 0 016.2 5c1.1-.4 3.8-.3 5.1-.3s4-.1 5.1.3a2.8 2.8 0 011.6 1.6c.4 1.1.3 3.8.3 5.1s.1 4-.3 5.1z" transform="translate(0.3 0)" />
  ),
  TikTok: (
    <path d="M16.6 5.8a4.8 4.8 0 01-1.1-3.1h-3.2v12.9a2.9 2.9 0 11-2.1-2.8V9.5a6 6 0 105.3 6V9.1a7.9 7.9 0 004.6 1.5V7.4a4.7 4.7 0 01-3.5-1.6z" />
  ),
  X: (
    <path d="M17.5 3h3l-6.6 7.5L21.6 21h-6.1l-4.8-6.2L5.2 21h-3l7-8-6.7-10h6.2l4.3 5.7zm-1 16.1h1.7L7.6 4.8H5.8z" />
  ),
};

/**
 * Social buttons for the footer. Channels the club hasn't set up render as
 * non-interactive placeholders — visible so the committee can see what's
 * missing, but not clickable, because a button that goes nowhere is worse than
 * no button. Add the URL in content/community.ts and it goes live.
 */
export default function SocialButtons() {
  return (
    <div>
      <h2 className="mb-3 text-base">Follow the club</h2>
      <ul className="flex flex-wrap gap-2.5">
        {socials.map((s) => {
          const icon = (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {ICONS[s.name]}
            </svg>
          );

          if (!s.href) {
            return (
              <li key={s.name}>
                <span
                  title={`${s.name} — not set up yet`}
                  className="grid h-12 w-12 place-items-center rounded-xl border-2 border-dashed
                             border-skyLine bg-cloud text-slate2/50"
                >
                  {icon}
                  <span className="sr-only">{s.name} — no account yet</span>
                </span>
              </li>
            );
          }

          return (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.note}
                className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-white
                           hover:bg-sky transition-colors"
              >
                {icon}
                <span className="sr-only">
                  {s.name}
                  {s.handle ? ` — ${s.handle}` : ''} (opens in a new tab)
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-slate2">
        Greyed buttons are channels the club has not set up yet.
      </p>
    </div>
  );
}

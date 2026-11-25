import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { club } from '@/content/site';

/**
 * THE FRAME ROUND THE THREE PAGES A VISITOR CAN SEE — the front page, the
 * sign-in page and "ask to join". A photograph down one side, the club's name,
 * and whatever the page has to say.
 *
 * Nothing from inside the portal belongs here: no news, no names, no
 * documents, no menu. A visitor learns that this is the club's members' portal
 * and how to get in, and that is all.
 */
export default function FrontDoor({
  children,
  photo = 'last-light',
}: {
  children: ReactNode;
  photo?: 'last-light' | 'from-above';
}) {
  const pic =
    photo === 'from-above'
      ? {
          src: '/img/camphill-launch-point-from-above.jpg',
          alt: 'The launch point at Camphill seen from the air: gliders lined up on the grass on the edge of the hill.',
          caption: 'The launch point, from above.',
          position: 'object-center',
        }
      : {
          src: '/img/camphill-last-light.jpg',
          alt: 'A glider and its pilot on the airfield at sunset, under a sky of gold-edged cloud.',
          caption: 'Last light at Camphill.',
          position: 'object-[center_86%] lg:object-center',
        };

  return (
    <div className="ground-dark min-h-screen lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
      <figure className="relative h-44 sm:h-56 lg:h-auto lg:min-h-screen">
        <Image
          src={pic.src}
          alt={pic.alt}
          fill
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          className={`object-cover ${pic.position}`}
        />
        <figcaption className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/60 to-transparent px-6 pb-4 pt-10 text-sm text-white lg:block">
          {pic.caption}
        </figcaption>
      </figure>

      <div className="flex flex-col lg:min-h-screen">
        <main id="main" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 lg:py-12">
          <div className="mb-6 text-center text-white">
            <span aria-hidden="true" className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-white/15">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M2 14l20-7-9 9-3-2-2 4-1-3-5-1z" fill="currentColor" />
              </svg>
            </span>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#A9CFEA]">
              {club.name}
            </p>
            <h1 className="display mt-1 text-4xl">
              Members&rsquo; <em>Portal</em>
            </h1>
            <p className="mt-2 text-sm text-white/90">Gliding at Camphill since {club.founded}</p>
          </div>

          {children}

          <p className="mt-6 text-center text-sm text-white/90">
            Not a member?{' '}
            <a
              href={club.publicSite}
              className="underline decoration-white/40 underline-offset-2 hover:decoration-white"
            >
              The club&rsquo;s public website
            </a>{' '}
            is the place to start.
          </p>
        </main>
      </div>
    </div>
  );
}

/** The link back to the front page, used under the sign-in and join forms. */
export function BackToFront() {
  return (
    <p className="mt-5 text-center text-sm">
      <Link href="/" className="text-white/90 underline decoration-white/40 underline-offset-2 hover:decoration-white">
        Back to the front page
      </Link>
    </p>
  );
}

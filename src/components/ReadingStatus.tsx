'use client';

import Link from 'next/link';
import { useReadingProgress } from '@/lib/reading-progress';

/**
 * One line on the dashboard: have I confirmed all the required reading?
 *
 * It sits in the dark opening band. Nothing is shown until the answer is
 * known, so the page does not jump for a member whose count cannot be read.
 * The list itself, with the tick boxes and the dates, is at the top of the
 * Documents page — this only says how far the member has got and takes them
 * there.
 */
export default function ReadingStatus({ keys }: { keys: string[] }) {
  const progress = useReadingProgress(keys);
  if (!progress) return null;
  const { done, total } = progress;
  const left = total - done;

  return (
    <p className="mt-5 max-w-[34rem] rounded-card border border-white/30 bg-white/10 px-4 py-3 text-white">
      {left === 0 ? (
        <>
          <strong>Required reading: all {total} confirmed.</strong>{' '}
          <Link href="/documents#required-reading" className="underline decoration-white/50 underline-offset-4 hover:decoration-white">
            See what you confirmed and when
          </Link>
        </>
      ) : (
        <>
          <strong>
            Required reading: {left} of {total} still to confirm.
          </strong>{' '}
          <Link href="/documents#required-reading" className="underline decoration-white/50 underline-offset-4 hover:decoration-white">
            Open the list and tick them off
          </Link>
        </>
      )}
    </p>
  );
}

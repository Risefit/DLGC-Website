import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui';
import MemberAdmin from '@/components/MemberAdmin';
import { getUser } from '@/lib/supabase/server';
import { isController } from '@/lib/auth';
import { loadMembers } from './actions';

export const metadata = { title: 'Members' };
export const dynamic = 'force-dynamic';
// Inviting everybody is done a few people at a time, but each step still makes
// accounts and sends email, so it is allowed a minute rather than ten seconds.
export const maxDuration = 60;

/**
 * THE MEMBERS PAGE — for controllers only. Who has a sign-in, who is asking
 * for one, and the buttons to add, approve and remove.
 *
 * Anybody who is not a controller gets "page not found", the same as for an
 * address that does not exist, so the page gives nothing away.
 */
export default async function MembersPage() {
  const user = await getUser();
  if (!isController(user)) notFound();

  const loaded = await loadMembers();

  return (
    <>
      <PageHeader
        eyebrow="Controllers only"
        title={
          <>
            Portal <em>members</em>
          </>
        }
        lead={
          <>
            Who can sign in to the portal. Add a member, approve a request, invite from the club’s
            list, or give somebody a new temporary password.{' '}
            <Link href="/admin/reading" className="font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">
              Who has confirmed the required reading
            </Link>
          </>
        }
      />
      {loaded.ok ? (
        <MemberAdmin
          members={loaded.members}
          requests={loaded.requests}
          requestsReady={loaded.requestsReady}
          list={loaded.list}
          rolesReady={loaded.rolesReady}
        />
      ) : (
        <p role="alert" className="card border-l-4 border-bad p-5 text-bad">
          {loaded.message}
        </p>
      )}
    </>
  );
}

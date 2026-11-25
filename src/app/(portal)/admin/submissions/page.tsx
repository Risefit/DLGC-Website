import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui';
import SubmissionReview, { type Waiting } from '@/components/SubmissionReview';
import { getUser } from '@/lib/supabase/server';
import { adminClient, logSupabaseProblem } from '@/lib/supabase/admin';
import { isController } from '@/lib/auth';
import { KINDS, type SentInKind } from '@/lib/sent-in';

export const metadata = { title: 'Sent in by members' };
export const dynamic = 'force-dynamic';
// Approving a photograph makes its smaller copies, which takes a moment.
export const maxDuration = 60;

/**
 * SENT IN BY MEMBERS — for controllers only.
 *
 * The flying-blog stories and photographs members have sent, with the buttons
 * to approve or decline each one. Approving publishes it at once. Anybody who
 * is not a controller gets "page not found".
 *
 * Stories and photographs ONLY. Safety reports are rows in the same table and
 * are never read here: the query names the two kinds it wants.
 */
export default async function SubmissionsPage() {
  const user = await getUser();
  if (!isController(user)) notFound();

  const admin = adminClient();
  let problem: string | null = null;
  let items: Waiting[] = [];

  if (!admin) {
    problem = 'This page needs SUPABASE_SERVICE_ROLE_KEY set in Vercel.';
  } else {
    const { data, error } = await admin
      .from('submissions')
      .select('id, kind, name, email, title, body, image_path, status, created_at')
      .in('kind', KINDS as unknown as string[])
      .order('created_at', { ascending: false })
      .limit(400);
    if (error) {
      logSupabaseProblem('reading submissions for review', error);
      problem = 'What members have sent in could not be read from Supabase. Try again in a moment.';
    } else {
      items = (data ?? []).map((r) => ({
        id: r.id as number,
        kind: r.kind as SentInKind,
        name: (r.name as string | null) ?? '',
        email: (r.email as string | null) ?? '',
        title: (r.title as string | null) ?? '',
        body: (r.body as string | null) ?? '',
        hasImage: Boolean(r.image_path),
        status: r.status === 'published' ? 'published' : r.status === 'pending' ? 'pending' : 'declined',
        sent: r.created_at as string,
      }));
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Controllers only"
        back={{ href: '/admin/members', label: 'Members' }}
        title={
          <>
            Sent in <em>by members</em>
          </>
        }
        lead="Flying-blog stories and photographs members have sent. Nothing shows on the site until a controller approves it here; approving publishes it straight away."
      />
      {problem ? (
        <p role="alert" className="card border-l-4 border-bad p-5 text-bad">
          {problem}
        </p>
      ) : (
        <SubmissionReview items={items} />
      )}
    </>
  );
}

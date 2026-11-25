import FrontDoor, { BackToFront } from '@/components/FrontDoor';
import JoinForm from '@/components/JoinForm';

export const metadata = { title: 'Ask to join' };

/**
 * ASK TO JOIN — a club member who has no sign-in yet tells the controller who
 * they are. Nothing is created here: the request waits on the Members page
 * (/admin/members) until a controller approves it, and only then does an
 * account exist.
 */
export default function JoinPage() {
  return (
    <FrontDoor photo="from-above">
      <JoinForm />
      <BackToFront />
    </FrontDoor>
  );
}

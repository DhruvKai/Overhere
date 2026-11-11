import { FaceCheck } from '@/components/FaceCheck';
import { goBack } from '@/lib/nav';
import { useModel } from '@/lib/store';

/* The Face check screen, opened from Profile, Post, a plan or the locked-plans note. Sign-up shows the same check in
   place instead (onboarding.tsx). Done goes back, or, with nothing behind this screen, to the screen this account may
   see: sign-up while it isn't finished (the tabs are locked until then, so going there would do nothing), else Home. */
export default function Verify() {
  const m = useModel();
  return <FaceCheck onDone={() => goBack(m.profile?.onboarded ? '/' : '/onboarding')} />;
}

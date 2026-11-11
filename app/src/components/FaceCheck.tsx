import { useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { FaceScan } from '@/components/FaceScan';
import { PhotoPair } from '@/components/PhotoPair';
import { Btn, Check, Empty, H, Icon, P } from '@/components/ui';
import { api, friendly, type FaceSession } from '@/lib/api';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

/* The face check. While app_config.face_check is 'simulated' it's the same pretend check as the website
   (verify_simulated). In 'live' mode it is AWS Face Liveness, the same steps as the website (CHECKS.live in
   web/app.js): face-start makes the session, FaceScan films it, face-result compares the live face with both of
   the person's photos and records pass or fail on the server. So two photos come first.
   Used in two places: the sign-up steps show it in place (onboarding.tsx), as the website does, and the Face check
   screen (app/verify.tsx) for everyone else. onDone is called when the check passes and from the Done button; it is
   the caller's job to move on, so nothing here depends on there being a screen to go back to. */
const CONTACT = 'admin@overhere.social';
export function FaceCheck({ onDone }: { onDone: () => void }) {
  const t = useTheme();
  const m = useModel();
  const { run, toast, refresh } = useStore();
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ses, setSes] = useState<FaceSession | null>(null);
  const [err, setErr] = useState('');
  const v = m.verify.face;
  const live = m.mode.face === 'live';

  if (m.profile?.face) {
    return <Empty icon="check-circle" title="You're verified" text="Your face check is done. You can post plans and ask to join."><Btn title="Done" onPress={onDone} /></Empty>;
  }
  if (v.review) {
    /* the same email as reviewMail in web/app.js: the account id helps the team find it in /addmin */
    const mail = `mailto:${CONTACT}?subject=${encodeURIComponent(`Manual face check for ${m.profile?.name || 'my account'}`)}&body=${encodeURIComponent(`Hi Overhere team,

My face check didn't pass after ${v.max} tries. Please check it by hand.

Account: ${m.me}
`)}`;
    const when = v.until ? new Date(v.until).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' }) : null;
    return (
      <Empty icon="clock" title="Check paused for 24 hours" text={`You've used all ${v.max} tries, so the check is paused${when ? ` until ${when}` : ''}. Then you get ${v.max} new tries. A person on our team will also look at it, and if they approve it you'll hear in Updates. Want it sorted sooner? Email us.`}>
        <Btn title={`Email ${CONTACT}`} icon="mail" kind="soft" onPress={() => Linking.openURL(mail).catch(() => toast(`Email us at ${CONTACT}`))} />
      </Empty>
    );
  }
  if (!m.profile?.photo || !m.profile.photo2) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }}>
        <H size={22}>First, add two photos of you</H>
        <P>The face check compares your face with both, so people know the photos are really you. The first is your profile picture.</P>
        <View style={{ height: 4 }} />
        <PhotoPair />
      </ScrollView>
    );
  }

  async function start() {
    if (!agree) return toast('Please tick the box to continue');
    setBusy(true); setErr('');
    if (!live) {
      const ok = await run(() => api.verifySimulated('face'));
      setBusy(false);
      if (ok !== undefined) { toast('Face check done'); onDone(); }
      return;
    }
    try {
      const s = await api.faceStart();
      if ('status' in s) await refresh();   // out of tries: the server filed it for review, no camera
      else setSes(s);
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  /* The video is with AWS (or the scan stopped): ask the server for the verdict either way, as the website does. */
  async function scanned(scanErr?: string) {
    const s = ses;
    setSes(null);
    if (!s) return;
    if (scanErr) { setErr(scanErr); await refresh(); return; }
    setBusy(true);
    try {
      const r = await api.faceResult(s.sessionId);
      await refresh();
      if (r.status === 'passed') { toast('Face check passed'); onDone(); }
      else if (r.status !== 'review') setErr(r.message || "That didn't pass. Try again in good light, with your face filling the oval.");
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
      {ses ? <FaceScan ses={ses} onDone={scanned} /> : null}
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: t.acc2, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="smile" size={30} color={t.accink} />
      </View>
      <H size={22}>A quick face check</H>
      <P>Shows people you&apos;re real and the person in your photos. You look at the camera for a few seconds.</P>
      <Check on={agree} onPress={() => setAgree(x => !x)}>I agree to a face scan. The video goes only to our verification provider to check that I am a real person and match my two photos, and is not kept. Overhere stores whether it passed and the provider&apos;s scores. If a scan fails, one still frame from it is kept privately so our team can compare it with my photos, and deleted once they have reviewed it or I pass.</Check>
      {live ? null : <P small mute>Beta: the check is simulated for now, so it always passes.</P>}
      <Btn title="Start face check" icon="camera" onPress={start} busy={busy} />
      {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, fontSize: 14 }}>{err}</Text> : null}
    </ScrollView>
  );
}

import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { FaceScan } from '@/components/FaceScan';
import { PhotoPair } from '@/components/PhotoPair';
import { Btn, Empty, H, Icon, P } from '@/components/ui';
import { api, friendly, type FaceSession } from '@/lib/api';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

/* The face check. While app_config.face_check is 'simulated' it's the same pretend check as the website
   (verify_simulated). In 'live' mode it is AWS Face Liveness, the same steps as the website (CHECKS.live in
   web/app.js): face-start makes the session, FaceScan films it, face-result compares the live face with both of
   the person's photos and records pass or fail on the server. So two photos come first. */
const CONTACT = 'admin@overhere.social';
export default function Verify() {
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
    return <Empty icon="check-circle" title="You're verified" text="Your face check is done. You can post plans and ask to join."><Btn title="Done" onPress={() => router.back()} /></Empty>;
  }
  if (v.review || v.fails >= v.max) {
    /* the same email as reviewMail in web/app.js: the account id helps the team find it in /addmin */
    const mail = `mailto:${CONTACT}?subject=${encodeURIComponent(`Manual face check for ${m.profile?.name || 'my account'}`)}&body=${encodeURIComponent(`Hi Overhere team,

My face check didn't pass after ${v.max} tries. Please check it by hand.

Account: ${m.me}
`)}`;
    return (
      <Empty icon="clock" title="A person is checking" text={`You've used all ${v.max} tries, so our team will look at it. We'll let you know in Updates. Want it sorted sooner? Email us and we'll verify you by hand.`}>
        <Btn title={`Email ${CONTACT}`} icon="mail" kind="soft" onPress={() => Linking.openURL(mail).catch(() => toast(`Email us at ${CONTACT}`))} />
      </Empty>
    );
  }
  if (!m.profile?.photo || !m.profile.photo2) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }}>
        <H size={22}>First, add two photos of you</H>
        <P>The face check compares your live face with both, so people know your photos are really you. Photo 1 is your profile picture; both show on your profile.</P>
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
      if (ok !== undefined) { toast('Face check done'); router.back(); }
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
      if (r.status === 'passed') { toast('Face check passed'); router.back(); }
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
      <P>It shows people you&apos;re a real person, and the person in your two photos. Everyone who posts or joins plans has done it. You look at the camera for a few seconds.</P>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: agree }} onPress={() => setAgree(x => !x)} style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, marginTop: 2, borderColor: agree ? t.acc : t.line, backgroundColor: agree ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {agree ? <Icon name="check" size={16} color={t.onAcc} /> : null}
        </View>
        <P style={{ flex: 1 }}>I agree to a face scan. The video goes only to our verification provider to check that I am a real person and match my two photos, and is not kept. Overhere stores only whether it passed and the provider&apos;s scores.</P>
      </Pressable>
      {live ? null : <P small mute>Beta: the check is simulated for now, so it always passes.</P>}
      <Btn title="Start face check" icon="camera" onPress={start} busy={busy} />
      {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, fontSize: 14 }}>{err}</Text> : null}
    </ScrollView>
  );
}

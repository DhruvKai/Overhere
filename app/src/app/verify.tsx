import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Btn, Empty, H, Icon, P } from '@/components/ui';
import { api } from '@/lib/api';
import { useModel, useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';

/* The face check. While app_config.face_check is 'simulated' it's the same pretend check as the website
   (verify_simulated). In 'live' mode the real check is AWS Face Liveness, whose native module is the next milestone:
   until then people do it once on the website and it carries over to the app. */
export default function Verify() {
  const t = useTheme();
  const m = useModel();
  const { run, toast } = useStore();
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const v = m.verify.face;

  if (m.profile?.face) {
    return <Empty icon="check-circle" title="You're verified" text="Your face check is done. You can post plans and ask to join."><Btn title="Done" onPress={() => router.back()} /></Empty>;
  }
  if (v.review || v.fails >= v.max) {
    return <Empty icon="clock" title="A person is checking" text="You've used all your tries, so our team will look at it. We'll let you know in Updates." />;
  }

  async function start() {
    if (!agree) return toast('Please tick the box to continue');
    setBusy(true);
    const ok = await run(() => api.verifySimulated('face'));
    setBusy(false);
    if (ok !== undefined) { toast('Face check done'); router.back(); }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: t.acc2, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="smile" size={30} color={t.accink} />
      </View>
      <H size={22}>A quick face check</H>
      <P>It shows people you&apos;re a real person. Everyone who posts or joins plans has done it. You look at the camera for a few seconds.</P>
      {m.mode.face === 'live' ? (
        <>
          <P mute>The in-app face check is coming in the next update. For now, do it once on overhere.social with the same account, and it shows here straight away.</P>
          <Btn title="Open overhere.social" icon="external-link" onPress={() => WebBrowser.openBrowserAsync(SITE + '/app.html')} />
        </>
      ) : (
        <>
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: agree }} onPress={() => setAgree(x => !x)} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, marginTop: 2, borderColor: agree ? t.acc : t.line, backgroundColor: agree ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              {agree ? <Icon name="check" size={16} color={t.onAcc} /> : null}
            </View>
            <P style={{ flex: 1 }}>I agree to a face scan. The video goes only to our verification provider to check that I am a real person, and is not kept. Overhere stores only whether it passed and the provider&apos;s confidence score.</P>
          </Pressable>
          <P small mute>Beta: the check is simulated for now, so it always passes. {v.max - v.attempts} tries left.</P>
          <Btn title="Start face check" icon="camera" onPress={start} busy={busy} />
        </>
      )}
    </ScrollView>
  );
}

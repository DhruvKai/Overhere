import * as WebBrowser from 'expo-web-browser';
import { Text, View } from 'react-native';
import { tipsOf } from '@/lib/feedback';
import { useModel, useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { Btn, H, P } from './ui';

/* "Before your first meetup": shown once, before your first request or first post (safetyOnce in web/app.js).
   Seen is kept in profiles.state.tips.safety1, shared with the website. */
export const safetySeen = (m: ReturnType<typeof useModel>) => !!tipsOf(m).safety1;

export function SafetyFirst({ onOk, title = true }: { onOk: () => void; title?: boolean }) {
  const t = useTheme();
  const { savePriv } = useStore();
  const tips = [
    'Meet in a busy public place, and make your own way there and back.',
    'Tell someone you trust where you\'ll be. You can send them your plan in one tap.',
    'Keep your home address and workplace to yourself until you know people.',
    'Never send money to someone you met here.',
    'Leave whenever you like. In an emergency call 112, or tap SOS in the group chat.',
  ];
  const ok = () => { savePriv(p => ({ tips: { ...(p.tips as object), safety1: true } })); onOk(); };
  return (
    <View>
      {title ? <View style={{ marginBottom: 10 }}><H size={20}>Before your first meetup</H></View> : null}
      <P style={{ marginBottom: 10 }}>You&apos;ll be meeting people you don&apos;t know yet. A few things that keep meetups good:</P>
      {tips.map(x => <P key={x} style={{ marginBottom: 6 }}>• {x}</P>)}
      <P small mute style={{ marginTop: 6, marginBottom: 16 }}>
        The face check confirms a real person made each account. It doesn&apos;t tell you what they&apos;re like. More in the{' '}
        <Text onPress={() => WebBrowser.openBrowserAsync(SITE + '/terms.html#safety')} style={{ color: t.accink, fontWeight: '700' }}>Terms</Text>.
      </P>
      <Btn title="I understand, continue" onPress={ok} />
    </View>
  );
}

import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { FeedbackSheet } from '@/components/Feedback';
import { ReportSheet } from '@/components/ReportSheet';
import { Avatar, Btn, Chip, Empty, Label, Meta, P } from '@/components/ui';
import { api } from '@/lib/api';
import { askedOf } from '@/lib/feedback';
import { placeLine, REPORT_REASONS, uname, whenStr } from '@/lib/model';
import { photoOf } from '@/lib/photos';
import { useModel, useStore } from '@/lib/store';
import { R, useTheme } from '@/lib/theme';

/* After a meetup: did it go OK, how much you enjoyed it, and who came. Show-up rates appear on profiles, so everyone can
   see who is reliable (rate_activity). "Something went wrong" offers SOS, a report, or an email to the team. */
export default function Rate() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const m = useModel();
  const { run, toast, askMicro, saveAsked } = useStore();
  const a = m.acts.find(x => x.id === id);
  const prev = a ? m.ratings[a.id] : undefined;
  const [ok, setOk] = useState<'yes' | 'no'>(prev?.ok ?? 'yes');
  const [stars, setStars] = useState(prev?.stars ?? 0);
  const [people, setPeople] = useState<Record<string, 'show' | 'noshow'>>(() => ({ ...(prev?.people as Record<string, 'show' | 'noshow'> | undefined) }));
  const [busy, setBusy] = useState(false);
  const [reporting, setReporting] = useState<string | null>(null);
  const [meetFb, setMeetFb] = useState(false);
  if (!a) return <Empty icon="star" title="This plan isn't available" text="It may have been cancelled." />;
  const ppl = [a.host, ...a.members].filter(x => x !== m.me && x !== '?');

  async function submit() {
    if (!a) return;
    if (!stars) return toast('Tap the stars to say how much you enjoyed it');
    setBusy(true);
    const all = Object.fromEntries(ppl.map(u => [u, people[u] ?? 'show'])) as Record<string, 'show' | 'noshow'>;
    const r = await run(() => api.rateActivity(a.id, ok, stars, all));
    setBusy(false);
    if (r === undefined) return;
    /* the first time, ask about the app as well; after that, just the quick question */
    const asked = askedOf(m);
    if (ok !== 'no' && !asked.fbSent && !asked.fbMeet) { saveAsked(() => ({ fbMeet: true })); setMeetFb(true); return; }
    toast(ok === 'no' ? 'Thanks for telling us. Our safety team will follow up with you.' : 'Thanks! Your feedback helps keep meetups good and reliable.');
    router.back();
    askMicro('rating');
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 6, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', gap: 12, backgroundColor: t.field, borderRadius: R, padding: 12, marginBottom: 12 }}>
          <Image source={photoOf(a)} style={{ width: 64, height: 64, borderRadius: 14 }} contentFit="cover" />
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ color: t.ink, fontSize: 16, fontWeight: '700' }} numberOfLines={2}>{a.desc}</Text>
            <Meta icon="calendar" text={whenStr(a.when)} />
            <Meta icon="map-pin" text={placeLine(a)} />
          </View>
        </View>

        <Label>Did everything go OK?</Label>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <Chip label="Yes, all good" on={ok === 'yes'} onPress={() => setOk('yes')} />
          <Chip label="Something went wrong" on={ok === 'no'} onPress={() => setOk('no')} />
        </View>
        {ok === 'no' ? (
          <View style={{ backgroundColor: t.badbg, borderRadius: 16, padding: 14, gap: 10, marginBottom: 14 }}>
            <Text style={{ color: t.bad, fontWeight: '700', fontSize: 15 }}>Are you still in a bad situation?</Text>
            <Btn title="Yes, I need help now" icon="alert-triangle" kind="alarm" onPress={() => router.push({ pathname: '/sos', params: { id: a.id } })} />
            <P small>It already happened? Report what happened, and we&apos;ll follow up. A person on our team reads every report.</P>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {ppl.filter(u => m.people[u]).map(u => <Chip key={u} icon="flag" label={`Report ${uname(m, u)}`} onPress={() => setReporting(u)} />)}
              <Chip icon="mail" label="Email us" onPress={() => Linking.openURL(`mailto:admin@overhere.social?subject=${encodeURIComponent('Something went wrong at a plan')}`)} />
            </View>
          </View>
        ) : null}

        <Label>How much did you enjoy it?</Label>
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <Pressable key={n} accessibilityRole="radio" accessibilityState={{ checked: stars === n }} accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}
              onPress={() => setStars(n)} hitSlop={4}>
              <Text style={{ fontSize: 36, color: n <= stars ? '#F59E0B' : t.line }}>★</Text>
            </Pressable>
          ))}
        </View>

        {ppl.length ? <Label>Who showed up?</Label> : null}
        {ppl.map(u => {
          const v = people[u] ?? 'show';
          return (
            <View key={u} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
              <Pressable accessibilityRole="button" disabled={!m.people[u]} onPress={() => setReporting(u)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Avatar m={m} id={u} size={32} />
                <Text style={{ flex: 1, color: t.ink, fontSize: 15 }} numberOfLines={1}>{uname(m, u)}</Text>
              </Pressable>
              <Chip label="Came" on={v === 'show'} onPress={() => setPeople(x => ({ ...x, [u]: 'show' }))} />
              <Chip label="No-show" on={v === 'noshow'} onPress={() => setPeople(x => ({ ...x, [u]: 'noshow' }))} />
            </View>
          );
        })}
        <P small mute style={{ marginTop: 6, marginBottom: 14 }}>Show-up rates appear on profiles so everyone can see who is reliable. Tap a name to report someone.</P>
        <Btn title={prev ? 'Update rating' : 'Submit'} onPress={submit} busy={busy} />
      </ScrollView>
      <ReportSheet open={!!reporting} title={`Report ${reporting ? uname(m, reporting) : ''}`} reasons={REPORT_REASONS} target={reporting} act={a.id} onClose={() => setReporting(null)} />
      {meetFb ? <FeedbackSheet from="meetup" onClose={() => { setMeetFb(false); router.back(); }} /> : null}
    </>
  );
}

import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { goBack } from '@/lib/nav';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedbackSheet } from '@/components/Feedback';
import { ReportSheet } from '@/components/ReportSheet';
import { Avatar, Btn, Chip, Empty, Field, Label, Meta, P } from '@/components/ui';
import { api } from '@/lib/api';
import { askedOf } from '@/lib/feedback';
import { needRate, placeLine, REPORT_REASONS, uname, whenStr } from '@/lib/model';
import { photoOf } from '@/lib/photos';
import { useModel, useStore } from '@/lib/store';
import { R, useTheme } from '@/lib/theme';

/* After a plan (the 7 Nov spec), one of three things, as needRate says:
   - the host rates it and marks everyone as there or a no-show (record_attendance); that's what reliability counts use
   - a member the host marked as there rates the plan and the host (rate_activity)
   - a member marked a no-show says, kindly asked, what happened, or that the mark is wrong (noshow_reply)
   "Something went wrong" offers SOS, a report, or an email to the team. */
export default function Rate() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  /* Android draws behind its navigation buttons, so the end of the page keeps clear of them */
  const insets = useSafeAreaInsets();
  const m = useModel();
  const { run, toast, askMicro, saveAsked } = useStore();
  const a = m.acts.find(x => x.id === id);
  const prev = a ? m.ratings[a.id] : undefined;
  const [ok, setOk] = useState<'yes' | 'no'>(prev?.ok ?? 'yes');
  const [stars, setStars] = useState(prev?.stars ?? 0);
  const [hostStars, setHostStars] = useState(prev?.hostStars ?? 0);
  const [people, setPeople] = useState<Record<string, 'show' | 'noshow'>>(() => ({ ...(prev?.people as Record<string, 'show' | 'noshow'> | undefined) }));
  const [reply, setReply] = useState('');
  const [dispute, setDispute] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reporting, setReporting] = useState<string | null>(null);
  const [meetFb, setMeetFb] = useState(false);
  if (!a) return <Empty icon="star" title="This plan isn't available" text="It may have been cancelled." />;
  const mode = needRate(m, a) ?? (a.host === m.me ? 'host' : 'member');
  const members = a.members.filter(x => x !== '?');
  const ppl = [a.host, ...a.members].filter(x => x !== m.me && x !== '?');

  const done = (msg: string) => {
    /* the first time, ask about the app as well; after that, just the quick question */
    const asked = askedOf(m);
    if (ok !== 'no' && mode !== 'noshow' && !asked.fbSent && !asked.fbMeet) { saveAsked(() => ({ fbMeet: true })); setMeetFb(true); return; }
    toast(msg);
    goBack();
    if (mode !== 'noshow') askMicro('rating');
  };

  async function submit() {
    if (!a) return;
    if (mode === 'noshow') {
      if (!reply.trim() && !dispute) return toast('Say what happened, or tick that you were there');
      setBusy(true);
      const r = await run(() => api.noshowReply(a.id, reply.trim(), dispute));
      setBusy(false);
      if (r !== undefined) done(dispute ? 'Thanks. Our team will look into it.' : 'Thanks, the host has been told.');
      return;
    }
    if (!stars) return toast(mode === 'host' ? 'Tap the stars to rate the plan' : 'Tap the stars to say how much you enjoyed it');
    if (mode === 'host') {
      const missing = members.find(u => !people[u]);
      if (missing) return toast(`Mark whether ${uname(m, missing)} came`);
      setBusy(true);
      const r = await run(() => api.recordAttendance(a.id, ok, stars, Object.fromEntries(members.map(u => [u, people[u]]))));
      setBusy(false);
      if (r !== undefined) done(ok === 'no' ? 'Thanks for telling us. Our safety team will follow up with you.' : 'Thanks! Everyone you marked as there can now rate the plan.');
      return;
    }
    if (!hostStars) return toast('Tap the stars to rate the host too');
    setBusy(true);
    const r = await run(() => api.rateActivity(a.id, ok, stars, hostStars));
    setBusy(false);
    if (r !== undefined) done(ok === 'no' ? 'Thanks for telling us. Our safety team will follow up with you.' : 'Thanks! Your feedback helps keep meetups good.');
  }

  const starRow = (v: number, set: (n: number) => void, what: string) => (
    <View accessibilityRole="radiogroup" accessibilityLabel={what} style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Pressable key={n} accessibilityRole="radio" accessibilityState={{ checked: v === n }} accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}
          onPress={() => set(n)} hitSlop={4}>
          <Text style={{ fontSize: 36, color: n <= v ? '#F59E0B' : t.line }}>★</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: mode === 'host' ? 'Rate and record attendance' : mode === 'noshow' ? 'We missed you' : 'How did it go?' }} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 6, paddingBottom: 40 + insets.bottom }}>
        <View style={{ flexDirection: 'row', gap: 12, backgroundColor: t.field, borderRadius: R, padding: 12, marginBottom: 12 }}>
          <Image source={photoOf(a)} style={{ width: 64, height: 64, borderRadius: 14 }} contentFit="cover" />
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ color: t.ink, fontSize: 16, fontWeight: '700' }} numberOfLines={2}>{a.desc}</Text>
            <Meta icon="calendar" text={whenStr(a.when)} />
            <Meta icon="map-pin" text={placeLine(a)} />
          </View>
        </View>

        {mode === 'noshow' ? (
          <>
            <P style={{ marginBottom: 12 }}>{uname(m, a.host)} marked you as not there. That&apos;s OK, plans change. If something came up, let them know. If you were there, say so and our team will look into it.</P>
            <Field label={`What happened? (${uname(m, a.host)} sees this)`} value={reply} onChangeText={setReply} maxLength={300} multiline
              placeholder="e.g. I got stuck at work and couldn't message in time. Sorry!" />
            <View style={{ flexDirection: 'row', marginBottom: 14 }}>
              <Chip icon={dispute ? 'check-square' : 'square'} label="I was there. This mark isn't right." on={dispute} onPress={() => setDispute(x => !x)} />
            </View>
            <Btn title="Send" onPress={submit} busy={busy} />
          </>
        ) : (
          <>
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

            <Label>{mode === 'host' ? 'How did the plan go overall?' : 'How much did you enjoy it?'}</Label>
            {starRow(stars, setStars, mode === 'host' ? 'How the plan went' : 'How much you enjoyed it')}

            {mode === 'host' ? (
              <>
                {members.length ? <Label>Who came?</Label> : null}
                {members.map(u => (
                  <View key={u} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
                    <Pressable accessibilityRole="button" disabled={!m.people[u]} onPress={() => router.push({ pathname: '/person/[id]', params: { id: u } })}
                      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Avatar m={m} id={u} size={32} />
                      <Text style={{ flex: 1, color: t.ink, fontSize: 15 }} numberOfLines={1}>{uname(m, u)}</Text>
                    </Pressable>
                    <Chip label="Showed up" on={people[u] === 'show'} onPress={() => setPeople(x => ({ ...x, [u]: 'show' }))} />
                    <Chip label="No-show" on={people[u] === 'noshow'} onPress={() => setPeople(x => ({ ...x, [u]: 'noshow' }))} />
                  </View>
                ))}
                <P small mute style={{ marginTop: 6, marginBottom: 14 }}>This updates each person&apos;s reliability record. People you mark as a no-show are asked what happened, and can tell us if it&apos;s wrong.</P>
              </>
            ) : (
              <>
                <Label>{`How was ${uname(m, a.host)} as a host?`}</Label>
                {starRow(hostStars, setHostStars, 'How the host was')}
                <P small mute style={{ marginBottom: 14 }}>Only our team sees ratings.</P>
              </>
            )}
            <Btn title={mode === 'host' ? 'Save' : prev ? 'Update rating' : 'Submit'} onPress={submit} busy={busy} />
          </>
        )}
      </ScrollView>
      <ReportSheet open={!!reporting} title={`Report ${reporting ? uname(m, reporting) : ''}`} reasons={REPORT_REASONS} target={reporting} act={a.id} onClose={() => setReporting(null)} />
      {meetFb ? <FeedbackSheet from="meetup" onClose={() => { setMeetFb(false); goBack(); }} /> : null}
    </>
  );
}

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { api } from '@/lib/api';
import { learnTaste, placeLine, spots, uname, whenStr, type Plan } from '@/lib/model';
import { photoOf } from '@/lib/photos';
import { registerPush } from '@/lib/push';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { SafetyFirst, safetySeen } from './SafetyFirst';
import { Sheet } from './Sheet';
import { Btn, Field, Label, Meta, Note } from './ui';

/* Ask to join, with an optional note to the host: the plan, who hosts it, then the note (the website's "Request to Join").
   Asking needs the face check first (request_join), so without it the button goes to the face check. */
export function JoinSheet({ plan, onClose, onDone }: { plan: Plan | null; onClose: () => void; onDone?: () => void }) {
  const t = useTheme();
  const m = useModel();
  const { run, toast, askMicro, savePriv } = useStore();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [safety, setSafety] = useState(false);
  if (!plan) return null;
  const a = plan;
  const full = spots(a) <= 0 || a.status === 'full';
  const sample = !!m.people[a.host]?.sample;
  const hostName = uname(m, a.host);
  const face = !!m.profile?.face;

  async function send(seen = safetySeen(m)) {
    /* the first request shows "Before your first meetup" first */
    if (!seen) return setSafety(true);
    setSafety(false);
    if (!face) { onClose(); router.push('/verify'); return; }
    setBusy(true);
    const st = await run(() => api.requestJoin(a.id, note.trim()));
    setBusy(false);
    if (st === undefined) return;
    /* asking to join counts towards the category in Swipe's order */
    savePriv(p => learnTaste(p, a.cat, 1));
    toast(st === 'accepted' ? `${hostName} said yes! Say hi in the group chat.` : `Request sent to ${hostName}. Follow it in My plans.`);
    setNote('');
    onClose();
    onDone?.();
    askMicro('request');
    registerPush(true);   // now's when notifications are useful: to hear back from the host
  }

  if (safety) return <Sheet title="Before your first meetup" onClose={() => setSafety(false)}><SafetyFirst title={false} onOk={() => send(true)} /></Sheet>;

  return (
    <Sheet title="Ask to join" onClose={onClose}>
      {/* just enough to know which plan this is; the plan's page has the rest */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Image source={photoOf(a)} style={{ width: 56, height: 56, borderRadius: 12 }} contentFit="cover" />
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={{ color: t.ink, fontSize: 16, fontWeight: '700' }} numberOfLines={2}>{a.desc}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 2 }}>
            <Meta icon="calendar" text={whenStr(a.when)} />
            <Meta icon="map-pin" text={placeLine(a)} />
          </View>
        </View>
      </View>

      {full ? <Note icon="users" tone="info">This plan is full, so it can&apos;t take requests right now.</Note> : null}
      <Label>Say hi to {hostName} <Text style={{ fontWeight: '400', color: t.mute }}>(optional)</Text></Label>
      <Field accessibilityLabel={`Note to ${hostName}`} value={note} onChangeText={setNote} maxLength={100} multiline
        placeholder="Say hi, or why you'd like to come" />
      {sample || !face ? (
        <Note>{sample ? <Text style={{ fontWeight: '700' }}>Sample plan: </Text> : null}{sample ? 'nobody will be there. ' : ''}{!face ? 'Quick 1-min face check first.' : ''}</Note>
      ) : null}
      <Btn title={face ? 'Send request' : 'Do the face check'} onPress={() => send()} busy={busy} icon={face ? 'send' : 'smile'} disabled={full} />
      <View style={{ height: 8 }} />
      <Btn title="Not now" kind="ghost" onPress={onClose} />
    </Sheet>
  );
}

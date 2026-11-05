import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { api } from '@/lib/api';
import { COST, isVer, kmAway, placeLine, rupees, spots, spotTxt, tags, uname, whenStr, type Plan } from '@/lib/model';
import { photoOf } from '@/lib/photos';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { SafetyFirst, safetySeen } from './SafetyFirst';
import { Sheet } from './Sheet';
import { Avatar, Badge, Btn, CatPill, Field, Icon, Label, Meta, Note, P } from './ui';

/* Ask to join, with an optional note to the host: the plan, who hosts it, then the note (the website's "Request to Join").
   Asking needs the face check first (request_join), so without it the button goes to the face check. */
export function JoinSheet({ plan, onClose, onDone }: { plan: Plan | null; onClose: () => void; onDone?: () => void }) {
  const t = useTheme();
  const m = useModel();
  const { run, toast, askMicro } = useStore();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [safety, setSafety] = useState(false);
  if (!plan) return null;
  const a = plan;
  const full = spots(a) <= 0 || a.status === 'full';
  const host = m.people[a.host];
  const hostName = uname(m, a.host);
  const face = !!m.profile?.face;
  const km = kmAway(m, a);

  async function send(seen = safetySeen(m)) {
    /* the first request shows "Before your first meetup" first */
    if (!seen) return setSafety(true);
    setSafety(false);
    if (!face) { onClose(); router.push('/verify'); return; }
    setBusy(true);
    const st = await run(() => api.requestJoin(a.id, note.trim()));
    setBusy(false);
    if (st === undefined) return;
    toast(st === 'waitlist' ? `You're on the waitlist. Your request goes to ${hostName} if a spot opens.`
      : st === 'accepted' ? `${hostName} said yes! Say hi in the group chat.` : `Request sent to ${hostName}. Follow it in My plans.`);
    setNote('');
    onClose();
    onDone?.();
    askMicro('request');
  }

  if (safety) return <Sheet title="Before your first meetup" onClose={() => setSafety(false)}><SafetyFirst title={false} onOk={() => send(true)} /></Sheet>;

  return (
    <Sheet title={full ? 'Join the waitlist' : 'Request to Join'} onClose={onClose}>
      <View style={{ flexDirection: 'row', gap: 12, backgroundColor: t.field, borderRadius: 18, padding: 12 }}>
        <Image source={photoOf(a)} style={{ width: 76, height: 76, borderRadius: 38 }} contentFit="cover" />
        <View style={{ flex: 1, gap: 3 }}>
          <CatPill cat={a.cat} />
          <Text style={{ color: t.ink, fontSize: 16, fontWeight: '700' }} numberOfLines={2}>{a.desc}</Text>
          <Meta icon="calendar" text={whenStr(a.when)} />
          <Meta icon="map-pin" text={placeLine(a) + (km != null ? ` · ${km.toFixed(1)} km` : '')} />
          <Meta icon="users" text={`${a.members.length} going · ${spotTxt(a)}${a.wl ? ` · ${a.wl} on waitlist` : ''}`} />
          <Meta icon="credit-card" text={COST[a.cost] + (a.total ? ` · about ${rupees(a.total)} in total` : '')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {[...tags(a), ...(a.aud === 'everyone' ? ['Open to everyone'] : [])].map(x => <Badge key={x} text={x} tone="acc" />)}
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 14, marginBottom: 14 }}>
        <P mute>Hosted by</P>
        <Pressable accessibilityRole="button" accessibilityLabel={`View ${hostName}'s profile`} onPress={() => { onClose(); router.push({ pathname: '/person/[id]', params: { id: a.host } }); }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Avatar m={m} id={a.host} size={26} />
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 15 }}>{hostName}{host?.age ? <Text style={{ fontWeight: '400' }}>, {host.age}</Text> : null}</Text>
        </Pressable>
        {isVer(m, a.host) ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}><Icon name="check-circle" size={14} color={t.ok} /><Text style={{ color: t.ok, fontSize: 13, fontWeight: '600' }}>Verified</Text></View> : null}
        {host?.sample ? <Badge text="SAMPLE" tone="warn" /> : null}
      </View>

      {full ? <Note icon="users" tone="info">This plan is full. Join the waitlist and your request goes to {hostName} automatically if a spot opens{a.wl ? ` (${a.wl} ahead of you)` : ''}.</Note> : null}
      <Label>Add a note <Text style={{ fontWeight: '400', color: t.mute }}>(optional)</Text></Label>
      <P small mute style={{ marginTop: -4, marginBottom: 8 }}>Introduce yourself or mention why you want to join.</P>
      <Field accessibilityLabel="Note to the host" hint={`${note.length}/100`} value={note} onChangeText={setNote} maxLength={100} multiline
        placeholder="Hey! I'd love to join, happy to be on time and split costs." />
      {host?.sample ? <Note><Text style={{ fontWeight: '700' }}>Sample plan.</Text> It shows how Overhere works: the host says yes straight away, but nobody will actually be there. Don&apos;t go to meet anyone.</Note> : null}
      {!face ? <Note>You&apos;ll need to do a quick face check before your request is sent. It takes about a minute.</Note> : null}
      <Btn title={full ? (face ? 'Join waitlist' : 'Verify & join waitlist') : (face ? 'Send Request' : 'Verify & Send Request')} onPress={() => send()} busy={busy} icon="send" />
      <View style={{ height: 8 }} />
      <Btn title="Not now" kind="ghost" onPress={onClose} />
    </Sheet>
  );
}

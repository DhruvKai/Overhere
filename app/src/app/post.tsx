import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { PlacePicker } from '@/components/PlacePicker';
import { Btn, Chip, Empty, Field, Label, P, Wrap } from '@/components/ui';
import { api } from '@/lib/api';
import { CATS, COST, GENDERS, homeLL, REPEAT, whenStr } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import type { Cat, Cost, Gender } from '@/lib/types';

/* A sensible first time: the next round hour at least 3 hours away. */
const firstTime = () => { const d = new Date(Date.now() + 3 * 3600e3); d.setMinutes(0, 0, 0); d.setHours(d.getHours() + 1); return d; };

export default function Post() {
  const t = useTheme();
  const m = useModel();
  const { run, toast } = useStore();
  const [cat, setCat] = useState<Cat>('cafe');
  const [desc, setDesc] = useState('');
  const [cap, setCap] = useState(3);
  const [when, setWhen] = useState(firstTime);
  const [venue, setVenue] = useState('');
  const [ll, setLl] = useState<[number, number] | null>(null);
  const [cost, setCost] = useState<Cost>('own');
  const [total, setTotal] = useState('');
  const [aud, setAud] = useState<Gender[] | null>(null);
  const [repeat, setRepeat] = useState<keyof typeof REPEAT | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (!m.profile?.face) {
    return (
      <Empty icon="smile" title="Do the face check first" text="Everyone who posts plans has passed a quick face check, so people know you're real.">
        <Btn title="Do the face check" onPress={() => router.replace('/verify')} />
      </Empty>
    );
  }

  const pickAndroid = () => DateTimePickerAndroid.open({
    value: when, mode: 'date', minimumDate: new Date(),
    onChange: (e: DateTimePickerEvent, d?: Date) => {
      if (e.type !== 'set' || !d) return;
      DateTimePickerAndroid.open({
        value: d, mode: 'time', is24Hour: false,
        onChange: (e2: DateTimePickerEvent, d2?: Date) => { if (e2.type === 'set' && d2) setWhen(d2); },
      });
    },
  });

  async function post() {
    const n = Number(total.replace(/[^\d]/g, ''));
    const problem = !desc.trim() ? 'Say what the plan is' : !venue.trim() ? 'Add where you\'ll meet'
      : when.getTime() <= Date.now() ? 'Pick a future date and time' : aud && !aud.length ? 'Pick who it\'s for' : '';
    setErr(problem);
    if (problem) return;
    setBusy(true);
    const id = await run(() => api.postActivity({
      cat, desc: desc.trim(), cap, when: when.getTime(), aud, venue: venue.trim(), cost,
      total: cost !== 'own' && n ? n : null, lat: ll?.[0] ?? null, lng: ll?.[1] ?? null, repeat,
    }));
    setBusy(false);
    if (id === undefined) return;
    toast('Posted! People nearby can see it now.');
    router.back();
  }


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Label>What kind of plan?</Label>
        <Wrap>{(Object.keys(CATS) as Cat[]).map(k => <Chip key={k} label={CATS[k].label} icon={CATS[k].icon} on={cat === k} onPress={() => setCat(k)} />)}</Wrap>
        <Field label="What's the plan?" value={desc} onChangeText={setDesc} maxLength={160} multiline placeholder="e.g. Filter coffee and the Sunday crossword" hint={`${desc.length}/160`} />

        <Label>When</Label>
        {Platform.OS === 'ios'
          ? <DateTimePicker value={when} mode="datetime" minimumDate={new Date()} display="compact" onChange={(_e, d) => d && setWhen(d)} style={{ alignSelf: 'flex-start', marginBottom: 16 }} />
          : <Btn title={whenStr(when.getTime())} kind="ghost" icon="calendar" onPress={pickAndroid} style={{ marginBottom: 16 }} />}

        <PlacePicker label="Where" mode="venue" value={venue} picked={!!ll} near={homeLL(m)} placeholder="Café, cinema or venue"
          onChange={v => { setVenue(v); setLl(null); }} onPick={p => { setVenue(p.label); setLl(p.ll); }}
          hint="Shows on the map" />
        {!ll && venue.trim().length > 1 ? <P small mute style={{ marginTop: -8, marginBottom: 14 }}>Not in the list? It&apos;s fine as typed; it shows near your home area.</P> : null}

        <Label>{`How many people can join? (${cap})`}</Label>
        <Wrap>{[1, 2, 3, 4, 5, 6, 8, 10].map(n => <Chip key={n} label={String(n)} on={cap === n} onPress={() => setCap(n)} />)}</Wrap>

        <Label>Cost</Label>
        <Wrap>{(Object.keys(COST) as Cost[]).map(k => <Chip key={k} label={COST[k]} on={cost === k} onPress={() => setCost(k)} />)}</Wrap>
        {cost !== 'own' ? <Field label="Rough total in ₹ (optional)" value={total} onChangeText={v => setTotal(v.replace(/[^\d]/g, ''))} keyboardType="number-pad" maxLength={7} /> : null}

        <Label>Who it&apos;s for</Label>
        <Wrap>
          <Chip label="Everyone" on={!aud} onPress={() => setAud(null)} />
          {GENDERS.map(g => (
            <Chip key={g} label={g} on={!!aud?.includes(g)}
              onPress={() => setAud(l => { const cur = l ?? []; const next = cur.includes(g) ? cur.filter(x => x !== g) : [...cur, g]; return next.length ? next : null; })} />
          ))}
        </Wrap>

        <Label>Repeat</Label>
        <Wrap>
          <Chip label="Just once" on={!repeat} onPress={() => setRepeat(null)} />
          {(Object.keys(REPEAT) as (keyof typeof REPEAT)[]).map(k => <Chip key={k} label={REPEAT[k]} on={repeat === k} onPress={() => setRepeat(k)} />)}
        </Wrap>

        {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginBottom: 12, fontSize: 14 }}>{err}</Text> : null}
        <Btn title="Post plan" icon="send" onPress={post} busy={busy} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

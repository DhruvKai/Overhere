import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { PlacePicker } from '@/components/PlacePicker';
import { SafetyFirst, safetySeen } from '@/components/SafetyFirst';
import { Btn, Chip, Empty, Field, Label, Note, P, Wrap } from '@/components/ui';
import { api } from '@/lib/api';
import { CATS, COST, GENDERS, homeLL, REPEAT, short, whenStr, type Plan } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import type { Cat, Cost, Gender } from '@/lib/types';

/* A sensible first time: the next round hour at least 3 hours away. */
const firstTime = () => { const d = new Date(Date.now() + 3 * 3600e3); d.setMinutes(0, 0, 0); d.setHours(d.getHours() + 1); return d; };

/* A past plan's time, moved on by whole weeks until it's at least an hour away ("Post again" keeps the weekday and time). */
const nextLike = (t: number) => { let w = t; while (w < Date.now() + 3600e3) w += 7 * 864e5; return new Date(w); };

/* Post a plan; with ?id edit one of yours, with ?tpl start from one you posted before ("Post again", or the chips at
   the top). The same form as the website's "Create Activity". */
export default function Post() {
  const t = useTheme();
  const m = useModel();
  const { run, toast, askMicro } = useStore();
  const { id, tpl } = useLocalSearchParams<{ id?: string; tpl?: string }>();
  const edit = id ? m.acts.find(a => a.id === id && a.host === m.me) : undefined;
  const start = edit ?? (tpl ? m.acts.find(a => a.id === tpl) : undefined);
  const minCap = Math.max(2, edit ? edit.members.length : 0);
  /* your past plans, newest first, one per title */
  const mine = [...new Map(m.acts.filter(a => a.host === m.me).sort((a, b) => b.when - a.when).map(a => [a.desc, a])).values()].slice(0, 8);
  const [from, setFrom] = useState(tpl ?? '');
  const [cat, setCat] = useState<Cat>(start?.cat ?? 'cafe');
  const [desc, setDesc] = useState(start?.desc ?? '');
  const [cap, setCap] = useState(Math.max(minCap, start?.cap ?? 3));
  const [when, setWhen] = useState(() => (edit ? new Date(edit.when) : start ? nextLike(start.when) : firstTime()));
  const [venue, setVenue] = useState(start?.venue ?? '');
  const [ll, setLl] = useState<[number, number] | null>(start?.ll ?? null);
  const [cost, setCost] = useState<Cost>(start?.cost ?? 'own');
  const [total, setTotal] = useState(start?.total ? String(start.total) : '');
  const [aud, setAud] = useState<Gender[] | null>(start && start.aud !== 'everyone' ? start.aud : null);
  const [repeat, setRepeat] = useState<keyof typeof REPEAT | null>(start?.repeat ?? null);
  const fill = (a: Plan | null) => {
    setFrom(a?.id ?? '');
    setCat(a?.cat ?? 'cafe'); setDesc(a?.desc ?? ''); setCap(a?.cap ?? 3); setWhen(a ? nextLike(a.when) : firstTime());
    setVenue(a?.venue ?? ''); setLl(a?.ll ?? null); setCost(a?.cost ?? 'own'); setTotal(a?.total ? String(a.total) : '');
    setAud(a && a.aud !== 'everyone' ? a.aud : null); setRepeat(a?.repeat ?? null);
  };
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [safe, setSafe] = useState(() => safetySeen(m));

  /* your first post shows "Before your first meetup" first, as on the website */
  if (!safe && !edit) return <ScrollView contentContainerStyle={{ padding: 20 }}><SafetyFirst onOk={() => setSafe(true)} /></ScrollView>;
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
    const p = {
      cat, desc: desc.trim(), cap, when: when.getTime(), aud, venue: venue.trim(), cost,
      total: cost !== 'own' && n ? n : null, lat: ll?.[0] ?? null, lng: ll?.[1] ?? null, repeat,
    };
    const r = await run(() => (edit ? api.editActivity(edit.id, p) : api.postActivity(p)));
    setBusy(false);
    if (r === undefined) return;
    toast(edit ? (edit.members.length ? 'Saved. Everyone going sees a note about the changes.' : 'Saved') : 'Posted! People nearby can see it now.');
    router.back();
    if (!edit) askMicro('post');
  }


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <Stack.Screen options={{ title: edit ? 'Edit plan' : 'Post a plan' }} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {edit && edit.members.length ? <Note tone="info" icon="users">{edit.members.length} {edit.members.length === 1 ? 'person is' : 'people are'} already going. They&apos;ll see a note about your changes in the group chat.</Note> : null}
        {!edit && mine.length ? (
          <>
            <Label>Start from a past plan (optional)</Label>
            <Wrap>
              <Chip label="Start fresh" on={!from} onPress={() => fill(null)} />
              {mine.map(a => <Chip key={a.id} label={short(a.desc)} on={from === a.id} onPress={() => fill(a)} />)}
            </Wrap>
          </>
        ) : null}
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
        <Wrap>{[2, 3, 4, 5, 6, 7, 8, 9, 10].filter(n => n >= minCap).map(n => <Chip key={n} label={String(n)} on={cap === n} onPress={() => setCap(n)} />)}</Wrap>

        <Label>Cost</Label>
        <Wrap>{(Object.keys(COST) as Cost[]).map(k => <Chip key={k} label={COST[k]} on={cost === k} onPress={() => setCost(k)} />)}</Wrap>
        {cost !== 'own' ? <Field label="Rough total in ₹ (optional)" value={total} onChangeText={v => setTotal(v.replace(/[^\d]/g, ''))} keyboardType="number-pad" maxLength={7}
          hint="We show each person's rough share. Payments stay between you." /> : null}

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
        {repeat ? <P small mute style={{ marginTop: -8, marginBottom: 14 }}>The next one is posted automatically when this one ends.</P> : null}

        {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginBottom: 12, fontSize: 14 }}>{err}</Text> : null}
        <Btn title={edit ? 'Save changes' : 'Post plan'} icon={edit ? 'check' : 'send'} onPress={post} busy={busy} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhotoPair } from '@/components/PhotoPair';
import { PlacePicker } from '@/components/PlacePicker';
import { Avatar, Btn, Chip, Field, H, Icon, P } from '@/components/ui';
import { api, friendly } from '@/lib/api';
import { GENDERS, INTERESTS, TIMES } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import type { Gender } from '@/lib/types';
import { isoDob, maskDob } from '@/lib/dob';

const toggle = (l: string[], v: string) => (l.includes(v) ? l.filter(x => x !== v) : [...l, v]);

/* Sign-up, the same steps as the website (onboardHtml in web/app.js): "About you" saves the profile, then two
   photos, the face check (both can be skipped) and "Tell us more", which sets onboarded and opens the tabs. */
export default function Onboarding() {
  return useStore().model?.profile ? <Steps /> : <AboutYou />;
}

function Steps() {
  const t = useTheme();
  const m = useModel();
  const { run, refresh, signOut } = useStore();
  const [skip, setSkip] = useState(false);
  const [job, setJob] = useState('');
  const [bio, setBio] = useState('');
  const [busy, setBusy] = useState<'' | 'save' | 'skip'>('');
  const p = m.profile!;

  async function done(save: boolean) {
    setBusy(save ? 'save' : 'skip');
    const ok = await run(() => api.saveProfile({ onboarded: true, ...(save ? { job: job.trim(), bio: bio.trim() } : {}) }));
    if (ok !== undefined) await refresh();
    else setBusy('');
  }

  const skipBtn = <><View style={{ height: 8 }} /><Btn title="Skip for now" kind="soft" onPress={() => setSkip(true)} /></>;
  let body;
  if (!p.face && !skip && !(p.photo && p.photo2)) {
    body = (<>
      <H size={26}>Add two photos of you</H>
      <P mute style={{ marginTop: 6, marginBottom: 22 }}>Photo 1 is your profile picture, and both show on your profile. The face check matches your live face against both.</P>
      <PhotoPair />
      {skipBtn}
      <P mute small style={{ textAlign: 'center', marginTop: 10 }}>Without photos you can browse, and other people see your emoji. Posting and joining plans need both photos and the face check.</P>
    </>);
  } else if (!p.face && !skip) {
    body = (<>
      <H size={26}>Quick face check</H>
      <P mute style={{ marginTop: 6, marginBottom: 22 }}>Confirms you&apos;re a real person, and the person in your two photos. You can browse without it, but you need it to post a plan or ask to join one.</P>
      <View style={{ alignItems: 'center', marginBottom: 22 }}><Avatar m={m} id={m.me} size={96} /></View>
      <Btn title="Start face check" onPress={() => router.push('/verify')} />
      {skipBtn}
    </>);
  } else {
    body = (<>
      <H size={26}>Tell us more (optional)</H>
      <P mute style={{ marginTop: 6, marginBottom: 22 }}>You can skip this and add it later.</P>
      <Field label="Profession" value={job} onChangeText={setJob} maxLength={40} />
      <Field label="Bio" value={bio} onChangeText={setBio} maxLength={300} multiline />
      <View style={{ height: 6 }} />
      <Btn title="Save and start browsing" onPress={() => done(true)} busy={busy === 'save'} disabled={!!busy} />
      <View style={{ height: 8 }} />
      <Btn title="Skip for now" kind="soft" onPress={() => done(false)} busy={busy === 'skip'} disabled={!!busy} />
    </>);
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
          {body}
          <View style={{ height: 10 }} />
          <Btn title="Sign out" kind="ghost" onPress={signOut} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* "About you" in three short pages, so nobody faces one long form: who you are, where you're based, what you like.
   Nothing is saved until the last page (save_profile needs it all). An under-18 date of birth asks first, then goes to
   the server, which removes the login (the under18 sheet on the website). */
const STEPS = 3;
const adult = (iso: string) => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return iso <= d.toISOString().slice(0, 10); };

function AboutYou() {
  const t = useTheme();
  const { refresh, signOut, toast } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [last, setLast] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [hood, setHood] = useState('');
  const [ll, setLl] = useState<[number, number] | null>(null);
  const [ints, setInts] = useState<string[]>([]);
  const [avail, setAvail] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const iso = isoDob(dob);

  function under18() {
    Alert.alert('Overhere is for adults', "The date of birth you entered means you're under 18. If that's right, we won't create your account, and we'll delete your sign-in details straight away.", [
      { text: 'Fix my date of birth', style: 'cancel' },
      { text: "That's right, delete my details", style: 'destructive', onPress: removeLogin },
    ]);
  }

  async function removeLogin() {
    setBusy(true);
    try {
      const r = await api.saveProfile({ dob: iso });
      if (r && r.error === 'under18') {
        /* the database already removed the login made a moment ago */
        await signOut();
        toast('Overhere is for people aged 18 and over. Nothing from this sign-up was kept.');
        return;
      }
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  function next() {
    const problem = step === 0
      ? (!name.trim() ? 'Add your first name' : !last.trim() ? 'Add your last name' : !iso ? 'Enter your date of birth as DD/MM/YYYY' : !gender ? 'Pick your gender' : '')
      : !ll ? 'Pick your home area from the list' : '';
    setErr(problem);
    if (problem) return;
    if (step === 0 && !adult(iso)) return under18();
    setStep(s => s + 1);
  }

  async function save() {
    const problem = !ints.length ? "Pick at least one thing you'd like to do" : !avail.length ? "Pick when you're usually free"
      : !consent ? 'Please agree to the Terms to continue' : '';
    setErr(problem);
    if (problem || !ll || !gender) return;
    setBusy(true);
    try {
      const r = await api.saveProfile({ name: name.trim(), last_name: last.trim(), dob: iso, gender, hood, lat: ll[0], lng: ll[1], ints, avail, consent: true });
      if (r && r.error === 'under18') {
        await signOut();
        toast('Overhere is for people aged 18 and over. Nothing from this sign-up was kept.');
        return;
      }
      await refresh();
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  const label = (text: string) => <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14, marginBottom: 8 }}>{text}</Text>;
  const chips = (list: readonly string[], on: string[], set: (f: (l: string[]) => string[]) => void) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
      {list.map(v => <Chip key={v} label={v} on={on.includes(v)} onPress={() => { setErr(''); set(l => toggle(l, v)); }} />)}
    </View>
  );

  let body;
  if (step === 0) {
    body = (<>
      <H size={26}>About you</H>
      <View style={{ height: 22 }} />
      <Field label="First name" value={name} onChangeText={setName} maxLength={40} autoComplete="given-name" textContentType="givenName" />
      <Field label="Last name" value={last} onChangeText={setLast} maxLength={40} autoComplete="family-name" textContentType="familyName" />
      <Field label="Date of birth" value={dob} onChangeText={v => setDob(maskDob(v))} placeholder="DD/MM/YYYY" keyboardType="number-pad" maxLength={10} />
      {label('Gender')}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {GENDERS.map(g => <Chip key={g} label={g} on={gender === g} onPress={() => { setErr(''); setGender(g); }} />)}
      </View>
    </>);
  } else if (step === 1) {
    body = (<>
      <H size={26}>Where are you based?</H>
      <View style={{ height: 22 }} />
      <PlacePicker label="Home area" mode="area" value={hood} picked={!!ll} placeholder="e.g. Koramangala, Bengaluru"
        onChange={v => { setHood(v); setLl(null); setErr(''); }} onPick={p => { setHood(p.label); setLl(p.ll); setErr(''); }} locate="home" />
    </>);
  } else {
    body = (<>
      <H size={26}>What do you like doing?</H>
      <View style={{ height: 22 }} />
      {chips(INTERESTS, ints, setInts)}
      {label("When are you usually free?")}
      {chips(TIMES, avail, setAvail)}
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: consent }} onPress={() => { setErr(''); setConsent(v => !v); }}
        style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 18 }}>
        <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: consent ? t.acc : t.line, backgroundColor: consent ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {consent ? <Icon name="check" size={16} color={t.onAcc} /> : null}
        </View>
        <P style={{ flex: 1 }}>
          I agree to the <Text style={{ color: t.accink, fontWeight: '700' }} onPress={() => WebBrowser.openBrowserAsync(SITE + '/terms.html')}>Terms</Text> and{' '}
          <Text style={{ color: t.accink, fontWeight: '700' }} onPress={() => WebBrowser.openBrowserAsync(SITE + '/privacy.html')}>Privacy policy</Text>
        </P>
      </Pressable>
    </>);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
          {/* where you are: three short bars */}
          <View accessible accessibilityLabel={`Step ${step + 1} of ${STEPS}`} style={{ flexDirection: 'row', gap: 6, marginBottom: 24 }}>
            {Array.from({ length: STEPS }, (_, k) => <View key={k} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: k <= step ? t.acc : t.line }} />)}
          </View>
          {body}
          {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginBottom: 12, fontSize: 14 }}>{err}</Text> : null}
          {step < STEPS - 1 ? <Btn title="Next" onPress={next} busy={busy} /> : <Btn title="Continue" onPress={save} busy={busy} />}
          <View style={{ height: 10 }} />
          {step > 0
            ? <Btn title="Back" kind="ghost" onPress={() => { setErr(''); setStep(s => s - 1); }} />
            : <Btn title="Sign out" kind="ghost" onPress={signOut} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState, type ReactNode } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InterestPicker } from '@/components/InterestPicker';
import { PhotoPair } from '@/components/PhotoPair';
import { PlacePicker } from '@/components/PlacePicker';
import { Avatar, BottomBar, Btn, Check, Chip, Field, H, Icon, Label, P, TextLink, Wrap } from '@/components/ui';
import { api, friendly } from '@/lib/api';
import { isoDob, maskDob } from '@/lib/dob';
import { column } from '@/lib/layout';
import { GENDERS, MIN_INTS, NEAR_KM, TIMES } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import type { Gender } from '@/lib/types';

const toggle = (l: string[], v: string) => (l.includes(v) ? l.filter(x => x !== v) : [...l, v]);

/* Sign-up, the same steps as the website (onboardHtml in web/app.js): "About you" saves the profile, then two
   photos, the face check (both can be skipped) and "Tell us more", which sets onboarded and opens the tabs. */
export default function Onboarding() {
  return useStore().model?.profile ? <Steps /> : <AboutYou />;
}

/* Every sign-up page: optional back arrow and progress bars at the top, the page in a scroll view, and its buttons
   kept at the bottom (BottomBar), so short pages don't end in a gap and long ones don't hide the button. */
function Page({ top, children, buttons }: { top?: ReactNode; children: ReactNode; buttons: ReactNode }) {
  const t = useTheme();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[{ padding: 24, paddingTop: 12 }, column]} keyboardShouldPersistTaps="handled">
          {top}
          {children}
        </ScrollView>
        <View style={column}><BottomBar>{buttons}</BottomBar></View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Steps() {
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

  const out = <View style={{ alignItems: 'center', marginTop: 18 }}><TextLink title="Sign out" onPress={signOut} /></View>;
  const skipBtn = <Btn title="Skip for now" kind="ghost" onPress={() => setSkip(true)} />;
  if (!p.face && !skip && !(p.photo && p.photo2)) {
    return (
      <Page buttons={skipBtn}>
        <H size={26}>Add two photos of you</H>
        <P mute style={{ marginTop: 6, marginBottom: 22 }}>The first is your profile picture. The face check compares your face with both.</P>
        <PhotoPair />
        <P mute small style={{ textAlign: 'center', marginTop: 10 }}>You can skip this and browse. Posting and joining plans need the photos and the face check.</P>
        {out}
      </Page>
    );
  }
  if (!p.face && !skip) {
    return (
      <Page buttons={<><Btn title="Start face check" onPress={() => router.push('/verify')} />{skipBtn}</>}>
        <H size={26}>Quick face check</H>
        <P mute style={{ marginTop: 6, marginBottom: 22 }}>Shows people you&apos;re real and the person in your photos. You need it to post or join plans.</P>
        <View style={{ alignItems: 'center' }}><Avatar m={m} id={m.me} size={112} /></View>
        {out}
      </Page>
    );
  }
  return (
    <Page buttons={<>
      <Btn title="Save and start browsing" onPress={() => done(true)} busy={busy === 'save'} disabled={!!busy || !(job.trim() || bio.trim())} />
      <Btn title="Skip for now" kind="ghost" onPress={() => done(false)} busy={busy === 'skip'} disabled={!!busy} />
    </>}>
      <H size={26}>Tell us more</H>
      <P mute style={{ marginTop: 6, marginBottom: 22 }}>Optional. Hosts see this when you ask to join.</P>
      <Field label="What you do" value={job} onChangeText={setJob} maxLength={40} placeholder="e.g. Designer, student" />
      <Field label="About you" value={bio} onChangeText={setBio} maxLength={300} multiline hint={`${bio.length}/300`} />
      {out}
    </Page>
  );
}

/* "About you" in three short pages, so nobody faces one long form: who you are, where you're based, what you like.
   Nothing is saved until the last page (save_profile needs it all). An under-18 date of birth asks first, then goes to
   the server, which removes the login (the under18 sheet on the website). */
const STEPS = 3;
const adult = (iso: string) => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return iso <= d.toISOString().slice(0, 10); };

function AboutYou() {
  const t = useTheme();
  const { refresh, signOut, toast, session } = useStore();
  /* New accounts agreed to the Terms on the sign-up screen (terms_ok, sign-in.tsx). Older ones, made before that box
     existed, still tick it here. */
  const agreedAtSignUp = session?.user.user_metadata?.terms_ok === true;
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [last, setLast] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [hood, setHood] = useState('');
  const [ll, setLl] = useState<[number, number] | null>(null);
  const [ints, setInts] = useState<string[]>([]);
  const [avail, setAvail] = useState<string[]>([]);
  const [consent, setConsent] = useState(agreedAtSignUp);
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
    const problem = ints.length < MIN_INTS ? `Pick at least ${MIN_INTS} things you like doing` : !avail.length ? "Pick when you're usually free"
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

  const back = () => { setErr(''); setStep(s => s - 1); };
  const top = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24, minHeight: 44 }}>
      {step > 0 ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={back} hitSlop={10} style={{ width: 36, height: 44, justifyContent: 'center' }}>
          <Icon name="arrow-left" size={22} />
        </Pressable>
      ) : null}
      {/* where you are: three short bars */}
      <View accessible accessibilityLabel={`Step ${step + 1} of ${STEPS}`} style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
        {Array.from({ length: STEPS }, (_, k) => <View key={k} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: k <= step ? t.acc : t.line }} />)}
      </View>
      {step === 0 ? <TextLink title="Sign out" onPress={signOut} /> : null}
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
      <Label>Gender</Label>
      <Wrap>{GENDERS.map(g => <Chip key={g} label={g} on={gender === g} onPress={() => { setErr(''); setGender(g); }} />)}</Wrap>
    </>);
  } else if (step === 1) {
    body = (<>
      <H size={26}>Where are you based?</H>
      <P mute style={{ marginTop: 6, marginBottom: 22 }}>You&apos;ll see plans within {NEAR_KM} km of here.</P>
      <PlacePicker label="Home area" mode="area" value={hood} picked={!!ll} placeholder="e.g. Koramangala, Bengaluru"
        onChange={v => { setHood(v); setLl(null); setErr(''); }} onPick={p => { setHood(p.label); setLl(p.ll); setErr(''); }} locate="home" />
    </>);
  } else {
    body = (<>
      <H size={26}>What do you like doing?</H>
      <View style={{ height: 22 }} />
      <InterestPicker value={ints} onChange={v => { setErr(''); setInts(v); }} />
      <Label>When are you usually free?</Label>
      <Wrap>{TIMES.map(v => <Chip key={v} label={v} on={avail.includes(v)} onPress={() => { setErr(''); setAvail(l => toggle(l, v)); }} />)}</Wrap>
      {!agreedAtSignUp ? (
        <Check on={consent} onPress={() => { setErr(''); setConsent(v => !v); }}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: t.ink2 }}>
            I agree to the <TextLink inline title="Terms" onPress={() => WebBrowser.openBrowserAsync(SITE + '/terms.html')} /> and{' '}
            <TextLink inline title="Privacy policy" onPress={() => WebBrowser.openBrowserAsync(SITE + '/privacy.html')} />
          </Text>
        </Check>
      ) : null}
    </>);
  }

  return (
    <Page top={top} buttons={<>
      {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, fontSize: 14 }}>{err}</Text> : null}
      {step < STEPS - 1 ? <Btn title="Next" onPress={next} busy={busy} /> : <Btn title="Continue" onPress={save} busy={busy} />}
    </>}>
      {body}
    </Page>
  );
}

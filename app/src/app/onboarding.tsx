import * as WebBrowser from 'expo-web-browser';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FaceCheck } from '@/components/FaceCheck';
import { PhotoPair } from '@/components/PhotoPair';
import { PlacePicker } from '@/components/PlacePicker';
import { SignupPage, SignupTop } from '@/components/SignupPage';
import { StartSteps } from '@/components/StartSteps';
import { Avatar, Btn, Check, Field, H, Icon, P, TextLink } from '@/components/ui';
import { api, friendly } from '@/lib/api';
import { column } from '@/lib/layout';
import { NEAR_KM } from '@/lib/model';
import { clearDraft, draftStep, loadDraft } from '@/lib/signup';
import { useModel, useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';

/* Sign-up after the phone, email and password (lib/signup.ts has the whole order), the same as onboardHtml in
   web/app.js: screen 9 (name, what you do, about you, home area) saves the profile with the answers to screens 1-4;
   then two photos and the face check, both of which can be skipped, and the tabs open.
   The face check runs here in place, as on the website, not on the Face check screen: once it passes, sign-up
   finishes by itself, so finishing it never depends on going back to this screen. */
export default function Onboarding() {
  return useStore().model?.profile ? <Steps /> : <AboutYou />;
}

/* Screens 10 and 11. Skipping the photos skips the face check too (it compares your face with them). */
function Steps() {
  const t = useTheme();
  const m = useModel();
  const { run, refresh, signOut } = useStore();
  const [skip, setSkip] = useState(false);
  const [checking, setChecking] = useState(false);
  /* Android's back button leaves the face check for the screen before it, rather than closing the app */
  useEffect(() => {
    if (!checking) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { setChecking(false); return true; });
    return () => sub.remove();
  }, [checking]);
  const p = m.profile!;
  const finished = p.face || skip;
  /* done (face check passed, or skipped): mark sign-up finished, which opens the tabs */
  const saving = useRef(false);
  useEffect(() => {
    if (!finished || saving.current) return;
    saving.current = true;
    run(() => api.saveProfile({ onboarded: true })).then(ok => {
      if (ok !== undefined) return refresh();
      saving.current = false; setSkip(false);   // not saved: back to the screen, to try again
    });
  }, [finished, run, refresh]);

  const out = <TextLink title="Sign out" onPress={signOut} />;
  const skipBtn = <Btn title="Skip for now" kind="ghost" onPress={() => setSkip(true)} />;
  if (finished) {
    return <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={t.acc} size="large" /></View>;
  }
  if (!(p.photo && p.photo2)) {
    return (
      <SignupPage top={<SignupTop right={out} />} buttons={skipBtn}>
        <H size={26}>Add two photos of you</H>
        <P mute style={{ marginTop: 6, marginBottom: 22 }}>The first is your profile picture. The face check compares your face with both.</P>
        <PhotoPair />
        <P mute small style={{ textAlign: 'center', marginTop: 10 }}>You can skip this and browse. Posting and joining plans need the photos and the face check.</P>
      </SignupPage>
    );
  }
  if (checking) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: t.bg }}>
        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, minHeight: 52 }, column]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => setChecking(false)} hitSlop={10} style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="arrow-left" size={22} />
          </Pressable>
          <Text accessibilityRole="header" style={{ color: t.ink, fontSize: 18, fontWeight: '700' }}>Face check</Text>
        </View>
        <View style={[{ flex: 1 }, column]}><FaceCheck onDone={() => setChecking(false)} /></View>
      </SafeAreaView>
    );
  }
  return (
    <SignupPage top={<SignupTop right={out} />} buttons={<><Btn title="Start face check" onPress={() => setChecking(true)} />{skipBtn}</>}>
      <H size={26}>Quick face check</H>
      <P mute style={{ marginTop: 6, marginBottom: 22 }}>Shows people you&apos;re real and the person in your photos. You need it to post or join plans.</P>
      <View style={{ alignItems: 'center' }}><Avatar m={m} id={m.me} size={112} /></View>
    </SignupPage>
  );
}

/* Screen 9, after screens 1-4 if their answers aren't on this phone (signed up on another phone, or with an older
   app). Nothing is saved until "Continue": save_profile needs it all at once. An under-18 date of birth asks first,
   then goes to the server, which removes the login (the under18 sheet on the website). */
function AboutYou() {
  const t = useTheme();
  const { refresh, signOut, toast, session } = useStore();
  /* New accounts agreed to the Terms on the phone screen (terms_ok, sign-in.tsx). Older ones, made before that box
     existed, still tick it here. */
  const agreedAtSignUp = session?.user.user_metadata?.terms_ok === true;
  const [pre, setPre] = useState<number | null>(() => (draftStep(loadDraft()) < 4 ? draftStep(loadDraft()) : null));
  const [name, setName] = useState('');
  const [last, setLast] = useState('');
  const [job, setJob] = useState('');
  const [bio, setBio] = useState('');
  const [hood, setHood] = useState('');
  const [ll, setLl] = useState<[number, number] | null>(null);
  const [consent, setConsent] = useState(agreedAtSignUp);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  function under18(iso: string) {
    Alert.alert('Overhere is for adults', "The date of birth you entered means you're under 18. If that's right, we won't create your account, and we'll delete your sign-in details straight away.", [
      { text: 'Fix my date of birth', style: 'cancel' },
      { text: "That's right, delete my details", style: 'destructive', onPress: () => removeLogin(iso) },
    ]);
  }

  async function removeLogin(iso: string) {
    try {
      const r = await api.saveProfile({ dob: iso });
      if (r && r.error === 'under18') {
        /* the database already removed the login made a moment ago */
        clearDraft();
        await signOut();
        toast('Overhere is for people aged 18 and over. Nothing from this sign-up was kept.');
      }
    } catch (e) { toast(friendly(e)); }
  }

  async function save() {
    const d = loadDraft();
    const problem = !name.trim() ? 'Add your first name' : !last.trim() ? 'Add your last name' : !ll ? 'Pick your home area from the list'
      : !consent ? 'Please agree to the Terms to continue' : '';
    setErr(problem);
    if (problem || !ll) return;
    if (draftStep(d) < 4 || !d.gender) { setPre(draftStep(d)); return; }
    setBusy(true);
    try {
      const r = await api.saveProfile({ name: name.trim(), last_name: last.trim(), dob: d.dob, gender: d.gender, hood, lat: ll[0], lng: ll[1],
        ints: d.ints, avail: d.avail, job: job.trim(), bio: bio.trim(), consent: true });
      if (r && r.error === 'under18') {
        clearDraft();
        await signOut();
        toast('Overhere is for people aged 18 and over. Nothing from this sign-up was kept.');
        return;
      }
      clearDraft();
      await refresh();
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  /* Android's back button on screen 9 opens screen 4, like the arrow */
  useEffect(() => {
    if (pre !== null) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { setPre(3); return true; });
    return () => sub.remove();
  }, [pre]);

  const out = <TextLink title="Sign out" onPress={signOut} />;
  if (pre !== null) return <StartSteps at={pre} onDone={() => setPre(null)} onUnder18={under18} right={out} />;

  return (
    <SignupPage top={<SignupTop onBack={() => setPre(3)} right={out} />} buttons={<>
      {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, fontSize: 14 }}>{err}</Text> : null}
      <Btn title="Continue" onPress={save} busy={busy} />
    </>}>
      <H size={26}>About you</H>
      <View style={{ height: 22 }} />
      <Field label="First name" value={name} onChangeText={v => { setErr(''); setName(v); }} maxLength={40} autoComplete="given-name" textContentType="givenName" />
      <Field label="Last name" value={last} onChangeText={v => { setErr(''); setLast(v); }} maxLength={40} autoComplete="family-name" textContentType="familyName" />
      <Field label="What you do (optional)" value={job} onChangeText={setJob} maxLength={40} placeholder="e.g. Designer, student" />
      <Field label="About you (optional)" value={bio} onChangeText={setBio} maxLength={300} multiline hint={`${bio.length}/300 · hosts see this when you ask to join`} />
      <PlacePicker label="Home area" mode="area" value={hood} picked={!!ll} placeholder="e.g. Koramangala, Bengaluru"
        hint={`You'll see plans within ${NEAR_KM} km`}
        onChange={v => { setHood(v); setLl(null); setErr(''); }} onPick={p => { setHood(p.label); setLl(p.ll); setErr(''); }} locate="home" />
      {!agreedAtSignUp ? (
        <Check on={consent} onPress={() => { setErr(''); setConsent(v => !v); }}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: t.ink2 }}>
            I agree to the <TextLink inline title="Terms" onPress={() => WebBrowser.openBrowserAsync(SITE + '/terms.html')} /> and{' '}
            <TextLink inline title="Privacy policy" onPress={() => WebBrowser.openBrowserAsync(SITE + '/privacy.html')} />
          </Text>
        </Check>
      ) : null}
    </SignupPage>
  );
}

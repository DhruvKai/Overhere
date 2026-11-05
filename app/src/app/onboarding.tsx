import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
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

function AboutYou() {
  const t = useTheme();
  const { refresh, signOut, toast } = useStore();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [hood, setHood] = useState('');
  const [ll, setLl] = useState<[number, number] | null>(null);
  const [ints, setInts] = useState<string[]>([]);
  const [avail, setAvail] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function save() {
    const iso = isoDob(dob);
    const problem = !name.trim() ? 'Add your first name' : !iso ? 'Enter your date of birth as DD/MM/YYYY' : !gender ? 'Pick your gender'
      : !ll ? 'Pick your home area from the list' : !consent ? 'Please tick the consent box to continue' : '';
    setErr(problem);
    if (problem || !ll || !gender) return;
    setBusy(true);
    try {
      const r = await api.saveProfile({ name: name.trim(), dob: iso, gender, hood, lat: ll[0], lng: ll[1], ints, avail, consent: true });
      if (r && r.error === 'under18') {
        /* the database already removed the login made a moment ago */
        await signOut();
        toast('Overhere is for people aged 18 and over. Nothing from this sign-up was kept.');
        return;
      }
      await refresh();
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
          <H size={26}>About you</H>
          <P mute style={{ marginTop: 6, marginBottom: 22 }}>Hosts see your first name, age, gender and what you like. Your date of birth stays private.</P>
          <Field label="First name" value={name} onChangeText={setName} maxLength={40} autoComplete="given-name" textContentType="givenName" />
          <Field label="Date of birth" value={dob} onChangeText={v => setDob(maskDob(v))} placeholder="DD/MM/YYYY" keyboardType="number-pad" maxLength={10} hint="You must be 18 or older" />
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14, marginBottom: 8 }}>Gender</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {GENDERS.map(g => <Chip key={g} label={g} on={gender === g} onPress={() => setGender(g)} />)}
          </View>
          <PlacePicker label="Home area" mode="area" value={hood} picked={!!ll} placeholder="e.g. Koramangala, Bengaluru"
            onChange={v => { setHood(v); setLl(null); }} onPick={p => { setHood(p.label); setLl(p.ll); }}
            hint="You'll see plans within 50 km of it" />
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14, marginBottom: 8 }}>What you like</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {INTERESTS.map(v => <Chip key={v} label={v} on={ints.includes(v)} onPress={() => setInts(l => toggle(l, v))} />)}
          </View>
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14, marginBottom: 8 }}>When you&apos;re free</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {TIMES.map(v => <Chip key={v} label={v} on={avail.includes(v)} onPress={() => setAvail(l => toggle(l, v))} />)}
          </View>

          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: consent }} onPress={() => setConsent(v => !v)}
            style={{ flexDirection: 'row', gap: 12, marginBottom: 18 }}>
            <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, marginTop: 2, borderColor: consent ? t.acc : t.line, backgroundColor: consent ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              {consent ? <Icon name="check" size={16} color={t.onAcc} /> : null}
            </View>
            <P style={{ flex: 1 }}>
              I agree to the <Text style={{ color: t.accink, fontWeight: '700' }} onPress={() => WebBrowser.openBrowserAsync(SITE + '/terms.html')}>Terms and community guidelines</Text>, and that Overhere may store these details to run the beta. I am 18 or older. I can ask for my data to be deleted at any time by emailing admin@overhere.social.{' '}
              <Text style={{ color: t.accink, fontWeight: '700' }} onPress={() => WebBrowser.openBrowserAsync(SITE + '/privacy.html')}>Privacy policy</Text>
            </P>
          </Pressable>
          {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginBottom: 12, fontSize: 14 }}>{err}</Text> : null}
          <Btn title="Continue" onPress={save} busy={busy} />
          <View style={{ height: 10 }} />
          <Btn title="Sign out" kind="ghost" onPress={signOut} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

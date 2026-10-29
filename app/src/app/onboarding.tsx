import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlacePicker } from '@/components/PlacePicker';
import { Btn, Chip, Field, H, Icon, P } from '@/components/ui';
import { api, friendly } from '@/lib/api';
import { GENDERS, INTERESTS, TIMES } from '@/lib/model';
import { useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import type { Gender } from '@/lib/types';

/* "DD/MM/YYYY" -> "YYYY-MM-DD", or '' when it isn't a real date. */
function isoDob(s: string) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s.trim());
  if (!m) return '';
  const [d, mo, y] = [+m[1], +m[2], +m[3]], dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d || y < 1900) return '';
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
const toggle = (l: string[], v: string) => (l.includes(v) ? l.filter(x => x !== v) : [...l, v]);

export default function Onboarding() {
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
      const r = await api.saveProfile({ name: name.trim(), dob: iso, gender, hood, lat: ll[0], lng: ll[1], ints, avail, consent: true, onboarded: true });
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
          <Field label="Date of birth" value={dob} onChangeText={setDob} placeholder="DD/MM/YYYY" keyboardType="numbers-and-punctuation" maxLength={10} hint="You must be 18 or older" />
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

import { useEffect, useState, type ReactNode } from 'react';
import { Alert, BackHandler, Text, View } from 'react-native';
import { InterestPicker } from './InterestPicker';
import { SignupPage, SignupTop } from './SignupPage';
import { Btn, Chip, Field, H, P, Wrap } from './ui';
import { isoDob, maskDob, showDob } from '@/lib/dob';
import { GENDERS, MIN_INTS, TIMES } from '@/lib/model';
import { adult, draftStep, loadDraft, saveDraft, type Draft } from '@/lib/signup';
import { useTheme } from '@/lib/theme';

/* Sign-up screens 1-4 (lib/signup.ts), the same as startStepsHtml in web/app.js: interests, when you're free, date of
   birth, gender. They come before the phone number, so each answer is kept on this phone as it's given and saved
   with the profile on screen 9. An under-18 date of birth stops here: no account exists yet, so nothing is kept.
   `at` opens a given screen (going back from the phone number opens the last one). */
const STEPS = 4;
const toggle = (l: string[], v: string) => (l.includes(v) ? l.filter(x => x !== v) : [...l, v]);

/* onUnder18: when there's already a login (screens 1-4 answered after signing in, on another phone or an older app),
   the caller removes it, as before; otherwise the screen just says no. */
export function StartSteps({ onDone, onBack, at, right, onUnder18 }: { onDone: () => void; onBack?: () => void; at?: number; right?: ReactNode; onUnder18?: (iso: string) => void }) {
  const t = useTheme();
  const [d, setD] = useState<Draft>(loadDraft);
  const [step, setStep] = useState(() => Math.min(at ?? draftStep(loadDraft()), STEPS - 1));
  const [dob, setDob] = useState(() => showDob(d.dob));
  const [err, setErr] = useState('');
  const keep = (patch: Partial<Draft>) => setD(x => { const n = { ...x, ...patch }; saveDraft(n); return n; });

  function next() {
    const iso = isoDob(dob);
    const problem = step === 0 ? (d.ints.length < MIN_INTS ? `Pick at least ${MIN_INTS} things you like doing` : '')
      : step === 1 ? (!d.avail.length ? "Pick when you're usually free" : '')
      : step === 2 ? (!iso ? 'Enter your date of birth as DD/MM/YYYY' : '')
      : !d.gender ? 'Pick your gender' : '';
    setErr(problem);
    if (problem) return;
    if (step === 2) {
      if (!adult(iso)) {
        if (onUnder18) return onUnder18(iso);
        keep({ dob: '' }); setDob('');
        Alert.alert('Overhere is for adults', "Overhere is only for people aged 18 and over, so you can't sign up.");
        return;
      }
      keep({ dob: iso });
    }
    if (step < STEPS - 1) setStep(s => s + 1);
    else onDone();
  }
  const back = step > 0 ? () => { setErr(''); setStep(s => s - 1); } : onBack;
  /* Android's back button goes back a screen too, rather than closing the app */
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step > 0) { setErr(''); setStep(step - 1); return true; }
      if (onBack) { onBack(); return true; }
      return false;   // screen 1 after signing in: Android's usual back
    });
    return () => sub.remove();
  }, [step, onBack]);

  let body;
  if (step === 0) {
    body = (<>
      <H size={26}>What do you like doing?</H>
      <P mute style={{ marginTop: 6, marginBottom: 18 }}>Pick at least {MIN_INTS}. We use them to show you plans you&apos;ll like.</P>
      <InterestPicker value={d.ints} onChange={v => { setErr(''); keep({ ints: v }); }} />
    </>);
  } else if (step === 1) {
    body = (<>
      <H size={26}>When are you usually free?</H>
      <P mute style={{ marginTop: 6, marginBottom: 18 }}>Pick all that fit.</P>
      <Wrap>{TIMES.map(v => <Chip key={v} label={v} on={d.avail.includes(v)} onPress={() => { setErr(''); keep({ avail: toggle(d.avail, v) }); }} />)}</Wrap>
    </>);
  } else if (step === 2) {
    body = (<>
      <H size={26}>When were you born?</H>
      <P mute style={{ marginTop: 6, marginBottom: 18 }}>Overhere is for people aged 18 and over. People see your age, never the date. <Text style={{ fontWeight: '700', color: t.ink2 }}>You can&apos;t change it later.</Text></P>
      <Field label="Date of birth" value={dob} onChangeText={v => { setErr(''); setDob(maskDob(v)); }} placeholder="DD/MM/YYYY" keyboardType="number-pad" maxLength={10} autoFocus />
    </>);
  } else {
    body = (<>
      <H size={26}>What&apos;s your gender?</H>
      <P mute style={{ marginTop: 6, marginBottom: 18 }}>Hosts can open a plan to some genders only. <Text style={{ fontWeight: '700', color: t.ink2 }}>You can&apos;t change it later.</Text></P>
      <Wrap>{GENDERS.map(g => <Chip key={g} label={g} on={d.gender === g} onPress={() => { setErr(''); keep({ gender: g }); }} />)}</Wrap>
    </>);
  }

  return (
    <SignupPage top={<SignupTop onBack={back} steps={[step, STEPS]} right={right} />} buttons={<>
      {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, fontSize: 14 }}>{err}</Text> : null}
      <Btn title="Next" onPress={next} />
    </>}>
      {body}
      <View style={{ height: 8 }} />
    </SignupPage>
  );
}

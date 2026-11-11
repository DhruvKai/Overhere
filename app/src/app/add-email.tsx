import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, CodeBoxes, Field, H, Icon, P } from '@/components/ui';
import { friendly } from '@/lib/api';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';

/* Phone accounts also need a confirmed email (the same step as emailStepHtml in web/app.js): add it, then type the
   code from the "Change email address" email. Once Supabase confirms it, the session changes and the root layout
   moves on to onboarding or the tabs. */
const RESEND_MS = 60000;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function AddEmail() {
  const t = useTheme();
  const { toast, signOut } = useStore();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(0);
  const [step, setStep] = useState<'add' | 'code'>('add');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function send() {
    const e = email.trim();
    if (!EMAIL_RE.test(e)) return setErr(e ? 'Enter a valid email, like name@example.com' : 'Enter your email');
    setBusy(true); setErr('');
    const { error } = await supabase.auth.updateUser({ email: e });
    setBusy(false);
    if (error) return setErr(friendly(error));
    setSent(Date.now()); setStep('code'); setCode('');
  }

  async function resend() {
    const wait = Math.ceil((sent + RESEND_MS - Date.now()) / 1000);
    if (wait > 0) return toast(`Please wait ${wait}s before asking for a new code`);
    const { error } = await supabase.auth.resend({ type: 'email_change', email: email.trim() });
    if (error) return toast(friendly(error));
    setSent(Date.now()); toast('Sent again. Check your inbox.');
  }

  async function confirm(token = code) {
    if (!/^\d{6}$/.test(token)) return setErr('Enter the 6-digit code from the email');
    setBusy(true); setErr('');
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token, type: 'email_change' });
    setBusy(false);
    if (error) { setErr(friendly(error)); setCode(''); return; }
    toast('Email confirmed');   // the session update moves the app on
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 48 }} keyboardShouldPersistTaps="handled">
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: t.acc2, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Icon name="mail" size={26} color={t.accink} />
          </View>
          {step === 'add' ? (<>
            <H size={28}>Add your email</H>
            <P mute style={{ marginTop: 6, marginBottom: 24 }}>Your phone number is confirmed. Now add your email and confirm it with a code. It&apos;s for account emails only, and nobody else sees it.</P>
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" autoFocus />
            <Btn title="Send code" onPress={send} busy={busy} />
          </>) : (<>
            <H size={28}>Enter the code</H>
            <P mute style={{ marginTop: 6, marginBottom: 24 }}>We sent a 6-digit code to {email.trim()}. It can take a minute, and sometimes lands in spam.</P>
            <CodeBoxes label="Code from the email" value={code} onChange={setCode} onDone={c => confirm(c)} error={!!err} />
            <Btn title="Confirm email" onPress={() => confirm()} busy={busy} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
              <Pressable onPress={() => { setStep('add'); setErr(''); }}><Text style={{ color: t.accink, fontWeight: '700', fontSize: 15 }}>Use a different email</Text></Pressable>
              <Pressable onPress={resend}><Text style={{ color: t.accink, fontWeight: '700', fontSize: 15 }}>Resend code</Text></Pressable>
            </View>
          </>)}
          {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginTop: 14, fontSize: 14 }}>{err}</Text> : null}
          <View style={{ height: 1, backgroundColor: t.line, marginVertical: 24 }} />
          <Btn title="Sign out" kind="ghost" icon="log-out" onPress={signOut} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

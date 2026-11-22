import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Btn, CodeBoxes, Field, P, TextLink } from '@/components/ui';
import { friendly } from '@/lib/api';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { FormScroll, KeyboardSafe } from '@/components/KeyboardSafe';

/* Accounts made with an email before phones were part of sign-up add their number here, from the progress card on
   Profile (the same as the website's addphone sheet). Supabase texts a code to the new number; once it's confirmed
   the number is on the account, and phone sign-in works too. */
const RESEND_MS = 30000;
const digits = (s: string) => { const d = s.replace(/\D/g, ''); return (d.length > 10 ? d.replace(/^(91|0)(?=\d{10}$)/, '') : d).slice(0, 10); };
const problem = (n: string) => (!n ? 'Enter your mobile number' : n.length < 10 ? 'Enter all 10 digits' : !/^[6-9]/.test(n) ? 'Indian mobile numbers start with 6, 7, 8 or 9' : '');

export default function AddPhone() {
  const t = useTheme();
  const { toast, refresh } = useStore();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'add' | 'code'>('add');
  const [sent, setSent] = useState(0);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const full = '+91' + digits(phone);

  async function send(again?: boolean) {
    const m = problem(digits(phone));
    setErr(m);
    if (m) return;
    const wait = again ? Math.ceil((sent + RESEND_MS - Date.now()) / 1000) : 0;
    if (wait > 0) return toast(`Please wait ${wait}s before asking for a new code`);
    setBusy(true);
    /* pw_set: this account already has a password (it signed in by email); without the flag, accounts from before
       7 Nov would be asked to make one once their phone is confirmed (create-password.tsx) */
    const { error } = await supabase.auth.updateUser({ phone: full, data: { pw_set: true } });
    setBusy(false);
    if (error) return setErr(friendly(error));
    setSent(Date.now()); setStep('code'); setCode('');
    if (again) toast('Code sent again');
  }

  async function confirm(token = code) {
    if (!/^\d{6}$/.test(token)) return setErr('Enter the 6-digit code');
    setBusy(true); setErr('');
    const { error } = await supabase.auth.verifyOtp({ phone: full, token, type: 'phone_change' });
    setBusy(false);
    if (error) { setErr(friendly(error)); setCode(''); return; }
    toast('Phone number added');
    refresh();
    router.back();
  }

  return (
    <KeyboardSafe style={{ backgroundColor: t.bg }}>
      <FormScroll contentContainerStyle={{ padding: 24 }}>
        {step === 'add' ? (<>
          <P mute style={{ marginBottom: 20 }}>We&apos;ll text a 6-digit code to confirm it. Nobody else sees your number.</P>
          <Field label="Mobile number" value={phone} onChangeText={v => { setErr(''); setPhone(digits(v)); }} keyboardType="phone-pad"
            placeholder="98765 43210" textContentType="telephoneNumber" autoComplete="tel" hint="+91" autoFocus />
          <Btn title="Send code" onPress={() => send()} busy={busy} off={!!problem(digits(phone))} />
        </>) : (<>
          <P style={{ marginBottom: 14 }}>Enter the code we sent to +91 {digits(phone)}.</P>
          <CodeBoxes label="6-digit code" value={code} onChange={v => { setCode(v); setErr(''); }} onDone={confirm} error={!!err} sms />
          <Btn title="Confirm number" onPress={() => confirm()} busy={busy} off={!/^\d{6}$/.test(code)} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <TextLink title="Change number" onPress={() => { setStep('add'); setErr(''); }} />
            <TextLink title="Resend code" onPress={() => send(true)} />
          </View>
        </>)}
        {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginTop: 14, fontSize: 14 }}>{err}</Text> : null}
      </FormScroll>
    </KeyboardSafe>
  );
}

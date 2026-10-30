import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCaptcha } from '@/components/Captcha';
import { Btn, Field, H, Icon, P } from '@/components/ui';
import { friendly } from '@/lib/api';
import { useStore } from '@/lib/store';
import { SITE, supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';

type Mode = 'phone' | 'code' | 'email' | 'reset' | 'resetSent';
const RESEND_MS = 30000;
const phoneDigits = (s: string) => { const d = s.replace(/\D/g, ''); return (d.length > 10 ? d.replace(/^(91|0)(?=\d{10}$)/, '') : d).slice(0, 10); };
const phoneProblem = (n: string) => (!n ? 'Enter your mobile number' : n.length < 10 ? 'Enter all 10 digits' : !/^[6-9]/.test(n) ? 'Indian mobile numbers start with 6, 7, 8 or 9' : '');

export default function SignIn() {
  const t = useTheme();
  const { toast } = useStore();
  const { node: captcha, getToken } = useCaptcha();
  const [mode, setMode] = useState<Mode>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(0);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [signUp, setSignUp] = useState(false);
  const [is18, setIs18] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  /* Phone and email sign-ups must carry "I'm 18 or older": the database refuses the login otherwise (_before_user_created). */
  const need18 = () => { if (!is18) { setErr("Please confirm you're 18 or older"); return false; } return true; };

  async function sendCode(again?: boolean) {
    const n = phoneDigits(phone), m = phoneProblem(n);
    setErr(m);
    if (m || (!again && !need18())) return;
    const wait = again ? Math.ceil((sent + RESEND_MS - Date.now()) / 1000) : 0;
    if (wait > 0) return toast(`Please wait ${wait}s before asking for a new code`);
    setBusy(true);
    try {
      const captchaToken = await getToken();
      const { error } = await supabase.auth.signInWithOtp({ phone: '+91' + n, options: { captchaToken, data: { age_18: true } } });
      if (error) throw error;
      setSent(Date.now()); setMode('code'); setCode('');
      toast('Code sent to +91 ' + n);
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  async function checkCode() {
    if (!/^\d{6}$/.test(code)) return setErr('Enter the 6-digit code');
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ phone: '+91' + phoneDigits(phone), token: code, type: 'sms' });
    setBusy(false);
    if (error) setErr(friendly(error));   // signed in: the root layout takes it from here
  }

  async function emailGo() {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setErr('Enter a valid email address');
    if (pw.length < 8) return setErr('Your password needs at least 8 characters');
    if (signUp && !need18()) return;
    setBusy(true); setErr('');
    try {
      const captchaToken = await getToken();
      if (signUp) {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: pw, options: { captchaToken, data: { age_18: true }, emailRedirectTo: SITE + '/app.html' } });
        if (error) throw error;
        if (!data.session) toast('Check your email to confirm your account, then sign in here.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw, options: { captchaToken } });
        if (error) throw error;
      }
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  /* The link in the email opens the website's "choose a new password" step (web/app.js, PASSWORD_RECOVERY);
     after that they come back here and sign in with the new one. */
  async function sendReset(again?: boolean) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setErr('Enter a valid email address');
    const wait = again ? Math.ceil((sent + RESEND_MS - Date.now()) / 1000) : 0;
    if (wait > 0) return toast(`Please wait ${wait}s before asking again`);
    setBusy(true); setErr('');
    try {
      const captchaToken = await getToken();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { captchaToken, redirectTo: SITE + '/app.html' });
      if (error) throw error;
      setSent(Date.now()); setMode('resetSent');
      if (again) toast('Sent again. Check your inbox.');
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  const Check = (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: is18 }} onPress={() => setIs18(v => !v)}
      style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 16 }}>
      <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: is18 ? t.acc : t.line, backgroundColor: is18 ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {is18 ? <Icon name="check" size={16} color={t.onAcc} /> : null}
      </View>
      <P>I&apos;m 18 or older</P>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      {captcha}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 48 }} keyboardShouldPersistTaps="handled">
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Icon name="map-pin" size={28} color={t.onAcc} />
          </View>
          <H size={30}>Overhere</H>
          <P mute style={{ marginTop: 6, marginBottom: 28 }}>Find people near you for movies, food and concerts.</P>

          {mode === 'phone' && (<>
            <Field label="Mobile number" value={phone} onChangeText={v => setPhone(phoneDigits(v))} keyboardType="phone-pad"
              placeholder="98765 43210" textContentType="telephoneNumber" autoComplete="tel" hint="+91 · we'll text you a 6-digit code" />
            {Check}
            <Btn title="Send code" onPress={() => sendCode()} busy={busy} />
          </>)}

          {mode === 'code' && (<>
            <P style={{ marginBottom: 14 }}>Enter the code we sent to +91 {phoneDigits(phone)}.</P>
            <Field label="6-digit code" value={code} onChangeText={v => setCode(v.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad"
              textContentType="oneTimeCode" autoComplete="sms-otp" autoFocus />
            <Btn title="Sign in" onPress={checkCode} busy={busy} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
              <Pressable onPress={() => { setMode('phone'); setErr(''); }}><Text style={{ color: t.accink, fontWeight: '700', fontSize: 15 }}>Change number</Text></Pressable>
              <Pressable onPress={() => sendCode(true)}><Text style={{ color: t.accink, fontWeight: '700', fontSize: 15 }}>Resend code</Text></Pressable>
            </View>
          </>)}

          {mode === 'email' && (<>
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
            <Field label="Password" value={pw} onChangeText={setPw} secureTextEntry autoComplete={signUp ? 'new-password' : 'current-password'} textContentType={signUp ? 'newPassword' : 'password'} hint={signUp ? 'At least 8 characters' : undefined} />
            {signUp ? Check : (
              <Pressable onPress={() => { setMode('reset'); setErr(''); }} style={{ alignSelf: 'flex-end', marginTop: -6, marginBottom: 16 }}>
                <Text style={{ color: t.accink, fontWeight: '700', fontSize: 15 }}>Forgot password?</Text>
              </Pressable>
            )}
            <Btn title={signUp ? 'Create account' : 'Sign in'} onPress={emailGo} busy={busy} />
            <Pressable onPress={() => { setSignUp(v => !v); setErr(''); }} style={{ marginTop: 14 }}>
              <Text style={{ color: t.accink, fontWeight: '700', fontSize: 15 }}>{signUp ? 'I already have an account' : 'New here? Create an account'}</Text>
            </Pressable>
          </>)}

          {mode === 'reset' && (<>
            <P style={{ marginBottom: 14 }}>Enter the email you signed up with and we&apos;ll send you a link to choose a new password.</P>
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" autoFocus />
            <Btn title="Send reset link" onPress={() => sendReset()} busy={busy} />
            <Pressable onPress={() => { setMode('email'); setErr(''); }} style={{ marginTop: 14 }}>
              <Text style={{ color: t.accink, fontWeight: '700', fontSize: 15 }}>Back to sign in</Text>
            </Pressable>
          </>)}

          {mode === 'resetSent' && (<>
            <P style={{ marginBottom: 14 }}>We sent a link to {email.trim()}. Open it, choose a new password, then come back here and sign in with it.</P>
            <Btn title="Back to sign in" onPress={() => { setMode('email'); setSignUp(false); setPw(''); setErr(''); }} />
            <Pressable onPress={() => sendReset(true)} style={{ marginTop: 14 }}>
              <Text style={{ color: t.accink, fontWeight: '700', fontSize: 15 }}>Didn&apos;t get it? Send again</Text>
            </Pressable>
          </>)}

          {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginTop: 14, fontSize: 14 }}>{err}</Text> : null}

          <View style={{ height: 1, backgroundColor: t.line, marginVertical: 24 }} />
          {mode === 'phone' || mode === 'code'
            ? <Btn title="Use email instead" kind="ghost" icon="mail" onPress={() => { setMode('email'); setErr(''); }} />
            : <Btn title="Use phone instead" kind="ghost" icon="phone" onPress={() => { setMode('phone'); setErr(''); }} />}
          <P mute small style={{ marginTop: 20, textAlign: 'center' }}>
            By continuing you agree to the{' '}
            <Text style={{ color: t.accink, fontWeight: '700' }} onPress={() => WebBrowser.openBrowserAsync(SITE + '/terms.html')}>Terms</Text> and{' '}
            <Text style={{ color: t.accink, fontWeight: '700' }} onPress={() => WebBrowser.openBrowserAsync(SITE + '/privacy.html')}>Privacy policy</Text>.
          </P>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

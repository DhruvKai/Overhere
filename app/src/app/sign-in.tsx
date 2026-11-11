import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCaptcha } from '@/components/Captcha';
import { Btn, Check, CodeBoxes, Field, H, Logo, P, PwField, TextLink } from '@/components/ui';
import Welcome from '@/components/Welcome';
import { api, friendly } from '@/lib/api';
import { emailProblem, mailFix } from '@/lib/email';
import { column } from '@/lib/layout';
import PwMeter from '@/components/PwMeter';
import { pwProblem } from '@/lib/password';
import { useStore } from '@/lib/store';
import { SITE, supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';

type Mode = 'phone' | 'code' | 'email' | 'reset' | 'resetSent';
const RESEND_MS = 30000;
const phoneDigits = (s: string) => { const d = s.replace(/\D/g, ''); return (d.length > 10 ? d.replace(/^(91|0)(?=\d{10}$)/, '') : d).slice(0, 10); };
/* OTP_GUARD: codes go through the otp-verify Edge Function (5 wrong codes pause the number for an hour and email the
   team). Off until that function is deployed on live; then codes go straight to Supabase, as before. Same as web/app.js. */
const OTP_GUARD = false;
const pausedText = (until: number) => `Too many wrong codes for this number, so phone sign-in is paused until ${new Date(until).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}. Please try again then, or use email.`;
const phoneProblem = (n: string) => (!n ? 'Enter your mobile number' : n.length < 10 ? 'Enter all 10 digits' : !/^[6-9]/.test(n) ? 'Indian mobile numbers start with 6, 7, 8 or 9' : '');
/* The welcome pages show until someone taps "Create account" or "I already have an account". */
const SEEN = 'overhere_welcome_seen';
const seenWelcome = () => { try { return localStorage.getItem(SEEN) === '1'; } catch { return false; } };
/* What a new account carries: "I'm 18 or older" (the database refuses the login without it, _before_user_created) and
   that they agreed to the Terms, so sign-up doesn't ask again (onboarding.tsx). Only read when the account is made. */
const NEW_ACCOUNT = { age_18: true, terms_ok: true };
/* the database's answer when a phone login would be a new account without NEW_ACCOUNT: on sign-in, there's no account */
const NO_ACCOUNT = /aged 18/i;

export default function SignIn() {
  const t = useTheme();
  const { toast } = useStore();
  const { node: captcha, getToken } = useCaptcha();
  const [intro, setIntro] = useState(() => !seenWelcome());
  const [mode, setMode] = useState<Mode>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(0);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  /* errors under each field, like fieldMsg in web/app.js: they appear when you leave a field or submit, and clear as you fix them */
  const [fe, setFe] = useState<{ email?: string; pw?: string; pw2?: string }>({});
  const [left2, setLeft2] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  /* New accounts tick one box: 18 or older, and the Terms. Signing in doesn't ask: they agreed when they signed up. */
  const needAgree = () => { if (signUp && !agreed) { setErr("Tick the box to confirm you're 18 or older and agree to the Terms"); return false; } return true; };

  /* A typo here sends the code to a stranger, so the first send asks "is this your number?" first. Resending
     goes to the number already confirmed. */
  function sendCode(again?: boolean) {
    const n = phoneDigits(phone), m = phoneProblem(n);
    setErr(m);
    if (m || (!again && !needAgree())) return;
    if (again) return send(n, true);
    Alert.alert('Is this your number?', `+91 ${n.slice(0, 5)} ${n.slice(5)}\n\nWe'll text a 6-digit code to this number. Please check it's right.`, [
      { text: 'Edit number', style: 'cancel' },
      { text: 'Yes, send code', onPress: () => send(n) },
    ], { cancelable: true });
  }

  async function send(n: string, again?: boolean) {
    const wait = again ? Math.ceil((sent + RESEND_MS - Date.now()) / 1000) : 0;
    if (wait > 0) return toast(`Please wait ${wait}s before asking for a new code`);
    setBusy(true);
    try {
      /* paused after too many wrong codes: don't send one that can't be used. If the check itself fails, send anyway. */
      const p = OTP_GUARD ? await api.otpPaused('+91' + n).catch(() => ({} as { until?: number })) : {} as { until?: number };
      if (p.until) throw new Error(pausedText(p.until));
      const captchaToken = await getToken();
      const { error } = await supabase.auth.signInWithOtp({ phone: '+91' + n, options: { captchaToken, ...(signUp ? { data: NEW_ACCOUNT } : {}) } });
      if (error && !signUp && NO_ACCOUNT.test(error.message)) {
        setSignUp(true); setBusy(false);
        return setErr("There's no account with this number yet. Tick the box to create one.");
      }
      if (error) throw error;
      setSent(Date.now()); setMode('code'); setCode('');
      toast('Code sent to +91 ' + n);
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  /* Checked by the otp-verify Edge Function (it pauses a number for an hour after 5 wrong codes), which hands back
     the session. */
  async function checkCode(c = code) {
    if (busy) return;
    if (!/^\d{6}$/.test(c)) return setErr('Enter the 6-digit code');
    setBusy(true);
    try {
      const ph = '+91' + phoneDigits(phone);
      const { error } = OTP_GUARD
        ? await supabase.auth.setSession((await api.otpVerify(ph, c)).session)
        : await supabase.auth.verifyOtp({ phone: ph, token: c, type: 'sms' });
      if (error) throw error;   // signed in: the root layout takes it from here
    } catch (e) { setErr(friendly(e)); }
    setBusy(false);
  }

  /* the line under "Confirm password": a match as you type, a mismatch once it's as long as the password or you've left it */
  const pw2Line = fe.pw2 ? { error: fe.pw2 } : pw2 && pw2 === pw ? { ok: 'Passwords match' }
    : pw2 && (left2 || pw2.length >= pw.length) ? { error: "Passwords don't match" } : {};
  const fix = mailFix(email);
  const clearFe = () => { setErr(''); setFe({}); };

  async function emailGo() {
    const e = { email: emailProblem(email), pw: !pw ? (signUp ? 'Choose a password' : 'Enter your password') : signUp ? pwProblem(pw, email) : '',
      pw2: !signUp ? '' : !pw2 ? 'Type your password again' : pw2 !== pw ? "Passwords don't match" : '' };
    setFe(e); setErr('');
    if (e.email || e.pw || e.pw2) return;
    if (!needAgree()) return;
    setBusy(true); setErr('');
    try {
      const captchaToken = await getToken();
      if (signUp) {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: pw, options: { captchaToken, data: { ...NEW_ACCOUNT, pw_set: true }, emailRedirectTo: SITE + '/app.html' } });
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
    const bad = emailProblem(email);
    setFe({ email: bad });
    if (bad) return;
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

  const open = (page: string) => WebBrowser.openBrowserAsync(SITE + page);
  /* the one box a new account ticks */
  const Agree = signUp ? (
    <View style={{ marginBottom: 12 }}>
      <Check on={agreed} onPress={() => { setAgreed(v => !v); setErr(''); }}>
        <Text style={{ fontSize: 14, lineHeight: 20, color: t.ink2 }}>
          I&apos;m 18 or older and agree to the <TextLink inline title="Terms" onPress={() => open('/terms.html')} /> and{' '}
          <TextLink inline title="Privacy policy" onPress={() => open('/privacy.html')} />
        </Text>
      </Check>
    </View>
  ) : null;
  /* a problem with the whole form, just above its button, where it's seen (as on the website) */
  const errLine = err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginBottom: 10, fontSize: 14 }}>{err}</Text> : null;
  const switchMode = (
    <TextLink title={signUp ? 'I already have an account' : 'New here? Create an account'}
      onPress={() => { setSignUp(v => !v); clearFe(); setPw2(''); setLeft2(false); }} style={{ marginTop: 6 }} />
  );

  /* the email box, with "Did you mean gmail.com?" for a likely typo (mailHint in web/app.js) */
  const emailField = (focus?: boolean) => (
    <Field label="Email" value={email} onChangeText={v => { setEmail(v); setFe(f => ({ ...f, email: '' })); }} keyboardType="email-address" autoCapitalize="none"
      autoCorrect={false} autoComplete="email" textContentType="emailAddress" placeholder="you@example.com" maxLength={120} autoFocus={focus}
      error={fe.email} onBlur={() => { if (email.trim()) setFe(f => ({ ...f, email: emailProblem(email) })); }}
      below={fix ? (
        <Text style={{ color: t.ink2, fontSize: 13, marginTop: 5 }}>Did you mean{' '}
          <Text accessibilityRole="button" style={{ color: t.accink, fontWeight: '700' }} onPress={() => { setEmail(fix); setFe(f => ({ ...f, email: '' })); }}>{fix}</Text>?
        </Text>
      ) : null} />
  );

  if (intro) {
    return <Welcome onDone={up => { try { localStorage.setItem(SEEN, '1'); } catch { /* shows again next time */ } setSignUp(up); setIntro(false); }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      {captcha}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[{ padding: 24, paddingTop: 48 }, column]} keyboardShouldPersistTaps="handled">
          <View style={{ marginBottom: 22 }}><Logo /></View>
          <H size={30}>{signUp ? 'Create your account' : 'Welcome back'}</H>
          <View style={{ height: 24 }} />

          {mode === 'phone' && (<>
            <Field label="Mobile number" value={phone} onChangeText={v => setPhone(phoneDigits(v))} keyboardType="phone-pad"
              placeholder="98765 43210" textContentType="telephoneNumber" autoComplete="tel"
              hint={signUp ? "+91 · we'll text you a code. Then you'll add your email and a password." : "+91 · we'll text you a 6-digit code"} />
            {Agree}
            {errLine}
            <Btn title="Send code" onPress={() => sendCode()} busy={busy} />
            {switchMode}
          </>)}

          {mode === 'code' && (<>
            <P style={{ marginBottom: 14 }}>Enter the code we sent to +91 {phoneDigits(phone)}.</P>
            <CodeBoxes label="6-digit code" value={code} onChange={v => { setCode(v); setErr(''); }} onDone={checkCode} error={!!err} sms />
            {errLine}
            <Btn title="Sign in" onPress={() => checkCode()} busy={busy} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <TextLink title="Change number" onPress={() => { setMode('phone'); setErr(''); }} />
              <TextLink title="Resend code" onPress={() => sendCode(true)} />
            </View>
          </>)}

          {mode === 'email' && (<>
            {emailField()}
            <PwField label="Password" value={pw} autoComplete={signUp ? 'new-password' : 'current-password'} textContentType={signUp ? 'newPassword' : 'password'}
              error={fe.pw} onChangeText={v => { setPw(v); if (fe.pw && !(signUp && v && pwProblem(v, email))) setFe(f => ({ ...f, pw: '' })); }}
              onBlur={() => { if (signUp && pw) setFe(f => ({ ...f, pw: pwProblem(pw, email) })); }} onSubmitEditing={signUp ? undefined : emailGo} />
            {signUp ? (<>
              <PwMeter pw={pw} email={email} />
              <PwField label="Confirm password" value={pw2} autoComplete="new-password" textContentType="newPassword" {...pw2Line}
                onChangeText={v => { setPw2(v); setFe(f => ({ ...f, pw2: '' })); }} onBlur={() => { if (pw2) setLeft2(true); }} />
            </>) : null}
            {signUp ? Agree : (
              <View style={{ alignSelf: 'flex-end', marginTop: -10, marginBottom: 8 }}>
                <TextLink title="Forgot password?" onPress={() => { setMode('reset'); clearFe(); }} />
              </View>
            )}
            {errLine}
            <Btn title={signUp ? 'Create account' : 'Sign in'} onPress={emailGo} busy={busy} />
            {switchMode}
          </>)}

          {mode === 'reset' && (<>
            <P style={{ marginBottom: 14 }}>Enter the email you signed up with and we&apos;ll send you a link to choose a new password.</P>
            {emailField(true)}
            {errLine}
            <Btn title="Send reset link" onPress={() => sendReset()} busy={busy} />
            <TextLink title="Back to sign in" onPress={() => { setMode('email'); clearFe(); }} style={{ marginTop: 6 }} />
          </>)}

          {mode === 'resetSent' && (<>
            <P style={{ marginBottom: 14 }}>We sent a link to {email.trim()}. Open it, choose a new password, then come back here and sign in with it.</P>
            <Btn title="Back to sign in" onPress={() => { setMode('email'); setSignUp(false); setPw(''); setPw2(''); clearFe(); }} />
            <TextLink title="Didn't get it? Send again" onPress={() => sendReset(true)} style={{ marginTop: 6 }} />
          </>)}


          <View style={{ height: 1, backgroundColor: t.line, marginVertical: 24 }} />
          {mode === 'phone' || mode === 'code'
            ? <Btn title="Use email instead" kind="ghost" icon="mail" onPress={() => { setMode('email'); clearFe(); }} />
            : <Btn title="Use phone instead" kind="ghost" icon="phone" onPress={() => { setMode('phone'); clearFe(); }} />}
          {/* new accounts agree with the box above; this is the reminder for everyone signing in */}
          {!signUp ? (
            <P mute small style={{ marginTop: 20, textAlign: 'center' }}>
              By signing in you agree to the <TextLink inline title="Terms" onPress={() => open('/terms.html')} /> and{' '}
              <TextLink inline title="Privacy policy" onPress={() => open('/privacy.html')} />.
            </P>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

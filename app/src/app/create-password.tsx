import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, H, Icon, P, PwField } from '@/components/ui';
import { friendly } from '@/lib/api';
import PwMeter from '@/components/PwMeter';
import { pwProblem } from '@/lib/password';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';

/* Phone accounts, after confirming their email (add-email.tsx): choose a password, the same step as pwStepHtml in
   web/app.js. Saving it sets user_metadata.pw_set; the session update then moves the root layout on. */
export default function CreatePassword() {
  const t = useTheme();
  const { toast, signOut, session } = useStore();
  const email = session?.user.email ?? '';
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  /* errors under each field, as on the website: shown when you leave a field or tap Save, cleared as you fix them */
  const [fe, setFe] = useState<{ pw?: string; pw2?: string }>({});
  const [left2, setLeft2] = useState(false);
  const pw2Line = fe.pw2 ? { error: fe.pw2 } : pw2 && pw2 === pw ? { ok: 'Passwords match' }
    : pw2 && (left2 || pw2.length >= pw.length) ? { error: "Passwords don't match" } : {};

  async function save() {
    const e = { pw: !pw ? 'Choose a password' : pwProblem(pw, email), pw2: !pw2 ? 'Type your password again' : pw2 !== pw ? "Passwords don't match" : '' };
    setFe(e); setErr('');
    if (e.pw || e.pw2) return;
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw, data: { pw_set: true } });
    setBusy(false);
    if (error) return setErr(/different from the old/i.test(error.message) ? 'Choose a password different from your old one.' : friendly(error));
    toast('Password saved');   // the session update moves the app on
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 48 }} keyboardShouldPersistTaps="handled">
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: t.acc2, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Icon name="lock" size={26} color={t.accink} />
          </View>
          <H size={28}>Create a password</H>
          <P mute style={{ marginTop: 6, marginBottom: 24 }}>Your email is confirmed. Now choose a password, so you can also sign in with {email} and this password.</P>
          <PwField label="Password" value={pw} autoComplete="new-password" textContentType="newPassword" autoFocus error={fe.pw}
            onChangeText={v => { setPw(v); setErr(''); if (fe.pw && !(v && pwProblem(v, email))) setFe(f => ({ ...f, pw: '' })); }}
            onBlur={() => { if (pw) setFe(f => ({ ...f, pw: pwProblem(pw, email) })); }} />
          <PwMeter pw={pw} email={email} />
          <PwField label="Confirm password" value={pw2} autoComplete="new-password" textContentType="newPassword" {...pw2Line}
            onChangeText={v => { setPw2(v); setErr(''); setFe(f => ({ ...f, pw2: '' })); }} onBlur={() => { if (pw2) setLeft2(true); }} onSubmitEditing={save} />
          <Btn title="Save password" onPress={save} busy={busy} />
          {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginTop: 14, fontSize: 14 }}>{err}</Text> : null}
          <View style={{ height: 1, backgroundColor: t.line, marginVertical: 24 }} />
          <Btn title="Sign out" kind="ghost" icon="log-out" onPress={signOut} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

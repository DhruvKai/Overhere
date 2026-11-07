import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Field, H, Icon, P } from '@/components/ui';
import { friendly } from '@/lib/api';
import { PW_HINT, pwProblem } from '@/lib/password';
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

  async function save() {
    const bad = pwProblem(pw, email);
    if (bad) return setErr(bad);
    if (pw2 !== pw) return setErr(pw2 ? "Passwords don't match" : 'Type your password again');
    setBusy(true); setErr('');
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
          <Field label="Password" value={pw} onChangeText={v => { setPw(v); setErr(''); }} secureTextEntry autoCapitalize="none"
            autoComplete="new-password" textContentType="newPassword" hint={PW_HINT} autoFocus />
          <Field label="Confirm password" value={pw2} onChangeText={v => { setPw2(v); setErr(''); }} secureTextEntry autoCapitalize="none"
            autoComplete="new-password" textContentType="newPassword" onSubmitEditing={save} />
          <Btn title="Save password" onPress={save} busy={busy} />
          {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginTop: 14, fontSize: 14 }}>{err}</Text> : null}
          <View style={{ height: 1, backgroundColor: t.line, marginVertical: 24 }} />
          <Btn title="Sign out" kind="ghost" icon="log-out" onPress={signOut} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

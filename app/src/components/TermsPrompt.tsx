import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import { api } from '@/lib/api';
import { column } from '@/lib/layout';
import { useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { Btn, H, P } from './ui';

/* When the terms change (app_state's terms_v is newer than the version you agreed to), you agree again before going on,
   or sign out. The same sheet as the website's (type 'terms'); it can't be closed any other way. */
export function TermsPrompt() {
  const t = useTheme();
  const { model, run, signOut } = useStore();
  const [busy, setBusy] = useState(false);
  if (!model?.termsV || !model.profile || model.profile.consent_version === model.termsV) return null;
  const agree = async () => { setBusy(true); await run(() => api.acceptTerms()); setBusy(false); };
  const items = [
    "You're 18 or over, and you are who you say you are.",
    'Be respectful, show up, and cancel early if you can\'t.',
    'Not a dating app: no sexual messages, pressure, selling or spam.',
    "Overhere introduces people but doesn't check everyone or run the meetups. Meet in public and look after yourself.",
  ];
  return (
    <Modal transparent visible animationType="fade" onRequestClose={() => {}}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.45)', justifyContent: 'center', padding: 16 }}>
        <ScrollView style={[{ backgroundColor: t.card, borderRadius: 24, maxHeight: '90%' }, column]} contentContainerStyle={{ padding: 20 }}>
          <H size={20}>Our terms and community guidelines</H>
          <P style={{ marginTop: 10, marginBottom: 10 }}>
            To keep using Overhere, please read and agree to our{' '}
            <Text onPress={() => WebBrowser.openBrowserAsync(SITE + '/terms.html')} style={{ color: t.accink, fontWeight: '700' }}>Terms and community guidelines</Text>. In short:
          </P>
          {items.map(x => <P key={x} small style={{ marginBottom: 6 }}>• {x}</P>)}
          <View style={{ height: 12 }} />
          <Btn title="I agree" onPress={agree} busy={busy} />
          <View style={{ height: 8 }} />
          <Btn title="Sign out" kind="ghost" onPress={signOut} />
        </ScrollView>
      </View>
    </Modal>
  );
}

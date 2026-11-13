import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedbackSheet } from '@/components/Feedback';
import { PersonRow, Ph, Row } from '@/components/ProfileParts';
import { Btn, Card, Check, Icon, P, TextLink } from '@/components/ui';
import { api } from '@/lib/api';
import { removePhotoFiles } from '@/lib/avatar';
import { askedOf } from '@/lib/feedback';
import { trustedOf, uname } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { setThemePref, themePref, useTheme, type ThemePref } from '@/lib/theme';

/* Settings, from the gear on Profile: safety, the app, feedback, the legal pages and the account. */
export default function Settings() {
  const t = useTheme();
  /* Android draws behind its navigation buttons, so the end of the page keeps clear of them */
  const insets = useSafeAreaInsets();
  const m = useModel();
  const { signOut, toast, run } = useStore();
  const [fb, setFb] = useState(false);
  const [theme, setTheme] = useState<ThemePref>(themePref);
  const sent = askedOf(m).fbSent;
  const p = m.profile!;
  const tc = trustedOf(m);
  const open = (page: string) => WebBrowser.openBrowserAsync(SITE + page);

  const deleteAccount = () => Alert.alert('Delete your account?',
    'Your profile, plans, requests and notifications are deleted for good. Plans you host are cancelled and their members told. This can\'t be undone.',
    [{ text: 'Cancel', style: 'cancel' }, {
      text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.deleteMyAccount(); await removePhotoFiles([m.profile?.photo, m.profile?.photo2]); await signOut(); toast('Your account was deleted.'); }
        catch { toast('Could not delete your account. Please try again or email admin@overhere.social.'); }
      },
    }]);
  const unblock = async (id: string) => { if (await run(() => api.unblockUser(id)) !== undefined) toast(`Unblocked ${uname(m, id)}`); };
  const usage = async () => {
    const on = !p.usage_ok;
    if (await run(() => api.saveProfile({ usage_ok: on })) !== undefined) toast(on ? 'Thanks! Usage statistics are on.' : 'Usage statistics are off, and what was collected is deleted.');
  };
  const pickTheme = (k: ThemePref) => { setTheme(k); setThemePref(k); };
  const sub = (text: string) => <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14, marginBottom: 6 }}>{text}</Text>;

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 + insets.bottom }}>
        <Card>
          <Ph icon="shield" title="Safety" />
          {sub('Trusted contact')}
          <P small mute style={{ marginBottom: 8 }}>Send them your plans, or alert them with SOS, in one tap. Only you see this.</P>
          {tc ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Icon name="phone" size={15} color={t.ink2} />
              <Text style={{ flex: 1, color: t.ink, fontSize: 15 }}><Text style={{ fontWeight: '700' }}>{tc.name}</Text> · {tc.phone}</Text>
              <TextLink title="Change" onPress={() => router.push('/edit-profile')} />
            </View>
          ) : <Btn title="Add a trusted contact" kind="soft" icon="user-plus" onPress={() => router.push('/edit-profile')} style={{ marginBottom: 14 }} />}
          {sub('Blocked people')}
          {m.blocked.length ? m.blocked.map(id => <PersonRow key={id} id={id} action="Unblock" onAction={() => unblock(id)} />)
            : <P small mute>No one.</P>}
        </Card>

        <Card>
          <Ph icon="sun" title="App" />
          {sub('Appearance')}
          <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', backgroundColor: t.field, borderRadius: 12, padding: 3, marginBottom: 14 }}>
            {([['system', 'System'], ['light', 'Light'], ['dark', 'Dark']] as [ThemePref, string][]).map(([k, l]) => (
              <Pressable key={k} accessibilityRole="radio" accessibilityState={{ checked: theme === k }} onPress={() => pickTheme(k)}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, backgroundColor: theme === k ? t.card : 'transparent' }}>
                <Text style={{ color: theme === k ? t.ink : t.mute, fontWeight: '700', fontSize: 14 }}>{l}</Text>
              </Pressable>
            ))}
          </View>
          <Check on={!!p.usage_ok} onPress={usage}>Share which features I use (never my messages) to help improve Overhere. Turning this off deletes what was collected.</Check>
        </Card>

        <Card>
          <Ph icon="message-square" title="Help shape Overhere" />
          <P small mute style={{ marginBottom: 12 }}>Tell us what&apos;s working and what isn&apos;t. It takes about 20 seconds.</P>
          <Btn title="Send feedback" kind="soft" icon="message-square" onPress={() => setFb(true)} />
          {sent ? <P small mute style={{ marginTop: 8, textAlign: 'center' }}>Last sent {new Date(sent).toLocaleDateString([], { day: 'numeric', month: 'short' })}. Thank you!</P> : null}
        </Card>

        <Card style={{ paddingVertical: 4 }}>
          <Row icon="shield" label="Privacy policy" onPress={() => open('/privacy.html')} />
          <Row icon="file-text" label="Terms and community guidelines" onPress={() => open('/terms.html')} />
          <Row icon="alert-circle" label="Copyright" onPress={() => open('/copyright.html')} />
          <Row icon="image" label="Photo credits" onPress={() => open('/credits.html')} />
        </Card>

        <Card style={{ paddingVertical: 4 }}>
          <Row icon="log-out" label="Sign out" onPress={signOut} />
          <Row icon="trash-2" label="Delete my account" onPress={deleteAccount} danger />
        </Card>
        <P small mute style={{ textAlign: 'center' }}>Overhere {Constants.expoConfig?.version} · beta</P>
      </ScrollView>
      {fb ? <FeedbackSheet from="profile" onClose={() => setFb(false)} /> : null}
    </>
  );
}

import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Header } from '@/components/Header';
import { Avatar, Badge, Btn, Card, H, Icon, P, type IconName } from '@/components/ui';
import { api } from '@/lib/api';
import { useModel, useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';

const ageOf = (dob: string) => { const d = new Date(dob); return isNaN(+d) ? '' : Math.floor((Date.now() - +d) / 31557600000); };

function Row({ icon, label, onPress, danger }: { icon: IconName; label: string; onPress: () => void; danger?: boolean }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, opacity: pressed ? 0.7 : 1 })}>
      <Icon name={icon} size={19} color={danger ? t.bad : t.ink2} />
      <Text style={{ flex: 1, fontSize: 16, color: danger ? t.bad : t.ink }}>{label}</Text>
      <Icon name="chevron-right" size={18} color={t.mute} />
    </Pressable>
  );
}

export default function Profile() {
  const m = useModel();
  const { signOut, toast } = useStore();
  const p = m.profile!;
  const hosted = m.acts.filter(a => a.host === m.me).length;

  const deleteAccount = () => Alert.alert('Delete your account?',
    'Your profile, plans, requests and notifications are deleted for good. Plans you host are cancelled and their members told. This can\'t be undone.',
    [{ text: 'Cancel', style: 'cancel' }, {
      text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.deleteMyAccount(); await signOut(); toast('Your account was deleted.'); }
        catch { toast('Could not delete your account. Please try again or email admin@overhere.social.'); }
      },
    }]);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Profile" sub="What hosts see" right={<View />} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 14, paddingBottom: 40 }}>
        <Card>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <Avatar m={m} id={m.me} size={64} />
            <View style={{ flex: 1 }}>
              <H size={21}>{p.name}, {ageOf(p.dob)}</H>
              <P mute>{p.gender} · {p.hood}</P>
            </View>
          </View>
          {p.job || p.bio ? <P style={{ marginTop: 12 }}>{[p.job, p.bio].filter(Boolean).join(' · ')}</P> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {p.ints.map(i => <Badge key={i} text={i} tone="acc" />)}
          </View>
          <Btn title="Edit profile" kind="ghost" icon="edit-2" onPress={() => router.push('/edit-profile')} style={{ marginTop: 14 }} />
        </Card>

        <Card>
          <H size={17}>Trust and safety</H>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <P>Face check</P>
            {p.face ? <Badge text="Done" tone="ok" /> : <Btn title="Do it now" kind="soft" onPress={() => router.push('/verify')} style={{ minHeight: 38 }} />}
          </View>
          <P small mute style={{ marginTop: 4 }}>Needed to post plans and ask to join.</P>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
            <P>ID check</P>
            {p.kyc ? <Badge text="Done" tone="ok" /> : <Badge text="Coming soon" tone="info" />}
          </View>
          <P small mute style={{ marginTop: 10 }}>{hosted} plan{hosted === 1 ? '' : 's'} hosted · {m.blocked.length} blocked</P>
        </Card>

        <Card style={{ paddingVertical: 4 }}>
          <Row icon="shield" label="Privacy policy" onPress={() => WebBrowser.openBrowserAsync(SITE + '/privacy.html')} />
          <Row icon="file-text" label="Terms and community guidelines" onPress={() => WebBrowser.openBrowserAsync(SITE + '/terms.html')} />
          <Row icon="image" label="Photo credits" onPress={() => WebBrowser.openBrowserAsync(SITE + '/credits.html')} />
          <Row icon="log-out" label="Sign out" onPress={signOut} />
          <Row icon="trash-2" label="Delete my account" onPress={deleteAccount} danger />
        </Card>
        <P small mute style={{ textAlign: 'center' }}>Overhere {Constants.expoConfig?.version} · beta</P>
      </ScrollView>
    </View>
  );
}

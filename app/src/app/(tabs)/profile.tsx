import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useState } from 'react';
import { FeedbackSheet } from '@/components/Feedback';
import { Header } from '@/components/Header';
import { Avatar, Badge, Btn, Card, Check, H, Icon, P, type IconName } from '@/components/ui';
import { api } from '@/lib/api';
import { removePhotoFiles } from '@/lib/avatar';
import { askedOf } from '@/lib/feedback';
import { ago, canRate, CATS, following, isVer, nowOf, pastList, trustedOf, trustTxt, uname } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { setThemePref, themePref, useTheme, type ThemePref } from '@/lib/theme';

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

/* A card's heading with its icon, like the website's panel headings. */
function Ph({ icon, title, right }: { icon: IconName; title: string; right?: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <Icon name={icon} size={16} color={t.accink} />
      <Text style={{ flex: 1, color: t.ink, fontSize: 16, fontWeight: '700' }}>{title}</Text>
      {right ? <Text style={{ color: t.mute, fontSize: 13 }}>{right}</Text> : null}
    </View>
  );
}

/* Someone's name and picture in a list, with one action on the right. */
function PersonRow({ id, action, onAction }: { id: string; action: string; onAction: () => void }) {
  const t = useTheme();
  const m = useModel();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
      <Pressable accessibilityRole="button" disabled={!m.people[id]} onPress={() => router.push({ pathname: '/person/[id]', params: { id } })}
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Avatar m={m} id={id} size={32} />
        <Text style={{ flex: 1, color: t.ink, fontSize: 15 }}>{uname(m, id)}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`${action} ${uname(m, id)}`} onPress={onAction} hitSlop={12} style={{ paddingVertical: 8, paddingHorizontal: 6 }}>
        <Text style={{ color: t.accink, fontWeight: '700', fontSize: 14 }}>{action}</Text>
      </Pressable>
    </View>
  );
}

export default function Profile() {
  const t = useTheme();
  const m = useModel();
  const { signOut, toast, run, savePriv, session } = useStore();
  const [fb, setFb] = useState(false);
  const [theme, setTheme] = useState<ThemePref>(themePref);
  const sent = askedOf(m).fbSent;
  const p = m.profile!;
  const fol = following(m), tc = trustedOf(m), past = pastList(m, m.me).slice(0, 6), now = nowOf(m);
  const byPhone = !!session?.user.phone;
  /* what's verified, as on the website: how you signed in, the face check, the ID check, a complete profile */
  const V: [IconName, string, boolean][] = [
    [byPhone ? 'phone' : 'mail', byPhone ? 'Phone verified' : 'Email verified', byPhone ? !!session?.user.phone_confirmed_at : !!session?.user.email_confirmed_at],
    ['smile', 'Face verified', !!p.face],
    ['credit-card', 'Government ID', !!p.kyc],
    ['user', 'Profile complete', !!(p.job && p.bio && p.ints.length && p.avail.length)],
  ];
  const done = V.filter(v => v[2]).length;

  const deleteAccount = () => Alert.alert('Delete your account?',
    'Your profile, plans, requests and notifications are deleted for good. Plans you host are cancelled and their members told. This can\'t be undone.',
    [{ text: 'Cancel', style: 'cancel' }, {
      text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.deleteMyAccount(); await removePhotoFiles([m.profile?.photo, m.profile?.photo2]); await signOut(); toast('Your account was deleted.'); }
        catch { toast('Could not delete your account. Please try again or email admin@overhere.social.'); }
      },
    }]);
  const unfollow = (id: string) => {
    savePriv(pv => ({ following: (Array.isArray(pv.following) ? pv.following as string[] : []).filter(x => x !== id) }));
    toast(`Unfollowed ${uname(m, id)}`);
  };
  const unblock = async (id: string) => { if (await run(() => api.unblockUser(id)) !== undefined) toast(`Unblocked ${uname(m, id)}`); };
  const usage = async () => {
    const on = !p.usage_ok;
    if (await run(() => api.saveProfile({ usage_ok: on })) !== undefined) toast(on ? 'Thanks! Usage statistics are on.' : 'Usage statistics are off, and what was collected is deleted.');
  };
  const pickTheme = (k: ThemePref) => { setTheme(k); setThemePref(k); };
  const soft = (l: string[], none: string) => (l.length
    ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{l.map(i => <Badge key={i} text={i} tone="acc" />)}</View>
    : <P small mute>{none}</P>);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Profile" sub="What hosts see" right={<View />} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 14, paddingBottom: 40 }}>
        <Card>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <Avatar m={m} id={m.me} size={64} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <H size={21}>{p.name}, {ageOf(p.dob)}</H>
                {isVer(m, m.me) || p.face ? <Icon name="check-circle" size={16} color={t.ok} /> : null}
              </View>
              <P mute>{p.gender} · {p.hood}</P>
              <P small style={{ marginTop: 2 }}>{trustTxt(m, m.me)}</P>
            </View>
          </View>
          {p.job || p.bio ? <P style={{ marginTop: 12 }}>{[p.job, p.bio].filter(Boolean).join(' · ')}</P>
            : <P small mute style={{ marginTop: 12 }}>Add a short bio so hosts know who you are. Tap Edit profile.</P>}
          <Btn title="Edit profile" kind="ghost" icon="edit-2" onPress={() => router.push('/edit-profile')} style={{ marginTop: 14 }} />
        </Card>

        <Card><Ph icon="star" title="Interests" />{soft(p.ints, 'Add what you would like to do with company in Edit profile.')}</Card>
        <Card><Ph icon="clock" title="Usually free" />{soft(p.avail, 'Tell hosts when you are usually free in Edit profile.')}</Card>

        <Card>
          <Ph icon="calendar" title="Past activities" />
          {past.length ? past.map((x, i) => {
            const a = x.act ? m.acts.find(y => y.id === x.act) : undefined;
            return (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
                <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: t.dark ? CATS[x.cat].bgDark : CATS[x.cat].bg, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={CATS[x.cat].icon} size={16} color={t.dark ? CATS[x.cat].fgDark : CATS[x.cat].fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.ink, fontSize: 15, fontWeight: '600' }} numberOfLines={1}>{x.t}</Text>
                  <P small mute>{x.role} · {ago(x.at, now)}</P>
                </View>
                {a && canRate(m, a) ? <Btn title="Rate" kind="soft" onPress={() => router.push({ pathname: '/rate/[id]', params: { id: a.id } })} style={{ minHeight: 36, paddingHorizontal: 12 }} /> : null}
              </View>
            );
          }) : <P small mute>Activities you host or join show up here.</P>}
        </Card>

        <Card>
          <Ph icon="shield" title="Verifications" right={`${done}/${V.length} complete`} />
          <View style={{ height: 6, borderRadius: 3, backgroundColor: t.field, marginBottom: 12, overflow: 'hidden' }}>
            <View style={{ width: `${(done / V.length) * 100}%`, height: 6, backgroundColor: t.acc }} />
          </View>
          {V.map(([ic, label, ok]) => (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
              <Icon name={ic} size={16} color={ok ? t.ok : t.mute} />
              <Text style={{ flex: 1, color: t.ink, fontSize: 15 }}>{label}</Text>
              {ok ? <Badge text="Done" tone="ok" />
                : label === 'Face verified' ? <Btn title="Start" kind="soft" onPress={() => router.push('/verify')} style={{ minHeight: 34, paddingHorizontal: 12 }} />
                : label === 'Government ID' ? <Badge text="Coming soon" tone="info" />
                : label === 'Profile complete' ? <Text accessibilityRole="button" onPress={() => router.push('/edit-profile')} style={{ color: t.accink, fontWeight: '700' }}>Add</Text> : null}
            </View>
          ))}
          <P small mute style={{ marginTop: 4 }}>The face check is needed to post plans and ask to join.</P>
        </Card>

        <Card>
          <Ph icon="user-plus" title="Following" />
          {fol.length ? fol.map(id => <PersonRow key={id} id={id} action="Unfollow" onAction={() => unfollow(id)} />)
            : <P small mute>Follow hosts from their profile to hear when they post a new plan.</P>}
        </Card>

        <Card>
          <Ph icon="message-square" title="Help shape Overhere" />
          <P small mute style={{ marginBottom: 12 }}>Overhere is in beta. Tell us what&apos;s working, what&apos;s confusing and what you&apos;d like next. It takes about 20 seconds.</P>
          <Btn title="Send feedback" kind="soft" icon="message-square" onPress={() => setFb(true)} />
          {sent ? <P small mute style={{ marginTop: 8, textAlign: 'center' }}>Last sent {new Date(sent).toLocaleDateString([], { day: 'numeric', month: 'short' })}. Thank you!</P> : null}
        </Card>

        <Card>
          <Ph icon="sun" title="App" />
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14, marginBottom: 8 }}>Appearance</Text>
          <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', backgroundColor: t.field, borderRadius: 12, padding: 3, marginBottom: 14 }}>
            {([['system', 'System'], ['light', 'Light'], ['dark', 'Dark']] as [ThemePref, string][]).map(([k, l]) => (
              <Pressable key={k} accessibilityRole="radio" accessibilityState={{ checked: theme === k }} onPress={() => pickTheme(k)}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, backgroundColor: theme === k ? t.card : 'transparent' }}>
                <Text style={{ color: theme === k ? t.ink : t.mute, fontWeight: '700', fontSize: 14 }}>{l}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14 }}>Usage statistics</Text>
          <Check on={!!p.usage_ok} onPress={usage}>Share which features I use (never my messages) to help improve the beta. Turning this off also deletes what was collected.</Check>
        </Card>

        <Card>
          <Ph icon="shield" title="Safety" />
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14 }}>Trusted contact</Text>
          <P small mute style={{ marginBottom: 8 }}>Someone you can send your plans to, or alert with SOS, in one tap. Only you see this.</P>
          {tc ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Icon name="phone" size={15} color={t.ink2} />
              <Text style={{ flex: 1, color: t.ink, fontSize: 15 }}><Text style={{ fontWeight: '700' }}>{tc.name}</Text> · {tc.phone}</Text>
              <Text accessibilityRole="button" onPress={() => router.push('/edit-profile')} style={{ color: t.accink, fontWeight: '700' }}>Change</Text>
            </View>
          ) : <Btn title="Add a trusted contact" kind="soft" icon="user-plus" onPress={() => router.push('/edit-profile')} style={{ marginBottom: 12 }} />}
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14 }}>Blocked people</Text>
          {m.blocked.length ? m.blocked.map(id => <PersonRow key={id} id={id} action="Unblock" onAction={() => unblock(id)} />)
            : <P small mute>You have not blocked anyone.</P>}
        </Card>

        <Card style={{ paddingVertical: 4 }}>
          <Row icon="shield" label="Privacy policy" onPress={() => WebBrowser.openBrowserAsync(SITE + '/privacy.html')} />
          <Row icon="file-text" label="Terms and community guidelines" onPress={() => WebBrowser.openBrowserAsync(SITE + '/terms.html')} />
          <Row icon="alert-circle" label="Copyright" onPress={() => WebBrowser.openBrowserAsync(SITE + '/copyright.html')} />
          <Row icon="image" label="Photo credits" onPress={() => WebBrowser.openBrowserAsync(SITE + '/credits.html')} />
          <Row icon="log-out" label="Sign out" onPress={signOut} />
          <Row icon="trash-2" label="Delete my account" onPress={deleteAccount} danger />
        </Card>
        <P small mute style={{ textAlign: 'center' }}>Overhere {Constants.expoConfig?.version} · beta</P>
      </ScrollView>
      {fb ? <FeedbackSheet from="profile" onClose={() => setFb(false)} /> : null}
    </View>
  );
}

import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { Header, HeaderIcon } from '@/components/Header';
import { PastRow, PersonRow, Ph } from '@/components/ProfileParts';
import { Avatar, Badge, Btn, Card, H, Icon, P, TextLink, type IconName } from '@/components/ui';
import { canRate, following, isVer, pastList, trustTxt, uname } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

const ageOf = (dob: string) => { const d = new Date(dob); return isNaN(+d) ? '' : Math.floor((Date.now() - +d) / 31557600000); };

/* Your profile, as other people see it, plus what's left to verify and who you follow. App settings, safety and the
   account are in Settings (the gear). */
export default function Profile() {
  const t = useTheme();
  const m = useModel();
  const { savePriv, toast, session } = useStore();
  const p = m.profile!;
  const fol = following(m), past = pastList(m, m.me).slice(0, 6);
  const byPhone = !!session?.user.phone;
  /* what's verified, as on the website: how you signed in, the face check, the ID check, a complete profile */
  const V: [IconName, string, boolean][] = [
    [byPhone ? 'phone' : 'mail', byPhone ? 'Phone verified' : 'Email verified', byPhone ? !!session?.user.phone_confirmed_at : !!session?.user.email_confirmed_at],
    ['smile', 'Face verified', !!p.face],
    ['credit-card', 'Government ID', !!p.kyc],
    ['user', 'Profile complete', !!(p.job && p.bio && p.ints.length && p.avail.length)],
  ];
  const done = V.filter(v => v[2]).length;
  const unfollow = (id: string) => {
    savePriv(pv => ({ following: (Array.isArray(pv.following) ? pv.following as string[] : []).filter(x => x !== id) }));
    toast(`Unfollowed ${uname(m, id)}`);
  };
  const tags = (l: string[]) => <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{l.map(i => <Badge key={i} text={i} tone="acc" />)}</View>;
  const times = (l: string[]) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {l.map(i => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: t.line, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 }}>
          <Icon name="clock" size={12} color={t.mute} /><Text style={{ fontSize: 13, color: t.ink2 }}>{i}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title="Profile" right={<HeaderIcon icon="settings" label="Settings" onPress={() => router.push('/settings')} />} />
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
          {p.job || p.bio ? <P style={{ marginTop: 12 }}>{[p.job, p.bio].filter(Boolean).join(' · ')}</P> : null}
          <Btn title="Edit profile" kind="ghost" icon="edit-2" onPress={() => router.push('/edit-profile')} style={{ marginTop: 14 }} />
        </Card>

        <Card><Ph icon="star" title="Interests" />{tags(p.ints)}</Card>
        {/* free times look different from interests: outlined, each with a clock */}
        {p.avail?.length ? <Card><Ph icon="clock" title="Usually free" />{times(p.avail)}</Card> : null}

        {done < V.length ? (
          <Card>
            <Ph icon="shield" title="Verifications" right={`${done} of ${V.length}`} />
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
                  : label === 'Profile complete' ? <TextLink title="Add" onPress={() => router.push('/edit-profile')} /> : null}
              </View>
            ))}
            {!p.face ? <P small mute style={{ marginTop: 4 }}>You need the face check to post plans and ask to join.</P> : null}
          </Card>
        ) : null}

        <Card>
          <Ph icon="calendar" title="Past activities" />
          {past.length ? past.map((x, i) => {
            const a = x.act ? m.acts.find(y => y.id === x.act) : undefined;
            return <PastRow key={i} m={m} x={x} right={a && canRate(m, a)
              ? <Btn title="Rate" kind="soft" onPress={() => router.push({ pathname: '/rate/[id]', params: { id: a.id } })} style={{ minHeight: 36, paddingHorizontal: 12 }} /> : null} />;
          }) : <P small mute>Plans you host or join show up here.</P>}
        </Card>

        {fol.length ? (
          <Card>
            <Ph icon="user-plus" title="Following" />
            {fol.map(id => <PersonRow key={id} id={id} action="Unfollow" onAction={() => unfollow(id)} />)}
          </Card>
        ) : null}
      </ScrollView>
    </View>
  );
}

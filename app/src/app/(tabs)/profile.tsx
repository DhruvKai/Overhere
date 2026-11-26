import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Header, HeaderIcon } from '@/components/Header';
import { genderTxt, IntChips, PastRow, PersonRow, Ph, Stats, TimeChips } from '@/components/ProfileParts';
import { ProgressBar, useProgress } from '@/components/SignupPage';
import { Avatar, Btn, Card, H, Icon, P, TextLink, type IconName } from '@/components/ui';
import { canRate, following, isVer, pastList, uname } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

const ageOf = (dob: string) => { const d = new Date(dob); return isNaN(+d) ? '' : Math.floor((Date.now() - +d) / 31557600000); };

/* Your profile, as other people see it, plus what's left to verify and who you follow. App settings, safety and the
   account are in Settings (the gear); sign out is also in the header so it's one tap away. */
export default function Profile() {
  const t = useTheme();
  const m = useModel();
  const { savePriv, toast, signOut } = useStore();
  const p = m.profile!;
  const fol = following(m), past = pastList(m, m.me).slice(0, 6);
  /* what's left of sign-up, the same score as the bar during sign-up (lib/signup.ts) and the website's profile */
  const { items, pct } = useProgress();
  const todo = items.filter(x => !x.done);
  /* each one opens straight at the thing to fill: Edit profile scrolls to that field and outlines it (?focus) */
  const edit = (focus?: 'job' | 'bio' | 'photos') => () => router.push(focus ? { pathname: '/edit-profile', params: { focus } } : '/edit-profile');
  const GO: Partial<Record<(typeof items)[number]['key'], [IconName, string, () => void]>> = {
    phone: ['phone', 'Add', () => router.push('/add-phone')],
    details: ['user', 'Add', edit()],
    job: ['briefcase', 'Add', edit('job')],
    bio: ['edit-3', 'Add', edit('bio')],
    photos: ['camera', 'Add', edit('photos')],
    face: ['smile', 'Start', () => router.push('/verify')],
  };
  /* tapping the percentage or the bar opens the first thing left */
  const next = todo.map(x => GO[x.key]).find(Boolean);
  const unfollow = (id: string) => {
    savePriv(pv => ({ following: (Array.isArray(pv.following) ? pv.following as string[] : []).filter(x => x !== id) }));
    toast(`Unfollowed ${uname(m, id)}`);
  };
  /* sign out from the header, asked first so a stray tap next to the gear doesn't log you out */
  const confirmSignOut = () => Alert.alert('Sign out?', 'You can sign back in any time.',
    [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign out', style: 'destructive', onPress: signOut }]);
  return (
    <View style={{ flex: 1 }}>
      {/* edit, settings and sign out at the top right */}
      <Header title="Profile" right={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <HeaderIcon icon="edit-2" label="Edit profile" onPress={() => router.push('/edit-profile')} />
          <HeaderIcon icon="settings" label="Settings" onPress={() => router.push('/settings')} />
          <HeaderIcon icon="log-out" label="Sign out" onPress={confirmSignOut} />
        </View>
      } />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 14, paddingBottom: 40 }}>
        {/* photo; name, age, tick and gender; work and area; the three numbers beside it; then the bio */}
        <Card>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <Avatar m={m} id={m.me} size={72} />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <H size={21}>{p.name}, {ageOf(p.dob)}</H>
                {isVer(m, m.me) || p.face ? <Icon name="check-circle" size={16} color={t.ok} /> : null}
                {p.gender ? <Text style={{ color: t.ink2, fontSize: 13.5 }}>{genderTxt(p.gender)}</Text> : null}
              </View>
              {p.job || p.hood ? <P mute>{[p.job, p.hood].filter(Boolean).join(' · ')}</P> : null}
              <View style={{ marginTop: 8 }}><Stats m={m} id={m.me} small /></View>
            </View>
          </View>
          {p.bio ? (
            <View style={{ marginTop: 14, backgroundColor: t.field, borderRadius: 12, padding: 12 }}>
              <P>{p.bio}</P>
            </View>
          ) : null}
        </Card>

        <Card><Ph icon="star" title="Interests" /><IntChips list={p.ints} /></Card>
        {p.avail?.length ? <Card><Ph icon="clock" title="Usually free" /><TimeChips list={p.avail} /></Card> : null}

        {pct < 100 ? (
          <Card>
            <Pressable onPress={next?.[2]} disabled={!next} accessibilityRole="button" accessibilityLabel={`Profile ${pct}% done. Fill in what's next`}>
              <Ph icon="check-circle" title="Finish your profile" right={`${pct}%`} />
              <View style={{ marginBottom: 8 }}><ProgressBar pct={pct} label={false} /></View>
            </Pressable>
            {todo.map(x => {
              const g = GO[x.key];
              /* the whole row is the button, not just the word Add */
              return (
                <Pressable key={x.key} onPress={g?.[2]} disabled={!g} accessibilityRole={g ? 'button' : undefined} accessibilityLabel={g ? `${g[1]} ${x.label}` : undefined}
                  style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, opacity: pressed ? 0.6 : 1 })}>
                  <Icon name={g?.[0] ?? 'circle'} size={16} color={t.mute} />
                  <Text style={{ flex: 1, color: t.ink, fontSize: 15 }}>{x.label} <Text style={{ color: t.mute, fontSize: 13 }}>+{x.pts}%</Text></Text>
                  {g ? (x.key === 'face'
                    ? <Btn title={g[1]} kind="soft" onPress={g[2]} style={{ minHeight: 34, paddingHorizontal: 12 }} />
                    : <TextLink title={g[1]} onPress={g[2]} />) : null}
                </Pressable>
              );
            })}
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

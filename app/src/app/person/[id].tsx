import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReportSheet } from '@/components/ReportSheet';
import { Avatar, Badge, Btn, Card, Empty, H, Icon, Note, P, PlanRow } from '@/components/ui';
import { api } from '@/lib/api';
import { following, isBlocked, isVer, pastList, REPORT_REASONS, signals, trust, visible } from '@/lib/model';
import { PastRow } from '@/components/ProfileParts';
import { useModel, useStore } from '@/lib/store';
import { R, useTheme } from '@/lib/theme';

/* Someone's profile, as hosts and guests see it: photos, show-up record, what you have in common, their plans.
   Follow, report or block from here (the website's profile sheet, type 'user'). */
export default function Person() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  /* Android draws behind its navigation buttons, so the end of the page keeps clear of them */
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const m = useModel();
  const { run, toast, savePriv } = useStore();
  const [reporting, setReporting] = useState(false);
  const p = m.people[id];
  if (!p) return <Empty icon="user" title="This profile isn't available" text="They may have deleted their account, or you blocked each other." />;

  const tr = trust(m, id), bl = isBlocked(m, id), fol = following(m).includes(id);
  const pics = [p.photo, p.photo2].filter(Boolean);
  const ups = m.acts.filter(a => a.host === id && visible(m, a)).sort((a, b) => a.when - b.when);
  const past = pastList(m, id).slice(0, 6);
  const sig = signals(m, id);

  const follow = () => {
    savePriv(pv => {
      const l = Array.isArray(pv.following) ? (pv.following as string[]) : [];
      return { following: fol ? l.filter(x => x !== id) : [...l, id] };
    });
    toast(fol ? `Unfollowed ${p.name}` : `Following ${p.name}. You'll hear when they post.`);
  };
  const block = () => Alert.alert(`Block ${p.name}?`, "You won't see each other's plans or profiles, and they can't request yours. They aren't told.", [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Block', style: 'destructive', onPress: async () => { if (await run(() => api.blockUser(id)) !== undefined) toast(`Blocked ${p.name}`); } },
  ]);
  const unblock = async () => { if (await run(() => api.unblockUser(id)) !== undefined) toast(`Unblocked ${p.name}`); };

  return (
    <>
      <Stack.Screen options={{ title: p.name }} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 14, paddingBottom: 40 + insets.bottom }}>
        {pics.length > 1 ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} accessibilityLabel={`Photos of ${p.name}. Swipe for more.`}
            style={{ marginHorizontal: -16 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
            {pics.map((uri, i) => (
              <Image key={uri} source={{ uri }} accessibilityLabel={`Photo ${i + 1} of ${p.name}`} contentFit="cover"
                style={{ width: Math.min(width, 640) - 48, aspectRatio: 1, borderRadius: R }} />
            ))}
          </ScrollView>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          {/* the photos are already shown big above; the small picture is for people without them */}
          {pics.length > 1 ? null : <Avatar m={m} id={id} size={64} />}
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <H size={22}>{p.name}</H>
              {isVer(m, id) ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}><Icon name="check-circle" size={15} color={t.ok} /><Text style={{ color: t.ok, fontSize: 13, fontWeight: '600' }}>Verified</Text></View> : null}
              {p.sample ? <Badge text="SAMPLE" tone="warn" /> : null}
            </View>
            <P mute>{[p.gender, p.age].filter(Boolean).join(', ')}{p.job ? ` · ${p.job}` : ''}</P>
          </View>
        </View>
        {p.bio ? <P>{p.bio}</P> : null}

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[[tr.met, 'meetups'], [tr.shows, 'showed up'], [tr.noshows, 'no-shows']].map(([n, l]) => (
            <View key={l} style={{ flex: 1, alignItems: 'center', backgroundColor: t.field, borderRadius: 14, paddingVertical: 10 }}>
              <Text style={{ color: t.ink, fontSize: 20, fontWeight: '800' }}>{n}</Text>
              <Text style={{ color: t.mute, fontSize: 12 }}>{l}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {sig.length ? sig.map(s => <Badge key={s.text} text={s.text} tone={s.tone} />) : <P small mute>Nothing in common yet</P>}
        </View>

        {!bl ? (
          <View>
            <Btn title={fol ? 'Following' : 'Follow'} kind={fol ? 'ghost' : 'soft'} icon={fol ? 'check-circle' : 'user-plus'} onPress={follow} />
            <P small mute style={{ textAlign: 'center', marginTop: 6 }}>{fol ? `You'll hear when ${p.name} posts a new plan.` : `Get notified when ${p.name} posts a new plan.`}</P>
          </View>
        ) : null}
        {!isVer(m, id) ? <Note>{p.name} hasn&apos;t done the face check yet. Meet in busy public places and share your plan with someone you trust.</Note> : null}

        <H size={17}>Upcoming activities{ups.length ? ` (${ups.length})` : ''}</H>
        {ups.length ? ups.map(a => <PlanRow key={a.id} m={m} a={a} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: a.id } })} />)
          : <P small mute>No upcoming activities near you right now.</P>}

        <H size={17}>Past activities</H>
        {past.length ? (
          <Card style={{ gap: 6 }}>{past.map((x, i) => <PastRow key={i} m={m} x={x} />)}</Card>
        ) : <P small mute>No past activities yet.</P>}

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
          {bl ? <Btn title={`Unblock ${p.name}`} kind="soft" onPress={unblock} style={{ flex: 1 }} /> : (
            <>
              <Btn title="Report" kind="ghost" icon="flag" onPress={() => setReporting(true)} style={{ flex: 1 }} />
              <Btn title="Block" kind="danger" onPress={block} style={{ flex: 1 }} />
            </>
          )}
        </View>
        {bl ? <P small mute>You blocked {p.name}. You won&apos;t see their activities and they can&apos;t request yours.</P> : null}
      </ScrollView>
      <ReportSheet open={reporting} title={`Report ${p.name}`} reasons={REPORT_REASONS} target={id} onClose={() => setReporting(false)} />
    </>
  );
}

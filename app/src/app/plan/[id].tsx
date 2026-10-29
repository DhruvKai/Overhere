import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActionSheetIOS, Alert, Platform, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { JoinSheet } from '@/components/JoinSheet';
import { ReportSheet } from '@/components/ReportSheet';
import { Avatar, Badge, Btn, Card, CatPill, Empty, H, Icon, Meta, P } from '@/components/ui';
import { api } from '@/lib/api';
import {
  COST, inChat, isVer, kmAway, myReq, nowOf, REPORT_REASONS, rupees, spots, spotTxt, tags, uname, whenStr,
} from '@/lib/model';
import { photoOf } from '@/lib/photos';
import { useModel, useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { R, useTheme } from '@/lib/theme';

export default function PlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const m = useModel();
  const { run, toast } = useStore();
  const [asking, setAsking] = useState(false);
  const [reporting, setReporting] = useState(false);
  const a = m.acts.find(x => x.id === id);

  if (!a) return <Empty icon="calendar" title="This plan isn't available" text="It may have been cancelled, or it's no longer open to you." />;

  const mine = a.host === m.me;
  const req = myReq(m, a.id);
  const past = a.when <= nowOf(m);
  const host = m.people[a.host];
  const pending = mine ? m.reqs.filter(r => r.act === a.id && r.status === 'pending') : [];
  const km = kmAway(m, a);

  const confirm = (title: string, text: string, label: string, fn: () => Promise<unknown>, done: string) =>
    Alert.alert(title, text, [{ text: 'Not now', style: 'cancel' }, {
      text: label, style: 'destructive', onPress: async () => { if (await run(fn) !== undefined) toast(done); },
    }]);

  const share = () => Share.share({ message: `${a.desc}, ${whenStr(a.when)} at ${a.venue}. Join me on Overhere: ${SITE}/app.html#act=${a.id}` });

  const more = () => {
    const opts = ['Report this plan', `Block ${uname(m, a.host)}`, 'Cancel'];
    const pick = (i: number) => {
      if (i === 0) setReporting(true);
      if (i === 1) confirm(`Block ${uname(m, a.host)}?`, "You won't see each other's plans or profiles. They aren't told.", 'Block',
        () => api.blockUser(a.host), 'Blocked');
    };
    if (Platform.OS === 'ios') ActionSheetIOS.showActionSheetWithOptions({ options: opts, cancelButtonIndex: 2, destructiveButtonIndex: 1 }, pick);
    else Alert.alert('More', undefined, [{ text: opts[0], onPress: () => pick(0) }, { text: opts[1], style: 'destructive', onPress: () => pick(1) }, { text: 'Cancel', style: 'cancel' }]);
  };

  return (
    <>
      <Stack.Screen options={{
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 18 }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Share invite link" onPress={share} hitSlop={10}><Icon name="share" size={21} /></Pressable>
            {!mine ? <Pressable accessibilityRole="button" accessibilityLabel="Report or block" onPress={more} hitSlop={10}><Icon name="more-horizontal" size={22} /></Pressable> : null}
          </View>
        ),
      }} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 14, paddingBottom: 40 }}>
        <Image source={photoOf(a)} style={{ width: '100%', aspectRatio: 16 / 10, borderRadius: R }} contentFit="cover" />
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <CatPill cat={a.cat} tint />
            {tags(a).map(x => <Badge key={x} text={x} tone="acc" />)}
          </View>
          <H size={24}>{a.desc}</H>
          <Meta icon="calendar" text={whenStr(a.when)} />
          <Meta icon="map-pin" text={a.venue + (km != null ? ` · ${km.toFixed(1)} km away` : '')} />
          <Meta icon="users" text={`${spotTxt(a)} · ${a.members.length} of ${a.cap} going${a.wl ? ` · ${a.wl} waiting` : ''}`} />
          <Meta icon="credit-card" text={COST[a.cost] + (a.total ? ` · about ${rupees(a.total)} in total` : '')} />
        </View>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar m={m} id={a.host} size={48} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: t.ink, fontSize: 16, fontWeight: '700' }}>{mine ? 'You' : host?.name ?? 'Someone'}{!mine && host?.age ? `, ${host.age}` : ''}</Text>
                {isVer(m, a.host) ? <Icon name="check-circle" size={16} color={t.ok} /> : null}
              </View>
              <P small mute>{mine ? 'You host this plan' : `Host${host?.met ? ` · ${host.shows}/${host.met} meetups showed up` : ''}`}</P>
            </View>
          </View>
          {!mine && host?.bio ? <P style={{ marginTop: 10 }}>{host.bio}</P> : null}
        </Card>

        {inChat(m, a) && a.members.length ? (
          <Card>
            <H size={16}>Going</H>
            {a.members.map(u => (
              <View key={u} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <Avatar m={m} id={u} size={34} />
                <Text style={{ flex: 1, color: t.ink, fontSize: 15 }}>{uname(m, u)}</Text>
                {mine && !past ? (
                  <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${uname(m, u)}`} hitSlop={8}
                    onPress={() => confirm(`Remove ${uname(m, u)}?`, "They leave the group chat and can't ask to join this plan again.", 'Remove',
                      () => api.removeMember(a.id, u), 'Removed')}>
                    <Icon name="user-x" size={18} color={t.mute} />
                  </Pressable>
                ) : null}
              </View>
            ))}
          </Card>
        ) : null}

        {mine && pending.length ? (
          <Card>
            <H size={16}>Asking to join</H>
            {pending.map(r => (
              <View key={r.id} style={{ marginTop: 12, gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Avatar m={m} id={r.user} size={34} />
                  <Text style={{ flex: 1, color: t.ink, fontSize: 15, fontWeight: '600' }}>
                    {uname(m, r.user)}{m.people[r.user]?.age ? `, ${m.people[r.user].age}` : ''}
                  </Text>
                </View>
                {r.note ? <P small>“{r.note}”</P> : null}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Btn title="Accept" style={{ flex: 1 }} disabled={spots(a) <= 0}
                    onPress={async () => { if (await run(() => api.decideRequest(r.id, true)) !== undefined) toast('Accepted'); }} />
                  <Btn title="Decline" kind="ghost" style={{ flex: 1 }}
                    onPress={async () => { if (await run(() => api.decideRequest(r.id, false)) !== undefined) toast('Declined'); }} />
                </View>
              </View>
            ))}
          </Card>
        ) : null}

        <View style={{ gap: 10 }}>
          {inChat(m, a) ? <Btn title="Open group chat" icon="message-circle" onPress={() => router.push({ pathname: '/chat/[id]', params: { id: a.id } })} /> : null}
          {!mine && !req && !past ? <Btn title={spots(a) <= 0 || a.status === 'full' ? 'Join the waitlist' : 'Ask to join'} icon="heart" onPress={() => setAsking(true)} /> : null}
          {req && (req.status === 'pending' || req.status === 'waitlist') && !past ? (
            <>
              <P mute style={{ textAlign: 'center' }}>{req.status === 'pending' ? `Waiting for ${uname(m, a.host)} to reply.` : `You're #${a.mypos || '?'} on the waitlist.`}</P>
              <Btn title="Withdraw request" kind="ghost" onPress={() => confirm('Withdraw your request?', 'You can ask again later if there is still room.', 'Withdraw',
                () => api.withdrawRequest(a.id), 'Request withdrawn')} />
            </>
          ) : null}
          {req?.status === 'rejected' ? <P mute style={{ textAlign: 'center' }}>{uname(m, a.host)} said no to this one. There are other plans in Discover.</P> : null}
          {req?.status === 'accepted' && !past ? <Btn title="Leave this plan" kind="ghost" onPress={() => confirm('Leave this plan?', 'You leave the group chat and your spot opens up for someone else.', 'Leave',
            () => api.leaveActivity(a.id), 'You left the plan')} /> : null}
          {mine && !past ? <Btn title="Cancel this plan" kind="danger" onPress={() => confirm('Cancel this plan?', 'Everyone who is going is told. This can\'t be undone.', 'Cancel plan',
            async () => { await api.cancelActivity(a.id); router.back(); }, 'Plan cancelled')} /> : null}
        </View>
      </ScrollView>
      {asking ? <JoinSheet plan={a} onClose={() => setAsking(false)} /> : null}
      <ReportSheet open={reporting} title="Report this plan" reasons={REPORT_REASONS} target={a.host} act={a.id} onClose={() => setReporting(false)} />
    </>
  );
}

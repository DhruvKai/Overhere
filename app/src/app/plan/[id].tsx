import { Image } from 'expo-image';
import Feather from '@expo/vector-icons/Feather';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { goBack } from '@/lib/nav';
import { useCallback, useEffect, useState } from 'react';
import { ActionSheetIOS, Alert, Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JoinSheet } from '@/components/JoinSheet';
import { ReasonSheet } from '@/components/ReasonSheet';
import { ReportSheet } from '@/components/ReportSheet';
import { TrustShareSheet } from '@/components/TrustShareSheet';
import { Avatar, Badge, BottomBar, Btn, Card, CatPill, Empty, H, Icon, P, type IconName } from '@/components/ui';
import { api } from '@/lib/api';
import { INVITE_MISS } from '@/lib/invite';
import {
  canSave, COST_S, costSub, durTxt, endOf, inChat, isVer, kmAway, myReq, needRate, nowOf, OPT_OUT, placeLine, REPORT_REASONS, RM_REASONS, saved, short,
  signals, spots, tags, trustTxt, uname, whenParts, whenStr,
} from '@/lib/model';
import { photoFor, photoOf } from '@/lib/photos';
import { sharePlan } from '@/lib/share';
import { useModel, useStore, useToggleSave } from '@/lib/store';
import { useTheme } from '@/lib/theme';

export default function PlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  /* light status bar text over the photo while this screen is showing, the theme's again when it isn't */
  useFocusEffect(useCallback(() => {
    setStatusBarStyle('light');
    return () => setStatusBarStyle(t.dark ? 'light' : 'dark');
  }, [t.dark]));
  const m = useModel();
  const { run, toast } = useStore();
  const toggleSave = useToggleSave();
  const [asking, setAsking] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [trustShare, setTrustShare] = useState(false);
  /* leaving, or removing someone, asks for a reason (ReasonSheet) */
  const [leaving, setLeaving] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const a = m.acts.find(x => x.id === id);
  /* not in your list (often from an invite link): ask the server why, so the message is right (openInvite in web/app.js) */
  const [why, setWhy] = useState('');
  useEffect(() => {
    if (a || !id) return;
    let live = true;
    api.inviteInfo(id).then(r => { if (live) setWhy(r); }, () => {});
    return () => { live = false; };
  }, [a, id]);

  if (!a) return <Empty icon="calendar" title="This plan isn't available" text={INVITE_MISS[why] || "It may have been cancelled, or it's no longer open to you."} />;

  const mine = a.host === m.me;
  const req = myReq(m, a.id);
  const past = a.when <= nowOf(m);
  const host = m.people[a.host];
  const pending = mine ? m.reqs.filter(r => r.act === a.id && r.status === 'pending') : [];
  /* the host also sees who was already decided (there's no waitlist: a full plan closes the requests still waiting) */
  const decided = mine ? m.reqs.filter(r => r.act === a.id && !['pending', 'accepted'].includes(r.status)) : [];
  const DECIDED: Record<string, string> = { rejected: 'Declined', left: 'Left', removed: 'Removed', closed: 'Closed', waitlist: 'Closed' };
  const rate = needRate(m, a);
  const km = kmAway(m, a);
  const [day, tm] = whenParts(a.when, nowOf(m));
  const canAsk = !mine && !req && !past;
  const full = spots(a) <= 0 || a.status === 'full';
  const bar = !!rate || inChat(m, a) || (canAsk && !full);

  const confirm = (title: string, text: string, label: string, fn: () => Promise<unknown>, done: string) =>
    Alert.alert(title, text, [{ text: 'Not now', style: 'cancel' }, {
      text: label, style: 'destructive', onPress: async () => { if (await run(fn) !== undefined) toast(done); },
    }]);

  const share = () => sharePlan(a);

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
      {/* layout A: the photo runs to the top of the screen, with the buttons on it, and the plan sits on a sheet over its edge */}
      <Stack.Screen options={{ headerShown: false }} />
      {/* with no button bar at the bottom, the page keeps clear of Android's navigation buttons itself */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 + (bar ? 0 : insets.bottom) }}>
        <Image source={photoOf(a)} style={{ width: '100%', height: 280 + insets.top }} contentFit="cover" accessibilityIgnoresInvertColors />
        <View style={{ marginTop: -24, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: t.bg, padding: 20, paddingTop: 20, gap: 14 }}>
          <View>
            <CatPill cat={a.cat} tint />
            <View style={{ marginTop: 12 }}><H size={25}>{a.desc}</H></View>
          </View>
          <Pressable accessibilityRole={mine ? undefined : 'button'} accessibilityLabel={mine ? undefined : `View ${host?.name ?? 'the host'}'s profile`} disabled={mine}
            onPress={() => router.push({ pathname: '/person/[id]', params: { id: a.host } })}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: t.line }}>
            <Avatar m={m} id={a.host} size={42} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Text style={{ color: t.ink, fontSize: 16, fontWeight: '700' }}>{mine ? 'You' : host?.name ?? 'Someone'}{!mine && host?.age ? `, ${host.age}` : ''}</Text>
                {isVer(m, a.host) ? <Icon name="check-circle" size={16} color={t.ok} /> : null}
                {!mine && host?.sample ? <Badge text="SAMPLE" tone="warn" /> : null}
              </View>
              <P small mute>{mine ? 'You host this plan' : `Host${host?.met ? ` · ${host.shows}/${host.met} meetups showed up` : ''}`}</P>
            </View>
            {!mine ? <Icon name="chevron-right" size={18} color={t.mute} /> : null}
          </Pressable>
          {/* when, where, spots, cost: one line each */}
          <View style={{ gap: 14, paddingTop: 2 }}>
            <Fact icon="calendar" text={`${day} · ${tm}`} sub={durTxt(a.dur)} />
            <Fact icon="map-pin" text={placeLine(a)} sub={km != null ? `${km.toFixed(1)} km` : ''} />
            <Fact icon="users" text={spots(a) > 0 ? `${spots(a)} of ${a.cap} spots open` : 'Full'} sub={a.members.length ? `${a.members.length} going` : ''} />
            <Fact icon="credit-card" text={COST_S[a.cost]} sub={costSub(m, a)} />
          </View>
          {tags(a, false).length ? <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>{tags(a, false).map(x => <Badge key={x} text={x} tone="acc" />)}</View> : null}
          {/* plan photos come from a bank of licensed photos, never the venue itself (lib/photos.ts) */}
          {(() => { const p = photoFor(a); return (
            <Pressable accessibilityRole="link" onPress={() => Linking.openURL(p.src)}>
              <Text style={{ color: t.mute, fontSize: 11.5 }}>Illustrative photo · {p.title} by {p.by}, {p.lic}</Text>
            </Pressable>
          ); })()}

        {inChat(m, a) && a.members.length ? (
          <Card>
            <H size={16}>Going</H>
            {a.members.map(u => (
              <View key={u} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <Pressable accessibilityRole="button" disabled={u === m.me || !m.people[u]} onPress={() => router.push({ pathname: '/person/[id]', params: { id: u } })}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Avatar m={m} id={u} size={34} />
                  <Text style={{ flex: 1, color: t.ink, fontSize: 15 }}>{uname(m, u)}</Text>
                </Pressable>
                {mine && !past ? (
                  <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${uname(m, u)}`} hitSlop={8}
                    onPress={() => setRemoving(u)}>
                    <Icon name="user-x" size={18} color={t.mute} />
                  </Pressable>
                ) : null}
              </View>
            ))}
          </Card>
        ) : null}

        {mine && !past && a.relist ? (
          <Card>
            <H size={16}>A spot opened up</H>
            <P small style={{ marginTop: 4, marginBottom: 10 }}>Someone left while the plan was full. Put the spot back up so others can ask to join, or keep the group as it is?</P>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Btn title="Keep the group" kind="ghost" style={{ flex: 1 }}
                onPress={async () => { if (await run(() => api.relistSpot(a.id, false)) !== undefined) toast('The plan stays full with the people going.'); }} />
              <Btn title="Relist the spot" style={{ flex: 1 }}
                onPress={async () => { if (await run(() => api.relistSpot(a.id, true)) !== undefined) toast('The spot is back up for others to request.'); }} />
            </View>
          </Card>
        ) : null}
        {mine && !past ? (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Btn title="Edit details" kind="ghost" icon="edit-2" style={{ flex: 1 }} onPress={() => router.push({ pathname: '/post', params: { id: a.id } })} />
            <Btn title="Invite a friend" kind="ghost" icon="send" style={{ flex: 1 }} onPress={share} />
          </View>
        ) : null}
        {mine && past ? <Btn title="Post again" kind="ghost" icon="repeat" onPress={() => router.push({ pathname: '/post', params: { tpl: a.id } })} /> : null}
        {mine && !past && !pending.length ? <P small mute>No pending requests yet. Invite a friend to get the word out.</P> : null}

        {mine && pending.length ? (
          <Card>
            <H size={16}>Pending requests ({pending.length})</H>
            {pending.map(r => (
              <View key={r.id} style={{ marginTop: 12, gap: 8 }}>
                <Pressable accessibilityRole="button" accessibilityLabel={`View ${uname(m, r.user)}'s profile`} onPress={() => router.push({ pathname: '/person/[id]', params: { id: r.user } })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Avatar m={m} id={r.user} size={34} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.ink, fontSize: 15, fontWeight: '600' }}>{uname(m, r.user)}{m.people[r.user]?.age ? `, ${m.people[r.user].age}` : ''}</Text>
                    <P small mute>{trustTxt(m, r.user)}</P>
                  </View>
                  <Icon name="chevron-right" size={18} color={t.mute} />
                </Pressable>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{signals(m, r.user).map(s => <Badge key={s.text} text={s.text} tone={s.tone} />)}</View>
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

        {decided.length ? (
          <Card>
            <H size={16}>Decided</H>
            {decided.map(r => (
              <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <Avatar m={m} id={r.user} size={30} />
                <Text style={{ flex: 1, color: t.ink, fontSize: 15 }}>{uname(m, r.user)}</Text>
                <Badge text={DECIDED[r.status] ?? 'No response'} tone={r.status === 'rejected' || r.status === 'removed' ? 'bad' : 'info'} />
              </View>
            ))}
          </Card>
        ) : null}

        <View style={{ gap: 10 }}>
          {mine && past && a.members.length && !rate ? <P small mute style={{ textAlign: 'center' }}>{a.attDone ? 'You recorded attendance. Thanks!' : `You can record who came once it ends, ${whenStr(endOf(a))}.`}</P> : null}
          {!mine && m.ratings[a.id] && past ? <P small mute style={{ textAlign: 'center' }}>You rated this meetup. Thanks!</P> : null}
          {canAsk && full ? <P mute style={{ textAlign: 'center' }}>This plan is full.</P> : null}
          {req && req.status === 'pending' && !past ? (
            <>
              <P mute style={{ textAlign: 'center' }}>{`Waiting for ${uname(m, a.host)} to reply.`}</P>
              <Btn title="Withdraw request" kind="ghost" onPress={() => confirm('Withdraw your request?', 'You can ask again later if there is still room.', 'Withdraw',
                () => api.withdrawRequest(a.id), 'Request withdrawn')} />
            </>
          ) : null}
          {req?.status === 'closed' ? <P mute style={{ textAlign: 'center' }}>This request is closed. There are other plans in Discover.</P> : null}
          {req?.status === 'accepted' && !past ? <Btn title="Share plan with trusted contact" kind="soft" icon="shield" onPress={() => setTrustShare(true)} /> : null}
          {req?.status === 'accepted' && !past ? <Btn title="Leave this plan" kind="ghost" onPress={() => setLeaving(true)} /> : null}
          {mine && !past ? <Btn title="Cancel this plan" kind="danger" onPress={() => confirm('Cancel this plan?',
            `You're about to cancel "${short(a.desc)}" on ${whenStr(a.when)}. This can't be undone. ${a.members.length ? `${a.members.length} accepted ${a.members.length === 1 ? 'member' : 'members'} will be told and the group chat will close.` : 'No one has been accepted yet.'}${pending.length ? ` ${pending.length} pending ${pending.length === 1 ? 'request' : 'requests'} will be dropped.` : ''}`,
            'Cancel plan',
            async () => { await api.cancelActivity(a.id); goBack(); }, 'Plan cancelled')} /> : null}
        </View>
        </View>
      </ScrollView>
      {/* back, save, share and more, on round buttons over the photo */}
      <View pointerEvents="box-none" style={{ position: 'absolute', top: insets.top + 8, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
        <RoundBtn icon="arrow-left" label="Back" onPress={() => goBack()} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {canSave(m, a) ? <RoundBtn icon="bookmark" label={saved(m).includes(a.id) ? 'Saved. Tap to remove' : 'Save for later'} on={saved(m).includes(a.id)} onPress={() => toggleSave(a.id)} /> : null}
          <RoundBtn icon="share" label="Share invite link" onPress={share} />
          {!mine ? <RoundBtn icon="more-horizontal" label="Report or block" onPress={more} /> : null}
        </View>
      </View>
      {/* the plan's main action stays at the bottom: rate it, open the chat, or ask to join */}
      {bar ? (
        <BottomBar>
          {rate ? <Btn title={rate === 'host' ? 'Rate and record attendance' : rate === 'noshow' ? 'Tell the host what happened' : 'Rate the meetup'} icon="star"
            onPress={() => router.push({ pathname: '/rate/[id]', params: { id: a.id } })} /> : null}
          {inChat(m, a) ? <Btn title="Open group chat" icon="message-circle" kind={rate ? 'ghost' : 'primary'} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: a.id } })} /> : null}
          {canAsk && !full ? <Btn title="Ask to join" icon="heart" onPress={() => setAsking(true)} /> : null}
        </BottomBar>
      ) : null}
      {asking ? <JoinSheet plan={a} onClose={() => setAsking(false)} /> : null}
      {trustShare ? <TrustShareSheet plan={a} onClose={() => setTrustShare(false)} /> : null}
      {leaving ? (
        <ReasonSheet title="Leave this plan?" reasons={OPT_OUT} action="Leave the plan"
          intro={`You'll leave "${short(a.desc)}" and its group chat, and can't ask to join it again. ${uname(m, a.host)} and the group see your reason.`}
          note={'"Feel uncomfortable with the group" and "Feel unsafe" stay private: the group only sees that you left, and our team looks at the plan. In danger right now? Call 112.'}
          onClose={() => setLeaving(false)}
          onPick={async why => { if (await run(() => api.leaveActivity(a.id, why)) !== undefined) { setLeaving(false); toast('You left the plan'); } }} />
      ) : null}
      {removing ? (
        <ReasonSheet title={`Remove ${uname(m, removing)}?`} reasons={RM_REASONS} action="Remove"
          intro={`${uname(m, removing)} leaves the group chat and can't ask to join this plan again. They and the group see your reason.`}
          onClose={() => setRemoving(null)}
          onPick={async why => { if (await run(() => api.removeMember(a.id, removing, why)) !== undefined) { setRemoving(null); toast('Removed'); } }} />
      ) : null}
      <ReportSheet open={reporting} title="Report this plan" reasons={REPORT_REASONS} target={a.host} act={a.id} onClose={() => setReporting(false)} />
    </>
  );
}

/* One fact about the plan: an icon, the fact, and a quieter detail after it. */
function Fact({ icon, text, sub }: { icon: IconName; text: string; sub?: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
      <Icon name={icon} size={19} color={t.accink} />
      <Text style={{ flex: 1, color: t.ink, fontSize: 15.5 }}>{text}{sub ? <Text style={{ color: t.mute }}> · {sub}</Text> : null}</Text>
    </View>
  );
}

/* A round button on the photo, readable on any picture. */
function RoundBtn({ icon, label, on, onPress }: { icon: IconName; label: string; on?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={on === undefined ? undefined : { selected: on }} onPress={onPress} hitSlop={6}
      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(15,12,8,0.5)', alignItems: 'center', justifyContent: 'center' }}>
      <Feather name={icon} size={19} color={on ? '#9FD3AA' : '#fff'} />
    </Pressable>
  );
}

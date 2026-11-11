import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActionSheetIOS, Alert, Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { JoinSheet } from '@/components/JoinSheet';
import { ReasonSheet } from '@/components/ReasonSheet';
import { ReportSheet } from '@/components/ReportSheet';
import { TrustShareSheet } from '@/components/TrustShareSheet';
import { Avatar, Badge, BottomBar, Btn, Card, CatPill, Empty, H, Icon, Meta, P } from '@/components/ui';
import { api } from '@/lib/api';
import { INVITE_MISS } from '@/lib/invite';
import {
  canSave, COST, durTxt, endOf, inChat, isVer, kmAway, myReq, needRate, nowOf, OPT_OUT, REPORT_REASONS, RM_REASONS, rupees, saved, short, signals, spots,
  spotTxt, tags, trustTxt, uname, whenStr,
} from '@/lib/model';
import { photoFor, photoOf } from '@/lib/photos';
import { sharePlan } from '@/lib/share';
import { useModel, useStore, useToggleSave } from '@/lib/store';
import { R, useTheme } from '@/lib/theme';

export default function PlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
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
  const canAsk = !mine && !req && !past;
  const full = spots(a) <= 0 || a.status === 'full';

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
      <Stack.Screen options={{
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 18 }}>
            {canSave(m, a) ? (
              <Pressable accessibilityRole="button" accessibilityState={{ selected: saved(m).includes(a.id) }} accessibilityLabel={saved(m).includes(a.id) ? 'Saved. Tap to remove' : 'Save for later'}
                onPress={() => toggleSave(a.id)} hitSlop={10}><Icon name="bookmark" size={21} color={saved(m).includes(a.id) ? t.accink : undefined} /></Pressable>
            ) : null}
            <Pressable accessibilityRole="button" accessibilityLabel="Share invite link" onPress={share} hitSlop={10}><Icon name="share" size={21} /></Pressable>
            {!mine ? <Pressable accessibilityRole="button" accessibilityLabel="Report or block" onPress={more} hitSlop={10}><Icon name="more-horizontal" size={22} /></Pressable> : null}
          </View>
        ),
      }} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 14, paddingBottom: 40 }}>
        <Image source={photoOf(a)} style={{ width: '100%', aspectRatio: 16 / 10, borderRadius: R }} contentFit="cover" />
        {/* plan photos come from a bank of licensed photos, never the venue itself (lib/photos.ts) */}
        {(() => { const p = photoFor(a); return (
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(p.src)} style={{ marginTop: -8 }}>
            <P small mute>Illustrative photo, not the actual venue · {p.title} by {p.by}, {p.lic}</P>
          </Pressable>
        ); })()}
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <CatPill cat={a.cat} tint />
            {tags(a).map(x => <Badge key={x} text={x} tone="acc" />)}
          </View>
          <H size={24}>{a.desc}</H>
          <Meta icon="calendar" text={`${whenStr(a.when)} · ${durTxt(a.dur)}`} />
          <Meta icon="map-pin" text={a.venue + (km != null ? ` · ${km.toFixed(1)} km away` : '')} />
          <Meta icon="users" text={a.members.length ? `${a.members.length} going · ${spotTxt(a)}` : spotTxt(a)} />
          <Meta icon="credit-card" text={COST[a.cost] + (a.total ? ` · about ${rupees(a.total)} in total` : '')} />
        </View>

        <Card>
          <Pressable accessibilityRole={mine ? undefined : 'button'} accessibilityLabel={mine ? undefined : `View ${host?.name ?? 'the host'}'s profile`} disabled={mine}
            onPress={() => router.push({ pathname: '/person/[id]', params: { id: a.host } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar m={m} id={a.host} size={48} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: t.ink, fontSize: 16, fontWeight: '700' }}>{mine ? 'You' : host?.name ?? 'Someone'}{!mine && host?.age ? `, ${host.age}` : ''}</Text>
                {isVer(m, a.host) ? <Icon name="check-circle" size={16} color={t.ok} /> : null}
              </View>
              <P small mute>{mine ? 'You host this plan' : `Host${host?.met ? ` · ${host.shows}/${host.met} meetups showed up` : ''}`}</P>
            </View>
            {!mine ? <Icon name="chevron-right" size={18} color={t.mute} /> : null}
          </Pressable>
          {!mine && host?.bio ? <P style={{ marginTop: 10 }}>{host.bio}</P> : null}
        </Card>

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
            async () => { await api.cancelActivity(a.id); router.back(); }, 'Plan cancelled')} /> : null}
        </View>
      </ScrollView>
      {/* the plan's main action stays at the bottom: rate it, open the chat, or ask to join */}
      {rate || inChat(m, a) || (canAsk && !full) ? (
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

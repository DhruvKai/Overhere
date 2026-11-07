import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReasonSheet } from '@/components/ReasonSheet';
import { ReportSheet } from '@/components/ReportSheet';
import { Sheet } from '@/components/Sheet';
import { TrustShareSheet } from '@/components/TrustShareSheet';
import { Avatar, Badge, Btn, Empty, Field, Icon, P } from '@/components/ui';
import { tipsOf } from '@/lib/feedback';
import { api } from '@/lib/api';
import { CHAT_OPEN_H, CHAT_REASONS, chatClosed, inChat, isPast, mutedOf, OPT_OUT, RM_REASONS, short, uname, type Msg } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { tidyWhen } from '@/lib/when';
import { useTheme } from '@/lib/theme';

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme(), insets = useSafeAreaInsets();
  const m = useModel();
  const { run, toast, savePriv } = useStore();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [reportMsg, setReportMsg] = useState<Msg | null>(null);
  const [sheet, setSheet] = useState<'members' | 'poll' | 'trust' | 'leave' | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [opts, setOpts] = useState(['', '', '', '']);
  const a = m.acts.find(x => x.id === id);

  if (!a || !inChat(m, a)) return <Empty icon="message-circle" title="This chat isn't open to you" text="Group chats are for the host and the people they accepted." />;

  const closed = chatClosed(m, a);
  const muted = !!mutedOf(m)[a.id];
  const host = a.host === m.me, past = isPast(m, a), sample = !!m.people[a.host]?.sample;
  /* the safety tips show at the top of each chat until you tap "Got it" (profiles.state.tips[plan], like the website) */
  const tips = !closed && !tipsOf(m)[a.id];
  /* newest first, for the inverted list */
  const msgs = [...(m.chats[a.id] ?? [])].reverse();

  async function send() {
    const body = text.trim();
    if (!body || !a) return;
    setSending(true);
    setText('');
    const ok = await run(() => api.sendMessage(a.id, body));
    if (ok === undefined) setText(body);
    setSending(false);
  }
  async function postPoll() {
    /* times and dates are written the app's way ("8am" -> "8:00 AM", "5/11" -> "Thu, 5 Nov") */
    const o = opts.map(x => tidyWhen(x.trim()).slice(0, 40)).filter(Boolean);
    if (!q.trim() || o.length < 2) return toast('Add a question and at least 2 options');
    if (await run(() => api.sendMessage(a!.id, null, { q: tidyWhen(q.trim()).slice(0, 80), opts: o })) === undefined) return;
    setQ(''); setOpts(['', '', '', '']); setSheet(null);
  }
  const mute = () => {
    savePriv(p => ({ muted: { ...(p.muted as object), [a.id]: !muted } }));
    toast(muted ? 'Chat notifications on' : 'Chat muted. You can still open it any time.');
  };
  /* both ask for a reason (ReasonSheet below) */
  const remove = (u: string) => { setSheet(null); setRemoving(u); };
  const leave = () => setSheet('leave');

  const vote = (msg: Msg, opt: number) => run(() => api.vote(msg.id, opt));
  const headBtn = (icon: 'users' | 'bell' | 'bell-off', label: string, onPress: () => void) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={8} onPress={onPress}><Icon name={icon} size={20} /></Pressable>
  );

  return (
    <>
      <Stack.Screen options={{
        title: a.desc.length > 22 ? a.desc.slice(0, 22) + '…' : a.desc,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            {headBtn('users', 'Members', () => setSheet('members'))}
            {headBtn(muted ? 'bell-off' : 'bell', muted ? 'Unmute chat notifications' : 'Mute chat notifications', mute)}
            <Pressable accessibilityRole="button" accessibilityLabel="SOS: get help now" hitSlop={8} onPress={() => router.push({ pathname: '/sos', params: { id: a.id } })}
              style={{ backgroundColor: t.bad, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13, letterSpacing: 0.5 }}>SOS</Text>
            </Pressable>
          </View>
        ),
      }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <Text style={{ color: t.mute, fontSize: 12.5, paddingHorizontal: 14, paddingVertical: 8, borderBottomWidth: 1, borderColor: t.line }}>
          Members: {[a.host, ...a.members].map(u => uname(m, u)).join(', ')} · full history visible to everyone{muted ? ' · notifications muted' : ''}
          {sample ? <Text style={{ fontWeight: '700' }}> · Sample plan: the host&apos;s messages are pre-written and nobody will be there</Text> : null}
        </Text>
        <FlatList
          inverted
          data={msgs}
          keyExtractor={x => String(x.id)}
          contentContainerStyle={{ padding: 12, gap: 8 }}
          ListFooterComponent={tips ? (
            <View style={{ backgroundColor: t.newbg, borderColor: t.line, borderWidth: 1, borderRadius: 16, padding: 14, gap: 6, marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name="shield" size={15} color={t.ok} /><Text style={{ color: t.ink, fontWeight: '700', fontSize: 14 }}>Meeting new people? A few tips</Text></View>
              <P small>• Meet in a busy public place and make your own way there.</P>
              <P small>• Tell someone you trust where you&apos;ll be. <Text onPress={() => setSheet('trust')} style={{ color: t.accink, fontWeight: '700' }}>Share plan</Text></P>
              <P small>• Leave whenever you like. Tap SOS if you ever feel unsafe.</P>
              <P small>• Press and hold someone&apos;s message to report it.</P>
              <Btn title="Got it" kind="soft" onPress={() => savePriv(p => ({ tips: { ...(p.tips as object), [a.id]: true } }))} style={{ minHeight: 38, marginTop: 4, alignSelf: 'flex-start' }} />
            </View>
          ) : undefined}
          renderItem={({ item: x }) => {
            if (x.sys) return <Text style={{ alignSelf: 'center', color: t.mute, fontSize: 13, paddingVertical: 4, textAlign: 'center' }}>{x.text}</Text>;
            const me = x.from === m.me;
            const total = x.poll ? x.poll.opts.reduce((n, o) => n + o.v.length, 0) : 0;
            return (
              <Pressable onLongPress={() => (!me && !x.reported ? setReportMsg(x) : undefined)} delayLongPress={350}
                accessibilityHint={!me ? 'Long press to report this message' : undefined}
                style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '82%', backgroundColor: me ? t.acc : t.card, borderColor: t.line, borderWidth: me ? 0 : 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 }}>
                {!me ? <Text style={{ color: t.accink, fontSize: 12, fontWeight: '700', marginBottom: 2 }}>{uname(m, x.from)}</Text> : null}
                {x.reported ? <Text style={{ color: t.mute, fontStyle: 'italic' }}>You reported this message.</Text>
                  : x.poll ? (
                    <View style={{ gap: 6, minWidth: 220 }}>
                      <Text style={{ color: me ? t.onAcc : t.ink, fontWeight: '700', fontSize: 15 }}>📊 {x.poll.q}</Text>
                      {x.poll.opts.map((o, j) => {
                        const on = o.v.includes(m.me), pct = total ? Math.round((o.v.length / total) * 100) : 0;
                        return (
                          <Pressable key={j} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={`${o.t}: ${o.v.length} votes`}
                            onPress={() => vote(x, j)} disabled={closed}
                            style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1.5, borderColor: on ? t.accink : t.line, backgroundColor: t.field, minHeight: 40, justifyContent: 'center' }}>
                            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, backgroundColor: t.acc2 }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                              <Text style={{ color: t.ink, fontSize: 15 }}>{o.t}</Text>
                              <Text style={{ color: t.ink2, fontSize: 14, fontWeight: '700' }}>{o.v.length}</Text>
                            </View>
                          </Pressable>
                        );
                      })}
                      <Text style={{ color: me ? t.onAcc : t.mute, fontSize: 12 }}>{total} {total === 1 ? 'vote' : 'votes'}{closed ? '' : ' · tap to vote'}</Text>
                    </View>
                  ) : <Text style={{ color: me ? t.onAcc : t.ink, fontSize: 16, lineHeight: 21 }}>{x.text}</Text>}
              </Pressable>
            );
          }}
          ListEmptyComponent={<Text style={{ color: t.mute, textAlign: 'center', padding: 24, transform: [{ scaleY: -1 }] }}>Say hi and agree where to meet.</Text>}
        />
        {closed ? (
          <View accessibilityRole="text" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, paddingBottom: insets.bottom + 14, backgroundColor: t.field, borderTopWidth: 1, borderColor: t.line }}>
            <Icon name="lock" size={15} color={t.mute} />
            <Text style={{ color: t.mute, fontSize: 14, flex: 1 }}>This chat closed {CHAT_OPEN_H} hours after the plan ended. You can still read it.</Text>
          </View>
        ) : (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, paddingBottom: insets.bottom + 10, backgroundColor: t.card, borderTopWidth: 1, borderColor: t.line }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Create a poll" onPress={() => setSheet('poll')}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.field, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bar-chart-2" size={19} color={t.ink2} />
          </Pressable>
          <TextInput value={text} onChangeText={setText} placeholder="Message the group" placeholderTextColor={t.ph} multiline maxLength={500}
            accessibilityLabel="Message"
            style={{ flex: 1, fontSize: 16, maxHeight: 120, minHeight: 44, backgroundColor: t.field, color: t.ink, borderRadius: 22, paddingHorizontal: 16, paddingTop: 11, paddingBottom: 11 }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Send" onPress={send} disabled={sending || !text.trim()}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: text.trim() ? t.acc : t.field, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="send" size={19} color={text.trim() ? t.onAcc : t.mute} />
          </Pressable>
        </View>
        )}
      </KeyboardAvoidingView>
      <ReportSheet open={!!reportMsg} title="Report this message" reasons={CHAT_REASONS} target={reportMsg?.from} act={a.id} msg={reportMsg?.id}
        onClose={() => setReportMsg(null)} />
      {sheet === 'members' ? (
        <Sheet title={`Members (${a.members.length + 1})`} onClose={() => setSheet(null)}>
          {[a.host, ...a.members].map(u => (
            <View key={u} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
              <Pressable accessibilityRole="button" disabled={u === m.me || !m.people[u]} onPress={() => { setSheet(null); router.push({ pathname: '/person/[id]', params: { id: u } }); }}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Avatar m={m} id={u} size={34} />
                <Text style={{ flex: 1, color: t.ink, fontSize: 15 }}>{uname(m, u)}</Text>
              </Pressable>
              {u === a.host ? <Badge text="Host" tone="acc" />
                : host && !past && u !== '?' ? <Btn title="Remove" kind="danger" onPress={() => { setSheet(null); remove(u); }} style={{ minHeight: 36, paddingHorizontal: 12 }} /> : null}
            </View>
          ))}
          {!host && !past && a.members.includes(m.me) ? <Btn title="Leave the plan" kind="danger" icon="log-out" onPress={() => { setSheet(null); leave(); }} style={{ marginTop: 10 }} /> : null}
        </Sheet>
      ) : null}
      {sheet === 'poll' ? (
        <Sheet title="New poll" onClose={() => setSheet(null)}>
          <Field label="Question" value={q} onChangeText={setQ} maxLength={80} placeholder="e.g. Which time works best?" />
          {opts.map((o, i) => (
            <Field key={i} label={i === 0 ? 'Options (at least 2)' : undefined} accessibilityLabel={`Option ${i + 1}`} value={o} maxLength={40}
              placeholder={`Option ${i + 1}${i > 1 ? ' (optional)' : ''}`} onChangeText={v => setOpts(l => l.map((x, j) => (j === i ? v : x)))} />
          ))}
          <Btn title="Post poll" onPress={postPoll} />
        </Sheet>
      ) : null}
      {sheet === 'trust' ? <TrustShareSheet plan={a} onClose={() => setSheet(null)} /> : null}
      {sheet === 'leave' ? (
        <ReasonSheet title="Leave this plan?" reasons={OPT_OUT} action="Leave the plan"
          intro={`You'll leave "${short(a.desc)}" and its group chat, and can't ask to join it again. ${uname(m, a.host)} and the group see your reason.`}
          note={'"Feel uncomfortable with the group" and "Feel unsafe" stay private: the group only sees that you left, and our team looks at the plan. In danger right now? Call 112.'}
          onClose={() => setSheet(null)}
          onPick={async why => { if (await run(() => api.leaveActivity(a.id, why)) !== undefined) { setSheet(null); toast('You left the plan'); router.back(); } }} />
      ) : null}
      {removing ? (
        <ReasonSheet title={`Remove ${uname(m, removing)}?`} reasons={RM_REASONS} action="Remove"
          intro={`${uname(m, removing)} leaves the group chat and can't ask to join this plan again. They and the group see your reason.`}
          onClose={() => setRemoving(null)}
          onPick={async why => { if (await run(() => api.removeMember(a.id, removing, why)) !== undefined) { setRemoving(null); toast('Removed'); } }} />
      ) : null}
    </>
  );
}

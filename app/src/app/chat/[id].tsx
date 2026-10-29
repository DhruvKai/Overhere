import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReportSheet } from '@/components/ReportSheet';
import { Empty, Icon } from '@/components/ui';
import { api } from '@/lib/api';
import { CHAT_REASONS, inChat, uname, type Msg } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme(), insets = useSafeAreaInsets();
  const m = useModel();
  const { run } = useStore();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [reportMsg, setReportMsg] = useState<Msg | null>(null);
  const a = m.acts.find(x => x.id === id);

  if (!a || !inChat(m, a)) return <Empty icon="message-circle" title="This chat isn't open to you" text="Group chats are for the host and the people they accepted." />;

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

  const vote = (msg: Msg, opt: number) => run(() => api.vote(msg.id, opt));

  return (
    <>
      <Stack.Screen options={{ title: a.desc.length > 28 ? a.desc.slice(0, 28) + '…' : a.desc }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          inverted
          data={msgs}
          keyExtractor={x => String(x.id)}
          contentContainerStyle={{ padding: 12, gap: 8 }}
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
                            onPress={() => vote(x, j)}
                            style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1.5, borderColor: on ? t.accink : t.line, backgroundColor: t.field, minHeight: 40, justifyContent: 'center' }}>
                            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, backgroundColor: t.acc2 }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                              <Text style={{ color: t.ink, fontSize: 15 }}>{o.t}</Text>
                              <Text style={{ color: t.ink2, fontSize: 14, fontWeight: '700' }}>{o.v.length}</Text>
                            </View>
                          </Pressable>
                        );
                      })}
                      <Text style={{ color: me ? t.onAcc : t.mute, fontSize: 12 }}>{total} {total === 1 ? 'vote' : 'votes'} · tap to vote</Text>
                    </View>
                  ) : <Text style={{ color: me ? t.onAcc : t.ink, fontSize: 16, lineHeight: 21 }}>{x.text}</Text>}
              </Pressable>
            );
          }}
          ListEmptyComponent={<Text style={{ color: t.mute, textAlign: 'center', padding: 24, transform: [{ scaleY: -1 }] }}>Say hi and agree where to meet.</Text>}
        />
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, paddingBottom: insets.bottom + 10, backgroundColor: t.card, borderTopWidth: 1, borderColor: t.line }}>
          <TextInput value={text} onChangeText={setText} placeholder="Message the group" placeholderTextColor={t.ph} multiline maxLength={500}
            accessibilityLabel="Message"
            style={{ flex: 1, fontSize: 16, maxHeight: 120, minHeight: 44, backgroundColor: t.field, color: t.ink, borderRadius: 22, paddingHorizontal: 16, paddingTop: 11, paddingBottom: 11 }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Send" onPress={send} disabled={sending || !text.trim()}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: text.trim() ? t.acc : t.field, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="send" size={19} color={text.trim() ? t.onAcc : t.mute} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <ReportSheet open={!!reportMsg} title="Report this message" reasons={CHAT_REASONS} target={reportMsg?.from} act={a.id} msg={reportMsg?.id}
        onClose={() => setReportMsg(null)} />
    </>
  );
}

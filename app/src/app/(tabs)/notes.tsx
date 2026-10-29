import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { Header } from '@/components/Header';
import { Badge, Empty, Icon, type IconName } from '@/components/ui';
import { api } from '@/lib/api';
import { ago, nowOf } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

const KIND: Record<string, IconName> = { req: 'user-check', update: 'layers', remind: 'calendar' };
const TONE: Record<string, 'ok' | 'bad' | 'warn' | 'info'> = { good: 'ok', bad: 'bad', warn: 'warn', info: 'info' };

export default function Notes() {
  const t = useTheme();
  const m = useModel();
  const { refresh } = useStore();
  const [pulling, setPulling] = useState(false);
  const unread = m.notes.some(n => !n.read);

  /* Opening this tab marks everything read (read_notifications(null)), a moment later so the dots are seen first. */
  useFocusEffect(useCallback(() => {
    if (!unread) return;
    const id = setTimeout(() => { api.readNotifications(null).then(refresh, () => {}); }, 1500);
    return () => clearTimeout(id);
  }, [unread, refresh]));

  const now = nowOf(m);
  return (
    <View style={{ flex: 1 }}>
      <Header title="Updates" sub="Requests, changes and reminders" right={<View />} />
      <FlatList
        data={m.notes}
        keyExtractor={n => n.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={pulling} onRefresh={async () => { setPulling(true); await refresh(); setPulling(false); }} tintColor={t.acc} />}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item: n }) => {
          const open = n.act && m.acts.some(a => a.id === n.act);
          return (
            <Pressable accessibilityRole={open ? 'button' : 'text'} disabled={!open}
              onPress={() => n.act && router.push({ pathname: n.flags.includes('chat') ? '/chat/[id]' : '/plan/[id]', params: { id: n.act } })}
              style={{ flexDirection: 'row', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: t.line, backgroundColor: n.read ? t.card : t.newbg }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: t.acc2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={KIND[n.kind] ?? 'bell'} size={18} color={t.accink} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Text style={{ color: t.ink, fontWeight: '700', fontSize: 15 }}>{n.title}</Text>
                  {n.tag ? <Badge text={n.tag} tone={TONE[n.tone] ?? 'info'} /> : null}
                </View>
                <Text style={{ color: t.ink2, fontSize: 14, lineHeight: 19 }}>{n.text}</Text>
                <Text style={{ color: t.mute, fontSize: 12 }}>{ago(n.at, now)}</Text>
              </View>
              {!n.read ? <View accessibilityLabel="Unread" style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: t.acc, marginTop: 6 }} /> : null}
            </Pressable>
          );
        }}
        ListEmptyComponent={<Empty icon="bell" title="Nothing new" text="Join requests, replies and reminders for your plans show up here." />}
      />
    </View>
  );
}

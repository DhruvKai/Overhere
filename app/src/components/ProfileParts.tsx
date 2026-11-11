import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ago, CATS, nowOf, uname, type Model, type PastItem } from '@/lib/model';
import { useModel } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { Avatar, Icon, P, type IconName } from './ui';

/* Pieces shared by Profile, Settings and someone else's profile. */

/* A card's heading with its icon, like the website's panel headings. */
export function Ph({ icon, title, right }: { icon: IconName; title: string; right?: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <Icon name={icon} size={16} color={t.accink} />
      <Text style={{ flex: 1, color: t.ink, fontSize: 16, fontWeight: '700' }}>{title}</Text>
      {right ? <Text style={{ color: t.mute, fontSize: 13 }}>{right}</Text> : null}
    </View>
  );
}

/* A settings-style row: icon, label, chevron. */
export function Row({ icon, label, onPress, danger }: { icon: IconName; label: string; onPress: () => void; danger?: boolean }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, opacity: pressed ? 0.7 : 1 })}>
      <Icon name={icon} size={19} color={danger ? t.bad : t.ink2} />
      <Text style={{ flex: 1, fontSize: 16, color: danger ? t.bad : t.ink }}>{label}</Text>
      <Icon name="chevron-right" size={18} color={t.mute} />
    </Pressable>
  );
}

/* Someone's name and picture in a list, with one action on the right. */
export function PersonRow({ id, action, onAction }: { id: string; action: string; onAction: () => void }) {
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

/* Past activities (pastList in lib/model.ts): category tile, title, role and when, and something on the right. */
export function PastRow({ m, x, right }: { m: Model; x: PastItem; right?: ReactNode }) {
  const t = useTheme();
  const c = CATS[x.cat];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: t.dark ? c.bgDark : c.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={c.icon} size={16} color={t.dark ? c.fgDark : c.fg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: t.ink, fontSize: 15, fontWeight: '600' }} numberOfLines={1}>{x.t}</Text>
        <P small mute>{x.role} · {ago(x.at, nowOf(m))}</P>
      </View>
      {right}
    </View>
  );
}

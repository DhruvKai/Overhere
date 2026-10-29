import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useModel } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { Icon } from './ui';

/* Tab header: the title, where you're browsing, and the Post button. */
export function Header({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  const t = useTheme(), insets = useSafeAreaInsets();
  const m = useModel();
  return (
    <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Text accessibilityRole="header" style={{ fontSize: 26, fontWeight: '800', color: t.ink, letterSpacing: -0.4 }}>{title}</Text>
        <Text style={{ fontSize: 13, color: t.mute }} numberOfLines={1}>{sub ?? `Near ${(m.profile?.hood || '').split(',')[0]}`}</Text>
      </View>
      {right ?? (
        <Pressable accessibilityRole="button" accessibilityLabel="Post a plan" onPress={() => router.push('/post')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: t.acc, borderRadius: 99, paddingHorizontal: 14, minHeight: 40 }}>
          <Icon name="plus" size={18} color={t.onAcc} />
          <Text style={{ color: t.onAcc, fontWeight: '700', fontSize: 15 }}>Post</Text>
        </Pressable>
      )}
    </View>
  );
}

import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';
import { Icon, Logo } from './ui';
import { WhereButton } from './Where';

/* Tab header: the title, then where you're browsing (tap to change city; Swipe and Discover) or nothing, and the Post
   button or something else on the right. */
export function Header({ title, where, right, logo }: { title: string; where?: boolean; right?: ReactNode; logo?: boolean }) {
  const t = useTheme(), insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1 }}>
        {logo ? <Logo size={26} /> : <Text accessibilityRole="header" style={{ fontSize: 26, fontWeight: '800', color: t.ink, letterSpacing: -0.4 }}>{title}</Text>}
        {where ? <WhereButton /> : null}
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

/* A round icon button for a header's right side (Settings on Profile). */
export function HeaderIcon({ icon, label, onPress }: { icon: 'settings'; label: string; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={6}
      style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={20} />
    </Pressable>
  );
}

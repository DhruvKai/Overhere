import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { Icon, Logo, type IconName } from './ui';
import { WhereButton } from './Where';

/* Tab header: the title, then where you're browsing (tap to change city; Swipe and Discover) or nothing, and Updates
   or something else on the right. (Post is in the middle of the tab bar.) */
export function Header({ title, where, right, logo }: { title: string; where?: boolean; right?: ReactNode; logo?: boolean }) {
  const t = useTheme(), insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1 }}>
        {logo ? <Logo size={26} /> : <Text accessibilityRole="header" style={{ fontSize: 26, fontWeight: '800', color: t.ink, letterSpacing: -0.4 }}>{title}</Text>}
        {where ? <WhereButton /> : null}
      </View>
      {right ?? <UpdatesButton />}
    </View>
  );
}

/* A round icon button for a header's right side (Settings on Profile). */
export function HeaderIcon({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={6}
      style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={20} />
    </Pressable>
  );
}

/* Updates at the top right: a round bell button (like the gear on Profile) with the number of unread ones. */
export function UpdatesButton() {
  const t = useTheme();
  const unread = useStore().model?.notes.filter(n => !n.read).length ?? 0;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={unread ? `Updates, ${unread} new` : 'Updates'} onPress={() => router.push('/updates')} hitSlop={6}
      style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 22, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}>
      <Icon name="bell" size={20} />
      {unread ? (
        <View style={{ position: 'absolute', top: -4, right: -4, minWidth: 19, height: 19, borderRadius: 10, paddingHorizontal: 4, backgroundColor: t.bad, borderWidth: 1.5, borderColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{unread > 9 ? '9+' : unread}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

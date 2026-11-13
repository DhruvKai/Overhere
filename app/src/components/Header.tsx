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

/* Updates at the top right: a bell with its name under it, and the number of unread ones. */
export function UpdatesButton() {
  const t = useTheme();
  const unread = useStore().model?.notes.filter(n => !n.read).length ?? 0;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={unread ? `Updates, ${unread} new` : 'Updates'} onPress={() => router.push('/updates')}
      style={({ pressed }) => ({ alignItems: 'center', justifyContent: 'center', gap: 1, minWidth: 64, minHeight: 50, paddingHorizontal: 8, borderRadius: 14, borderWidth: 1, borderColor: t.line, backgroundColor: t.card, opacity: pressed ? 0.8 : 1 })}>
      <View>
        <Icon name="bell" size={20} />
        {unread ? (
          <View style={{ position: 'absolute', top: -6, right: -10, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: t.bad, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{unread > 9 ? '9+' : unread}</Text>
          </View>
        ) : null}
      </View>
      <Text style={{ color: t.ink2, fontSize: 11.5, fontWeight: '600' }}>Updates</Text>
    </Pressable>
  );
}

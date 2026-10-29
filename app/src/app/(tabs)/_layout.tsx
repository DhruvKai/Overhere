import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import { useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

export default function TabLayout() {
  const t = useTheme();
  const unread = useStore().model?.notes.filter(n => !n.read).length ?? 0;
  const icon = (name: React.ComponentProps<typeof Feather>['name']) =>
    function TabIcon({ color }: { color: import('react-native').ColorValue }) { return <Feather name={name} size={22} color={color as string} />; };
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: t.acc,
      tabBarInactiveTintColor: t.mute,
      tabBarStyle: { backgroundColor: t.card, borderTopColor: t.line },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Swipe', tabBarIcon: icon('layers') }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover', tabBarIcon: icon('compass') }} />
      <Tabs.Screen name="plans" options={{ title: 'My plans', tabBarIcon: icon('message-circle') }} />
      <Tabs.Screen name="notes" options={{ title: 'Updates', tabBarIcon: icon('bell'), tabBarBadge: unread ? (unread > 9 ? '9+' : unread) : undefined }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('user') }} />
    </Tabs>
  );
}

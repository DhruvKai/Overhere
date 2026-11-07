import Feather from '@expo/vector-icons/Feather';
import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { MicroAsk } from '@/components/Feedback';
import { Btn, Empty } from '@/components/ui';
import { TermsPrompt } from '@/components/TermsPrompt';
import { column } from '@/lib/layout';
import { nowOf } from '@/lib/model';
import { useReminders } from '@/lib/reminders';
import { useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

/* Each start of the app counts as a visit, for when to ask for feedback (fbDue in lib/feedback.ts). */
let counted = false;

export default function TabLayout() {
  const t = useTheme();
  const { model, saveAsked } = useStore();
  const unread = model?.notes.filter(n => !n.read).length ?? 0;
  useEffect(() => {
    if (counted || !model) return;
    counted = true;
    const now = nowOf(model);
    saveAsked(a => ({ fbOpens: (a.fbOpens || 0) + 1, ...(a.fbFirst ? {} : { fbFirst: now }) }));
  }, [model, saveAsked]);
  useReminders();
  /* A hosted plan whose three daily attendance reminders went unanswered comes before anything else (app_state 'due',
     the website's mustrate): the tabs wait until it's rated. */
  const overdue = model?.due.find(d => d.overdue && model.acts.some(a => a.id === d.act && !a.attDone));
  if (overdue) {
    const a = model!.acts.find(x => x.id === overdue.act);
    return (
      <View style={{ flex: 1, backgroundColor: t.bg, justifyContent: 'center' }}>
        <Empty icon="star" title="Rate your plan to carry on"
          text={`"${a?.desc ?? 'Your plan'}" has ended and we've sent three reminders. Marking who came keeps everyone's reliability record fair. It takes a minute.`}>
          <Btn title="Rate and record attendance" onPress={() => router.push({ pathname: '/rate/[id]', params: { id: overdue.act } })} />
        </Empty>
      </View>
    );
  }
  const icon = (name: React.ComponentProps<typeof Feather>['name']) =>
    function TabIcon({ color }: { color: import('react-native').ColorValue }) { return <Feather name={name} size={22} color={color as string} />; };
  return (
    <>
      <Tabs screenOptions={{
        headerShown: false,
        /* the middle column on tablets (lib/layout.ts); the tab bar stays full width */
        sceneStyle: { backgroundColor: t.bg, ...column },
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
      <MicroAsk />
      <TermsPrompt />
    </>
  );
}

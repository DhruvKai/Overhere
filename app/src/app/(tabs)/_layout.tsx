import Feather from '@expo/vector-icons/Feather';
import { router, Tabs } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MicroAsk } from '@/components/Feedback';
import { Avatar, Btn, Empty, Icon } from '@/components/ui';
import { TermsPrompt } from '@/components/TermsPrompt';
import { askedOf, FB_TICK, FB_TIME, fbOpen } from '@/lib/feedback';
import { column } from '@/lib/layout';
import { nowOf } from '@/lib/model';
import { useReminders } from '@/lib/reminders';
import { useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

/* Each start of the app counts as a visit, and decides whether the feedback card is due (fbOpen in lib/feedback.ts). */
let counted = false;

export default function TabLayout() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { model, saveAsked } = useStore();
  useEffect(() => {
    if (counted || !model) return;
    counted = true;
    const now = nowOf(model);
    saveAsked(a => fbOpen(model, a, now));
  }, [model, saveAsked]);
  /* Minutes of use while the app is on screen, saved once a minute until FB_TIME is reached. */
  const time = useRef(FB_TIME);
  useEffect(() => { time.current = model ? askedOf(model).fbTime || 0 : FB_TIME; }, [model]);
  useEffect(() => {
    const id = setInterval(() => {
      if (AppState.currentState !== 'active' || time.current >= FB_TIME) return;
      time.current += FB_TICK;
      saveAsked(a => ({ fbTime: Math.min(FB_TIME, (a.fbTime || 0) + FB_TICK) }));
    }, FB_TICK);
    return () => clearInterval(id);
  }, [saveAsked]);
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
        /* room for the tallest item (your photo), a little space under the items, and then a solid strip of its own
           behind the phone's ◀ ● ■ buttons, as in WhatsApp */
        tabBarStyle: { borderTopColor: t.line, height: 64 + insets.bottom + 6, paddingTop: 6, paddingBottom: insets.bottom + 6 },
        tabBarBackground: () => (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: t.card }} />
            <View style={{ height: insets.bottom, backgroundColor: t.dark ? '#0B0A08' : '#E9E2D3' }} />
          </View>
        ),
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
      }}>
        <Tabs.Screen name="index" options={{ title: 'Swipe', tabBarIcon: icon('layers') }} />
        <Tabs.Screen name="discover" options={{ title: 'Discover', tabBarIcon: icon('compass') }} />
        {/* Post sits in the middle: a round green + button that opens the post screen, not a tab */}
        <Tabs.Screen name="new" options={{
          title: 'Post',
          tabBarButton: () => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Pressable accessibilityRole="button" accessibilityLabel="Post a plan" onPress={() => router.push('/post')}
                style={({ pressed }) => ({ width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: t.acc,
                  opacity: pressed ? 0.85 : 1, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 4 })}>
                <Icon name="plus" size={26} color={t.onAcc} />
              </Pressable>
            </View>
          ),
        }} />
        <Tabs.Screen name="plans" options={{ title: 'My plans', tabBarIcon: icon('message-circle') }} />
        {/* your own photo, about the size of the other icons and labelled like them so the row lines up, ringed in green
            while you're on it */}
        <Tabs.Screen name="profile" options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => model ? (
            <View style={{ borderRadius: 99, padding: 1, borderWidth: 1.5, borderColor: focused ? t.acc : 'transparent' }}>
              <Avatar m={model} id={model.me} size={23} />
            </View>
          ) : icon('user')({ color: t.mute }),
        }} />
      </Tabs>
      <MicroAsk />
      <TermsPrompt />
    </>
  );
}

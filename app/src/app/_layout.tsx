import { DarkTheme, DefaultTheme, router, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Intro, introPending } from '@/components/Intro';
import { Btn, Empty, Icon, Loading } from '@/components/ui';
import { api } from '@/lib/api';
import { setInviteReady, takeInvite } from '@/lib/invite';
import { column, COLUMN, onTablet } from '@/lib/layout';
import { onPushTap, openFromPush, registerPush } from '@/lib/push';
import { StoreProvider, useStore } from '@/lib/store';
import { applyThemePref, useTheme } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();
/* WELCOME_FN: the address of the welcome-email Edge Function, asked to send "Welcome to Overhere" once sign-up is
   complete; false turns it off. On live it's "smart-service" (deployed from the dashboard, which picked that address);
   keep it the same as WELCOME_FN in web/app.js. */
const WELCOME_FN: string | false = 'smart-service';
/* Profile -> Appearance, if it isn't "System" */
applyThemePref();

/* Phones stay upright. Tablets turn with the device: iPad split screen needs every orientation, and Android 16
   ignores orientation locks on big screens anyway, so every screen has to work both ways there (lib/layout.ts).
   Loaded with require so a development build made before this module was added still starts; it just doesn't lock. */
if (!onTablet()) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const SO = require('expo-screen-orientation') as typeof import('expo-screen-orientation');
    SO.lockAsync(SO.OrientationLock.PORTRAIT_UP).catch(() => {});
  } catch { /* older build without the module */ }
}

/* Short messages over the tab bar. They go by themselves, and the cross (or a tap anywhere on it) closes one sooner. */
function Toast() {
  const { toastMsg, hideToast } = useStore();
  const t = useTheme(), insets = useSafeAreaInsets();
  if (!toastMsg) return null;
  return (
    <View pointerEvents="box-none" accessibilityLiveRegion="polite" style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 72, alignItems: 'center' }}>
      <Pressable onPress={hideToast} accessibilityHint="Tap to close"
        style={{ width: '100%', maxWidth: COLUMN - 32, backgroundColor: t.ink, borderRadius: 14, paddingVertical: 14, paddingLeft: 14, paddingRight: 6, flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
        <Text style={{ flex: 1, color: t.bg, fontSize: 15, fontWeight: '600' }}>{toastMsg}</Text>
        <Pressable onPress={hideToast} accessibilityRole="button" accessibilityLabel="Close message" hitSlop={10}
          style={{ width: 32, height: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={18} color={t.bg} />
        </Pressable>
      </Pressable>
    </View>
  );
}

function Gate() {
  const { ready, session, model, error, refresh, signOut } = useStore();
  const t = useTheme();
  const signedIn = !!session;
  const loading = signedIn && !model;
  const hasProfile = !!model?.profile;
  /* Sign-up stays open after "About you" for the photos, face check and extras, as on the website (obDone). */
  const onboarded = !!model?.profile?.onboarded;
  /* Phone sign-ups add and confirm an email before anything else (add-email.tsx). */
  const user = session?.user;
  const needEmail = signedIn && !!user?.phone_confirmed_at && !user?.email_confirmed_at;
  /* ...then choose a password (create-password.tsx). Email sign-ups chose theirs when signing up. */
  const needPw = signedIn && !needEmail && !!user?.phone_confirmed_at && user?.user_metadata?.pw_set !== true;
  const setUp = signedIn && !needEmail && !needPw;
  /* The welcome email, once per account and app start (the function itself makes sure it's sent only once). */
  const welcomed = useRef('');
  useEffect(() => {
    if (!WELCOME_FN || !setUp || !user?.email_confirmed_at || user.app_metadata?.welcomed_at || welcomed.current === user.id) return;
    welcomed.current = user.id;
    api.welcome(WELCOME_FN).catch(e => console.warn('welcome email', e));
  }, [setUp, user]);
  /* the startup animation (Intro.tsx) covers the app from the start and plays once the splash has really gone (a
     moment after hideAsync, which only asks for it to go) */
  const [intro, setIntro] = useState(introPending);
  const [splashGone, setSplashGone] = useState(false);
  const introDone = useCallback(() => setIntro(false), []);
  useEffect(() => {
    if (!ready || loading) return;
    SplashScreen.hideAsync().catch(() => {}).finally(() => setTimeout(() => setSplashGone(true), 250));
  }, [ready, loading]);
  /* Push: register this phone once the profile exists, and open whatever notification was tapped. */
  const pushOn = signedIn && hasProfile;
  useEffect(() => {
    if (!pushOn) return;
    registerPush();
    return onPushTap(openFromPush);
  }, [pushOn]);
  /* Invite links (lib/invite.ts): once signed in with a finished profile, open the plan from a link that was waiting. */
  const plansOpen = setUp && onboarded;
  useEffect(() => {
    setInviteReady(plansOpen);
    const id = plansOpen ? takeInvite() : null;
    if (id) setTimeout(() => router.push({ pathname: '/plan/[id]', params: { id } }), 0);
  }, [plansOpen]);
  if (!ready) return null;
  if (loading && !error) return <Loading />;
  if (loading) {
    return error ? (
      <View style={{ flex: 1, backgroundColor: t.bg, justifyContent: 'center' }}>
        <Empty icon="wifi-off" title="Can't load Overhere" text={error}>
          <Btn title="Try again" onPress={refresh} />
          <View style={{ height: 10 }} />
          <Btn title="Sign out" kind="ghost" onPress={signOut} />
        </Empty>
      </View>
    ) : <Loading />;
  }
  return (
    /* Screens sit in the middle column on tablets (lib/layout.ts). The tabs keep the full width so the tab bar
       spans the screen (their screens get the column in (tabs)/_layout.tsx), and sign-in so the welcome photos do. */
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg, ...column } }}>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="sign-in" options={{ contentStyle: { backgroundColor: t.bg } }} />
        </Stack.Protected>
        <Stack.Protected guard={needEmail}>
          <Stack.Screen name="add-email" />
        </Stack.Protected>
        <Stack.Protected guard={needPw}>
          <Stack.Screen name="create-password" />
        </Stack.Protected>
        <Stack.Protected guard={setUp && !onboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={setUp && hasProfile}>
          <Stack.Screen name="verify" options={{ presentation: 'modal', headerShown: true, title: 'Face check', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
        </Stack.Protected>
        <Stack.Protected guard={setUp && onboarded}>
          <Stack.Screen name="(tabs)" options={{ contentStyle: { backgroundColor: t.bg } }} />
          <Stack.Screen name="plan/[id]" options={{ headerShown: true, title: '', headerBackTitle: 'Back', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink, headerShadowVisible: false }} />
          <Stack.Screen name="rate/[id]" options={{ presentation: 'modal', headerShown: true, title: 'How did it go?', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
          <Stack.Screen name="person/[id]" options={{ headerShown: true, title: '', headerBackTitle: 'Back', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink, headerShadowVisible: false }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: true, title: 'Group chat', headerBackTitle: 'Back', headerStyle: { backgroundColor: t.card }, headerTintColor: t.ink }} />
          <Stack.Screen name="post" options={{ presentation: 'modal', headerShown: true, title: 'Post a plan', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
          <Stack.Screen name="sos" options={{ presentation: 'modal', headerShown: true, title: 'Get help', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
          <Stack.Screen name="edit-profile" options={{ presentation: 'modal', headerShown: true, title: 'Edit profile', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
          <Stack.Screen name="updates" options={{ headerShown: true, title: 'Updates', headerBackTitle: 'Back', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink, headerShadowVisible: false }} />
        <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings', headerBackTitle: 'Back', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink, headerShadowVisible: false }} />
        </Stack.Protected>
      </Stack>
      {intro ? <Intro go={splashGone} onDone={introDone} /> : null}
    </>
  );
}

export default function RootLayout() {
  const t = useTheme();
  /* The navigators' own colours (tab screens, headers) from the app's tokens. Without this they keep React
     Navigation's light grey background while the text follows the phone's dark mode, so it can't be read. */
  const base = t.dark ? DarkTheme : DefaultTheme;
  const nav = { ...base, colors: { ...base.colors, primary: t.acc, background: t.bg, card: t.card, text: t.ink, border: t.line, notification: t.bad } };
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: t.bg }}>
      <SafeAreaProvider>
        <ThemeProvider value={nav}>
          <StoreProvider>
            <StatusBar style={t.dark ? 'light' : 'dark'} />
            <Gate />
            <Toast />
          </StoreProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn, Empty, Loading } from '@/components/ui';
import { column, COLUMN, onTablet } from '@/lib/layout';
import { onPushTap, openFromPush, registerPush } from '@/lib/push';
import { StoreProvider, useStore } from '@/lib/store';
import { applyThemePref, useTheme } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();
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

function Toast() {
  const { toastMsg } = useStore();
  const t = useTheme(), insets = useSafeAreaInsets();
  if (!toastMsg) return null;
  return (
    <View pointerEvents="none" accessibilityLiveRegion="polite" style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 72, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: COLUMN - 32, backgroundColor: t.ink, borderRadius: 14, padding: 14 }}>
        <Text style={{ color: t.bg, fontSize: 15, fontWeight: '600' }}>{toastMsg}</Text>
      </View>
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
  useEffect(() => { if (ready && !loading) SplashScreen.hideAsync(); }, [ready, loading]);
  /* Push: register this phone once the profile exists, and open whatever notification was tapped. */
  const pushOn = signedIn && hasProfile;
  useEffect(() => {
    if (!pushOn) return;
    registerPush();
    return onPushTap(openFromPush);
  }, [pushOn]);
  if (!ready) return null;
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
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg, ...column } }}>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="sign-in" options={{ contentStyle: { backgroundColor: t.bg } }} />
      </Stack.Protected>
      <Stack.Protected guard={needEmail}>
        <Stack.Screen name="add-email" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && !needEmail && !onboarded}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && !needEmail && hasProfile}>
        <Stack.Screen name="verify" options={{ presentation: 'modal', headerShown: true, title: 'Face check', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && !needEmail && onboarded}>
        <Stack.Screen name="(tabs)" options={{ contentStyle: { backgroundColor: t.bg } }} />
        <Stack.Screen name="plan/[id]" options={{ headerShown: true, title: '', headerBackTitle: 'Back', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink, headerShadowVisible: false }} />
        <Stack.Screen name="rate/[id]" options={{ presentation: 'modal', headerShown: true, title: 'How did it go?', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
        <Stack.Screen name="person/[id]" options={{ headerShown: true, title: '', headerBackTitle: 'Back', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink, headerShadowVisible: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: true, title: 'Group chat', headerBackTitle: 'Back', headerStyle: { backgroundColor: t.card }, headerTintColor: t.ink }} />
        <Stack.Screen name="post" options={{ presentation: 'modal', headerShown: true, title: 'Post a plan', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
        <Stack.Screen name="sos" options={{ presentation: 'modal', headerShown: true, title: 'Get help', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal', headerShown: true, title: 'Edit profile', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
      </Stack.Protected>
    </Stack>
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

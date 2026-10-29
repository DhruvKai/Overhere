import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn, Empty, Loading } from '@/components/ui';
import { StoreProvider, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();

function Toast() {
  const { toastMsg } = useStore();
  const t = useTheme(), insets = useSafeAreaInsets();
  if (!toastMsg) return null;
  return (
    <View pointerEvents="none" accessibilityLiveRegion="polite"
      style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 72, backgroundColor: t.ink, borderRadius: 14, padding: 14 }}>
      <Text style={{ color: t.bg, fontSize: 15, fontWeight: '600' }}>{toastMsg}</Text>
    </View>
  );
}

function Gate() {
  const { ready, session, model, error, refresh, signOut } = useStore();
  const t = useTheme();
  const signedIn = !!session;
  const loading = signedIn && !model;
  useEffect(() => { if (ready && !loading) SplashScreen.hideAsync(); }, [ready, loading]);
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
  const hasProfile = !!model?.profile;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }}>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && !hasProfile}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && hasProfile}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="plan/[id]" options={{ headerShown: true, title: '', headerBackTitle: 'Back', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink, headerShadowVisible: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: true, title: 'Group chat', headerBackTitle: 'Back', headerStyle: { backgroundColor: t.card }, headerTintColor: t.ink }} />
        <Stack.Screen name="post" options={{ presentation: 'modal', headerShown: true, title: 'Post a plan', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
        <Stack.Screen name="verify" options={{ presentation: 'modal', headerShown: true, title: 'Face check', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal', headerShown: true, title: 'Edit profile', headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const t = useTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: t.bg }}>
      <SafeAreaProvider>
        <StoreProvider>
          <StatusBar style={t.dark ? 'light' : 'dark'} />
          <Gate />
          <Toast />
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

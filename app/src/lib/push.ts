import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { api } from './api';

/* Push notifications. The database sends every notification to the phones in push_tokens through Expo's push service
   (_push_note in web/schema-app.sql, switched on by app_config push). The app only registers this phone and opens
   the right screen when one is tapped. Expo Go can't receive push on Android, so all of this is skipped there. */
const inExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
let token: string | null = null;

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

/* Asks once (Android 13+ and iOS show the system prompt), then saves this phone's token for the signed-in person. */
export async function registerPush() {
  if (inExpoGo) return;
  try {
    if (Platform.OS === 'android') {
      // the prompt only appears once a channel exists; the database sends to 'default'
      await Notifications.setNotificationChannelAsync('default', { name: 'Updates', importance: AndroidImportance.HIGH });
    }
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') status = (await Notifications.requestPermissionsAsync()).status;
    if (status !== 'granted') return;
    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    await api.savePushToken(token, Platform.OS);
  } catch (e) {
    console.warn('Push registration failed', e);   // no Firebase file in this build, offline, ...: try again next launch
  }
}

/* Before signing out: this phone stops getting that person's notifications. */
export async function forgetPush() {
  if (!token) return;
  try { await api.forgetPushToken(token); } catch {}
  token = null;
}

/* Tapping a notification opens its plan, or its chat for a chat message (the same as tapping it in Updates). */
export function openFromPush(r: Notifications.NotificationResponse | null) {
  const d = r?.notification.request.content.data as { act?: string | null; chat?: boolean } | undefined;
  if (!d?.act) return;
  router.push({ pathname: d.chat ? '/chat/[id]' : '/plan/[id]', params: { id: d.act } });
}

export function onPushTap(fn: typeof openFromPush) {
  if (inExpoGo) return () => {};
  Notifications.getLastNotificationResponseAsync().then(fn, () => {});
  const sub = Notifications.addNotificationResponseReceivedListener(fn);
  return () => sub.remove();
}

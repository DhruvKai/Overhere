import * as Location from 'expo-location';
import { useEffect, useSyncExternalStore } from 'react';
import { AppState, Linking, Platform } from 'react-native';

/* Where the phone is right now, for Discover: the blue dot on the map and "how far" (the distance filter and sorting
   by distance). null while the phone's location is off, Overhere isn't allowed to use it, or no fix came in; then the
   map shows your home area from your profile with no dot, and the distance controls are off.
   Looking never asks: the permission prompt only comes from askHere(), when someone taps "Turn on location".
   It's checked again whenever the app comes back to the front, and on Android whenever the app gets focus back
   (closing the quick settings panel doesn't send the app to the background), so turning location on or off there
   shows up straight away. */
export type LL = [number, number];

let here: LL | null = null;
let checking: Promise<void> | null = null;
const subs = new Set<() => void>();
const set = (v: LL | null) => {
  if (v?.[0] === here?.[0] && v?.[1] === here?.[1]) return;
  here = v;
  subs.forEach(f => f());
};

/* how a read ended: ok, location switched off, not allowed for Overhere, or on and allowed but no position came in */
export type HereResult = 'ok' | 'off' | 'denied' | 'nofix';

async function read(ask: boolean): Promise<HereResult> {
  try {
    if (!(await Location.hasServicesEnabledAsync())) {
      if (!ask) { set(null); return 'off'; }
      /* Android can switch it on from a system dialog; iOS can't, so open Overhere's page in Settings */
      if (Platform.OS === 'android') { try { await Location.enableNetworkProviderAsync(); } catch { set(null); return 'off'; } }
      else { Linking.openSettings(); set(null); return 'off'; }
    }
    let p = await Location.getForegroundPermissionsAsync();
    if (p.status !== 'granted' && ask) {
      if (p.canAskAgain) p = await Location.requestForegroundPermissionsAsync();
      else { Linking.openSettings(); set(null); return 'denied'; }   // said "don't ask again": only Settings can change it
    }
    if (p.status !== 'granted') { set(null); return 'denied'; }
    /* a recent fix if the phone has one, else a fresh one, giving up after 15 seconds (as in PlacePicker) */
    const pos = await Location.getLastKnownPositionAsync({ maxAge: 120000 })
      || await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise<never>((_, no) => setTimeout(() => no(new Error('timeout')), 15000)),
      ]);
    set([pos.coords.latitude, pos.coords.longitude]);
    return 'ok';
  } catch { return 'nofix'; }   // no fresh fix (weak signal indoors): keep the last place we had, if any
}

const check = () => (checking ??= read(false).then(() => undefined).finally(() => { checking = null; }));
/* "Turn on location": asks for the permission (or opens the switch, or Settings) and then reads where you are */
export const askHere = () => read(true);

/* Where you are, kept up to date while the screen using it is open. */
export function useHere(): LL | null {
  useEffect(() => {
    check();
    const ls = [AppState.addEventListener('change', s => { if (s === 'active') check(); })];
    if (Platform.OS === 'android') ls.push(AppState.addEventListener('focus', check));
    return () => ls.forEach(x => x.remove());
  }, []);
  return useSyncExternalStore(f => { subs.add(f); return () => { subs.delete(f); }; }, () => here);
}

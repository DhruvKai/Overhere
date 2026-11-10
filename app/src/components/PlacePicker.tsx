import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { inIndia, placeHere, searchPlaces, type Place } from '@/lib/geo';
import { useTheme } from '@/lib/theme';
import { Field, Icon } from './ui';

/* A search box with OpenStreetMap suggestions. `picked` is set only when a suggestion is chosen,
   so the place always comes with its map position. `locate` adds a "use my location" button, as on the website:
   'home' keeps only the area, rounded to about 1 km, never the exact spot; 'spot' (a venue's area) pins where you are. */
export function PlacePicker({ label, mode, value, picked, near, onChange, onPick, placeholder, hint, locate }: {
  label: string; mode: 'area' | 'venue'; value: string; picked: boolean; near?: [number, number] | null;
  onChange: (text: string) => void; onPick: (p: Place) => void; placeholder?: string; hint?: string; locate?: 'home' | 'spot';
}) {
  const t = useTheme();
  const [hits, setHits] = useState<Place[] | null>([]);
  const [fail, setFail] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef('');
  const [finding, setFinding] = useState(false);
  const [locErr, setLocErr] = useState('');
  useEffect(() => () => clearTimeout(timer.current), []);

  async function useMine() {
    if (finding) return;
    setFinding(true); setLocErr('');
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') { setLocErr('Location is off for Overhere. Allow it in your phone settings, or search instead.'); return; }
      /* like the website (maximumAge 2 min, timeout 15 s): a recent fix if the phone has one, else a fresh one, and
         give up after 15 seconds rather than spin forever with weak GPS indoors */
      const pos = await Location.getLastKnownPositionAsync({ maxAge: 120000 })
        || await Promise.race([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
          new Promise<never>((_, no) => setTimeout(() => no(new Error('timeout')), 15000)),
        ]);
      const ll: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      if (!inIndia(ll)) { setLocErr('That location is outside India. Overhere is only in India for now.'); return; }
      const spot: [number, number] = locate === 'home' ? [Math.round(ll[0] * 100) / 100, Math.round(ll[1] * 100) / 100] : ll;
      const name = await placeHere(spot);
      latest.current = ''; clearTimeout(timer.current); setHits([]);
      onPick({ label: name, ll: spot, kind: 'Area', state: '' });
    } catch { setLocErr("Couldn't get your location. Search for the place instead."); }
    finally { setFinding(false); }
  }

  const type = (text: string) => {
    onChange(text);
    setLocErr('');
    clearTimeout(timer.current);
    const q = text.trim();
    latest.current = q;
    if (q.length < 2) { setHits([]); return; }
    setHits(null);
    timer.current = setTimeout(() => {
      searchPlaces(q, mode, near).then(
        l => { if (latest.current === q) { setHits(l); setFail(false); } },
        () => { if (latest.current === q) { setHits([]); setFail(true); } });
    }, 300);
  };

  return (
    <View>
      <Field label={label} value={value} onChangeText={type} placeholder={placeholder} autoCorrect={false}
        hint={picked ? '✓ ' + (hint || 'Picked from the list') : 'Type, then pick from the list'} />
      {locate ? (
        <Pressable accessibilityRole="button" onPress={useMine} disabled={finding}
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginTop: -6, marginBottom: 14, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 99, borderWidth: 1, borderColor: t.line, backgroundColor: pressed ? t.field : t.card })}>
          {finding ? <ActivityIndicator size="small" color={t.accink} /> : <Icon name="navigation" size={15} color={t.accink} />}
          <Text style={{ color: t.accink, fontWeight: '700', fontSize: 14 }}>{finding ? 'Finding where you are…' : locate === 'home' ? 'Use my current location' : "I'm there now: use my location"}</Text>
        </Pressable>
      ) : null}
      {locErr ? <Text style={{ color: t.bad, marginTop: -6, marginBottom: 10 }}>{locErr}</Text> : null}
      {hits === null ? <ActivityIndicator color={t.acc} style={{ marginTop: -6, marginBottom: 10 }} /> : null}
      {fail ? <Text style={{ color: t.bad, marginTop: -6, marginBottom: 10 }}>Place search isn&apos;t reachable right now. Try again in a moment.</Text> : null}
      {hits && hits.length > 0 ? (
        <View accessibilityRole="list" style={{ backgroundColor: t.card, borderColor: t.line, borderWidth: 1, borderRadius: 14, marginTop: -6, marginBottom: 14, overflow: 'hidden' }}>
          {hits.map((p, i) => (
            <Pressable key={p.label} accessibilityRole="button" onPress={() => { latest.current = ''; clearTimeout(timer.current); onPick(p); setHits([]); }}
              style={({ pressed }) => ({ padding: 12, borderTopWidth: i ? 1 : 0, borderColor: t.line, backgroundColor: pressed ? t.field : 'transparent' })}>
              <Text style={{ color: t.ink, fontSize: 15, fontWeight: '600' }}>{p.label}</Text>
              <Text style={{ color: t.mute, fontSize: 13 }}>{p.kind}{p.state ? ' · ' + p.state : ''}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { searchPlaces, type Place } from '@/lib/geo';
import { useTheme } from '@/lib/theme';
import { Field } from './ui';

/* A search box with OpenStreetMap suggestions. `picked` is set only when a suggestion is chosen,
   so the place always comes with its map position. */
export function PlacePicker({ label, mode, value, picked, near, onChange, onPick, placeholder, hint }: {
  label: string; mode: 'area' | 'venue'; value: string; picked: boolean; near?: [number, number] | null;
  onChange: (text: string) => void; onPick: (p: Place) => void; placeholder?: string; hint?: string;
}) {
  const t = useTheme();
  const [hits, setHits] = useState<Place[] | null>([]);
  const [fail, setFail] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef('');
  useEffect(() => () => clearTimeout(timer.current), []);

  const type = (text: string) => {
    onChange(text);
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

import { Text, View } from 'react-native';
import { Chip } from '@/components/ui';
import { INT_GROUPS, intCount, MIN_INTS } from '@/lib/model';
import { useTheme } from '@/lib/theme';

/* The interest chips in their groups, with a count that turns green at MIN_INTS (intOpts in web/app.js).
   Used in sign-up (onboarding.tsx) and Edit profile. */
export function InterestPicker({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const t = useTheme();
  const n = value.length, ok = n >= MIN_INTS;
  const flip = (v: string) => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  return (
    <View style={{ marginBottom: 12 }}>
      <Text accessibilityLiveRegion="polite" style={{ color: ok ? t.accink : t.mute, fontWeight: ok ? '700' : '400', fontSize: 13 }}>{intCount(n)}</Text>
      {INT_GROUPS.map(([group, items]) => (
        <View key={group}>
          <Text accessibilityRole="header" style={{ color: t.mute, fontWeight: '600', fontSize: 13, marginTop: 16, marginBottom: 8 }}>{group}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {items.map(([label]) => <Chip key={label} label={label} on={value.includes(label)} onPress={() => flip(label)} />)}
          </View>
        </View>
      ))}
    </View>
  );
}

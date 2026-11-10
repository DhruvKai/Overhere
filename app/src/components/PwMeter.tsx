import { Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { PW_RULES, pwHint, pwScore } from '@/lib/password';
import { useTheme } from '@/lib/theme';

/* The strength meter under a new-password field, the same as pwMeter / pwLive in web/app.js: a four-part bar and a
   label (Too short, Too common, Weak, Fair, Good, Strong), a tip naming what gives the password away, and the checklist. */
export default function PwMeter({ pw, email = '' }: { pw: string; email?: string }) {
  const t = useTheme();
  const r = pwScore(pw, email);
  const s = !pw ? 0 : pw.length < 8 ? 1 : Math.max(r.s, 1);
  const label = !pw ? '' : pw.length < 8 ? 'Too short' : r.s === 0 ? 'Too common' : ['', 'Weak', 'Fair', 'Good', 'Strong'][r.s];
  const tone = [
    { c: t.line, ink: t.mute, bg: 'transparent' },
    { c: t.bad, ink: t.bad, bg: t.badbg },
    { c: t.warn, ink: t.warn, bg: t.warnbg },
    { c: t.acc, ink: t.accink, bg: t.acc2 },
    { c: t.ok, ink: t.ok, bg: t.okbg },
  ][s];
  const tip = !pw || pw.length < 8 || r.s === 3 ? '' : r.s === 4 ? "Nice, that's hard to guess" : pwHint(r);

  return (
    <View style={{ marginTop: -4, marginBottom: 14, backgroundColor: t.card, borderColor: t.line, borderWidth: 1, borderRadius: 14, paddingHorizontal: 13, paddingTop: 11, paddingBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 22 }}>
        <Text style={{ color: t.ink2, fontSize: 13, fontWeight: '600' }}>Password strength</Text>
        {label ? (
          <Text accessibilityLiveRegion="polite" style={{ color: tone.ink, backgroundColor: tone.bg, fontSize: 12, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, overflow: 'hidden' }}>{label}</Text>
        ) : null}
      </View>
      <View accessible accessibilityLabel={label ? `Password strength: ${label}` : 'Password strength'} style={{ flexDirection: 'row', gap: 5, marginTop: 8 }}>
        {[1, 2, 3, 4].map(k => <View key={k} style={{ flex: 1, height: 6, borderRadius: 99, backgroundColor: k <= s ? tone.c : t.line }} />)}
      </View>
      {tip ? (
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 9, alignItems: 'flex-start' }}>
          <Icon name={r.s === 4 ? 'shield' : 'info'} size={14} color={r.s === 4 ? t.ok : t.ink2} />
          <Text accessibilityLiveRegion="polite" style={{ flex: 1, color: r.s === 4 ? t.ok : t.ink2, fontSize: 13, lineHeight: 18 }}>{tip}</Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 6, marginTop: 10 }}>
        {PW_RULES.map(([text, ok]) => {
          const y = ok(pw);
          return (
            <View key={text} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} accessible accessibilityLabel={`${text}: ${y ? 'done' : 'not yet'}`}>
              <View style={{ width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: y ? t.ok : 'transparent', borderWidth: y ? 0 : 1.5, borderColor: t.line }}>
                {y ? <Icon name="check" size={10} color={t.card} /> : null}
              </View>
              <Text style={{ color: y ? t.ink : t.mute, fontSize: 13 }}>{text}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

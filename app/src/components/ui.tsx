import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { CATS, defEmo, type Model, type Plan, placeLine, spotTxt, whenStr, kmAway } from '@/lib/model';
import { photoOf } from '@/lib/photos';
import { R, useTheme } from '@/lib/theme';
import type { Cat } from '@/lib/types';

export type IconName = ComponentProps<typeof Feather>['name'];
export const Icon = ({ name, size = 16, color }: { name: IconName; size?: number; color?: string }) => {
  const t = useTheme();
  return <Feather name={name} size={size} color={color ?? t.ink} />;
};

export function Btn({ title, onPress, kind = 'primary', icon, busy, disabled, style }: {
  title: string; onPress: () => void; kind?: 'primary' | 'ghost' | 'danger' | 'soft'; icon?: IconName; busy?: boolean; disabled?: boolean; style?: ViewStyle;
}) {
  const t = useTheme();
  const bg = kind === 'primary' ? t.acc : kind === 'danger' ? t.badbg : kind === 'soft' ? t.acc2 : 'transparent';
  const fg = kind === 'primary' ? t.onAcc : kind === 'danger' ? t.bad : kind === 'soft' ? t.accink : t.ink;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} disabled={disabled || busy}
      style={({ pressed }) => [s.btn, { backgroundColor: bg, borderColor: kind === 'ghost' ? t.line : bg, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }, style]}>
      {busy ? <ActivityIndicator color={fg} /> : (<>{icon ? <Feather name={icon} size={17} color={fg} /> : null}<Text style={[s.btnT, { color: fg }]}>{title}</Text></>)}
    </Pressable>
  );
}

/* Text fields are 16px or more (web/AGENTS.md: iOS zooms smaller ones, and they're hard to read). */
export function Field({ label, hint, error, ...p }: TextInputProps & { label?: string; hint?: string; error?: string }) {
  const t = useTheme();
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={[s.label, { color: t.ink }]}>{label}</Text> : null}
      <TextInput placeholderTextColor={t.ph} {...p}
        style={[s.input, { backgroundColor: t.field, color: t.ink, borderColor: error ? t.bad : 'transparent' }, p.multiline && { minHeight: 90, textAlignVertical: 'top' }, p.style]} />
      {error ? <Text style={[s.small, { color: t.bad, marginTop: 4 }]}>{error}</Text> : hint ? <Text style={[s.small, { color: t.mute, marginTop: 4 }]}>{hint}</Text> : null}
    </View>
  );
}

export function Chip({ label, on, onPress, icon }: { label: string; on?: boolean; onPress?: () => void; icon?: IconName }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!on }} onPress={onPress}
      style={[s.chip, { backgroundColor: on ? t.acc2 : t.chip, borderColor: on ? t.acc : t.line }]}>
      {icon ? <Feather name={icon} size={13} color={on ? t.accink : t.ink2} /> : null}
      <Text style={[s.chipT, { color: on ? t.accink : t.ink2 }]}>{label}</Text>
    </Pressable>
  );
}

/* A form label, and a wrapping row of chips under it. */
export function Label({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14, marginBottom: 8 }}>{children}</Text>;
}
export function Wrap({ children, gap = 8 }: { children: ReactNode; gap?: number }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap, marginBottom: 16 }}>{children}</View>;
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const t = useTheme();
  return <View style={[s.card, { backgroundColor: t.card, borderColor: t.line }, style]}>{children}</View>;
}

export function H({ children, size = 22 }: { children: ReactNode; size?: number }) {
  const t = useTheme();
  return <Text style={{ fontSize: size, fontWeight: '800', color: t.ink, letterSpacing: -0.3 }}>{children}</Text>;
}
export function P({ children, mute, small, style }: { children: ReactNode; mute?: boolean; small?: boolean; style?: object }) {
  const t = useTheme();
  return <Text style={[{ fontSize: small ? 13 : 15, lineHeight: small ? 18 : 21, color: mute ? t.mute : t.ink2 }, style]}>{children}</Text>;
}

export function Empty({ icon, title, text, children }: { icon: IconName; title: string; text: string; children?: ReactNode }) {
  const t = useTheme();
  return (
    <View style={s.empty}>
      <View style={[s.emptyIc, { backgroundColor: t.acc2 }]}><Feather name={icon} size={26} color={t.accink} /></View>
      <H size={18}>{title}</H>
      <P mute style={{ textAlign: 'center', marginTop: 6, marginBottom: 14 }}>{text}</P>
      {children}
    </View>
  );
}

export function Loading() {
  const t = useTheme();
  return <View style={[s.center, { backgroundColor: t.bg }]}><ActivityIndicator color={t.acc} size="large" /></View>;
}

const PASTEL = ['#E3EFDB', '#E9E4FB', '#D9F2E6', '#FBE3EE', '#DDEEFB', '#FBF0D2'];
export function Avatar({ m, id, size = 36 }: { m: Model; id: string; size?: number }) {
  const p = id === m.me ? m.profile : m.people[id];
  const name = p?.name || '?';
  let h = 0;
  for (const c of name) h += c.charCodeAt(0);
  const emo = (p?.emo as string) || defEmo(p?.gender || '');
  return (
    <View accessibilityLabel={name} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: PASTEL[h % PASTEL.length], alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.55 }}>{emo}</Text>
    </View>
  );
}

export function CatPill({ cat, tint }: { cat: Cat; tint?: boolean }) {
  const t = useTheme(), c = CATS[cat];
  const fg = t.dark ? c.fgDark : c.fg;
  return (
    <View style={[s.cat, tint && { backgroundColor: t.dark ? c.bgDark : c.bg }]}>
      <Feather name={c.icon} size={12} color={fg} />
      <Text style={{ color: fg, fontSize: 12, fontWeight: '700' }}>{c.label}</Text>
    </View>
  );
}

export function Meta({ icon, text }: { icon: IconName; text: string }) {
  const t = useTheme();
  return (
    <View style={s.meta}>
      <Feather name={icon} size={13} color={t.mute} />
      <Text style={{ color: t.mute, fontSize: 13, flexShrink: 1 }} numberOfLines={1}>{text}</Text>
    </View>
  );
}

/* A plan in a list: photo, category, title, when and where. */
export function PlanRow({ m, a, onPress, right }: { m: Model; a: Plan; onPress: () => void; right?: ReactNode }) {
  const t = useTheme();
  const km = kmAway(m, a);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={a.desc} onPress={onPress}
      style={({ pressed }) => [s.row, { backgroundColor: t.card, borderColor: t.line, opacity: pressed ? 0.85 : 1 }]}>
      <Image source={photoOf(a)} style={s.thumb} contentFit="cover" transition={150} />
      <View style={{ flex: 1, gap: 3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><CatPill cat={a.cat} /><Text style={{ color: t.mute, fontSize: 12 }}>{spotTxt(a)}</Text></View>
        <Text style={{ color: t.ink, fontSize: 15, fontWeight: '700' }} numberOfLines={2}>{a.desc}</Text>
        <Meta icon="calendar" text={whenStr(a.when)} />
        <Meta icon="map-pin" text={placeLine(a) + (km != null ? ` · ${km.toFixed(1)} km` : '')} />
      </View>
      {right}
    </Pressable>
  );
}

export function Badge({ text, tone = 'info' }: { text: string; tone?: 'ok' | 'bad' | 'warn' | 'info' | 'acc' }) {
  const t = useTheme();
  const [bg, fg] = tone === 'ok' ? [t.okbg, t.ok] : tone === 'bad' ? [t.badbg, t.bad] : tone === 'warn' ? [t.warnbg, t.warn] : tone === 'acc' ? [t.acc2, t.accink] : [t.infobg, t.info];
  return <View style={{ backgroundColor: bg, borderRadius: 99, paddingHorizontal: 9, paddingVertical: 3 }}><Text style={{ color: fg, fontSize: 12, fontWeight: '700' }}>{text}</Text></View>;
}

const s = StyleSheet.create({
  btn: { minHeight: 48, borderRadius: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1 },
  btnT: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  input: { fontSize: 16, minHeight: 48, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1.5 },
  small: { fontSize: 13 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 99, paddingHorizontal: 14, minHeight: 38, justifyContent: 'center' },
  chipT: { fontSize: 14, fontWeight: '600' },
  card: { borderRadius: R, borderWidth: 1, padding: 16 },
  empty: { alignItems: 'center', padding: 32, paddingTop: 60 },
  emptyIc: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cat: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  row: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: R, borderWidth: 1, alignItems: 'center' },
  thumb: { width: 84, height: 84, borderRadius: 14 },
});

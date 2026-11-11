import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputInstance, type TextInputProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATS, defEmo, type Model, type Plan, placeLine, spotTxt, whenStr, kmAway } from '@/lib/model';
import { avatarUrl } from '@/lib/avatar';
import { photoOf } from '@/lib/photos';
import { R, useTheme } from '@/lib/theme';
import type { Cat } from '@/lib/types';

export type IconName = ComponentProps<typeof Feather>['name'];
export const Icon = ({ name, size = 16, color }: { name: IconName; size?: number; color?: string }) => {
  const t = useTheme();
  return <Feather name={name} size={size} color={color ?? t.ink} />;
};

export function Btn({ title, onPress, kind = 'primary', icon, busy, disabled, style }: {
  /* alarm: solid red with white text, for getting help (SOS, call 112) */
  title: string; onPress: () => void; kind?: 'primary' | 'ghost' | 'danger' | 'alarm' | 'soft'; icon?: IconName; busy?: boolean; disabled?: boolean; style?: ViewStyle;
}) {
  const t = useTheme();
  const bg = kind === 'primary' ? t.acc : kind === 'danger' ? t.badbg : kind === 'alarm' ? '#B91C1C' : kind === 'soft' ? t.acc2 : 'transparent';
  const fg = kind === 'primary' ? t.onAcc : kind === 'danger' ? t.bad : kind === 'alarm' ? '#FFFFFF' : kind === 'soft' ? t.accink : t.ink;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} disabled={disabled || busy}
      style={({ pressed }) => [s.btn, { backgroundColor: bg, borderColor: kind === 'ghost' ? t.line : bg, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }, style]}>
      {busy ? <ActivityIndicator color={fg} /> : (<>{icon ? <Feather name={icon} size={17} color={fg} /> : null}<Text style={[s.btnT, { color: fg }]}>{title}</Text></>)}
    </Pressable>
  );
}

/* The Overhere logo: two white dots with a green ring, and the name (as on the welcome pages).
   light: white dots and name, for photos (the welcome pages). */
export function Logo({ size = 22, light }: { size?: number; light?: boolean }) {
  const t = useTheme();
  const d = Math.round(size * 0.66);
  const shadow = light ? { textShadowColor: 'rgba(0,0,0,0.55)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 } : null;
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="Overhere" style={{ flexDirection: 'row', alignItems: 'center', gap: Math.round(size * 0.4) }}>
      <View style={{ flexDirection: 'row', gap: 3 }}>
        {[0, 1].map(k => <View key={k} style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: '#fff', borderWidth: d * 0.25, borderColor: t.acc }} />)}
      </View>
      <Text style={[{ color: light ? '#fff' : t.ink, fontSize: size, fontWeight: '800', letterSpacing: -0.4 }, shadow]}>Overhere</Text>
    </View>
  );
}

/* A tappable bit of green text, on its own (block) or inside a sentence (inline). */
export function TextLink({ title, onPress, inline, style }: { title: string; onPress: () => void; inline?: boolean; style?: object }) {
  const t = useTheme();
  const text = <Text accessibilityRole="link" onPress={inline ? onPress : undefined} style={[{ color: t.accink, fontWeight: '700', fontSize: inline ? undefined : 15 }, style]}>{title}</Text>;
  if (inline) return text;
  return <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8} style={{ minHeight: 40, justifyContent: 'center' }}>{text}</Pressable>;
}

/* The main action of a screen, kept at the bottom above the keyboard and the home bar, so it never scrolls away and
   short screens don't end in empty space under a button. */
export function BottomBar({ children }: { children: ReactNode }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: Math.max(insets.bottom, 12), gap: 8, backgroundColor: t.bg, borderTopWidth: 1, borderTopColor: t.line }}>
      {children}
    </View>
  );
}

/* A number with − and + either side (how long a plan takes, how many can join). */
export function Stepper({ value, label, min, max, onChange, unit }: { value: number; label: string; min: number; max: number; onChange: (n: number) => void; unit: (n: number) => string }) {
  const t = useTheme();
  const btn = (icon: 'minus' | 'plus', to: number, off: boolean) => (
    <Pressable accessibilityRole="button" accessibilityLabel={`${icon === 'minus' ? 'Less' : 'More'}: ${label}`} disabled={off} onPress={() => onChange(to)} hitSlop={6}
      style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: t.line, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', opacity: off ? 0.4 : 1 }}>
      <Feather name={icon} size={18} color={t.ink} />
    </Pressable>
  );
  return (
    <View accessible accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ text: unit(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={e => onChange(Math.min(max, Math.max(min, value + (e.nativeEvent.actionName === 'increment' ? 1 : -1))))}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 }}>
      {btn('minus', Math.max(min, value - 1), value <= min)}
      <Text style={{ minWidth: 76, textAlign: 'center', color: t.ink, fontSize: 17, fontWeight: '700' }}>{unit(value)}</Text>
      {btn('plus', Math.min(max, value + 1), value >= max)}
    </View>
  );
}

/* Text fields are 16px or more (web/AGENTS.md: iOS zooms smaller ones, and they're hard to read). */
/* error: red line with a warning icon, and a red border. ok: a green line with a tick ("Passwords match").
   right: something inside the box on the right (the show/hide button). below: more under the message line. */
export function Field({ label, hint, error, ok, right, below, ...p }: TextInputProps & { label?: string; hint?: string; error?: string; ok?: string; right?: ReactNode; below?: ReactNode }) {
  const t = useTheme();
  const msg = error ? { text: error, color: t.bad, icon: 'alert-triangle' as const } : ok ? { text: ok, color: t.ok, icon: 'check-circle' as const } : null;
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={[s.label, { color: t.ink }]}>{label}</Text> : null}
      <View>
        <TextInput placeholderTextColor={t.ph} accessibilityLabel={label} {...p}
          style={[s.input, { backgroundColor: t.field, color: t.ink, borderColor: error ? t.bad : 'transparent' }, right ? { paddingRight: 52 } : null, p.multiline && { minHeight: 90, textAlignVertical: 'top' }, p.style]} />
        {right ? <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, justifyContent: 'center' }}>{right}</View> : null}
      </View>
      {msg ? (
        <View accessibilityLiveRegion="polite" style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
          <Feather name={msg.icon} size={14} color={msg.color} />
          <Text style={[s.small, { color: msg.color, flex: 1 }]}>{msg.text}</Text>
        </View>
      ) : hint ? <Text style={[s.small, { color: t.mute, marginTop: 4 }]}>{hint}</Text> : null}
      {below}
    </View>
  );
}

/* A 6-digit code as six boxes, like the website's .otp: one invisible text box on top takes the typing, pasting and
   the SMS autofill, and the boxes show the digits, with the next one to fill outlined. onDone runs on the 6th digit. */
export function CodeBoxes({ value, onChange, onDone, label, error, sms }: { value: string; onChange: (v: string) => void; onDone?: (v: string) => void; label: string; error?: boolean; sms?: boolean }) {
  const t = useTheme();
  const box = useRef<TextInputInstance>(null);
  const [focus, setFocus] = useState(true);
  return (
    <Pressable onPress={() => box.current?.focus()} accessible={false} style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {Array.from({ length: 6 }, (_, i) => {
          const on = focus && (i === value.length || (i === 5 && value.length === 6));
          return (
            <View key={i} style={{ flex: 1, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5,
              backgroundColor: on ? t.card : t.field, borderColor: error ? t.bad : on ? t.acc : 'transparent' }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: t.ink }}>{value[i] ?? ''}</Text>
            </View>
          );
        })}
      </View>
      <TextInput ref={box} value={value} autoFocus keyboardType="number-pad" maxLength={6} accessibilityLabel={label}
        textContentType="oneTimeCode" autoComplete={sms ? 'sms-otp' : 'one-time-code'} caretHidden contextMenuHidden={false}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onChangeText={v => { const c = v.replace(/\D/g, '').slice(0, 6); onChange(c); if (c.length === 6) onDone?.(c); }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0.011, color: 'transparent', fontSize: 16 }} />
    </Pressable>
  );
}

/* A password box with a show/hide button, like pwField in web/app.js. */
export function PwField(p: Omit<ComponentProps<typeof Field>, 'secureTextEntry' | 'right'>) {
  const t = useTheme();
  const [show, setShow] = useState(false);
  return (
    <Field autoCapitalize="none" autoCorrect={false} spellCheck={false} maxLength={72} {...p} secureTextEntry={!show}
      right={
        <Pressable onPress={() => setShow(v => !v)} hitSlop={6} accessibilityRole="button" accessibilityLabel={show ? 'Hide password' : 'Show password'}
          accessibilityState={{ selected: show }} style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name={show ? 'eye-off' : 'eye'} size={19} color={t.mute} />
        </Pressable>
      } />
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

/* A tick box with its words beside it (the label can hold bold parts or a link). */
export function Check({ on, onPress, children }: { on: boolean; onPress: () => void; children: ReactNode }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={onPress} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 6 }}>
      <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: on ? t.acc : t.line, backgroundColor: on ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
        {on ? <Feather name="check" size={15} color={t.onAcc} /> : null}
      </View>
      <View style={{ flex: 1 }}>{typeof children === 'string' ? <Text style={{ fontSize: 14, lineHeight: 20, color: t.ink2 }}>{children}</Text> : children}</View>
    </Pressable>
  );
}

/* A yellow (or blue) box for something to watch out for. */
export function Note({ icon = 'alert-triangle', tone = 'warn', style, children }: { icon?: IconName; tone?: 'warn' | 'info'; style?: ViewStyle; children: ReactNode }) {
  const t = useTheme();
  const [bg, fg] = tone === 'info' ? [t.infobg, t.info] : [t.warnbg, t.warn];
  return (
    <View style={[{ flexDirection: 'row', gap: 10, backgroundColor: bg, borderRadius: 14, padding: 12, marginBottom: 14 }, style]}>
      <Feather name={icon} size={16} color={fg} style={{ marginTop: 2 }} />
      <Text style={{ flex: 1, color: fg, fontSize: 14, lineHeight: 20 }}>{children}</Text>
    </View>
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
  /* your own photo comes from the profile row (a path), other people's already as a link (toModel) */
  const photo = id === m.me ? avatarUrl(m.profile?.photo) : (p as { photo?: string } | undefined)?.photo;
  if (photo) return <Image accessibilityLabel={name} source={{ uri: photo }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: PASTEL[h % PASTEL.length] }} contentFit="cover" transition={150} />;
  return (
    <View accessibilityLabel={name} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: PASTEL[h % PASTEL.length], alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.55 }}>{emo}</Text>
    </View>
  );
}

/* light: the pill sits on a fixed white background (the swipe card's photo), so it keeps the light colours in dark mode */
export function CatPill({ cat, tint, light }: { cat: Cat; tint?: boolean; light?: boolean }) {
  const t = useTheme(), c = CATS[cat];
  const fg = t.dark && !light ? c.fgDark : c.fg;
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

/* Save for later (Discover plans only, see canSave). */
export function SaveToggle({ on, onPress }: { on: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={on ? 'Saved. Tap to remove' : 'Save for later'} hitSlop={10} onPress={onPress}
      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: on ? t.acc2 : t.field, alignItems: 'center', justifyContent: 'center' }}>
      <Feather name="bookmark" size={18} color={on ? t.accink : t.mute} />
    </Pressable>
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

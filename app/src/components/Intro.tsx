import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { Easing, makeMutable, runOnJS, useAnimatedStyle, useReducedMotion, withTiming, type SharedValue } from 'react-native-reanimated';
import { useTheme } from '@/lib/theme';

/* The startup animation (storyboard approved 13 Nov 2026, video "v4" with the turn 5% quicker than v3).
   The phone's own splash is a plain background (app.json), so this starts from exactly what it shows:
     0.15-0.75   the two logo dots come in from the left and right edges and meet in the middle
     0.75-1.415  they turn once, flat, around the point between them
     1.375-1.755 one quick green ripple
     1.515-2.215 zoom in on the point where they touch: the dots fly past and fade
     1.865-2.465 the cover fades and the app is there (Welcome then turns its logo and brings its text in)
   Every move is eased in and out. It runs on the UI thread from one clock, so it stays smooth while the app loads
   underneath. Shown on the first open of the day, never with Reduce motion on. */
/* the clock runs on past the cover (gone at 2.465 s, and it never blocks taps) until Welcome's logo and last
   button are in (3.19 s), so they never stop halfway */
const END = 3.25;
const DAY_KEY = 'overhere_intro_day';
const today = () => new Date().toDateString();
function introDue() {
  try { return localStorage.getItem(DAY_KEY) !== today(); } catch { return true; }
}
/* Decided once when the app starts, so the root layout and Welcome agree on it. */
let pending = introDue();
export const introPending = () => pending;
/* The one clock (seconds) everything runs from, Welcome's logo turn and rising text included, so they stay in step
   with the cover however long the phone takes to start. It waits at 0 until the phone's splash has gone. */
export const introClock = makeMutable(0);

const D = 44, R = 26, RING = 10;
export function seg(t: number, a: number, b: number) { 'worklet'; return Math.max(0, Math.min(1, (t - a) / (b - a))); }
export function ioC(k: number) { 'worklet'; return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
function ioQ(k: number) { 'worklet'; return k < 0.5 ? 16 * k * k * k * k * k : 1 - Math.pow(-2 * k + 2, 5) / 2; }
function oC(k: number) { 'worklet'; return 1 - Math.pow(1 - k, 3); }

function Dot({ t, side, from }: { t: SharedValue<number>; side: -1 | 1; from: number }) {
  const style = useAnimatedStyle(() => {
    const k = ioQ(seg(t.value, 0.15, 0.75));
    const r = from + (R - from) * k;
    const a = ioC(seg(t.value, 0.75, 1.415)) * Math.PI * 2;
    return { transform: [{ translateX: side * r * Math.cos(a) }, { translateY: side * r * Math.sin(a) }] };
  });
  return <Animated.View style={[s.dot, style]} />;
}

/* go: the phone's splash has gone (until then the cover just sits there, the same colour as the splash) */
export function Intro({ go, onDone }: { go: boolean; onDone: () => void }) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const reduce = useReducedMotion();
  const clock = introClock;

  useEffect(() => {
    if (!go) return;
    try { localStorage.setItem(DAY_KEY, today()); } catch {}
    const done = () => { pending = false; onDone(); };
    if (reduce) { done(); return; }
    clock.value = withTiming(END, { duration: END * 1000, easing: Easing.linear }, fin => { if (fin) runOnJS(done)(); });
  }, [go, clock, onDone, reduce]);

  const cover = useAnimatedStyle(() => ({ opacity: 1 - ioC(seg(clock.value, 1.865, 2.465)) }));
  const zoom = useAnimatedStyle(() => ({
    opacity: 1 - ioC(seg(clock.value, 1.865, 2.215)),
    transform: [{ scale: Math.pow(46, Math.pow(seg(clock.value, 1.515, 2.215), 3)) }],
  }));
  const ripple = useAnimatedStyle(() => {
    const q = seg(clock.value, 1.375, 1.755), e = oC(q);
    return { opacity: q > 0 && q < 1 ? 0.55 * (1 - e) : 0, transform: [{ scale: 1 + 1.8 * e }] };
  });

  if (reduce) return null;
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: t.bg }, cover]}
      accessible accessibilityLabel="Overhere">
      <Animated.View style={[s.center, zoom]}>
        <Animated.View style={[s.ripple, { borderColor: t.acc }, ripple]} />
        <Dot t={clock} side={-1} from={width / 2 + D} />
        <Dot t={clock} side={1} from={width / 2 + D} />
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  center: { position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 },
  dot: { position: 'absolute', left: -D / 2, top: -D / 2, width: D, height: D, borderRadius: D / 2, backgroundColor: '#1A1A1A', borderWidth: RING, borderColor: '#3F7D4E' },
  ripple: { position: 'absolute', left: -75, top: -42, width: 150, height: 84, borderRadius: 50, borderWidth: 3 },
});

/* For Welcome under the cover: part i of its text and buttons rises in (2.45 s on, one after another), and the logo
   fades in turning once (2.2 s), then its name slides out (2.55 s), as in the video. */
export function useIntroRise(i: number, on: boolean) {
  return useAnimatedStyle(() => {
    if (!on) return { opacity: 1, transform: [{ translateY: 0 }] };
    const v = ioC(seg(introClock.value, 2.45 + i * 0.06, 2.95 + i * 0.06));
    return { opacity: v, transform: [{ translateY: (1 - v) * 22 }] };
  });
}
export function introLogo(t: number) {
  'worklet';
  return { show: seg(t, 2.2, 2.35), turn: ioC(seg(t, 2.2, 2.8175)), name: ioC(seg(t, 2.55, 2.95)) };
}

import { usePreventRemove } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { StyleSheet, useWindowDimensions, View, type LayoutChangeEvent, type ViewInstance } from 'react-native';
import Animated, { defineAnimation, useAnimatedStyle, useReducedMotion, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { COLUMN } from '@/lib/layout';
import { useTheme } from '@/lib/theme';

/* A plan card grows into its plan page, and the page shrinks back into the card.

   The plan page opens as a see-through screen over the list (presentation transparentModal, no slide: the `grow`
   route param, see app/_layout.tsx), so the list stays drawn under it. The page itself, already drawn in full with
   its photo and text, starts as a window the size and place of the card and grows to fill the screen while the list
   behind it dims. Going back runs the other way, into wherever the card is now, and the page closes once it's gone.

   Only transforms, opacity and corner radii move (Reanimated sends those straight to the screen, see
   ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS in package.json), never a width or height, which would have to wait for
   React. Off with Reduce motion: the page then opens and closes as before.

   Two things keep it from jumping:
   - It starts only once the page's photo is on screen (useGrowPhoto). The photo isn't always decoded in time (after
     visiting another tab, say), and the page then grew as an empty panel with the photo popping in at the end.
   - It moves on by at most MAX_STEP of time per frame drawn (withSteps), instead of following the clock. A slow
     frame (the new page's first frames are heavy) then makes it a few milliseconds longer, where a clock-driven
     animation skipped that part, so the start of the grow was never seen. */

type Box = { x: number; y: number; w: number; h: number };
type Origin = { box: Box; radius: number; ref: RefObject<ViewInstance | null> };
type Grow = {
  /* grow the page for plan id out of this card; go(true): open the page as a grown one (planHref(id, true)) */
  open: (card: RefObject<ViewInstance | null>, o: { id: string; radius: number }, go: (grown: boolean) => void) => void;
  origin: (id: string) => Origin | undefined;
  /* where that card is now, or null if it's gone (scrolled away, or the plan left the list) */
  where: (id: string) => Promise<Box | null>;
};

/* the plan page's photo is 280 high plus the status bar (app/plan/[id].tsx) */
export const PLAN_PHOTO = 280;
const OPEN_MS = 380, CLOSE_MS = 360;
/* Opening: the page fades in over the card in the first moments, while it's moving fastest, so the change from card
   to page is hidden by the movement. Closing: it fades out into the card over the second half, while it's still
   shrinking, so it melts into the card as it lands. Fading only once it had stopped showed a small copy of the page
   sitting on the card and then a jump to the card. */
const FADE_IN_MS = 90, FADE_OUT_FROM = 0.42, FADE_OUT_TO = 0.92;
/* the most time one frame moves it on: two frames at 60 Hz */
const MAX_STEP = 34;
/* how long the open waits for the page's photo before going without it */
const PHOTO_WAIT = 300;

/* CSS cubic-bezier(x1, y1, x2, y2) at x (found by halving, so it's exact enough for any curve) */
function bezier(x1: number, y1: number, x2: number, y2: number, x: number) {
  'worklet';
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const at = (a: number, b: number, t: number) => 3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t;
  let lo = 0, hi = 1, t = x;
  for (let i = 0; i < 20; i++) {
    t = (lo + hi) / 2;
    if (at(x1, x2, t) < x) lo = t; else hi = t;
  }
  return at(y1, y2, t);
}
/* opening: quick to start, slow to settle. Closing: gentle at both ends, so it doesn't drop away from under the finger
   and lands softly on the card */
const openEase = (x: number) => { 'worklet'; return bezier(0.2, 0, 0, 1, x); };
const closeEase = (x: number) => { 'worklet'; return bezier(0.4, 0, 0.2, 1, x); };

/* Moves a value in a straight line to toValue (0 or 1) over ms, like withTiming with a linear curve, except that one
   frame never moves it on by more than MAX_STEP of time, however long that frame took. */
type Steps = {
  onFrame: (a: Steps, now: number) => boolean; onStart: (a: Steps, value: number, now: number) => void;
  current: number; toValue: number; last: number; callback?: (finished?: boolean) => void;
};
function withSteps(toValue: number, ms: number, callback?: (finished?: boolean) => void): number {
  'worklet';
  return defineAnimation<Steps>(toValue as unknown as Steps, () => {
    'worklet';
    const onFrame = (a: Steps, now: number) => {
      const dt = Math.min(Math.max(now - a.last, 0), MAX_STEP);
      a.last = now;
      const up = a.toValue > a.current, v = a.current + ((up ? 1 : -1) * dt) / ms;
      if (up ? v >= a.toValue : v <= a.toValue) { a.current = a.toValue; return true; }
      a.current = v;
      return false;
    };
    const onStart = (a: Steps, value: number, now: number) => { a.current = value; a.last = now; };
    return { onFrame, onStart, current: toValue, toValue, last: 0, callback };
  }) as unknown as number;
}

/* From v, how far through by time (r in Frame), and whether it's closing: k, how far from the card to the page,
   eased the opening or the closing way, and the page's opacity, in over the first FADE_IN_MS opening and out over
   FADE_OUT_FROM to FADE_OUT_TO of the way closing. */
function shape(v: number, closing: boolean) {
  'worklet';
  if (!closing) return { k: openEase(v), op: Math.min(1, (v * OPEN_MS) / FADE_IN_MS) };
  const done = 1 - v;
  return { k: 1 - closeEase(done), op: 1 - Math.min(1, Math.max(0, (done - FADE_OUT_FROM) / (FADE_OUT_TO - FADE_OUT_FROM))) };
}

/* the plan page's route; grown: it grows out of its card instead of sliding in */
export const planHref = (id: string, grown?: boolean) => ({ pathname: '/plan/[id]' as const, params: grown ? { id, grow: '1' } : { id } });

const Ctx = createContext<Grow>({ open: (_c, _o, go) => go(false), origin: () => undefined, where: async () => null });
export const useGrow = () => useContext(Ctx);
/* the plan page calls this once its photo is on screen (expo-image onDisplay); the grow waits for it */
const PhotoCtx = createContext<() => void>(() => {});
export const useGrowPhoto = () => useContext(PhotoCtx);

/* Where a view is on the screen, or null if it can't be measured. */
const measure = (r: RefObject<ViewInstance | null> | null) => new Promise<Box | null>(ok => {
  const v = r?.current;
  if (!v) { ok(null); return; }
  v.measureInWindow((x, y, w, h) => ok(w > 0 && h > 0 ? { x, y, w, h } : null));
});

export function GrowProvider({ children }: { children: ReactNode }) {
  const still = useReducedMotion();
  const origins = useRef(new Map<string, Origin>());
  const lastOpen = useRef(0);   // a second tap while the page is on its way is ignored

  const open: Grow['open'] = useCallback(async (ref, o, go) => {
    const now = Date.now();
    if (now - lastOpen.current < 700) return;
    lastOpen.current = now;
    if (still) { go(false); return; }
    const box = await measure(ref);
    if (!box) { go(false); return; }
    origins.current.set(o.id, { box, radius: o.radius, ref });
    go(true);
  }, [still]);
  const origin = useCallback((id: string) => origins.current.get(id), []);
  const where = useCallback((id: string) => measure(origins.current.get(id)?.ref ?? null), []);

  const value = useMemo(() => ({ open, origin, where }), [open, origin, where]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* The plan page, growing out of its card (on: opened with planHref(id, true)). Without a card to grow from it's
   the page as it is, on its own background (the screen under it shows through otherwise). */
export function GrowPage({ id, on, children }: { id: string; on: boolean; children: ReactNode }) {
  const t = useTheme();
  const o = useGrow().origin(id);
  if (!on) return <>{children}</>;
  if (!o) return <View style={{ flex: 1, backgroundColor: t.bg }}>{children}</View>;
  return <Frame id={id} o={o}>{children}</Frame>;
}

function Frame({ id, o, children }: { id: string; o: Origin; children: ReactNode }) {
  const t = useTheme();
  const grow = useGrow();
  const { width: W } = useWindowDimensions();
  /* the page: the middle column on a tablet (lib/layout.ts), the whole screen on a phone */
  const pw = Math.min(W, COLUMN), px = (W - pw) / 2;
  const r = useSharedValue(0);              // how far through, by time: 0 = the card, 1 = the page
  const out = useSharedValue(false);        // closing (eased and faded the closing way)
  const from = useSharedValue(o.box);       // the card's box on screen
  const H = useSharedValue(0);              // the page's height, once laid out

  /* Close (Back, the back button, closing after leaving or cancelling): the way out is held while the page shrinks
     into its card, then let go. */
  const [gone, setGone] = useState(false);
  const goOn = useRef<(() => void) | null>(null);
  const closing = useRef(false);

  /* Open: once the page is laid out and its photo is on screen (or PHOTO_WAIT has passed), and a frame later, so
     the page's first frame is drawn before it moves. */
  const laid = useRef(false), shown = useRef(false), started = useRef(false);
  const begin = () => {
    if (started.current || !laid.current || !shown.current || closing.current) return;
    started.current = true;
    requestAnimationFrame(() => { if (!closing.current) r.set(withSteps(1, OPEN_MS)); });
  };
  const photoShown = () => { shown.current = true; begin(); };
  /* once, from when the page first draws (it only reads refs, so the first photoShown is as good as any) */
  useEffect(() => {
    const w = setTimeout(photoShown, PHOTO_WAIT);
    return () => clearTimeout(w);
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps
  const laidOut = (e: LayoutChangeEvent) => {
    H.set(e.nativeEvent.layout.height);
    laid.current = true;
    begin();
  };

  /* With no card to go back to, it shrinks to the middle of the screen and fades. Closed before it had started
     opening, there's nothing on screen to shrink, so it just goes. */
  usePreventRemove(!gone, ({ repeat }) => {
    goOn.current = repeat;
    if (closing.current) return;
    closing.current = true;
    grow.where(id).then(b => {
      const h = H.get();
      from.set(b ?? { x: px + pw * 0.15, y: h * 0.3, w: pw * 0.7, h: h * 0.4 });
      if (!started.current || r.get() <= 0) { setGone(true); return; }
      /* going back while it's still opening: carry on from the point of the closing curve that's at the same size,
         so changing curves doesn't make it jump */
      const k = openEase(r.get());
      let lo = 0, hi = 1;
      for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; if (shape(m, true).k < k) lo = m; else hi = m; }
      r.set((lo + hi) / 2);
      out.set(true);
      r.set(withSteps(0, CLOSE_MS, done => { 'worklet'; if (done) scheduleOnRN(setGone, true); }));
    });
  });
  useEffect(() => { if (gone && goOn.current) { const f = goOn.current; goOn.current = null; f(); } }, [gone]);

  /* r and out are read in each animated style itself, not inside shape: Reanimated redraws a style only when a shared
     value it reads directly changes */

  /* At k (0 = the card, 1 = the page) the window is the card's box moved part way to the page's: (x, y, w, h) on
     screen. The page in it is scaled by w / pw the same both ways, so it's never squashed, and only its top shows. */
  const mix = (a: number, b: number, k: number) => { 'worklet'; return a + (b - a) * k; };
  const dim = useAnimatedStyle(() => ({ opacity: 0.38 * shape(r.get(), out.get()).k }));
  /* the window: laid out as the whole page, scaled from its top left. Its bottom edge (and its rounded bottom
     corners) are where the window's bottom is; its top is above that, by however much of the page is hidden. */
  const win = useAnimatedStyle(() => {
    const { k, op } = shape(r.get(), out.get()), b = from.get(), ph = H.get() || 1;
    const x = mix(b.x, px, k), y = mix(b.y, 0, k), w = mix(b.w, pw, k), h = mix(b.h, ph, k), sc = w / pw;
    return {
      opacity: op,
      borderRadius: mix(o.radius, 0, k) / sc,
      transform: [{ translateX: x - px }, { translateY: y + h - ph * sc }, { scale: sc }],
    };
  });
  /* the page inside it, moved down so its top is at the window's top, with the window's rounded top corners */
  const page = useAnimatedStyle(() => {
    const { k } = shape(r.get(), out.get()), b = from.get(), ph = H.get() || 1;
    const w = mix(b.w, pw, k), h = mix(b.h, ph, k), sc = w / pw, rr = mix(o.radius, 0, k) / sc;
    return { borderTopLeftRadius: rr, borderTopRightRadius: rr, transform: [{ translateY: ph - h / sc }] };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }, dim]} />
      <Animated.View onLayout={laidOut} style={[s.clip, { left: px, width: pw }, s.origin, win]}>
        <Animated.View style={[StyleSheet.absoluteFill, s.clip, { backgroundColor: t.bg }, page]}>
          <PhotoCtx.Provider value={photoShown}>{children}</PhotoCtx.Provider>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  clip: { position: 'absolute', top: 0, bottom: 0, overflow: 'hidden' },
  origin: { transformOrigin: 'left top' },
});

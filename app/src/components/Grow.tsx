import { Image, type ImageSource } from 'expo-image';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewInstance } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useFrameCallback, useReducedMotion, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { COLUMN } from '@/lib/layout';
import { useTheme } from '@/lib/theme';

/* A plan card grows into its plan page, and the page shrinks back into the card.

   The plan page is its own screen, so the card can't really become it. Instead a stand-in (the card's colour and
   photo) is drawn over the whole app, at the card's place and size, and grows to the page's size while the screen
   behind it dims, its photo growing to where the page's photo sits. Once it covers the screen the page opens under
   it with no slide of its own (the `grow` route param, see app/_layout.tsx), and the stand-in fades to show it.
   Going back runs the other way: the stand-in fades in over the page, the page closes under it, and it shrinks into
   the card and goes. Off with Reduce motion: the page then opens and closes as before. */

type Box = { x: number; y: number; w: number; h: number };
type From = { id: string; card: Box; photo: Box; radius: number; photoRadius: number; src: ImageSource; bg: string };
type Grow = {
  /* which card is standing in (hidden while its stand-in is out) */
  hidden: string | null;
  open: (card: RefObject<ViewInstance | null>, photo: RefObject<ViewInstance | null> | null, o: { id: string; radius: number; photoRadius?: number; src: ImageSource; bg: string }, go: (grown: boolean) => void) => void;
  ready: (id: string) => void;
  close: (id: string, pop: () => void) => boolean;
};

/* the plan page's photo is 280 high plus the status bar (app/plan/[id].tsx) */
export const PLAN_PHOTO = 280;
const OPEN_MS = 340, SHRINK_MS = 320, EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

/* the plan page's route; grown: it opens under a stand-in, so without its own slide */
export const planHref = (id: string, grown?: boolean) => ({ pathname: '/plan/[id]' as const, params: grown ? { id, grow: '1' } : { id } });

const Ctx = createContext<Grow>({ hidden: null, open: (_c, _p, _o, go) => go(false), ready: () => {}, close: () => false });
export const useGrow = () => useContext(Ctx);

/* Run f once the app has stopped being busy: three frames in a row on time (a re-render of the list, or a screen that
   just closed, can hold up drawing for a moment, and an animation started then would be over before it's seen).
   min: wait at least this long first, for busy work that hasn't started yet (closing a screen re-draws the one under
   it a moment later). At most 800 ms past min. */
function whenCalm(f: () => void, min = 0) {
  const start = Date.now();
  let last = start, calm = 0;
  const tick = () => {
    const now = Date.now();
    calm = now - last < 34 ? calm + 1 : 0;
    last = now;
    if ((calm >= 4 && now - start >= min) || now - start > min + 800) f(); else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* Where a view is on the screen, or null if it can't be measured. */
const measure = (r: RefObject<ViewInstance | null> | null) => new Promise<Box | null>(ok => {
  const v = r?.current;
  if (!v) { ok(null); return; }
  v.measureInWindow((x, y, w, h) => ok(w > 0 && h > 0 ? { x, y, w, h } : null));
});

export function GrowProvider({ children }: { children: ReactNode }) {
  const t = useTheme();
  const still = useReducedMotion();
  const [from, setFrom] = useState<From | null>(null);
  const [hidden, setHidden] = useState<string | null>(null);
  const last = useRef<From | null>(null);           // the card the open page came from, to shrink back into
  const waiting = useRef<string | null>(null);      // opened, waiting for the page to say it's drawn
  /* What to run once the stand-in is really on screen. Starting the clock before then (while the list re-renders)
     would let a busy phone skip the whole animation. */
  const onShown = useRef<(() => void) | null>(null);
  const shown = useCallback(() => { const f = onShown.current; onShown.current = null; if (f) whenCalm(f); }, []);
  const p = useSharedValue(0);                       // 0 = the card, 1 = the page
  const show = useSharedValue(1);                    // the stand-in's opacity
  /* 1 while the shrink waits for the screen under it to be drawn smoothly (StandIn's frame check starts it) */
  const armed = useSharedValue(0);

  const clear = useCallback(() => { setFrom(null); setHidden(null); }, []);
  const reveal = useCallback(() => {
    waiting.current = null;
    show.set(withTiming(0, { duration: 160 }, fin => { if (fin) scheduleOnRN(clear); }));
  }, [show, clear]);

  const open: Grow['open'] = useCallback(async (cardRef, photoRef, o, go) => {
    if (still || from) { go(false); return; }
    const [card, photo] = await Promise.all([measure(cardRef), photoRef ? measure(photoRef) : Promise.resolve(null)]);
    if (!card) { go(false); return; }
    const f: From = {
      id: o.id, card, src: o.src, bg: o.bg, radius: o.radius, photoRadius: o.photoRadius ?? o.radius,
      /* the photo, as a box inside the card; the whole card when it's all photo (the swipe deck) */
      photo: photo ? { x: photo.x - card.x, y: photo.y - card.y, w: photo.w, h: photo.h } : { x: 0, y: 0, w: card.w, h: card.h },
    };
    last.current = f;
    /* the stand-in stays invisible, and the card stays put, until the stand-in's photo is drawn: no empty card */
    setFrom(f);
    p.set(0); show.set(0);
    const arrived = () => {
      waiting.current = f.id;
      go(true);
      setTimeout(() => { if (waiting.current === f.id) reveal(); }, 1500);   // in case the page never says it's drawn
    };
    onShown.current = () => {
      show.set(1); setHidden(f.id);
      whenCalm(() => p.set(withTiming(1, { duration: OPEN_MS, easing: EASE }, fin => { if (fin) scheduleOnRN(arrived); })));
    };
  }, [still, from, p, show, reveal]);

  /* the page's photo is on screen under the stand-in: let the page show (a frame later, so it's really drawn) */
  const ready: Grow['ready'] = useCallback(id => {
    if (waiting.current === id) whenCalm(() => { if (waiting.current === id) reveal(); });
  }, [reveal]);

  const close: Grow['close'] = useCallback((id, pop) => {
    const f = last.current;
    if (still || !f || f.id !== id) return false;
    last.current = null;
    setFrom(f); setHidden(f.id);
    p.set(1); show.set(0);
    const shrink = () => { pop(); armed.set(1); };
    onShown.current = () => show.set(withTiming(1, { duration: 110 }, fin => { if (fin) scheduleOnRN(shrink); }));
    return true;
  }, [still, p, show, armed]);

  const value = useMemo(() => ({ hidden, open, ready, close }), [hidden, open, ready, close]);
  return (
    <Ctx.Provider value={value}>
      {children}
      {from ? <StandIn f={from} p={p} show={show} armed={armed} pageBg={t.bg} onShown={shown} onDone={clear} /> : null}
    </Ctx.Provider>
  );
}

function StandIn({ f, p, show, armed, pageBg, onShown, onDone }: {
  f: From; p: SharedValue<number>; show: SharedValue<number>; armed: SharedValue<number>; pageBg: string; onShown: () => void; onDone: () => void;
}) {
  /* Closing a page makes the phone draw the screen under it, which can stall drawing for a moment; an animation that
     ran then would be over before it's seen. So the shrink starts here, on the drawing thread, once frames are coming
     on time again: 4 in a row, at least 8 frames after the page closed (about 1.5 s at most). */
  const seen = useSharedValue(0), calm = useSharedValue(0);
  useFrameCallback(fi => {
    'worklet';
    if (armed.get() !== 1) return;
    const n = seen.get() + 1;
    seen.set(n);
    calm.set((fi.timeSincePreviousFrame ?? 16) < 34 ? calm.get() + 1 : 0);
    if ((n >= 8 && calm.get() >= 4) || n > 90) {
      armed.set(0); seen.set(0); calm.set(0);
      p.set(withTiming(0, { duration: SHRINK_MS, easing: EASE }, fin => { if (fin) scheduleOnRN(onDone); }));
    }
  });
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  /* the page: the middle column on a tablet (lib/layout.ts), the whole screen on a phone */
  const pw = Math.min(W, COLUMN), px = (W - pw) / 2, ph = PLAN_PHOTO + insets.top;
  /* Only transforms and opacity move here, never width, height or position: those wait for React to finish drawing
     the screen underneath, which is exactly when the shrink runs. So each box is laid out at its size on the page and
     scaled to where it is now; the view inside it is scaled back the other way, so nothing in it looks squashed, and
     the box's own edges clip it. */
  const mix = (a: number, b: number, k: number) => { 'worklet'; return a + (b - a) * k; };
  /* the card's box and its photo's box on screen at k (0 = the card, 1 = the page) */
  const cardAt = (k: number) => {
    'worklet';
    return { x: mix(f.card.x, px, k), y: mix(f.card.y, 0, k), w: mix(f.card.w, pw, k), h: mix(f.card.h, H, k) };
  };
  const photoAt = (k: number) => {
    'worklet';
    return { x: mix(f.card.x + f.photo.x, px, k), y: mix(f.card.y + f.photo.y, 0, k), w: mix(f.photo.w, pw, k), h: mix(f.photo.h, ph, k) };
  };
  const dim = useAnimatedStyle(() => ({ opacity: 0.4 * p.get() * show.get() }));
  /* the card: laid out as the page (px, 0, pw, H), scaled to the card's box */
  const box = useAnimatedStyle(() => {
    const k = p.get(), r = cardAt(k), sx = r.w / pw, sy = r.h / H;
    return {
      opacity: show.get(), backgroundColor: interpolateColor(k, [0, 1], [f.bg, pageBg]),
      borderRadius: mix(f.radius, 0, k) / ((sx + sy) / 2),
      transform: [{ translateX: r.x + r.w / 2 - (px + pw / 2) }, { translateY: r.y + r.h / 2 - H / 2 }, { scaleX: sx }, { scaleY: sy }],
    };
  });
  /* inside it, scaled back: this layer is unscaled again, its top-left at the card box's centre minus half the page */
  const unbox = useAnimatedStyle(() => {
    const r = cardAt(p.get());
    return { transform: [{ scaleX: pw / r.w }, { scaleY: H / r.h }] };
  });
  /* the photo's box, laid out as the page's photo (0, 0, pw, ph) in that layer, scaled to where the photo is now */
  const pbox = useAnimatedStyle(() => {
    const k = p.get(), r = cardAt(k), q = photoAt(k), qx = q.w / pw, qy = q.h / ph;
    const ox = r.x + r.w / 2 - pw / 2, oy = r.y + r.h / 2 - H / 2;   // where the layer's top-left is on screen
    return {
      borderRadius: mix(f.photoRadius, 0, k) / ((qx + qy) / 2),
      transform: [{ translateX: q.x + q.w / 2 - ox - pw / 2 }, { translateY: q.y + q.h / 2 - oy - ph / 2 }, { scaleX: qx }, { scaleY: qy }],
    };
  });
  /* the photo itself: scaled back, then by one amount both ways so it covers its box, like contentFit cover */
  const pimg = useAnimatedStyle(() => {
    const q = photoAt(p.get()), qx = q.w / pw, qy = q.h / ph, u = Math.max(qx, qy);
    return { transform: [{ scaleX: u / qx }, { scaleY: u / qy }] };
  });
  return (
    /* catches taps while it runs, so nothing is opened twice */
    <View style={StyleSheet.absoluteFill} onLayout={() => setTimeout(onShown, 400)}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }, dim]} />
      <Animated.View pointerEvents="none" style={[s.clip, { left: px, top: 0, width: pw, height: H }, box]}>
        <Animated.View style={[StyleSheet.absoluteFill, unbox]}>
          <Animated.View style={[s.clip, { left: 0, top: 0, width: pw, height: ph }, pbox]}>
            <Animated.View style={[StyleSheet.absoluteFill, pimg]}>
              <Image source={f.src} style={StyleSheet.absoluteFill} contentFit="cover" priority="high" onDisplay={onShown} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({ clip: { position: 'absolute', overflow: 'hidden' } });

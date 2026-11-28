import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { planHref, useGrow } from '@/components/Grow';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View, type ViewInstance } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { DECK } from '@/lib/layout';
import { isVer, kmAway, tags, uname, whenStr, type Model, type Plan } from '@/lib/model';
import { photoOf } from '@/lib/photos';
import { sharePlan } from '@/lib/share';
import { R, useTheme } from '@/lib/theme';
import { Avatar, CatPill, Icon } from './ui';

/* The card fills the space between the header and the tab bar, with skip, details and join on the bottom of its
   photo, as in Tinder (mockups/swipe-layout/options.html, option 2). The buttons stay put over the deck while the card
   under them follows your finger.
   The top card follows your finger on the UI thread (Reanimated), so it stays smooth on budget phones.
   Past a third of the screen it flies off: right asks to join, left skips. With holdLeft (your first skip asks "are you
   sure?") a skip comes back like a request does, and the card goes once you say OK. */
export function SwipeDeck({ m, cards: ranked, onSwipe, holdLeft }: {
  m: Model; cards: Plan[]; onSwipe: (a: Plan, dir: 'left' | 'right') => void; holdLeft?: boolean;
}) {
  const t = useTheme();
  /* The two cards on screen keep their places while they're still in the deck: a skip changes your taste and so the
     order (lib/model.ts, deck), and the card waiting underneath was then sometimes swapped for another one just as
     it came up. New ranking only moves the cards after them. */
  const [pin, setPin] = useState<string[]>([]);
  const kept = pin.map(id => ranked.find(a => a.id === id)).filter((a): a is Plan => !!a);
  const cards = [...kept, ...ranked.filter(a => !pin.includes(a.id))];
  const shown = cards.slice(0, 2).map(a => a.id);
  if (shown.join() !== pin.join()) setPin(shown);
  const { width } = useWindowDimensions();
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  /* the plan of the card that flew off to the left, until the deck has moved on. x still holds where that card went,
     so any other card treats x as 0: when the next card becomes the top one, it's drawn in place straight away,
     not where the skipped card was (off the left edge) for a moment */
  const gone = useSharedValue<string | null>(null);
  const top = cards[0];
  const topId = top?.id ?? '';
  const limit = width * 0.3;
  /* the top card's plan page grows out of it (components/Grow.tsx), from a tap on it or on Details. It's measured by
     the deck's space, which never moves and which the card fills exactly at rest, so it's right even mid-swipe. */
  const grow = useGrow();
  const deckBox = useRef<ViewInstance>(null);
  const openTop = () => { if (top) grow.open(deckBox, { id: top.id, radius: R + 4 }, grown => router.push(planHref(top.id, grown))); };

  /* .set()/.get() rather than .value, so the React Compiler can see what changes */
  useEffect(() => { x.set(0); y.set(0); gone.set(null); }, [top?.id, x, y, gone]);

  const done = (dir: 'left' | 'right') => {
    Haptics.selectionAsync();
    if (top) onSwipe(top, dir);
  };

  const pan = usePanGesture({
    activeOffsetX: [-12, 12],
    onUpdate: e => { 'worklet'; x.set(e.translationX); y.set(e.translationY * 0.3); },
    onDeactivate: e => {
      'worklet';
      const fling = Math.abs(e.velocityX) > 900;
      if (Math.abs(e.translationX) > limit || fling) {
        if ((fling ? e.velocityX : e.translationX) > 0 || holdLeft) {
          /* a request (or the first skip) opens its own sheet, so the card comes back */
          x.set(withSpring(0)); y.set(withSpring(0));
          scheduleOnRN(done, (fling ? e.velocityX : e.translationX) > 0 ? 'right' as const : 'left' as const);
        } else {
          /* the card is removed once it has flown off */
          gone.set(topId);
          x.set(withTiming(-width * 1.4, { duration: 220 }, () => { scheduleOnRN(done, 'left' as const); }));
        }
      } else {
        x.set(withSpring(0)); y.set(withSpring(0));
      }
    },
  });

  /* x and gone are read in each style itself: Reanimated redraws a style only for shared values it reads directly */
  const topStyle = useAnimatedStyle(() => {
    const g = gone.get(), on = !g || g === topId, xv = on ? x.get() : 0, yv = on ? y.get() : 0;
    return { transform: [{ translateX: xv }, { translateY: yv }, { rotate: `${interpolate(xv, [-width, width], [-18, 18])}deg` }] };
  }, [topId, width]);
  const likeStyle = useAnimatedStyle(() => {
    const g = gone.get();
    return { opacity: interpolate(!g || g === topId ? x.get() : 0, [0, limit], [0, 1], 'clamp') };
  }, [topId, limit]);
  const skipStyle = useAnimatedStyle(() => {
    const g = gone.get();
    return { opacity: interpolate(!g || g === topId ? x.get() : 0, [-limit, 0], [1, 0], 'clamp') };
  }, [topId, limit]);
  const nextStyle = useAnimatedStyle(() => {
    const g = gone.get();
    return { transform: [{ scale: interpolate(Math.abs(!g || g === topId ? x.get() : 0), [0, limit], [0.95, 1], 'clamp') }] };
  }, [topId, limit]);

  if (!top) return null;
  const next = cards[1];
  const tap = (dir: 'left' | 'right') => {
    if (dir === 'left' && !holdLeft) gone.set(topId);
    if (dir === 'left' && !holdLeft) x.set(withTiming(-width * 1.4, { duration: 220 }, () => { scheduleOnRN(done, 'left' as const); }));
    else done(dir);
  };

  /* on a tablet the card stays card-sized in the middle (lib/layout.ts) */
  return (
    <View style={{ flex: 1, width: '100%', maxWidth: DECK, alignSelf: 'center' }}>
      {/* The two cards are one list keyed by plan, the next one first (underneath). When the top card goes, the next
          one is the same view moving up, its photo already showing, instead of a new one loading it again (and the
          old top's photo never shows on the new card). Dragging anywhere on the deck moves the top card. */}
      <GestureDetector gesture={pan}>
        <View ref={deckBox} collapsable={false} style={{ flex: 1 }}>
          {(next ? [next, top] : [top]).map(a => a.id === top.id ? (
            <Animated.View key={a.id} style={[StyleSheet.absoluteFill, topStyle]}>
              <DeckCard m={m} a={a} onOpen={openTop} />
              <Animated.View style={[s.stamp, { left: 20, borderColor: t.ok }, likeStyle]}><Text style={[s.stampT, { color: t.ok }]}>JOIN</Text></Animated.View>
              <Animated.View style={[s.stamp, { right: 20, borderColor: t.bad }, skipStyle]}><Text style={[s.stampT, { color: t.bad }]}>SKIP</Text></Animated.View>
            </Animated.View>
          ) : (
            <Animated.View key={a.id} style={[StyleSheet.absoluteFill, nextStyle]}><DeckCard m={m} a={a} /></Animated.View>
          ))}
          {/* the buttons, on the bottom of the photo */}
          <View style={s.btns} pointerEvents="box-none">
            <Pressable accessibilityRole="button" accessibilityLabel="Skip" onPress={() => tap('left')} style={({ pressed }) => [s.round, s.skip, pressed && s.pressed]}>
              <Icon name="x" size={26} color={t.bad} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Details" onPress={openTop} style={({ pressed }) => [s.round, s.small, pressed && s.pressed]}>
              <Icon name="info" size={20} color="#fff" />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Request to join" onPress={() => tap('right')} style={({ pressed }) => [s.round, { backgroundColor: t.acc }, pressed && s.pressed]}>
              <Icon name="heart" size={25} color={t.onAcc} />
            </Pressable>
          </View>
        </View>
      </GestureDetector>
    </View>
  );
}

function DeckCard({ m, a, onOpen }: { m: Model; a: Plan; onOpen?: () => void }) {
  const km = kmAway(m, a);
  const host = m.people[a.host];
  /* who it's for and how often stay on the card; the cost and spots left are on the plan page */
  const tg = tags(a, false);
  return (
    <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={`${a.desc}, ${whenStr(a.when)}`} style={s.card}>
      <Image source={photoOf(a)} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,.25)', 'rgba(0,0,0,.85)']} locations={[0.35, 0.55, 1]} style={StyleSheet.absoluteFill} />
      {onOpen && a.host !== m.me ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Share this plan" hitSlop={8} onPress={() => sharePlan(a)} style={s.share}>
          <Icon name="share" size={18} color="#fff" />
        </Pressable>
      ) : null}
      <View style={s.body}>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          <View style={s.pillBg}><CatPill cat={a.cat} light /></View>
          {tg.map(x => <View key={x} style={s.tag}><Text style={s.tagT}>{x}</Text></View>)}
        </View>
        <Text style={s.title} numberOfLines={3}>{a.desc}</Text>
        <Text style={s.meta} numberOfLines={1}>{whenStr(a.when)}{km != null ? ` · ${km.toFixed(1)} km` : ''}</Text>
        {/* the host as a small chip: photo, name and age, and the tick when verified */}
        <View style={s.host} accessible accessibilityLabel={`Hosted by ${uname(m, a.host)}${host?.age ? `, ${host.age}` : ''}`}>
          <Avatar m={m} id={a.host} size={22} />
          <Text style={s.hostT} numberOfLines={1}>{uname(m, a.host)}{host?.age ? `, ${host.age}` : ''}</Text>
          {isVer(m, a.host) ? <Icon name="check-circle" size={13} color="#8FD49F" /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { flex: 1, borderRadius: R + 4, overflow: 'hidden', backgroundColor: '#1c1530' },
  /* the bottom padding leaves room for the buttons over the photo (btns) */
  body: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 18, paddingBottom: 92 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.3, marginBottom: 8 },
  meta: { color: 'rgba(255,255,255,.92)', fontSize: 15 },
  host: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 10, paddingVertical: 3, paddingLeft: 3, paddingRight: 10, borderRadius: 99, backgroundColor: 'rgba(0,0,0,.35)' },
  hostT: { color: '#fff', fontSize: 13, fontWeight: '700', flexShrink: 1 },
  pillBg: { backgroundColor: 'rgba(255,255,255,.92)', borderRadius: 99 },
  tag: { backgroundColor: 'rgba(0,0,0,.35)', borderRadius: 99, paddingHorizontal: 9, paddingVertical: 3 },
  tagT: { color: '#fff', fontSize: 12, fontWeight: '700' },
  share: { position: 'absolute', top: 14, right: 14, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(20,16,12,.45)', alignItems: 'center', justifyContent: 'center' },
  stamp: { position: 'absolute', top: 28, borderWidth: 3, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(255,255,255,.85)' },
  stampT: { fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  btns: { position: 'absolute', left: 0, right: 0, bottom: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 },
  round: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  skip: { backgroundColor: 'rgba(255,253,248,.96)' },
  small: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(20,16,12,.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,.2)', elevation: 0, shadowOpacity: 0 },
  pressed: { transform: [{ scale: 0.92 }] },
});

import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { kmAway, placeLine, spotTxt, tags, uname, whenStr, type Model, type Plan } from '@/lib/model';
import { photoOf } from '@/lib/photos';
import { R, useTheme } from '@/lib/theme';
import { CatPill, Icon } from './ui';

/* The top card follows your finger on the UI thread (Reanimated), so it stays smooth on budget phones.
   Past a third of the screen it flies off: right asks to join, left skips. */
export function SwipeDeck({ m, cards, onSwipe }: { m: Model; cards: Plan[]; onSwipe: (a: Plan, dir: 'left' | 'right') => void }) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const top = cards[0];
  const limit = width * 0.3;

  /* .set()/.get() rather than .value, so the React Compiler can see what changes */
  useEffect(() => { x.set(0); y.set(0); }, [top?.id, x, y]);

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
        if ((fling ? e.velocityX : e.translationX) > 0) {
          /* a request opens its own sheet, so the card comes back */
          x.set(withSpring(0)); y.set(withSpring(0));
          scheduleOnRN(done, 'right' as const);
        } else {
          /* the card is removed once it has flown off */
          x.set(withTiming(-width * 1.4, { duration: 220 }, () => { scheduleOnRN(done, 'left' as const); }));
        }
      } else {
        x.set(withSpring(0)); y.set(withSpring(0));
      }
    },
  });

  const topStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }, { translateY: y.get() }, { rotate: `${interpolate(x.get(), [-width, width], [-18, 18])}deg` }],
  }));
  const likeStyle = useAnimatedStyle(() => ({ opacity: interpolate(x.get(), [0, limit], [0, 1], 'clamp') }));
  const skipStyle = useAnimatedStyle(() => ({ opacity: interpolate(x.get(), [-limit, 0], [1, 0], 'clamp') }));
  const nextStyle = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(Math.abs(x.get()), [0, limit], [0.95, 1], 'clamp') }] }));

  if (!top) return null;
  const next = cards[1];
  const tap = (dir: 'left' | 'right') => {
    if (dir === 'left') x.set(withTiming(-width * 1.4, { duration: 220 }, () => { scheduleOnRN(done, 'left' as const); }));
    else done('right');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {next ? <Animated.View style={[StyleSheet.absoluteFill, nextStyle]}><DeckCard m={m} a={next} /></Animated.View> : null}
        <GestureDetector gesture={pan}>
          <Animated.View style={[StyleSheet.absoluteFill, topStyle]}>
            <DeckCard m={m} a={top} onOpen={() => router.push({ pathname: '/plan/[id]', params: { id: top.id } })} />
            <Animated.View style={[s.stamp, { left: 20, borderColor: t.ok }, likeStyle]}><Text style={[s.stampT, { color: t.ok }]}>JOIN</Text></Animated.View>
            <Animated.View style={[s.stamp, { right: 20, borderColor: t.bad }, skipStyle]}><Text style={[s.stampT, { color: t.bad }]}>SKIP</Text></Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={s.btns}>
        <Pressable accessibilityRole="button" accessibilityLabel="Skip" onPress={() => tap('left')} style={[s.round, { backgroundColor: t.card, borderColor: t.line }]}>
          <Icon name="x" size={26} color={t.bad} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Details" onPress={() => router.push({ pathname: '/plan/[id]', params: { id: top.id } })} style={[s.round, s.small, { backgroundColor: t.card, borderColor: t.line }]}>
          <Icon name="info" size={20} color={t.ink2} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Request to join" onPress={() => tap('right')} style={[s.round, { backgroundColor: t.acc, borderColor: t.acc }]}>
          <Icon name="heart" size={26} color={t.onAcc} />
        </Pressable>
      </View>
    </View>
  );
}

function DeckCard({ m, a, onOpen }: { m: Model; a: Plan; onOpen?: () => void }) {
  const km = kmAway(m, a);
  const host = m.people[a.host];
  return (
    <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={`${a.desc}, ${whenStr(a.when)}`} style={s.card}>
      <Image source={photoOf(a)} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,.25)', 'rgba(0,0,0,.85)']} locations={[0.35, 0.55, 1]} style={StyleSheet.absoluteFill} />
      <View style={s.body}>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          <View style={s.pillBg}><CatPill cat={a.cat} /></View>
          {tags(a).map(x => <View key={x} style={s.tag}><Text style={s.tagT}>{x}</Text></View>)}
        </View>
        <Text style={s.title} numberOfLines={3}>{a.desc}</Text>
        <Text style={s.meta}>{whenStr(a.when)} · {spotTxt(a)}</Text>
        <Text style={s.meta} numberOfLines={1}>{placeLine(a)}{km != null ? ` · ${km.toFixed(1)} km` : ''}</Text>
        <Text style={[s.meta, { marginTop: 6, fontWeight: '700' }]}>Hosted by {uname(m, a.host)}{host?.age ? `, ${host.age}` : ''}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { flex: 1, borderRadius: R + 4, overflow: 'hidden', backgroundColor: '#1c1530' },
  body: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.3, marginBottom: 8 },
  meta: { color: 'rgba(255,255,255,.92)', fontSize: 15 },
  pillBg: { backgroundColor: 'rgba(255,255,255,.92)', borderRadius: 99 },
  tag: { backgroundColor: 'rgba(0,0,0,.35)', borderRadius: 99, paddingHorizontal: 9, paddingVertical: 3 },
  tagT: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stamp: { position: 'absolute', top: 28, borderWidth: 3, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(255,255,255,.85)' },
  stampT: { fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  btns: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22, paddingVertical: 14 },
  round: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  small: { width: 48, height: 48, borderRadius: 24 },
});

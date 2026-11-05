import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Icon, type IconName } from '@/components/ui';
import { column } from '@/lib/layout';
import { PHOTOS } from '@/lib/photoFiles';
import { useTheme } from '@/lib/theme';

/* First open: three pages on what Overhere is (the same story as the website's welcome page), then sign-up or
   sign-in. Shown until someone picks one of those; sign-in.tsx remembers it. */
const PAGES: { photo: keyof typeof PHOTOS; icon: IconName; title: string; text: string }[] = [
  { photo: 'concert', icon: 'map-pin', title: 'Got a plan? Bring company.', text: "Post the movie, coffee or gig you're already planning. People nearby ask to join, and you choose who comes." },
  { photo: 'chai', icon: 'layers', title: 'Swipe today, discover later', text: 'Plans for today and tomorrow come up as cards: swipe right to ask to join. Anything later is in Discover, on a list or a map.' },
  { photo: 'sukhna', icon: 'shield', title: 'Safe by design', text: 'Hosts approve every request. Face check, show-up records, a trusted contact and SOS in every chat. Not a dating app.' },
];

export default function Welcome({ onDone }: { onDone: (signUp: boolean) => void }) {
  const t = useTheme();
  const { width, height } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const pager = useRef<ScrollViewInstance>(null);
  const last = page === PAGES.length - 1;
  /* Scrolling from code doesn't send the end-of-scroll event (iOS and web), so Next sets the page itself too. */
  const go = (i: number) => { setPage(i); pager.current?.scrollTo({ x: i * width, animated: true }); };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== page && i >= 0 && i < PAGES.length) setPage(i);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#120E0A' }}>
      {/* a tablet turning changes the page width, so line the current page up again */}
      <ScrollView ref={pager} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScroll} onScrollEndDrag={onScroll} scrollEventThrottle={16}
        onLayout={() => pager.current?.scrollTo({ x: page * width, animated: false })}>
        {PAGES.map((p, i) => (
          <View key={p.photo} style={{ width, height }} accessible accessibilityLabel={`${p.title}. ${p.text}`} accessibilityHint={`Page ${i + 1} of ${PAGES.length}`}>
            <Image source={PHOTOS[p.photo]} style={{ position: 'absolute', width, height }} contentFit="cover" transition={200} />
            <LinearGradient colors={['rgba(10,8,5,0.15)', 'rgba(10,8,5,0.25)', 'rgba(10,8,5,0.92)']} locations={[0, 0.4, 0.78]} style={{ position: 'absolute', width, height }} />
          </View>
        ))}
      </ScrollView>

      <SafeAreaView pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              {[0, 1].map(k => <View key={k} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#F2EDE4', borderWidth: 3, borderColor: t.acc }} />)}
            </View>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: -0.4 }}>Overhere</Text>
          </View>
          {!last ? (
            <Pressable accessibilityRole="button" onPress={() => go(PAGES.length - 1)} hitSlop={12}>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '700' }}>Skip</Text>
            </Pressable>
          ) : null}
        </View>

        <View pointerEvents="box-none" style={[{ paddingHorizontal: 24, paddingBottom: 18 }, column]}>
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Icon name={PAGES[page].icon} size={22} color="#fff" />
          </View>
          <Text accessibilityRole="header" style={{ color: '#fff', fontSize: 32, lineHeight: 36, fontWeight: '800', letterSpacing: -0.8 }}>{PAGES[page].title}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.84)', fontSize: 16, lineHeight: 23, marginTop: 10, minHeight: 69 }}>{PAGES[page].text}</Text>

          <View style={{ flexDirection: 'row', gap: 6, marginTop: 20, marginBottom: 22 }} accessibilityLabel={`Page ${page + 1} of ${PAGES.length}`}>
            {PAGES.map((p, i) => (
              <Pressable key={p.photo} onPress={() => go(i)} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Go to page ${i + 1}`}>
                <View style={{ width: i === page ? 22 : 8, height: 8, borderRadius: 4, backgroundColor: i === page ? '#fff' : 'rgba(255,255,255,0.4)' }} />
              </Pressable>
            ))}
          </View>

          {last ? (<>
            <Btn title="Create account" onPress={() => onDone(true)} />
            <Pressable accessibilityRole="button" onPress={() => onDone(false)} style={{ minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>I already have an account</Text>
            </Pressable>
          </>) : (
            <Btn title="Next" onPress={() => go(page + 1)} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

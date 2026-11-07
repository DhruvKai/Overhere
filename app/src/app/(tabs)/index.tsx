import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { FeedbackCard } from '@/components/Feedback';
import { Header } from '@/components/Header';
import { JoinSheet } from '@/components/JoinSheet';
import { Sheet } from '@/components/Sheet';
import { SwipeDeck } from '@/components/SwipeDeck';
import { Btn, Empty, P } from '@/components/ui';
import { LockedNote, WhereBar } from '@/components/Where';
import { tipsOf } from '@/lib/feedback';
import { deck, dismissed, learnTaste, type Plan } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';

/* Plans in the next 7 days, one card at a time. */
export default function Swipe() {
  const m = useModel();
  const { savePriv, askMicro } = useStore();
  const [asking, setAsking] = useState<Plan | null>(null);
  const [skipping, setSkipping] = useState<Plan | null>(null);
  const cards = deck(m);
  /* the first skip asks "are you sure?" once, then never again (profiles.state.tips.swipe_left, shared with the website) */
  const sure = !!tipsOf(m).swipe_left;

  const skip = (a: Plan, first?: boolean) => {
    savePriv(p => ({ dismissed: [...dismissed({ ...m, priv: p }), a.id], ...learnTaste(p, a.cat, -0.5), ...(first ? { tips: { ...(p.tips as object), swipe_left: true } } : {}) }));
    askMicro('swipe');
  };
  const onSwipe = (a: Plan, dir: 'left' | 'right') => {
    if (dir === 'right') setAsking(a);
    else if (!sure) setSkipping(a);
    else skip(a);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="This week" />
      <View style={{ paddingHorizontal: 16 }}><WhereBar /><LockedNote /><FeedbackCard /></View>
      {cards.length ? (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <SwipeDeck m={m} cards={cards} onSwipe={onSwipe} holdLeft={!sure} />
        </View>
      ) : (
        <Empty icon="sun" title="You've seen everything nearby" text="Nothing else is on in the next 7 days. Discover has plans further out, or post your own.">
          <Btn title="Open Discover" onPress={() => router.navigate('/discover')} />
          <View style={{ height: 10 }} />
          <Btn title="Post a plan" kind="ghost" icon="plus" onPress={() => router.push('/post')} />
        </Empty>
      )}
      <JoinSheet plan={asking} onClose={() => setAsking(null)} />
      {skipping ? (
        <Sheet title="Skip this plan?" onClose={() => setSkipping(null)}>
          <P style={{ marginBottom: 16 }}>Swiping left skips <P style={{ fontWeight: '700' }}>{skipping.desc}</P>. You won&apos;t see it here again.</P>
          <Btn title="OK" onPress={() => { skip(skipping, true); setSkipping(null); }} />
          <View style={{ height: 8 }} />
          <Btn title="Cancel" kind="ghost" onPress={() => setSkipping(null)} />
        </Sheet>
      ) : null}
    </View>
  );
}

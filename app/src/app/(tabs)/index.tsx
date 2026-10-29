import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Header } from '@/components/Header';
import { JoinSheet } from '@/components/JoinSheet';
import { SwipeDeck } from '@/components/SwipeDeck';
import { Btn, Empty } from '@/components/ui';
import { deck, dismissed, type Plan } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';

/* Today and tomorrow, one card at a time. */
export default function Swipe() {
  const m = useModel();
  const { savePriv } = useStore();
  const [asking, setAsking] = useState<Plan | null>(null);
  const cards = deck(m);

  const onSwipe = (a: Plan, dir: 'left' | 'right') => {
    if (dir === 'right') setAsking(a);
    else savePriv({ dismissed: [...dismissed(m), a.id] });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Today & tomorrow" />
      {cards.length ? (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <SwipeDeck m={m} cards={cards} onSwipe={onSwipe} />
        </View>
      ) : (
        <Empty icon="sun" title="You've seen everything nearby" text="Nothing else is on today or tomorrow. Discover has plans for later this week, or post your own.">
          <Btn title="Open Discover" onPress={() => router.navigate('/discover')} />
          <View style={{ height: 10 }} />
          <Btn title="Post a plan" kind="ghost" icon="plus" onPress={() => router.push('/post')} />
        </Empty>
      )}
      <JoinSheet plan={asking} onClose={() => setAsking(null)} />
    </View>
  );
}

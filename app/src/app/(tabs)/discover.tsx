import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Header } from '@/components/Header';
import { Chip, Empty, P, PlanRow } from '@/components/ui';
import { CATS, feed, kmAway, type Plan } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import type { Cat } from '@/lib/types';

type Sort = 'soon' | 'near';

/* Plans from the day after tomorrow on (today and tomorrow are Swipe's). */
export default function Discover() {
  const t = useTheme();
  const m = useModel();
  const { refresh } = useStore();
  const [cat, setCat] = useState<Cat | 'all'>('all');
  const [sort, setSort] = useState<Sort>('soon');
  const [pulling, setPulling] = useState(false);

  const list = useMemo(() => {
    const l = feed(m).filter(a => cat === 'all' || a.cat === cat);
    return sort === 'near' ? [...l].sort((a, b) => (kmAway(m, a) ?? 1e9) - (kmAway(m, b) ?? 1e9)) : l;
  }, [m, cat, sort]);

  const onPull = async () => { setPulling(true); await refresh(); setPulling(false); };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Discover" />
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 10 }}>
          <Chip label="All" on={cat === 'all'} onPress={() => setCat('all')} />
          {(Object.keys(CATS) as Cat[]).map(k => <Chip key={k} label={CATS[k].label} icon={CATS[k].icon} on={cat === k} onPress={() => setCat(k)} />)}
          <View style={{ width: 1, backgroundColor: t.line, marginHorizontal: 4 }} />
          <Chip label="Soonest" icon="clock" on={sort === 'soon'} onPress={() => setSort('soon')} />
          <Chip label="Closest" icon="map-pin" on={sort === 'near'} onPress={() => setSort('near')} />
        </ScrollView>
      </View>
      <FlashList<Plan>
        data={list}
        keyExtractor={a => a.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={<RefreshControl refreshing={pulling} onRefresh={onPull} tintColor={t.acc} />}
        renderItem={({ item }) => <PlanRow m={m} a={item} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: item.id } })} />}
        ListHeaderComponent={list.length ? <P small mute style={{ marginBottom: 8 }}>{list.length} plan{list.length === 1 ? '' : 's'} within 50 km</P> : null}
        ListEmptyComponent={<Empty icon="compass" title="No plans yet" text={cat === 'all' ? 'Nothing is posted near you for later this week. Be the first: post a plan.' : 'Nothing in this category yet. Try All.'} />}
      />
    </View>
  );
}

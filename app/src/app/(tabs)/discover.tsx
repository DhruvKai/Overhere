import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, RefreshControl, Text, View } from 'react-native';
import { FeedbackCard } from '@/components/Feedback';
import { Header } from '@/components/Header';
import { JoinSheet } from '@/components/JoinSheet';
import { PlanMap } from '@/components/PlanMap';
import { Sheet } from '@/components/Sheet';
import { Btn, Chip, Empty, Icon, P, PlanRow, SaveToggle, type IconName } from '@/components/ui';
import { LockedNote, WhereBar } from '@/components/Where';
import {
  alertLabel, alertsOf, canSave, CATS, datePresets, dayKey, deck, DISTS, feed, filterLabels, kmAway, matchF, myReq, NO_FILTERS, reasons, saved,
  savedFOf, score, spots, swipeEnd, whereTxt, type Filters, type Plan, type Sort, type Tod,
} from '@/lib/model';
import { useModel, useStore, useToggleSave } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import type { Cat } from '@/lib/types';

const SORTS: Record<Sort, [IconName, string, string]> = {
  for: ['star', 'My interests', 'Plans that match what you like come first'],
  soon: ['clock', 'Time', 'Soonest first'],
  near: ['map-pin', 'Distance', 'Closest to you first'],
};
const TODS: [Tod, string][] = [['any', 'Any time'], ['morning', 'Morning'], ['afternoon', 'Afternoon'], ['evening', 'Evening'], ['night', 'Night']];
/* ids for saved filters and alerts, the same shape as the website's (sf…/al… and the time in base 36) */
const newId = (p: string) => p + Date.now().toString(36);
const dShow = (k: string) => new Date(k + 'T12:00:00').toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

/* Plans from the day after tomorrow on (today and tomorrow are Swipe's), with the website's filters, sorting, saved
   filters and alerts (tabDiscover in web/app.js). */
export default function Discover() {
  const t = useTheme();
  const m = useModel();
  const { refresh, savePriv, toast } = useStore();
  const toggleSave = useToggleSave();
  const [f, setF] = useState<Filters>(NO_FILTERS);
  const [sort, setSort] = useState<Sort>('for');
  const [pulling, setPulling] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [sheet, setSheet] = useState<'filters' | 'sort' | null>(null);
  const [asking, setAsking] = useState<Plan | null>(null);

  const all = feed(m);
  const list = useMemo(() => {
    const l = all.filter(a => matchF(m, a, f));
    if (sort === 'for') return [...l].sort((a, b) => score(m, b) - score(m, a) || a.when - b.when);
    if (sort === 'near') return [...l].sort((a, b) => kmAway(m, a) - kmAway(m, b) || a.when - b.when);
    return l;
  }, [m, all, f, sort]);
  const act = filterLabels(f), sf = savedFOf(m), al = alertsOf(m), nDeck = deck(m).length;
  const label = act.map(x => x[1]).join(' · ').slice(0, 60);
  const alertable = act.some(([k]) => k !== 'date'), alerted = al.some(x => x.label === alertLabel(f));

  const onPull = async () => { setPulling(true); await refresh(); setPulling(false); };
  const clear = (k: 'cat' | 'date' | 'tod' | 'dist') => setF(x => (k === 'date' ? { ...x, dfrom: '', dto: '' } : { ...x, [k]: NO_FILTERS[k] }));
  const saveF = () => {
    if (sf.some(x => x.label === label)) return toast('Already saved');
    const datep = (Object.entries(datePresets(m)).find(([, [, a, b]]) => f.dfrom === a && f.dto === b)?.[0]) || '';
    const n = { id: newId('sf'), label: label || 'All plans', f: { cat: f.cat, tod: f.tod, dist: f.dist, sort, datep } };
    savePriv(p => ({ savedF: [n, ...(Array.isArray(p.savedF) ? p.savedF : [])].slice(0, 10) }));
    toast('Filters saved. Tap them above to use them again.');
  };
  const applyF = (id: string) => {
    const x = sf.find(s => s.id === id);
    if (!x) return;
    const p = x.f.datep ? datePresets(m)[x.f.datep as 'weekend'] : undefined;
    setF({ cat: x.f.cat || 'all', tod: x.f.tod || 'any', dist: +(x.f.dist || 0), dfrom: p ? p[1] : '', dto: p ? p[2] : '' });
    if (x.f.sort) setSort(x.f.sort);
  };
  const saveAlert = () => {
    const n = { id: newId('al'), cat: f.cat, tod: f.tod, dist: f.dist, label: alertLabel(f) };
    savePriv(p => ({ alerts: [...(Array.isArray(p.alerts) ? p.alerts : []), n] }));
    toast(`Alert saved: we'll tell you about new "${n.label}" plans.`);
  };
  const rm = (key: 'savedF' | 'alerts', id: string) => {
    savePriv(p => ({ [key]: (Array.isArray(p[key]) ? p[key] as { id: string }[] : []).filter(x => x.id !== id) }));
    if (key === 'alerts') toast('Alert removed');
  };
  const tool = (icon: IconName, text: string, onPress: () => void, on?: boolean, count?: number) => (
    <Pressable accessibilityRole="button" onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: on ? t.acc : t.line, backgroundColor: on ? t.acc2 : t.card, borderRadius: 99, paddingHorizontal: 12, minHeight: 38 }}>
      <Icon name={icon} size={14} color={on ? t.accink : t.ink2} />
      <Text style={{ color: on ? t.accink : t.ink2, fontWeight: '600', fontSize: 14 }}>{text}</Text>
      {count ? <View style={{ backgroundColor: t.acc, borderRadius: 99, minWidth: 18, paddingHorizontal: 5, alignItems: 'center' }}><Text style={{ color: t.onAcc, fontSize: 12, fontWeight: '800' }}>{count}</Text></View> : null}
    </Pressable>
  );
  const removable = (text: string, onRemove: () => void, onPress?: () => void, icon?: IconName) => (
    <View key={text} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: t.chip, borderColor: t.line, borderWidth: 1, borderRadius: 99, paddingLeft: 10, paddingRight: 4, minHeight: 32 }}>
      <Pressable accessibilityRole="button" disabled={!onPress} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {icon ? <Icon name={icon} size={12} color={t.accink} /> : null}
        <Text style={{ color: t.ink2, fontSize: 13, fontWeight: '600' }}>{text}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${text}`} hitSlop={8} onPress={onRemove} style={{ padding: 4 }}><Icon name="x" size={12} color={t.mute} /></Pressable>
    </View>
  );

  const head = (
    <View>
      <WhereBar />
      <P small mute style={{ marginBottom: 10 }}>{all.length} upcoming {whereTxt(m)}, from {dShow(dayKey(swipeEnd(m)))} onwards</P>
      <LockedNote />
      <FeedbackCard />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        <Chip icon="zap" label={`Tonight & tomorrow${nDeck ? ` · ${nDeck}` : ''}`} onPress={() => router.navigate('/')} />
        {sf.map(x => removable(x.label, () => rm('savedF', x.id), () => applyF(x.id), 'filter'))}
      </View>
      {al.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 10 }}>
          <Icon name="bell" size={13} color={t.mute} /><Text style={{ color: t.mute, fontSize: 13 }}>Your alerts</Text>
          {al.map(x => removable(x.label, () => rm('alerts', x.id)))}
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        {tool('filter', 'Filters', () => setSheet('filters'), act.length > 0, act.length)}
        {tool('sliders', `Sort: ${SORTS[sort][1]}`, () => setSheet('sort'))}
        {tool(view === 'list' ? 'map' : 'list', view === 'list' ? 'Map' : 'List', () => setView(view === 'list' ? 'map' : 'list'))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: t.mute, fontSize: 13 }}>Showing <Text style={{ fontWeight: '700', color: t.ink }}>{list.length}</Text> {list.length === 1 ? 'activity' : 'activities'}</Text>
        {act.map(([k, l]) => removable(l, () => clear(k)))}
      </View>
      {act.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 10 }}>
          <Text accessibilityRole="button" onPress={() => setF(NO_FILTERS)} style={{ color: t.accink, fontWeight: '700' }}>Reset</Text>
          {!sf.some(x => x.label === label) ? <Text accessibilityRole="button" onPress={saveF} style={{ color: t.accink, fontWeight: '700' }}>Save these filters</Text> : null}
          {alertable && !alerted ? <Text accessibilityRole="button" onPress={saveAlert} style={{ color: t.accink, fontWeight: '700' }}>Alert me about new matches</Text> : null}
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title="Discover" />
      {view === 'map' ? <View style={{ flex: 1 }}><View style={{ paddingHorizontal: 16 }}>{head}</View><PlanMap m={m} list={list} /></View> : (
      <FlashList<Plan>
        data={list}
        keyExtractor={a => a.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={<RefreshControl refreshing={pulling} onRefresh={onPull} tintColor={t.acc} />}
        renderItem={({ item }) => {
          const why = sort === 'for' ? reasons(m, item)[0]?.[0] : undefined;
          const rq = myReq(m, item.id);
          return (
            <View>
              {why ? <Text style={{ color: t.accink, fontSize: 12, fontWeight: '700', marginBottom: 4 }}>★ {why}</Text> : null}
              <PlanRow m={m} a={item} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: item.id } })}
                right={(
                  <View style={{ alignItems: 'flex-end', gap: 8 }}>
                    {canSave(m, item) ? <SaveToggle on={saved(m).includes(item.id)} onPress={() => toggleSave(item.id)} /> : null}
                    {!rq ? (
                      <Pressable accessibilityRole="button" onPress={() => setAsking(item)}
                        style={{ backgroundColor: spots(item) <= 0 ? t.acc2 : t.acc, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6 }}>
                        <Text style={{ color: spots(item) <= 0 ? t.accink : t.onAcc, fontWeight: '700', fontSize: 12 }}>{spots(item) <= 0 ? 'Waitlist' : 'Request'}</Text>
                      </Pressable>
                    ) : null}
                  </View>
                )} />
            </View>
          );
        }}
        ListHeaderComponent={head}
        ListEmptyComponent={(
          <Empty icon="calendar" title={all.length ? 'No matches' : 'No plans yet'} text={all.length ? 'Try different filters.' : 'Be the first to post one.'}>
            {act.length && all.length ? <Btn title="Reset filters" kind="soft" onPress={() => setF(NO_FILTERS)} /> : <Btn title="Post a plan" icon="plus" onPress={() => router.push('/post')} />}
          </Empty>
        )}
      />
      )}
      <JoinSheet plan={asking} onClose={() => setAsking(null)} />
      {sheet === 'sort' ? (
        <Sheet title="Sort by" onClose={() => setSheet(null)}>
          {(Object.keys(SORTS) as Sort[]).map(k => (
            <Pressable key={k} accessibilityRole="radio" accessibilityState={{ checked: sort === k }} onPress={() => { setSort(k); setSheet(null); }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: sort === k ? t.acc : t.line, backgroundColor: sort === k ? t.acc2 : t.card, marginBottom: 8 }}>
              <Icon name={SORTS[k][0]} size={18} color={t.accink} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.ink, fontWeight: '700', fontSize: 15 }}>{SORTS[k][1]}</Text>
                <Text style={{ color: t.mute, fontSize: 13 }}>{SORTS[k][2]}</Text>
              </View>
              {sort === k ? <Icon name="check" size={18} color={t.accink} /> : null}
            </Pressable>
          ))}
        </Sheet>
      ) : null}
      {sheet === 'filters' ? <FiltersSheet f={f} setF={setF} count={all.filter(a => matchF(m, a, f)).length} onClose={() => setSheet(null)} /> : null}
    </View>
  );
}

function H3({ children }: { children: string }) {
  const t = useTheme();
  return <Text style={{ color: t.ink, fontWeight: '700', fontSize: 15, marginTop: 6, marginBottom: 8 }}>{children}</Text>;
}

function FiltersSheet({ f, setF, count, onClose }: { f: Filters; setF: (f: Filters) => void; count: number; onClose: () => void }) {
  const m = useModel();
  const presets = datePresets(m), first = dayKey(swipeEnd(m));
  const [iosPick, setIosPick] = useState<'dfrom' | 'dto' | null>(null);
  const set = (p: Partial<Filters>) => setF({ ...f, ...p });
  const toDate = (k: string) => new Date((k || first) + 'T12:00:00');
  const pick = (which: 'dfrom' | 'dto') => {
    if (Platform.OS === 'ios') return setIosPick(which);
    DateTimePickerAndroid.open({
      value: toDate(f[which]), mode: 'date', minimumDate: toDate(which === 'dto' ? f.dfrom || first : first),
      maximumDate: which === 'dfrom' && f.dto ? toDate(f.dto) : undefined,
      onChange: (e, d) => { if (e.type === 'set' && d) set({ [which]: dayKey(d.getTime()) }); },
    });
  };
  return (
    <Sheet title="Filters" onClose={onClose}>
      <H3>Category</H3>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <Chip label="All" on={f.cat === 'all'} onPress={() => set({ cat: 'all' })} />
        {(Object.keys(CATS) as Cat[]).map(k => <Chip key={k} label={CATS[k].label} icon={CATS[k].icon} on={f.cat === k} onPress={() => set({ cat: k })} />)}
      </View>
      <H3>Date</H3>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <Chip icon="calendar" label="Any date" on={!f.dfrom && !f.dto} onPress={() => set({ dfrom: '', dto: '' })} />
        {Object.entries(presets).map(([k, [l, a, b]]) => <Chip key={k} label={l} on={f.dfrom === a && f.dto === b} onPress={() => set({ dfrom: a, dto: b })} />)}
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <Btn title={f.dfrom ? 'From ' + dShow(f.dfrom) : 'From…'} kind="ghost" onPress={() => pick('dfrom')} style={{ flex: 1, minHeight: 42 }} />
        <Btn title={f.dto ? 'To ' + dShow(f.dto) : 'To…'} kind="ghost" onPress={() => pick('dto')} style={{ flex: 1, minHeight: 42 }} />
      </View>
      {iosPick ? (
        <DateTimePicker value={toDate(f[iosPick])} mode="date" display="inline" minimumDate={toDate(iosPick === 'dto' ? f.dfrom || first : first)}
          onChange={(_e, d) => { if (d) set({ [iosPick]: dayKey(d.getTime()) }); setIosPick(null); }} />
      ) : null}
      <H3>Time of day</H3>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {TODS.map(([k, l]) => <Chip key={k} icon={k === 'any' ? 'clock' : undefined} label={l} on={f.tod === k} onPress={() => set({ tod: k })} />)}
      </View>
      <H3>Distance</H3>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <Chip icon="map-pin" label="Any distance" on={!f.dist} onPress={() => set({ dist: 0 })} />
        {DISTS.map(k => <Chip key={k} label={`Within ${k} km`} on={f.dist === k} onPress={() => set({ dist: k })} />)}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {filterLabels(f).length ? <Btn title="Reset" kind="ghost" onPress={() => setF(NO_FILTERS)} style={{ flex: 1 }} /> : null}
        <Btn title={`Show ${count} ${count === 1 ? 'activity' : 'activities'}`} onPress={onClose} style={{ flex: 2 }} />
      </View>
    </Sheet>
  );
}

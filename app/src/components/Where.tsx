import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { api } from '@/lib/api';
import { homeLL, homeName, kmBetween, NEAR_KM, viewCity, viewName } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { Sheet } from './Sheet';
import { Icon, Note, P } from './ui';

/* Where you're browsing, at the top of Swipe and Discover: near your home area, or a city with plans (the website's
   whereBar). The choice is saved in profiles.state.city and the server sends that city's plans. When Overhere is new
   near you, the nearest city is picked for you and a note says so. */
export function WhereBar() {
  const t = useTheme();
  const m = useModel();
  const [open, setOpen] = useState(false);
  const c = viewCity(m);
  return (
    <>
      <Pressable accessibilityRole="button" accessibilityLabel={`Showing plans ${c ? 'in ' + viewName(m) : 'near ' + homeName(m)}. Change city`} onPress={() => setOpen(true)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', backgroundColor: t.card, borderColor: t.line, borderWidth: 1, borderRadius: 99, paddingHorizontal: 12, minHeight: 36, marginBottom: 10 }}>
        <Icon name="map-pin" size={14} color={t.accink} />
        <Text style={{ color: t.ink, fontWeight: '600', fontSize: 14 }}>{c ? viewName(m) : 'Near ' + homeName(m)}</Text>
        <Icon name="chevron-down" size={14} color={t.mute} />
      </Pressable>
      {m.cityAuto && c ? (
        <Note icon="compass" tone="info">Overhere is new in {homeName(m)}, so you&apos;re seeing plans in {viewName(m)} ({Math.round(kmBetween(homeLL(m), [c[2], c[3]]))} km away) too. Anything posted near you shows here first.</Note>
      ) : null}
      {open ? <CitySheet onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function CitySheet({ onClose }: { onClose: () => void }) {
  const t = useTheme();
  const m = useModel();
  const { run, toast } = useStore();
  const h = homeLL(m), cur = m.city || 'home';
  const covered = m.cities.some(c => kmBetween(h, [c[2], c[3]]) <= NEAR_KM);
  const list = m.cities.map(c => [c, kmBetween(h, [c[2], c[3]])] as const).sort((a, b) => a[1] - b[1]);
  async function pick(k: string, name: string) {
    onClose();
    if (await run(() => api.saveState({ ...m.priv, city: k })) !== undefined) toast(k === 'home' ? `Showing plans near ${homeName(m)}` : `Showing plans in ${name}`);
  }
  const opt = (k: string, icon: 'navigation' | 'map-pin', title: string, sub: string) => (
    <Pressable key={k} accessibilityRole="radio" accessibilityState={{ checked: cur === k }} onPress={() => pick(k, title)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: cur === k ? t.acc : t.line, backgroundColor: cur === k ? t.acc2 : t.card, marginBottom: 8 }}>
      <Icon name={icon} size={18} color={t.accink} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: t.ink, fontWeight: '700', fontSize: 15 }}>{title}</Text>
        <Text style={{ color: t.mute, fontSize: 13 }}>{sub}</Text>
      </View>
      {cur === k ? <Icon name="check" size={18} color={t.accink} /> : null}
    </Pressable>
  );
  return (
    <Sheet title="Show plans in" onClose={onClose}>
      {opt('home', 'navigation', 'Near ' + homeName(m), covered ? `Within ${NEAR_KM} km of your home area` : 'Only what people post near you, for now')}
      {list.map(([c, km]) => opt(c[0], 'map-pin', c[1], km <= NEAR_KM ? 'Your city' : `${Math.round(km).toLocaleString('en-IN')} km from ${homeName(m)}${m.cityAuto && m.city === c[0] ? ' · nearest to you' : ''}`))}
      <P small mute style={{ marginTop: 4 }}>Your home area stays {m.profile?.hood}. You can change it in Edit profile.</P>
    </Sheet>
  );
}

/* Plans limited to some groups (e.g. women-only) only reach people whose face check passed: say how many are waiting.
   It takes a lot of room above the deck, so it shows once per install: the first time there are locked plans, it
   hides itself after a few seconds or when closed, and is never shown again (on Swipe or Discover). */
const LOCKED_SEEN = 'overhere.lockedNoteSeen';
const LOCKED_SHOW_MS = 12000;
const lockedSeen = () => { try { return localStorage.getItem(LOCKED_SEEN) === '1'; } catch { return false; } };

export function LockedNote() {
  const t = useTheme();
  const m = useModel();
  const due = !!m.locked && !m.profile?.face;
  /* 'wait' until there's something to say, then 'show' once, then 'gone' */
  const [phase, setPhase] = useState<'wait' | 'show' | 'gone'>(() => lockedSeen() ? 'gone' : 'wait');
  const claimed = useRef(false); // this one marked it seen (so a re-run of the effect still shows it)
  useEffect(() => {
    if (phase === 'gone' || !due) return;
    if (phase === 'wait') {
      if (!claimed.current && lockedSeen()) { const id = setTimeout(() => setPhase('gone'), 0); return () => clearTimeout(id); } // the other tab showed it
      claimed.current = true;
      try { localStorage.setItem(LOCKED_SEEN, '1'); } catch { /* shows again next launch */ }
      const id = setTimeout(() => setPhase('show'), 0);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setPhase('gone'), LOCKED_SHOW_MS);
    return () => clearTimeout(id);
  }, [phase, due]);
  if (phase !== 'show' || !due) return null;
  return (
    <View>
      <Note icon="shield" tone="info" style={{ paddingRight: 36 }}>
        {m.locked} {m.locked === 1 ? 'plan near you is' : 'plans near you are'} only open to certain groups, like women-only plans.{' '}
        <Text onPress={() => router.push('/verify')} style={{ fontWeight: '700', color: t.info, textDecorationLine: 'underline' }}>Do the face check to see {m.locked === 1 ? 'it' : 'them'}</Text>
      </Note>
      <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => setPhase('gone')} hitSlop={10}
        style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="x" size={16} color={t.info} />
      </Pressable>
    </View>
  );
}

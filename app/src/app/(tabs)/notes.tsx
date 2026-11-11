import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, SectionList, Text, View } from 'react-native';
import { Header } from '@/components/Header';
import { Sheet } from '@/components/Sheet';
import { Badge, Btn, Empty, H, Icon, P, TextLink, type IconName } from '@/components/ui';
import { api } from '@/lib/api';
import { ago, nowOf, trustedOf, type Note, type Plan } from '@/lib/model';
import { actfOf } from '@/lib/reminders';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

const KIND: Record<string, IconName> = { req: 'user-check', update: 'layers', remind: 'calendar' };
const TONE: Record<string, 'ok' | 'bad' | 'warn' | 'info'> = { good: 'ok', bad: 'bad', warn: 'warn', info: 'info' };

/* Notifications, then join requests and replies, as on the website. Tapping one marks it read and opens what it's
   about: the "Arrived safely?" check-in, the group chat, the rating, or the plan. Notifications are never deleted. */
export default function Notes() {
  const t = useTheme();
  const m = useModel();
  const { refresh, run, toast, savePriv } = useStore();
  const [pulling, setPulling] = useState(false);
  const [safe, setSafe] = useState<Plan | null>(null);
  const unread = m.notes.filter(n => !n.read).length;
  const now = nowOf(m);
  /* empty sections are left out; with nothing at all, one empty state says what will show up */
  const sections = [
    { title: 'Notifications', data: m.notes.filter(n => n.kind !== 'req') },
    { title: 'Requests', data: m.notes.filter(n => n.kind === 'req') },
  ].filter(s => s.data.length);

  const open = (n: Note) => {
    if (!n.read) api.readNotifications([n.id]).then(refresh, () => {});
    const a = n.act ? m.acts.find(x => x.id === n.act) : undefined;
    if (!a) return;
    if (n.flags.includes('safe') && actfOf(m)[a.id]?.arrive === 'asked') return setSafe(a);
    if (n.flags.includes('chat') && m.chats[a.id]?.length) return router.push({ pathname: '/chat/[id]', params: { id: a.id } });
    if (n.flags.includes('check') && !m.ratings[a.id]) return router.push({ pathname: '/rate/[id]', params: { id: a.id } });
    router.push({ pathname: '/plan/[id]', params: { id: a.id } });
  };
  const readAll = async () => { if (await run(() => api.readNotifications(null)) !== undefined) toast('All notifications marked as read'); };
  const ok = (a: Plan) => {
    savePriv(p => ({ actf: { ...(p.actf as object), [a.id]: { ...actfOf(m)[a.id], arrive: 'ok' } } }));
    setSafe(null);
    toast("Great, have fun! We'll check in again afterwards.");
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Updates" right={unread ? <TextLink title="Mark all read" onPress={readAll} /> : <View />} />
      <SectionList
        sections={sections}
        keyExtractor={n => n.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={pulling} onRefresh={async () => { setPulling(true); await refresh(); setPulling(false); }} tintColor={t.acc} />}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderSectionHeader={({ section }) => <View style={{ paddingTop: 12, paddingBottom: 8 }}><H size={17}>{section.title}</H></View>}
        renderItem={({ item: n }) => (
          <Pressable accessibilityRole="button" onPress={() => open(n)}
            style={{ flexDirection: 'row', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: t.line, backgroundColor: n.read ? t.card : t.newbg }}>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: t.acc2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={KIND[n.kind] ?? 'bell'} size={18} color={t.accink} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text style={{ color: t.ink, fontWeight: '700', fontSize: 15 }}>{n.title || 'Update'}</Text>
                {/* the badge only when it adds something: not "Cancelled" next to "Activity cancelled" */}
                {n.tag && !(n.title || '').toLowerCase().includes(n.tag.toLowerCase()) ? <Badge text={n.tag} tone={TONE[n.tone] ?? 'info'} /> : null}
              </View>
              <Text style={{ color: t.ink2, fontSize: 14, lineHeight: 19 }}>{n.text}</Text>
              <Text style={{ color: t.mute, fontSize: 12 }}>{ago(n.at, now)}</Text>
            </View>
            {!n.read ? <View accessibilityLabel="Unread" style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: t.acc, marginTop: 6 }} /> : null}
          </Pressable>
        )}
        ListEmptyComponent={<Empty icon="bell" title="Nothing yet" text="Join requests, replies and reminders about your plans show up here." />}
      />
      {safe ? (
        <Sheet title="Arrived safely?" onClose={() => setSafe(null)}>
          <P style={{ marginBottom: 16 }}>&quot;{safe.desc}&quot; at {safe.venue} started {ago(safe.when, now)}. Let us know you&apos;re OK.</P>
          <Btn title="Yes, I'm OK" icon="check-circle" onPress={() => ok(safe)} />
          <View style={{ height: 8 }} />
          <Btn title="I need help" icon="alert-triangle" kind="danger" onPress={() => { const id = safe.id; setSafe(null); router.push({ pathname: '/sos', params: { id } }); }} />
          <P small mute style={{ marginTop: 12 }}>No answer within 30 minutes? We&apos;ll remind you and offer to alert {trustedOf(m)?.name ?? 'your trusted contact'}.</P>
        </Sheet>
      ) : null}
    </View>
  );
}

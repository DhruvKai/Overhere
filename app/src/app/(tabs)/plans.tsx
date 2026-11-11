import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, SectionList, View } from 'react-native';
import { Header } from '@/components/Header';
import { Badge, Btn, Empty, H, Icon, PlanRow, SaveToggle } from '@/components/ui';
import { inChat, myPlans, myReq, nowOf, saved, type Model, type Plan } from '@/lib/model';
import { useModel, useStore, useToggleSave } from '@/lib/store';
import { useTheme } from '@/lib/theme';

function status(m: Model, a: Plan): [string, 'ok' | 'bad' | 'warn' | 'info' | 'acc'] {
  if (a.host === m.me) {
    const waiting = m.reqs.filter(r => r.act === a.id && r.status === 'pending').length;
    return waiting ? [`${waiting} to review`, 'warn'] : ['Hosting', 'acc'];
  }
  const r = myReq(m, a.id);
  switch (r?.status) {
    case 'accepted': return ['Going', 'ok'];
    case 'pending': return ['Pending', 'warn'];
    case 'waitlist': case 'closed': case 'rejected': return ['Closed', 'info'];
    case 'left': return ['You left', 'info'];
    case 'removed': return ['Removed', 'bad'];
    default: return ['', 'info'];
  }
}

/* Plans you host, joined or asked to join, with their group chats. */
export default function Plans() {
  const t = useTheme();
  const m = useModel();
  const { refresh } = useStore();
  const toggleSave = useToggleSave();
  const [pulling, setPulling] = useState(false);
  const now = nowOf(m);
  const all = myPlans(m);
  /* saved from Discover, until you ask to join, the plan starts or it's gone */
  const savedPlans = saved(m).map(id => m.acts.find(a => a.id === id)).filter((a): a is Plan => !!a && a.when > now && !myReq(m, a.id)).sort((a, b) => a.when - b.when);
  const sections = [
    { title: 'Saved for later', data: savedPlans },
    { title: 'Coming up', data: all.filter(a => a.when > now && (a.host === m.me || ['accepted', 'pending'].includes(myReq(m, a.id)?.status ?? ''))) },
    { title: 'Past and closed', data: all.filter(a => a.when <= now || (a.host !== m.me && !['accepted', 'pending'].includes(myReq(m, a.id)?.status ?? ''))).reverse() },
  ].filter(s => s.data.length);

  return (
    <View style={{ flex: 1 }}>
      <Header title="My plans" />
      <SectionList
        sections={sections}
        keyExtractor={a => a.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={pulling} onRefresh={async () => { setPulling(true); await refresh(); setPulling(false); }} tintColor={t.acc} />}
        renderSectionHeader={({ section }) => <View style={{ paddingTop: 10, paddingBottom: 8 }}><H size={17}>{section.title}</H></View>}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item, section }) => {
          if (section.title === 'Saved for later') {
            return <PlanRow m={m} a={item} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: item.id } })} right={<SaveToggle on onPress={() => toggleSave(item.id)} />} />;
          }
          const [txt, tone] = status(m, item);
          const unreadChat = inChat(m, item) && (m.chats[item.id]?.length ?? 0) > 0;
          return (
            <PlanRow m={m} a={item} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: item.id } })}
              right={(
                <View style={{ alignItems: 'flex-end', gap: 10 }}>
                  {txt ? <Badge text={txt} tone={tone} /> : null}
                  {inChat(m, item) ? (
                    <Pressable accessibilityRole="button" accessibilityLabel="Open group chat" hitSlop={10}
                      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } })}
                      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: unreadChat ? t.acc2 : t.field, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="message-circle" size={19} color={t.accink} />
                    </Pressable>
                  ) : null}
                </View>
              )} />
          );
        }}
        ListEmptyComponent={(
          <Empty icon="calendar" title="No plans yet" text="Ask to join something from Swipe or Discover, or post your own plan.">
            <Btn title="Post a plan" icon="plus" onPress={() => router.push('/post')} />
          </Empty>
        )}
      />
    </View>
  );
}

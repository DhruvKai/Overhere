import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from 'react-native';
import { api } from '@/lib/api';
import { spots, uname, type Plan } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { Btn, Field, H, P } from './ui';

/* Ask to join, with an optional note to the host. Asking needs the face check first (request_join). */
export function JoinSheet({ plan, onClose, onDone }: { plan: Plan | null; onClose: () => void; onDone?: () => void }) {
  const t = useTheme();
  const m = useModel();
  const { run, toast } = useStore();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  if (!plan) return null;
  const full = spots(plan) <= 0 || plan.status === 'full';
  const host = uname(m, plan.host);

  async function send() {
    if (!plan) return;
    if (!m.profile?.face) { onClose(); router.push('/verify'); return; }
    setBusy(true);
    const st = await run(() => api.requestJoin(plan.id, note.trim()));
    setBusy(false);
    if (st === undefined) return;
    toast(st === 'waitlist' ? `You're on the waitlist. Your request goes to ${host} if a spot opens.`
      : st === 'accepted' ? `${host} said yes! Say hi in the group chat.` : `Request sent to ${host}. Follow it in My plans.`);
    setNote('');
    onClose();
    onDone?.();
  }

  return (
    <Modal transparent visible animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.35)' }} onPress={onClose} accessibilityLabel="Close" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ backgroundColor: t.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 34 }}>
          <H size={20}>{full ? 'Join the waitlist?' : `Ask ${host} to join?`}</H>
          <P mute style={{ marginTop: 6, marginBottom: 16 }}>
            {full ? `It's full right now. If a spot opens, your request goes to ${host}.` : `${host} sees your profile and decides. If they say yes, you're in the group chat.`}
          </P>
          <Field label="Note to the host (optional)" value={note} onChangeText={setNote} maxLength={100} placeholder="Hi! I love this film…" multiline />
          <P small mute style={{ marginBottom: 16 }}>Meet in public, tell someone where you&apos;re going, and leave whenever you like.</P>
          <Btn title={full ? 'Join waitlist' : 'Send request'} onPress={send} busy={busy} icon="send" />
          <View style={{ height: 8 }} />
          <Btn title="Cancel" kind="ghost" onPress={onClose} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

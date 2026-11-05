import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/lib/api';
import { column } from '@/lib/layout';
import { useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { Btn, Chip, Field, H, P } from './ui';

/* Report a person, a plan or a message. Reports go to the team (the reports table); blocking is separate. */
export function ReportSheet({ open, title, reasons, target, act, msg, onClose }: {
  open: boolean; title: string; reasons: string[]; target?: string | null; act?: string | null; msg?: number | null; onClose: () => void;
}) {
  const t = useTheme();
  /* the sheet runs edge to edge, so it clears the gesture bar or a tablet's taskbar itself */
  const pad = 20 + Math.max(useSafeAreaInsets().bottom, 14);
  const { run, toast } = useStore();
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  if (!open) return null;

  async function send() {
    if (!reason) return toast('Pick a reason');
    setBusy(true);
    const ok = await run(() => api.report({ target, act, msg, reason, note: note.trim() }));
    setBusy(false);
    if (ok === undefined) return;
    toast("Thanks. We'll look at it, and we may email you.");
    setReason(''); setNote(''); onClose();
  }

  return (
    <Modal transparent visible animationType="slide" onRequestClose={onClose}>
      {/* the dimmed backdrop covers the screen; the sheet keeps to the middle column on tablets (lib/layout.ts) */}
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.35)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close" />
        <KeyboardAvoidingView behavior="padding">
          <ScrollView style={[{ backgroundColor: t.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: 560 }, column]}
            contentContainerStyle={{ padding: 20, paddingBottom: pad }} keyboardShouldPersistTaps="handled">
            <H size={20}>{title}</H>
            <P mute style={{ marginTop: 6, marginBottom: 14 }}>If you&apos;re in danger, call 112 first.</P>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {reasons.map(r => <Chip key={r} label={r} on={reason === r} onPress={() => setReason(r)} />)}
            </View>
            <Field label="What happened? (optional)" value={note} onChangeText={setNote} maxLength={500} multiline />
            <Btn title="Send report" onPress={send} busy={busy} />
            <View style={{ height: 8 }} />
            <Btn title="Cancel" kind="ghost" onPress={onClose} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

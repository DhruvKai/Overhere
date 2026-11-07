import { useState } from 'react';
import { Text, View } from 'react-native';
import { Btn, Chip, Field, P } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { Sheet } from './Sheet';

/* Leaving a plan or removing someone needs a reason from a list, or the person's own words for "Other" (the 7 Nov spec).
   onPick gets the reason and resolves once it's done; the sheet stays open (busy) until then. */
export function ReasonSheet({ title, intro, reasons, note, action, onPick, onClose }: {
  title: string; intro: string; reasons: string[]; note?: string; action: string;
  onPick: (reason: string) => Promise<unknown>; onClose: () => void;
}) {
  const t = useTheme();
  const [pick, setPick] = useState('');
  const [other, setOther] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function go() {
    const why = pick === 'Other' ? other.trim() : pick;
    if (!pick) return setErr('Pick a reason');
    if (!why) return setErr('Say why in your own words');
    setBusy(true); setErr('');
    await onPick(why);
    setBusy(false);
  }
  return (
    <Sheet title={title} onClose={onClose}>
      <P style={{ marginBottom: 12 }}>{intro}</P>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {reasons.map(r => <Chip key={r} label={r} on={pick === r} onPress={() => { setPick(r); setErr(''); }} />)}
      </View>
      {pick === 'Other' ? <Field label="In your own words" value={other} onChangeText={setOther} maxLength={150} autoFocus /> : null}
      {note ? <P small mute style={{ marginBottom: 12 }}>{note}</P> : null}
      {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, marginBottom: 10, fontSize: 14 }}>{err}</Text> : null}
      <Btn title={action} kind="danger" onPress={go} busy={busy} />
    </Sheet>
  );
}

import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Btn, Chip, Field, Label } from '@/components/ui';
import { api } from '@/lib/api';
import { defEmo, EMOJIS, INTERESTS, TIMES } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

const toggle = (l: string[], v: string) => (l.includes(v) ? l.filter(x => x !== v) : [...l, v]);

/* Name, avatar, job, bio and likes. Date of birth, gender and home area stay as set at sign-up for now. */
export default function EditProfile() {
  const t = useTheme();
  const m = useModel();
  const { run, toast } = useStore();
  const p = m.profile!;
  const [name, setName] = useState(p.name);
  const [emo, setEmo] = useState(p.emo || defEmo(p.gender));
  const [job, setJob] = useState(p.job);
  const [bio, setBio] = useState(p.bio);
  const [ints, setInts] = useState<string[]>(p.ints);
  const [avail, setAvail] = useState<string[]>(p.avail);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!name.trim()) return toast('Add your first name');
    setBusy(true);
    const ok = await run(() => api.saveProfile({ name: name.trim(), emo, job: job.trim(), bio: bio.trim(), ints, avail }));
    setBusy(false);
    if (ok !== undefined) { toast('Saved'); router.back(); }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Label>Your avatar</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {EMOJIS.map(e => (
            <Pressable key={e} accessibilityRole="button" accessibilityState={{ selected: emo === e }} accessibilityLabel={`Avatar ${e}`} onPress={() => setEmo(e)}
              style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: emo === e ? t.acc : 'transparent', backgroundColor: t.field }}>
              <Text style={{ fontSize: 22 }}>{e}</Text>
            </Pressable>
          ))}
        </View>
        <Field label="First name" value={name} onChangeText={setName} maxLength={40} />
        <Field label="What you do (optional)" value={job} onChangeText={setJob} maxLength={40} placeholder="e.g. Designer, student" />
        <Field label="About you (optional)" value={bio} onChangeText={setBio} maxLength={300} multiline hint={`${bio.length}/300`} />
        <Label>What you like</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {INTERESTS.map(v => <Chip key={v} label={v} on={ints.includes(v)} onPress={() => setInts(l => toggle(l, v))} />)}
        </View>
        <Label>When you&apos;re free</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {TIMES.map(v => <Chip key={v} label={v} on={avail.includes(v)} onPress={() => setAvail(l => toggle(l, v))} />)}
        </View>
        <Btn title="Save" onPress={save} busy={busy} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { PhotoPair } from '@/components/PhotoPair';
import { PlacePicker } from '@/components/PlacePicker';
import { Avatar, BottomBar, Btn, Chip, Field, Label, P, Wrap } from '@/components/ui';
import { api } from '@/lib/api';
import { setPhoto } from '@/lib/avatar';
import { isoDob, maskDob, showDob } from '@/lib/dob';
import { defEmo, EMOJIS, GENDERS, MIN_INTS, NEAR_KM, TIMES, trustedOf } from '@/lib/model';
import { InterestPicker } from '@/components/InterestPicker';
import type { Gender } from '@/lib/types';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

const toggle = (l: string[], v: string) => (l.includes(v) ? l.filter(x => x !== v) : [...l, v]);

/* Name, avatar (an emoji, or two photos of your face that the face check is matched against), date of birth, gender,
   home area, job, bio and likes, as on the website. After the ID check, date of birth and gender come from the ID. */
export default function EditProfile() {
  const t = useTheme();
  const m = useModel();
  const { run, toast, savePriv, session } = useStore();
  const p = m.profile!;
  const [name, setName] = useState(p.name);
  const [last, setLast] = useState(p.last_name ?? '');
  const [emo, setEmo] = useState(p.emo || defEmo(p.gender));
  const [dob, setDob] = useState(showDob(p.dob));
  const [gender, setGender] = useState<Gender>(p.gender);
  const [hood, setHood] = useState(p.hood);
  const [ll, setLl] = useState<[number, number] | null>(p.lat != null && p.lng != null ? [p.lat, p.lng] : null);
  const [job, setJob] = useState(p.job);
  const [bio, setBio] = useState(p.bio);
  const [ints, setInts] = useState<string[]>(p.ints);
  const [avail, setAvail] = useState<string[]>(p.avail);
  const [tName, setTName] = useState(trustedOf(m)?.name ?? '');
  const [tPhone, setTPhone] = useState(trustedOf(m)?.phone ?? '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [photoBusy, setPhotoBusy] = useState(false);
  const [emoPicked, setEmoPicked] = useState(false);   // picking an emoji while you have photos removes them on Save
  const hasPhoto = !!p.photo && !emoPicked;

  async function removePhotos() {
    setPhotoBusy(true);
    const reset = await run(() => setPhoto(null));
    setPhotoBusy(false);
    if (reset !== undefined) toast(reset === true ? 'Photos removed. Add two photos and redo the face check to be verified again.' : 'Photos removed. Showing your emoji.');
  }

  async function save() {
    /* trusted contact: both or neither (the same checks as the website) */
    const tn = tName.trim(), tp = tPhone.trim(), digits = tp.replace(/\D/g, '');
    const own = (session?.user.phone || '').replace(/\D/g, '').slice(-10);
    const iso = isoDob(dob);
    /* shown above Save (the bottom bar), like the sign-up pages */
    const problem = !name.trim() ? 'Add your first name' : !last.trim() ? 'Add your last name' : !iso ? 'Enter your date of birth as DD/MM/YYYY'
      : !ll ? 'Pick your home area from the list' : ints.length < MIN_INTS ? `Pick at least ${MIN_INTS} things you like doing`
      : !avail.length ? "Pick when you're usually free"
      : (tn || tp) && (!tn || digits.length < 7) ? 'Add a name and a valid phone for your trusted contact, or leave both empty'
      : tp && own && digits.slice(-10) === own ? "Your trusted contact can't be the number you signed in with" : '';
    setErr(problem);
    if (problem || !ll) return;
    savePriv({ trusted: tn ? { name: tn.slice(0, 40), phone: tp.slice(0, 20) } : null });
    setBusy(true);
    const ok = await run(async () => {
      await api.saveProfile({
        name: name.trim(), last_name: last.trim(), emo, job: job.trim(), bio: bio.trim(), ints, avail, hood, lat: ll[0], lng: ll[1],
        /* the database refuses changes to these after the ID check, so they're only sent before it */
        ...(p.kyc ? {} : { dob: iso, gender }),
      });
      if (emoPicked && p.photo) await setPhoto(null);
    });
    setBusy(false);
    if (ok !== undefined) { toast('Saved'); router.back(); }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <Label>Your photos</Label>
        <P mute small style={{ marginBottom: 10 }}>
          Photo 1 is your profile picture. The face check needs both and matches your live face against each.{p.face && p.photo ? ' A new photo means doing the face check again.' : ''}
        </P>
        <PhotoPair onSaved={() => setEmoPicked(false)} />
        {p.photo && !emoPicked ? <Btn title="Remove photos" icon="trash-2" kind="ghost" onPress={removePhotos} busy={photoBusy} style={{ marginBottom: 16 }} /> : null}
        <Label>Or an emoji</Label>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 12 }}>
          {hasPhoto ? <Avatar m={m} id={m.me} size={56} /> : (
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: t.field, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 30 }}>{emo}</Text></View>
          )}
          <P mute small style={{ flex: 1 }}>
            {p.photo ? `Picking an emoji removes your photos when you save${p.face ? ', and means redoing your face check' : ''}.` : 'Other people see this next to your name until you add photos.'}
          </P>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {EMOJIS.map(e => (
            <Pressable key={e} accessibilityRole="button" accessibilityState={{ selected: !hasPhoto && emo === e }} accessibilityLabel={`Avatar ${e}`} onPress={() => { setEmo(e); if (p.photo) setEmoPicked(true); }}
              style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: !hasPhoto && emo === e ? t.acc : 'transparent', backgroundColor: t.field }}>
              <Text style={{ fontSize: 22 }}>{e}</Text>
            </Pressable>
          ))}
        </View>
        <Field label="First name" value={name} onChangeText={setName} maxLength={40} autoComplete="given-name" textContentType="givenName" />
        <Field label="Last name" value={last} onChangeText={setLast} maxLength={40} autoComplete="family-name" textContentType="familyName" />
        <Field label="Date of birth" value={dob} onChangeText={v => setDob(maskDob(v))} placeholder="DD/MM/YYYY" keyboardType="number-pad" maxLength={10} editable={!p.kyc} />
        <Label>Gender</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {GENDERS.map(g => <Chip key={g} label={g} on={gender === g} onPress={() => { if (!p.kyc) setGender(g); }} />)}
        </View>
        <P mute small style={{ marginBottom: 14 }}>
          {p.kyc ? 'Confirmed by your ID check. To change these, email admin@overhere.social.' : 'Used for plans that are only for some people, like women-only plans.'}
        </P>
        <PlacePicker label="Home area" mode="area" value={hood} picked={!!ll} placeholder="Search your area or city"
          onChange={v => { setHood(v); setLl(null); }} onPick={x => { setHood(x.label); setLl(x.ll); }}
          hint={`You see plans within ${NEAR_KM} km of here.`} locate="home" />
        <Field label="What you do" value={job} onChangeText={setJob} maxLength={40} placeholder="e.g. Designer, student" />
        <Field label="About you" value={bio} onChangeText={setBio} maxLength={300} multiline hint={`${bio.length}/300`} />
        <Label>What you like doing</Label>
        <InterestPicker value={ints} onChange={setInts} />
        <Label>When you&apos;re usually free</Label>
        <Wrap>{TIMES.map(v => <Chip key={v} label={v} on={avail.includes(v)} onPress={() => setAvail(l => toggle(l, v))} />)}</Wrap>
        <Label>Trusted contact</Label>
        <P mute small style={{ marginBottom: 10 }}>SOS can alert them in one tap, with your location. Only you see this.</P>
        <Field label="Name" value={tName} onChangeText={setTName} placeholder="e.g. Mum, Riya" maxLength={40} />
        <Field label="Phone" value={tPhone} onChangeText={setTPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" maxLength={20} />
      </ScrollView>
      <BottomBar>
        {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, fontSize: 14 }}>{err}</Text> : null}
        <Btn title="Save" onPress={save} busy={busy} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

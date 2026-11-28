import { useLocalSearchParams } from 'expo-router';
import { goBack } from '@/lib/nav';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, Text, View, type ScrollViewInstance, type TextInputInstance } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PhotoPair } from '@/components/PhotoPair';
import { PlacePicker } from '@/components/PlacePicker';
import { BottomBar, Btn, Chip, Field, Icon, Label, P, Wrap } from '@/components/ui';
import { api } from '@/lib/api';
import { setPhoto } from '@/lib/avatar';
import { isoDob, maskDob, showDob } from '@/lib/dob';
import { GENDERS, homeLL, MIN_INTS, NEAR_KM, TIMES, trustedOf } from '@/lib/model';
import { InterestPicker } from '@/components/InterestPicker';
import type { Gender } from '@/lib/types';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { FormScroll, KeyboardSafe } from '@/components/KeyboardSafe';

const toggle = (l: string[], v: string) => (l.includes(v) ? l.filter(x => x !== v) : [...l, v]);

/* Name, two photos of your face (the face check is matched against them), date of birth, gender,
   home area, job, bio and likes, as on the website. Date of birth and gender are fixed once given at sign-up. */
export default function EditProfile() {
  const t = useTheme();
  /* Android draws behind its navigation buttons, so the end of the page keeps clear of them */
  const insets = useSafeAreaInsets();
  const m = useModel();
  const { run, toast, savePriv, session } = useStore();
  const p = m.profile!;
  const [name, setName] = useState(p.name);
  const [last, setLast] = useState(p.last_name ?? '');
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

  /* Profile's "Finish your profile" opens this with ?focus=job|bio|photos: scroll that part into view (Spot outlines
     it for a moment) and, for a text field, put the cursor in it. Only once, on the first layout. */
  const { focus } = useLocalSearchParams<{ focus?: 'job' | 'bio' | 'photos' }>();
  const sv = useRef<ScrollViewInstance>(null);
  const jobBox = useRef<TextInputInstance>(null), bioBox = useRef<TextInputInstance>(null);
  const jumped = useRef(false);
  const jumpTo = (y: number) => {
    if (jumped.current) return;
    jumped.current = true;
    setTimeout(() => {
      sv.current?.scrollTo({ y: Math.max(0, y - 24), animated: true });
      const box = focus === 'job' ? jobBox : focus === 'bio' ? bioBox : null;
      if (box) setTimeout(() => box.current?.focus(), 450);
    }, 150);
  };

  async function removePhotos() {
    setPhotoBusy(true);
    const reset = await run(() => setPhoto(null));
    setPhotoBusy(false);
    if (reset !== undefined) toast(reset === true ? 'Photos removed. Add two photos and redo the face check to be verified again.' : 'Photos removed.');
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
        name: name.trim(), last_name: last.trim(), job: job.trim(), bio: bio.trim(), ints, avail, hood, lat: ll[0], lng: ll[1],
        /* fixed once given at sign-up (the database refuses a change), so only sent by an older account that never gave one */
        ...(p.dob ? {} : { dob: iso }), ...(p.gender ? {} : { gender }),
      });
    });
    setBusy(false);
    if (ok !== undefined) { toast('Saved'); goBack(); }
  }

  return (
    <KeyboardSafe>
      <FormScroll ref={sv} contentContainerStyle={{ padding: 20, paddingBottom: 24 + insets.bottom }}>
        <Spot on={focus === 'photos'} onY={jumpTo}>
          <Label>Your photos</Label>
          <P mute small style={{ marginBottom: 10 }}>
            Photo 1 is your profile picture. The face check needs both and matches your live face against each.
          </P>
          <PhotoPair />
        </Spot>
        {p.photo ? <Btn title="Remove photos" icon="trash-2" kind="ghost" onPress={removePhotos} busy={photoBusy} style={{ marginBottom: 16 }} /> : null}
        <Field label="First name" value={name} onChangeText={setName} maxLength={40} autoComplete="given-name" textContentType="givenName" />
        <Field label="Last name" value={last} onChangeText={setLast} maxLength={40} autoComplete="family-name" textContentType="familyName" />
        {/* Once given, date of birth and gender are fixed: shown as locked rows (no field background, a lock, muted text)
            so they read as read-only at a glance, not as fields that don't respond. */}
        {p.dob ? <Locked label="Date of birth" value={dob} /> : (
          <Field label="Date of birth" value={dob} onChangeText={v => setDob(maskDob(v))} placeholder="DD/MM/YYYY" keyboardType="number-pad" maxLength={10} />
        )}
        {p.gender ? <Locked label="Gender" value={gender} /> : (<>
          <Label>Gender</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {GENDERS.map(g => <Chip key={g} label={g} on={gender === g} onPress={() => setGender(g)} />)}
          </View>
        </>)}
        <P mute small style={{ marginBottom: 14 }}>
          {p.dob && p.gender ? "Your date of birth and gender can't be changed. If either is wrong, email admin@overhere.social."
            : 'Used for plans that are only for some people, like women-only plans.'}
        </P>
        <PlacePicker label="Home area" mode="area" value={hood} picked={!!ll} near={homeLL(m)} placeholder="Search your area or city"
          onChange={v => { setHood(v); setLl(null); }} onPick={x => { setHood(x.label); setLl(x.ll); }}
          hint={`You see plans within ${NEAR_KM} km of here.`} locate="home" />
        <Spot on={focus === 'job'} onY={jumpTo}>
          <Field ref={jobBox} label="What you do" value={job} onChangeText={setJob} maxLength={40} placeholder="e.g. Designer, student" />
        </Spot>
        <Spot on={focus === 'bio'} onY={jumpTo}>
          <Field ref={bioBox} label="About you" value={bio} onChangeText={setBio} maxLength={300} multiline hint={`${bio.length}/300`} />
        </Spot>
        <Interests value={ints} onChange={setInts} />
        <Label>When you&apos;re usually free</Label>
        <Wrap>{TIMES.map(v => <Chip key={v} label={v} on={avail.includes(v)} onPress={() => setAvail(l => toggle(l, v))} />)}</Wrap>
        <Label>Trusted contact</Label>
        <P mute small style={{ marginBottom: 10 }}>SOS can alert them in one tap, with your location. Only you see this.</P>
        <Field label="Name" value={tName} onChangeText={setTName} placeholder="e.g. Mum, Riya" maxLength={40} />
        <Field label="Phone" value={tPhone} onChangeText={setTPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" maxLength={20} />
      </FormScroll>
      <BottomBar>
        {err ? <Text accessibilityLiveRegion="polite" style={{ color: t.bad, fontSize: 14 }}>{err}</Text> : null}
        <Btn title="Save" onPress={save} busy={busy} />
      </BottomBar>
    </KeyboardSafe>
  );
}

/* Interests, folded away as one row (the list is long): what you picked so far as a few chips and how many more, and a
   chevron. Tapping it opens the full picker under it (the Interests <details> in Edit profile in web/app.js). */
function Interests({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const t = useTheme();
  const still = useReducedMotion();
  const [open, setOpen] = useState(false);
  const turn = useSharedValue(0);
  useEffect(() => { turn.set(withTiming(open ? 1 : 0, { duration: still ? 0 : 200 })); }, [open, still, turn]);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get() * 180}deg` }] }));
  const K = 4;
  return (
    <View style={{ marginBottom: 16, borderWidth: 1, borderColor: t.line, borderRadius: 16, backgroundColor: t.chip, overflow: 'hidden' }}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={`Interests, ${value.length} picked`} onPress={() => setOpen(o => !o)}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: pressed ? t.field : 'transparent' })}>
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14 }}>Interests</Text>
          {value.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {value.slice(0, K).map(x => (
                <Text key={x} style={{ backgroundColor: t.acc2, color: t.accink, fontSize: 12.5, fontWeight: '600', paddingHorizontal: 11, paddingVertical: 4, borderRadius: 99, overflow: 'hidden' }}>{x}</Text>
              ))}
              {value.length > K ? <Text style={{ color: t.mute, fontSize: 12.5, fontWeight: '600', paddingLeft: 2 }}>+{value.length - K} more</Text> : null}
            </View>
          ) : <Text style={{ color: t.mute, fontSize: 13 }}>Tap to pick at least {MIN_INTS}</Text>}
        </View>
        <Animated.View style={chevron}><Icon name="chevron-down" size={18} color={t.mute} /></Animated.View>
      </Pressable>
      {open ? (
        <Animated.View entering={still ? undefined : FadeIn.duration(180)} style={{ paddingHorizontal: 16, paddingBottom: 4, borderTopWidth: 1, borderTopColor: t.line, paddingTop: 12 }}>
          <InterestPicker value={value} onChange={onChange} />
        </Animated.View>
      ) : null}
    </View>
  );
}

/* Wraps a part of the form Profile can send you to. When it's the one (on), it reports where it sits in the scroll
   view and glows: a green outline and tint behind it that fades in, holds for a couple of seconds, then fades out. */
function Spot({ on, onY, children }: { on: boolean; onY: (y: number) => void; children: ReactNode }) {
  const t = useTheme();
  const glow = useSharedValue(0);
  const still = useReducedMotion();
  useEffect(() => {
    if (!on) return;
    const fade = still ? 0 : 1;
    glow.value = withDelay(400, withSequence(withTiming(1, { duration: 250 * fade }), withDelay(2200, withTiming(0, { duration: 800 * fade }))));
  }, [on, still, glow]);
  const style = useAnimatedStyle(() => ({ opacity: glow.value }));
  return (
    <View onLayout={on ? e => onY(e.nativeEvent.layout.y) : undefined}>
      {on ? <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: -8, left: -10, right: -10, bottom: 2, borderRadius: 16, borderWidth: 2, borderColor: t.acc, backgroundColor: t.acc2 }, style]} /> : null}
      {children}
    </View>
  );
}

/* A detail that can't be edited: the label with "Locked", then the value in a dashed outline with no field fill and a lock,
   so it can't be mistaken for a text box or a choice. */
function Locked({ label, value }: { label: string; value: string }) {
  const t = useTheme();
  return (
    <View style={{ marginBottom: 14 }} accessible accessibilityLabel={`${label}: ${value}. Locked, can't be changed.`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14 }}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: t.field, borderRadius: 99, paddingHorizontal: 7, paddingVertical: 2 }}>
          <Icon name="lock" size={10} color={t.mute} />
          <Text style={{ color: t.mute, fontSize: 11, fontWeight: '700' }}>Locked</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: t.line }}>
        <Text style={{ color: t.mute, fontSize: 16, flex: 1 }}>{value}</Text>
        <Icon name="lock" size={16} color={t.mute} />
      </View>
    </View>
  );
}

import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { Btn, Field, H, Icon, P } from '@/components/ui';
import { trustedOf } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

type Loc = { lat: number; lng: number; acc: number };
async function getLoc(): Promise<Loc | null> {
  try {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') return null;
    const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    return { lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy ?? 50 };
  } catch { return null; }
}

/* Get help: call 112, or alert your trusted contact by SMS, WhatsApp or a call, with where you are. The same as the
   website's SOS sheet (web/app.js, type 'sos'). Nothing is sent by Overhere: the phone's own apps send it. */
export default function Sos() {
  const t = useTheme();
  const m = useModel();
  const { savePriv, toast, session } = useStore();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const a = id ? m.acts.find(x => x.id === id) : undefined;
  const tc = trustedOf(m);
  const [loc, setLoc] = useState<Loc | null>(null);
  const [locState, setLocState] = useState<'wait' | 'ok' | 'fail'>('wait');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  /* where you are, for the message (asked once on opening; Try again asks again) */
  const locate = () => getLoc().then(l => { setLoc(l); setLocState(l ? 'ok' : 'fail'); });
  useEffect(() => { locate(); }, []);
  const findMe = () => { setLocState('wait'); locate(); };

  const where = loc ? `https://maps.google.com/?q=${loc.lat.toFixed(5)},${loc.lng.toFixed(5)}` : '';
  const text = `SOS from Overhere: I need help.${a ? ` I'm at "${a.desc}" (${a.venue}).` : ''}${where ? ' My location: ' + where : ''} Please call me now.`;
  const ph = tc ? tc.phone.replace(/[^\d+]/g, '') : '';
  const wa = ph.replace('+', '').replace(/^0?(\d{10})$/, '91$1');   // WhatsApp wants the country code
  const open = (url: string) => Linking.openURL(url).catch(() => toast("Couldn't open that on this phone"));

  function saveContact() {
    const n = name.trim(), p = phone.trim();
    if (!n || p.replace(/\D/g, '').length < 7) return toast('Add a name and a valid phone number');
    const own = (session?.user.phone || '').replace(/\D/g, '').slice(-10);
    if (own && p.replace(/\D/g, '').slice(-10) === own) return toast("Your trusted contact can't be your own number");
    savePriv({ trusted: { name: n.slice(0, 40), phone: p.slice(0, 20) } });
    toast('Trusted contact saved');
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Btn title="Call emergency services (112)" icon="phone" kind="alarm" onPress={() => open('tel:112')} />
      <H size={18}>Alert your trusted contact</H>
      {tc ? (<>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <Icon name={locState === 'fail' ? 'alert-triangle' : 'map-pin'} size={14} color={t.mute} />
          <Text style={{ color: t.mute, fontSize: 14, flex: 1 }}>
            {locState === 'wait' ? 'Finding your location…' : loc ? `Location found (within about ${Math.max(5, Math.round(loc.acc))} m)` : "Couldn't get your location, so the message names the venue instead."}
          </Text>
          {locState === 'fail' ? <Text onPress={findMe} style={{ color: t.accink, fontWeight: '700' }}>Try again</Text> : null}
        </View>
        <Btn title={`Text ${tc.name}${loc ? ' my location' : ''}`} icon="message-circle" onPress={() => open(`sms:${ph}?body=${encodeURIComponent(text)}`)} />
        <Btn title={`WhatsApp ${tc.name}`} kind="soft" onPress={() => open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`)} />
        <Btn title={`Call ${tc.name}`} icon="phone" kind="ghost" onPress={() => open(`tel:${ph}`)} />
      </>) : (<>
        <P mute>Add someone now so you can alert them in one tap. Only you see this.</P>
        <Field label="Name" value={name} onChangeText={setName} placeholder="e.g. Mum, Riya" maxLength={40} />
        <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" maxLength={20} />
        <Btn title="Save contact" onPress={saveContact} />
      </>)}
      <P mute small style={{ marginTop: 8 }}>Nothing is sent until you press send in your own SMS or WhatsApp app.</P>
    </ScrollView>
  );
}

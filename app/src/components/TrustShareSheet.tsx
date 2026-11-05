import { useState } from 'react';
import { Linking, Share, Text, View } from 'react-native';
import { trustedOf, uname, type Plan } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { Sheet } from './Sheet';
import { Btn, Field, Icon, P } from './ui';

const fmt = (t: number) => new Date(t).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

/* Send your trusted contact where you'll be and who with (the website's "Share with trusted contact"). Without a
   contact yet, add one first. Nothing is sent by Overhere: the phone's SMS or WhatsApp sends it. */
export function TrustShareSheet({ plan: a, onClose }: { plan: Plan; onClose: () => void }) {
  const t = useTheme();
  const m = useModel();
  const { savePriv, toast, session } = useStore();
  const tc = trustedOf(m);
  const [editing, setEditing] = useState(!tc);
  const [name, setName] = useState(tc?.name ?? '');
  const [phone, setPhone] = useState(tc?.phone ?? '');

  function save() {
    const n = name.trim(), p = phone.trim();
    if (!n || p.replace(/\D/g, '').length < 7) return toast('Add a name and a valid phone number');
    const own = (session?.user.phone || '').replace(/\D/g, '').slice(-10);
    if (own && p.replace(/\D/g, '').slice(-10) === own) return toast("That's the number you signed in with. Add someone else's number");
    savePriv({ trusted: { name: n.slice(0, 40), phone: p.slice(0, 20) } });
    toast('Trusted contact saved');
    setEditing(false);
  }

  if (editing || !tc) {
    return (
      <Sheet title="Trusted contact" onClose={onClose}>
        <P small mute style={{ marginBottom: 12 }}>Pick someone you trust. When you join a plan you can send them where you&apos;ll be and who with. Only you see this.</P>
        <Field label="Name" value={name} onChangeText={setName} placeholder="e.g. Mum, Riya" maxLength={40} />
        <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" maxLength={20} />
        <Btn title="Save and continue" onPress={save} />
      </Sheet>
    );
  }

  const who = a.members.filter(x => x !== m.me && x !== '?').map(x => uname(m, x)).join(', ');
  const text = `Hi ${tc.name}, sharing my plan: "${a.desc}" on ${fmt(a.when)} at ${a.venue}. Hosted by ${uname(m, a.host)}${who ? `, also going: ${who}` : ''}. I'll message you when I'm done. (Sent from Overhere)`;
  const ph = tc.phone.replace(/[^\d+]/g, '');
  const wa = ph.replace('+', '').replace(/^0?(\d{10})$/, '91$1');   // WhatsApp wants the country code
  const open = (url: string) => Linking.openURL(url).catch(() => toast("Couldn't open that on this phone"));

  return (
    <Sheet title="Share with trusted contact" onClose={onClose}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Icon name="shield" size={15} color={t.ok} />
        <Text style={{ flex: 1, color: t.ink2, fontSize: 14 }}>To <Text style={{ fontWeight: '700', color: t.ink }}>{tc.name}</Text> · {tc.phone}</Text>
        <Text accessibilityRole="button" onPress={() => setEditing(true)} style={{ color: t.accink, fontWeight: '700' }}>Change</Text>
      </View>
      <View style={{ backgroundColor: t.field, borderRadius: 12, padding: 12, marginBottom: 14 }}><Text selectable style={{ color: t.ink, fontSize: 15, lineHeight: 21 }}>{text}</Text></View>
      <Btn title="Send as SMS" icon="message-circle" onPress={() => open(`sms:${ph}?body=${encodeURIComponent(text)}`)} />
      <View style={{ height: 8 }} />
      <Btn title="Send on WhatsApp" kind="soft" onPress={() => open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`)} />
      <View style={{ height: 8 }} />
      <Btn title="Share another way" kind="ghost" icon="share" onPress={() => Share.share({ message: text })} />
    </Sheet>
  );
}

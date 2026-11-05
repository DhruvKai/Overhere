import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/lib/api';
import { FACES, fbDue, MICRO, MICRO_FACES } from '@/lib/feedback';
import { COLUMN } from '@/lib/layout';
import { nowOf } from '@/lib/model';
import { useModel, useStore } from '@/lib/store';
import { SITE } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { Sheet } from './Sheet';
import { Btn, Check, Chip, Field, Icon, Label, P } from './ui';

/* The required consent line, with the privacy policy one tap away. */
function Consent({ on, onPress, what = 'my feedback is' }: { on: boolean; onPress: () => void; what?: string }) {
  const t = useTheme();
  return (
    <Check on={on} onPress={onPress}>
      <Text style={{ fontSize: 14, lineHeight: 20, color: t.ink2 }}>
        <Text style={{ fontWeight: '700' }}>Required:</Text> I agree {what} stored and used to improve Overhere (
        <Text style={{ color: t.accink, fontWeight: '700' }} onPress={() => WebBrowser.openBrowserAsync(SITE + '/privacy.html')}>Privacy policy</Text>).
      </Text>
    </Check>
  );
}

/* The feedback sheet, the same questions as the website's. `from` says where it was opened (card, profile, meetup),
   which is sent with it. Send stays off until a face is picked and the required box is ticked. */
export function FeedbackSheet({ from, onClose }: { from: 'card' | 'profile' | 'meetup'; onClose: () => void }) {
  const t = useTheme();
  const m = useModel();
  const { toast, saveAsked } = useStore();
  const [rating, setRating] = useState(0);
  const [improve, setImprove] = useState('');
  const [use, setUse] = useState('');
  const [quote, setQuote] = useState(false);
  const [contact, setContact] = useState(false);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const meet = from === 'meetup';
  const why = rating && ok ? '' : !rating && !ok ? 'Pick a face and tick the required box to send.' : !rating ? 'Pick a face to send.' : 'Tick the required box to send.';

  async function send() {
    if (!rating || !ok) return;
    setBusy(true);
    try {
      await api.sendFeedback({ rating, improve: improve.trim() || null, would_use: use || null, consent_quote: quote, consent_contact: contact, source: 'app:' + from });
    } catch (e) { setBusy(false); toast(e instanceof Error ? e.message : "Couldn't send it. Check your connection."); return; }
    saveAsked(() => ({ fbSent: nowOf(m) }));
    toast('Thank you! We read every one of these.');
    onClose();
  }

  return (
    <Sheet title={meet ? 'And Overhere itself?' : 'Send feedback'} onClose={onClose}>
      <P small mute style={{ marginBottom: 14 }}>{meet ? 'Thanks for rating your meetup. One more quick one, about the app this time.' : "Overhere is in beta and we're a small team. We read every message."}</P>
      <Label>How&apos;s Overhere working for you?</Label>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 6, marginBottom: 16 }}>
        {FACES.map(([e, l], i) => {
          const on = rating === i + 1;
          return (
            <Pressable key={l} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={l} onPress={() => setRating(i + 1)}
              style={{ flex: 1, alignItems: 'center', gap: 2, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, borderColor: on ? t.acc : t.line, backgroundColor: on ? t.acc2 : t.chip }}>
              <Text style={{ fontSize: 24 }}>{e}</Text>
              <Text style={{ fontSize: 11.5, color: on ? t.accink : t.mute, fontWeight: '600' }}>{l}</Text>
            </Pressable>
          );
        })}
      </View>
      <Field label="What's one thing we should change? (optional)" value={improve} onChangeText={setImprove} maxLength={1000} multiline
        placeholder="Something confusing, missing, or that you'd love to see" />
      <Label>Would you use Overhere in your city? (optional)</Label>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        {['Yes', 'Maybe', 'No'].map(v => <Chip key={v} label={v} on={use === v} onPress={() => setUse(use === v ? '' : v)} />)}
      </View>
      <Check on={quote} onPress={() => setQuote(!quote)}>Optional: you may quote this publicly, without my name.</Check>
      <Check on={contact} onPress={() => setContact(!contact)}>Optional: you may contact me with follow-up questions.</Check>
      <Consent on={ok} onPress={() => setOk(!ok)} />
      <View style={{ height: 12 }} />
      <Btn title="Send feedback" onPress={send} busy={busy} disabled={!rating || !ok} />
      {why ? <P small mute style={{ textAlign: 'center', marginTop: 8 }}>{why}</P> : null}
    </Sheet>
  );
}

/* The card at the top of Swipe and Discover: from your 3rd visit or 2nd day (fbDue). "Tell us" or the cross both count
   as an answer, so it comes back once, a week later, and never after two. */
export function FeedbackCard() {
  const t = useTheme();
  const m = useModel();
  const { saveAsked } = useStore();
  const [open, setOpen] = useState(false);
  const not = () => saveAsked(a => ({ fbNo: (a.fbNo || 0) + 1, fbNoAt: nowOf(m) }));
  if (!fbDue(m) && !open) return null;
  return (
    <>
      {fbDue(m) ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: t.newbg, borderColor: t.line, borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 10 }}>
          <Text style={{ fontSize: 22 }} accessibilityElementsHidden>💬</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.ink, fontWeight: '700', fontSize: 14 }}>How&apos;s Overhere going so far?</Text>
            <Text style={{ color: t.mute, fontSize: 12.5 }}>20 seconds, and it shapes what we build next.</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => { not(); setOpen(true); }}
            style={{ backgroundColor: t.acc, borderRadius: 99, paddingHorizontal: 14, minHeight: 36, justifyContent: 'center' }}>
            <Text style={{ color: t.onAcc, fontWeight: '700', fontSize: 14 }}>Tell us</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Not now" hitSlop={10} onPress={not}><Icon name="x" size={17} color={t.mute} /></Pressable>
        </View>
      ) : null}
      {open ? <FeedbackSheet from="card" onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/* One quick question after a key moment (askMicro in the store), floating above the tab bar. "Hard" or "OK" asks why
   in one line; "Easy" and "Very easy" are done. Closing it counts as asked. */
export function MicroAsk() {
  const t = useTheme(), insets = useSafeAreaInsets();
  const { model, micro, endMicro, saveAsked, toast } = useStore();
  const [score, setScore] = useState(0);
  const [text, setText] = useState('');
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  /* it floats, so it moves up over the keyboard itself while you type why */
  const [kb, setKb] = useState(0);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', e => setKb(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKb(0));
    return () => { show.remove(); hide.remove(); };
  }, []);
  if (!micro || !model) return null;
  const k = micro;
  const done = () => { setScore(0); setText(''); setOk(false); setBusy(false); endMicro(); };
  const answer = (n: number) => {
    saveAsked(() => ({ [k]: true }));
    if (n <= 2) { setScore(n); return; }
    done(); toast('Thanks! That helps us improve.');
  };
  const close = () => { saveAsked(() => ({ [k]: true })); done(); };
  async function send() {
    if (!text.trim() || !ok) return;
    setBusy(true);
    try { await api.sendFeedback({ improve: text.trim(), source: 'micro:' + k }); }
    catch (e) { setBusy(false); toast(e instanceof Error ? e.message : "Couldn't send it. Check your connection."); return; }
    done(); toast('Thank you! That really helps.');
  }

  return (
    <View accessibilityRole="alert" accessibilityLabel="Quick question"
      style={{ position: 'absolute', left: 12, right: 12, bottom: kb ? kb + insets.bottom + 8 : insets.bottom + 66, alignSelf: 'center', maxWidth: COLUMN - 24,
        backgroundColor: t.card, borderColor: t.line, borderWidth: 1, borderRadius: 18, padding: 14, paddingTop: 10,
        shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 12, color: t.mute }}>{score ? 'Thanks! One more thing' : 'Quick question'}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={score ? 'Skip' : 'Dismiss question'} hitSlop={10} onPress={close}><Icon name="x" size={16} color={t.mute} /></Pressable>
      </View>
      {score ? (
        <>
          <Text style={{ color: t.ink, fontWeight: '600', fontSize: 14, marginVertical: 8 }}>{score === 1 ? 'What made it hard?' : 'What would have made it easier?'}</Text>
          <TextInput value={text} onChangeText={setText} maxLength={1000} multiline autoFocus placeholder="A few words is plenty" placeholderTextColor={t.ph}
            style={{ fontSize: 16, minHeight: 64, textAlignVertical: 'top', backgroundColor: t.field, color: t.ink, borderRadius: 12, padding: 10, marginBottom: 6 }} />
          <Consent on={ok} onPress={() => setOk(!ok)} what="this is" />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Btn title="Skip" kind="ghost" onPress={close} style={{ flex: 1, minHeight: 40 }} />
            <Btn title="Send" onPress={send} busy={busy} disabled={!text.trim() || !ok} style={{ flex: 1, minHeight: 40 }} />
          </View>
        </>
      ) : (
        <>
          <Text style={{ color: t.ink, fontWeight: '600', fontSize: 14, marginVertical: 8 }}>{MICRO[k]}</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {MICRO_FACES.map(([e, l, n]) => (
              <Pressable key={l} accessibilityRole="button" accessibilityLabel={l} onPress={() => answer(n)}
                style={{ flex: 1, alignItems: 'center', gap: 2, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: t.line, backgroundColor: t.chip }}>
                <Text style={{ fontSize: 20 }}>{e}</Text>
                <Text style={{ fontSize: 11.5, color: t.mute }}>{l}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useRef, useState } from 'react';
import { FlatList, Modal, Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { column } from '@/lib/layout';
import { useTheme } from '@/lib/theme';
import { H, Icon, Label } from './ui';

/* A plan's date and time, the way booking apps do it and the same as the website's form (whenPicker in app.js):
   a row of days (the next two weeks, then "Other" for any date) and a time list in 15-minute steps. Times less than
   an hour away are greyed out. */
const TIMES = Array.from({ length: 96 }, (_, i) => i * 15);   // minutes after midnight
const ROW = 50;
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const at = (day: Date, min: number) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(min / 60), min % 60);
export const timeTxt = (min: number) => new Date(2000, 0, 1, Math.floor(min / 60), min % 60).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

export function WhenPicker({ value, onChange }: { value: Date; onChange: (d: Date) => void }) {
  const t = useTheme();
  const [cal, setCal] = useState(false);     // iOS: the calendar for a date further out
  const [open, setOpen] = useState(false);   // the time list
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 14 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
  const inRow = days.some(d => sameDay(d, value));
  const mins = value.getHours() * 60 + value.getMinutes();
  const soonest = Date.now() + 3600e3;
  /* a new day keeps the time; if that's too soon on that day, it moves to the first time that works */
  const pickDay = (d: Date) => {
    const ok = at(d, mins).getTime() >= soonest ? mins : TIMES.find(x => at(d, x).getTime() >= soonest);
    onChange(at(d, ok ?? mins));
  };
  const pickOther = () => {
    if (Platform.OS === 'android') DateTimePickerAndroid.open({ value, mode: 'date', minimumDate: new Date(), onChange: (e, d) => { if (e.type === 'set' && d) pickDay(d); } });
    else setCal(c => !c);
  };
  const box = (on: boolean) => ({ width: 58, height: 66, borderRadius: 14, borderWidth: 1, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 1,
    backgroundColor: on ? t.acc : t.field, borderColor: on ? t.acc : t.line });
  const small = (on: boolean) => ({ fontSize: 11.5, fontWeight: '600' as const, color: on ? t.onAcc : t.mute });

  return (
    <>
      <Label>Date</Label>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingBottom: 4 }} style={{ marginHorizontal: -2, marginBottom: 12 }}>
        {days.map((d, i) => {
          const on = sameDay(d, value);
          return (
            <Pressable key={i} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              onPress={() => pickDay(d)} style={box(on)}>
              <Text style={small(on)}>{i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-IN', { weekday: 'short' })}</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: on ? t.onAcc : t.ink }}>{d.getDate()}</Text>
              <Text style={small(on)}>{d.toLocaleDateString('en-IN', { month: 'short' })}</Text>
            </Pressable>
          );
        })}
        <Pressable accessibilityRole="radio" accessibilityState={{ checked: !inRow }} accessibilityLabel={inRow ? 'Other date' : `Other date: ${value.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}`}
          onPress={pickOther} style={[box(!inRow), { width: inRow ? 58 : 72 }]}>
          <Icon name="calendar" size={17} color={inRow ? t.ink2 : t.onAcc} />
          <Text style={small(!inRow)}>{inRow ? 'Other' : value.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
        </Pressable>
      </ScrollView>
      {cal && Platform.OS === 'ios' ? (
        <DateTimePicker value={value} mode="date" display="inline" minimumDate={new Date()} accentColor={t.acc}
          onChange={(_e, d) => { if (d) { pickDay(d); setCal(false); } }} />
      ) : null}

      <Label>Time</Label>
      <Pressable accessibilityRole="button" accessibilityLabel={`Time: ${timeTxt(mins)}. Change`} onPress={() => setOpen(true)}
        style={{ flexDirection: 'row', alignItems: 'center', minHeight: 50, paddingHorizontal: 14, borderRadius: 14, backgroundColor: t.field, marginBottom: 16 }}>
        <Icon name="clock" size={17} color={t.mute} />
        <Text style={{ flex: 1, marginLeft: 10, fontSize: 16, color: t.ink }}>{timeTxt(mins)}</Text>
        <Icon name="chevron-down" size={18} color={t.mute} />
      </Pressable>
      {open ? <TimeSheet day={value} mins={mins} soonest={soonest} onPick={x => { onChange(at(value, x)); setOpen(false); }} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/* the time list: a sheet like the others, opened on the time already picked */
function TimeSheet({ day, mins, soonest, onPick, onClose }: { day: Date; mins: number; soonest: number; onPick: (m: number) => void; onClose: () => void }) {
  const t = useTheme();
  const { height } = useWindowDimensions();
  const pad = Math.max(useSafeAreaInsets().bottom, 14);
  const list = useRef<FlatList<number>>(null);
  const start = Math.max(0, TIMES.indexOf(mins - (mins % 15)) - 2);
  return (
    <Modal transparent visible animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.35)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close" />
        <View style={[{ backgroundColor: t.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: Math.min(height * 0.6, 520), paddingBottom: pad }, column]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 8 }}>
            <View style={{ flex: 1 }}><H size={20}>Time</H></View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={12} onPress={onClose}><Icon name="x" size={20} /></Pressable>
          </View>
          <FlatList ref={list} data={TIMES} keyExtractor={x => String(x)} initialScrollIndex={start}
            getItemLayout={(_d, i) => ({ length: ROW, offset: ROW * i, index: i })} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8 }}
            renderItem={({ item }) => {
              const on = item === mins, off = at(day, item).getTime() < soonest;
              return (
                <Pressable accessibilityRole="radio" accessibilityState={{ checked: on, disabled: off }} disabled={off} onPress={() => onPick(item)}
                  style={{ height: ROW, borderRadius: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: on ? t.acc2 : 'transparent' }}>
                  <Text style={{ flex: 1, fontSize: 16, fontWeight: on ? '700' : '400', color: off ? t.ph : on ? t.accink : t.ink }}>{timeTxt(item)}</Text>
                  {on ? <Icon name="check" size={18} color={t.acc} /> : null}
                </Pressable>
              );
            }} />
        </View>
      </View>
    </Modal>
  );
}

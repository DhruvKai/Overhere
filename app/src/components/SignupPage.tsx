import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { column } from '@/lib/layout';
import { loadDraft, progressItems, progressOf } from '@/lib/signup';
import { useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { FormScroll } from './KeyboardSafe';
import { BottomBar, Icon } from './ui';

/* Every sign-up page: an optional back arrow and the progress at the top, the page in a scroll view, and its buttons
   kept at the bottom (BottomBar), so short pages don't end in a gap and long ones don't hide the button. */
export function SignupPage({ top, children, buttons }: { top?: ReactNode; children: ReactNode; buttons: ReactNode }) {
  const t = useTheme();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <FormScroll contentContainerStyle={[{ padding: 24, paddingTop: 12 }, column]}>
          {top}
          {children}
        </FormScroll>
        <View style={column}><BottomBar>{buttons}</BottomBar></View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* The row at the top of a sign-up page: back arrow, then either short step bars (screens 1-4) or the % bar
   (screen 5 on), and anything on the right (Sign out). */
export function SignupTop({ onBack, steps, right }: { onBack?: () => void; steps?: [number, number]; right?: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24, minHeight: 44 }}>
      {onBack ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} hitSlop={10} style={{ width: 36, height: 44, justifyContent: 'center' }}>
          <Icon name="arrow-left" size={22} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>{steps ? <StepBars at={steps[0]} of={steps[1]} /> : <SignupBar />}</View>
      {right}
    </View>
  );
}

function StepBars({ at, of }: { at: number; of: number }) {
  const t = useTheme();
  return (
    <View accessible accessibilityLabel={`Step ${at + 1} of ${of}`} style={{ flexDirection: 'row', gap: 6 }}>
      {Array.from({ length: of }, (_, k) => <View key={k} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: k <= at ? t.acc : t.line }} />)}
    </View>
  );
}

/* How much of sign-up is done (lib/signup.ts): 30% once screens 1-4 are answered, 100% with everything. */
export function useProgress() {
  const { session, model } = useStore();
  const items = progressItems(session, model, loadDraft());
  return { items, pct: progressOf(items) };
}

export function ProgressBar({ pct, label = true }: { pct: number; label?: boolean }) {
  const t = useTheme();
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={`Profile ${pct}% done`} accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: t.line, overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height: 6, borderRadius: 3, backgroundColor: t.acc }} />
      </View>
      {label ? <Text style={{ color: t.ink2, fontSize: 13, fontWeight: '700', minWidth: 62, textAlign: 'right' }}>{pct}% done</Text> : null}
    </View>
  );
}

function SignupBar() {
  return <ProgressBar pct={useProgress().pct} />;
}

import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { column } from '@/lib/layout';
import { useTheme } from '@/lib/theme';
import { H, Icon } from './ui';

/* A sheet from the bottom with a title and a close button, like the website's sheets. Tap outside or Back to close.
   It scrolls when taller than the screen. */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const t = useTheme();
  const { height } = useWindowDimensions();
  /* the sheet runs edge to edge, so it clears the gesture bar or a tablet's taskbar itself */
  const pad = 20 + Math.max(useSafeAreaInsets().bottom, 14);
  return (
    <Modal transparent visible animationType="slide" onRequestClose={onClose}>
      {/* the dimmed backdrop covers the screen; the sheet keeps to the middle column on tablets (lib/layout.ts) */}
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.35)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close" />
        {/* a Modal is its own window, so Android doesn't resize it for the keyboard: lift the sheet on both platforms */}
        <KeyboardAvoidingView behavior="padding">
          <ScrollView style={[{ backgroundColor: t.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: height * 0.9 }, column]}
            contentContainerStyle={{ padding: 20, paddingBottom: pad }} keyboardShouldPersistTaps="handled">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <View style={{ flex: 1 }}><H size={20}>{title}</H></View>
              <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={12} onPress={onClose}><Icon name="x" size={20} /></Pressable>
            </View>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput, View, type ScrollViewInstance, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';

/* Every screen with a text field sits in this, so the keyboard never covers the field being typed in (or the button
   under it). Android draws the app edge to edge, so the window no longer shrinks for the keyboard by itself: this view
   shrinks instead ('height'), and the scroll view inside keeps the focused field in sight. iOS pads.
   React Native works out how much of the view the keyboard covers from the view's place in its parent, not on the
   screen, so it comes up short by whatever sits above, such as a screen's header bar (the chat box ended up just
   under the keyboard). So this measures where it really starts on screen and passes that as the offset. */
export function KeyboardSafe({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const box = useRef<ComponentRef<typeof View>>(null);
  const [top, setTop] = useState(0);
  return (
    <View ref={box} style={[{ flex: 1 }, style]} onLayout={() => box.current?.measureInWindow((_x, y) => setTop(Math.max(0, Math.round(y))))}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={top} style={{ flex: 1 }}>
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}

/* The scroll view for a form inside KeyboardSafe. When the keyboard opens, the view above shrinks, but Android doesn't
   scroll the field you tapped back into sight (a field low on the screen ended up behind the Save bar). So once the
   keyboard is up, this scrolls the focused field, with a little room under it, into the part you can see. Moving to
   another field while the keyboard is up is handled by Android itself. */
export function FormScroll({ onScroll, ...p }: ScrollViewProps) {
  const sv = useRef<ScrollViewInstance>(null);
  const y = useRef(0);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      const input = TextInput.State.currentlyFocusedInput();
      const box = sv.current;
      if (!input || !box) return;
      box.measureInWindow((_x, top, _w, h) => {
        input.measureInWindow((_ix, iy, _iw, ih) => {
          const room = 16, bottom = top + h;
          if (iy + ih + room > bottom) box.scrollTo({ y: y.current + iy + ih + room - bottom, animated: true });
          else if (iy < top + room) box.scrollTo({ y: Math.max(0, y.current - (top + room - iy)), animated: true });
        });
      });
    };
    /* after the view above has shrunk for the keyboard */
    const sub = Keyboard.addListener('keyboardDidShow', () => { clearTimeout(timer); timer = setTimeout(reveal, 150); });
    return () => { clearTimeout(timer); sub.remove(); };
  }, []);
  return (
    <ScrollView ref={sv} keyboardShouldPersistTaps="handled" scrollEventThrottle={16} {...p}
      onScroll={e => { y.current = e.nativeEvent.contentOffset.y; onScroll?.(e); }} />
  );
}

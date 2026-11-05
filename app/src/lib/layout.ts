import { Dimensions } from 'react-native';

/* Screen sizes, from small phones to tablets (Android tablets, iPads, foldables opened up).
   A tablet is 600dp or more on its short side: Android's usual cut-off, and every iPad is wider than that.
   On a wide screen the app keeps a phone-like column in the middle instead of stretching text, lists and cards
   across the whole width. The navigators apply it (app/_layout.tsx, app/(tabs)/_layout.tsx), so a new screen gets
   it without doing anything; only things drawn outside them (a Modal sheet, a full-bleed photo) use `column`. */
export const COLUMN = 640;
/* the swipe card: wider than this it stops looking like a card */
export const DECK = 480;
export const column = { width: '100%', maxWidth: COLUMN, alignSelf: 'center' } as const;

export const isTablet = (w: number, h: number) => Math.min(w, h) >= 600;
/* The physical screen, not the window: an app in split screen on a tablet is still on a tablet. */
export const onTablet = () => { const s = Dimensions.get('screen'); return isTablet(s.width, s.height); };

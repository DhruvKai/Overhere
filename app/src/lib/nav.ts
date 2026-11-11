import { router, type Href } from 'expo-router';

/* Leave the current screen. router.back() does nothing when the screen has nothing behind it (opened from a
   notification or a link, or after the stack was rebuilt), and then the header has no back arrow either, so the person
   is stuck. Go to `home` instead. It must be a screen the layout's guards allow right now: '/' is the tabs, which are
   locked until sign-up is finished, so screens that can open during sign-up pass '/onboarding' while it isn't done. */
export function goBack(home: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(home);
}

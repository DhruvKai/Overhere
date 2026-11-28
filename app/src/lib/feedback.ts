import { nowOf, type Model } from './model';

/* Asking for feedback, the same rules as web/app.js: the feedback sheet (send_feedback in web/schema-app.sql), the card
   that asks for it in Swipe and Discover, and one quick question after a few key moments, each asked once.
   What has been asked is kept in profiles.state.asked, which the website shares, so nothing is asked twice across them:
   fbSent (when you last sent feedback), fbFirst and fbOpens (your first visit and how many times you've opened Overhere),
   fbTime (minutes of use, counted up to FB_TIME), fbDid (you've posted a plan or asked to join one), fbReady (both were
   true when you last opened Overhere), fbNo and fbNoAt (how often, and when, you said "not now" to the card), and each
   quick question's key once answered. */

export const FEEDBACK_V = 'v1';   // the consent wording version, the same as the website's form
export const FACES: [string, string][] = [['😞', 'Bad'], ['😕', 'Meh'], ['😐', 'OK'], ['🙂', 'Good'], ['😍', 'Love it']];
export const MICRO = {
  swipe: 'Was swiping an easy way to find plans?',
  request: 'How easy was it to ask to join?',
  post: 'How easy was posting your plan?',
  rating: 'Was rating the meetup quick enough?',
} as const;
export type MicroKey = keyof typeof MICRO;
export const MICRO_FACES: [string, string, number][] = [['😞', 'Hard', 1], ['😐', 'OK', 2], ['🙂', 'Easy', 3], ['😀', 'Very easy', 4]];

export type Asked = {
  fbSent?: number; fbFirst?: number; fbOpens?: number; fbTime?: number; fbDid?: boolean; fbReady?: boolean;
  fbNo?: number; fbNoAt?: number; fbMeet?: boolean;
} & Partial<Record<MicroKey, boolean>>;

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {});
export const askedFrom = (priv: Record<string, unknown>): Asked => obj(priv.asked) as Asked;
export const askedOf = (m: Model): Asked => askedFrom(m.priv);
/* one-off hints, like the "are you sure?" on the first skip (S.tips on the website) */
export const tipsOf = (m: Model): Record<string, boolean> => obj(m.priv.tips) as Record<string, boolean>;

/* The card waits until you've used Overhere for 10 minutes in all and posted a plan or asked to join one. It's checked
   when the app opens (fbReady, set by fbOpen), so it shows on a later visit, never straight after posting or asking,
   which have their own quick question. It comes back once, a week after "not now". */
export const FB_TIME = 10 * 60e3, FB_TICK = 60e3;
const FB_AGAIN = 7 * 864e5;
/* fbDid is saved when you post or ask; the rest covers what you did before it was. */
const didKey = (m: Model, a: Asked) => !!(a.fbDid || a.post || a.request
  || m.acts.some(x => x.host === m.me || x.members.includes(m.me)) || m.reqs.some(r => r.user === m.me));
/* What to save when the app opens: one more visit, and fbReady once both rules are met. */
export function fbOpen(m: Model, a: Asked, now: number): Asked {
  return { fbOpens: (a.fbOpens || 0) + 1, ...(a.fbFirst ? {} : { fbFirst: now }),
    ...(!a.fbReady && (a.fbTime || 0) >= FB_TIME && didKey(m, a) ? { fbReady: true } : {}) };
}
export function fbDue(m: Model) {
  const a = askedOf(m), now = nowOf(m);
  if (a.fbSent || (a.fbNo || 0) >= 2 || !a.fbReady) return false;
  return !(a.fbNo && now - (a.fbNoAt || 0) < FB_AGAIN);
}

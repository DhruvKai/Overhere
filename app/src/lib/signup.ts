import type { Session } from '@supabase/supabase-js';
import { MIN_INTS, type Model } from './model';
import type { Gender } from './types';

/* Sign-up, in the order of the 19 Nov spec (the same as web/app.js):
     1 interests · 2 when you're free · 3 date of birth · 4 gender      (before there's an account: kept on this phone)
     5 phone · 6 SMS code · 7 email · 8 email code · 8b password       (sign-in.tsx, add-email.tsx, create-password.tsx)
     9 name, what you do, about you, home area                         (onboarding.tsx: saves the profile)
     10 two photos · 11 face check                                     (onboarding.tsx: both can be skipped)
   The progress bar from screen 5 on, and the card on Profile, show the same score (progressOf). */

/* ---------- screens 1-4, before the account exists ---------- */
export type Draft = { ints: string[]; avail: string[]; dob: string; gender: Gender | '' };
const KEY = 'overhere_signup';
const EMPTY: Draft = { ints: [], avail: [], dob: '', gender: '' };

export function loadDraft(): Draft {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!d || typeof d !== 'object') return { ...EMPTY };
    return {
      ints: Array.isArray(d.ints) ? d.ints.filter((x: unknown) => typeof x === 'string').slice(0, 60) : [],
      avail: Array.isArray(d.avail) ? d.avail.filter((x: unknown) => typeof x === 'string').slice(0, 10) : [],
      dob: typeof d.dob === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.dob) ? d.dob : '',
      gender: typeof d.gender === 'string' ? d.gender as Gender : '',
    };
  } catch { return { ...EMPTY }; }
}
export function saveDraft(d: Draft) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* asked again next time */ } }
export function clearDraft() { try { localStorage.removeItem(KEY); } catch { /* nothing to clear */ } }

/* the first screen of 1-4 that still needs an answer, or 4 when they're all answered */
export const draftStep = (d: Draft) => (d.ints.length < MIN_INTS ? 0 : !d.avail.length ? 1 : !d.dob ? 2 : !d.gender ? 3 : 4);
export const adult = (iso: string) => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return iso <= d.toISOString().slice(0, 10); };

/* ---------- the score ---------- */
export type ProgressItem = { key: 'about' | 'phone' | 'email' | 'details' | 'job' | 'bio' | 'photos' | 'face'; label: string; pts: number; done: boolean };

/* 30 for screens 1-4, then phone, email, the details, two photos and the face check: 100 when everything's there. */
export function progressItems(session: Session | null, m: Model | null, draft?: Draft): ProgressItem[] {
  const p = m?.profile, u = session?.user;
  const about = p ? true : !!draft && draftStep(draft) === 4;
  return [
    { key: 'about', label: 'Interests, free times, age and gender', pts: 30, done: about },
    { key: 'phone', label: 'Phone number', pts: 10, done: !!u?.phone_confirmed_at },
    { key: 'email', label: 'Email', pts: 10, done: !!u?.email_confirmed_at },
    { key: 'details', label: 'Name and home area', pts: 10, done: !!p },
    { key: 'job', label: 'What you do', pts: 5, done: !!p?.job?.trim() },
    { key: 'bio', label: 'About you', pts: 5, done: !!p?.bio?.trim() },
    { key: 'photos', label: 'Two photos', pts: 15, done: !!(p?.photo && p?.photo2) },
    { key: 'face', label: 'Face check', pts: 15, done: !!p?.face },
  ];
}
export const progressOf = (items: ProgressItem[]) => items.reduce((n, x) => n + (x.done ? x.pts : 0), 0);

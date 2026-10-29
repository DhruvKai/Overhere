import type { AppStateResponse, Cat, Cost, Gender, RawNote, RawProfile, RawReq } from './types';

/* The app's view of app_state(), and the same rules web/app.js uses to decide what goes in Swipe and Discover. */

export type Person = {
  id: string; name: string; gender: Gender | ''; age: number | ''; job: string; bio: string; emo: string;
  verified: boolean; kyc: boolean; sample: boolean; ints: string[]; met: number; shows: number;
};

export type Plan = {
  id: string; host: string; cat: Cat; desc: string; cap: number; when: number; aud: 'everyone' | Gender[];
  venue: string; cost: Cost; total: number | null; hood: string; ll: [number, number] | null;
  repeat: 'weekly' | 'biweekly' | 'monthly' | null; status: 'open' | 'full' | 'past'; created: number;
  members: string[]; wl: number; mypos: number;
};

export type PollOpt = { t: string; v: string[] };
export type Msg = { id: number; from: string; sys: boolean; text: string; at: number; poll: { q: string; opts: PollOpt[] } | null; reported: boolean };
export type Note = RawNote;
export type Req = RawReq;

export type Model = {
  me: string;
  skew: number;
  mode: AppStateResponse['mode'];
  verify: AppStateResponse['verify'];
  profile: RawProfile | null;
  priv: Record<string, unknown>;          // profiles.state, sent back whole by save_state
  people: Record<string, Person>;
  acts: Plan[];
  reqs: Req[];
  chats: Record<string, Msg[]>;
  notes: Note[];
  blocked: string[];
  cities: [string, string, number, number][];
  city: string | null;
  cityAuto: boolean;
  termsV: string | null;
  locked: number;
};

export const GENDERS: Gender[] = ['Woman', 'Man', 'Non-binary'];
export const INTERESTS = ['Movies', 'Cafe / Food', 'Concerts'];
export const TIMES = ['Weekday evenings', 'Weekend days', 'Weekend evenings', 'Late nights'];
export const CATS: Record<Cat, { label: string; icon: 'film' | 'coffee' | 'music'; fg: string; bg: string; fgDark: string; bgDark: string }> = {
  movies: { label: 'Movies', icon: 'film', fg: '#7C3AED', bg: '#EDE9FE', fgDark: '#C4B5FD', bgDark: '#2E2350' },
  cafe: { label: 'Cafe/Food', icon: 'coffee', fg: '#15803D', bg: '#DCFCE7', fgDark: '#86EFAC', bgDark: '#14301F' },
  concerts: { label: 'Concerts', icon: 'music', fg: '#DB2777', bg: '#FCE7F3', fgDark: '#F9A8D4', bgDark: '#3F1530' },
};
export const COST: Record<Cost, string> = { split: 'Split equally', own: 'Everyone pays their own way', host: 'Host is covering everyone' };
export const COST_S: Record<Cost, string> = { split: 'Equal Split', own: 'Go Dutch', host: 'Host Pays' };
export const REPEAT = { weekly: 'Every week', biweekly: 'Every 2 weeks', monthly: 'Every month' } as const;
export const REPORT_REASONS = ['Made me feel unsafe', 'Inappropriate messages or behaviour', 'Fake profile or scam', "Didn't show up", 'Copyright infringement', 'Something else'];
export const CHAT_REASONS = ['Harassment or threats', 'Sexual or unwanted messages', 'Spam or scam', 'Hate speech', 'Copyright infringement', 'Something else'];
export const NEAR_KM = 50;
export const EMOJIS = ['👩🏻', '👩🏽', '👩🏿', '👨🏻', '👨🏽', '👨🏿', '🧑🏼', '🧑🏾', '👩🏽‍🦱', '👨🏻‍🦱', '👩🏾‍🦳', '🧔🏽', '👱🏻‍♀️', '👳🏽‍♂️', '🧕🏽', '👩🏽‍💻', '👨🏾‍💻', '👩🏻‍🎨', '👨🏽‍🍳', '🧑🏽‍🎤', '😀', '😎', '🤓', '🥳', '🦊', '🐼', '🐯', '🦉', '🌻', '🎧', '🎬', '☕', '🎸'];
export const defEmo = (g: string) => (g === 'Woman' ? '👩' : g === 'Man' ? '👨' : '🧑');
const isUuid = (x: unknown): x is string => typeof x === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x);

export function toModel(st: AppStateResponse): Model {
  const now = st.now || Date.now();
  const people: Record<string, Person> = {};
  (st.people ?? []).forEach(x => {
    people[x.id] = {
      id: x.id, name: x.name, gender: x.gender, age: x.age, job: x.job || '', bio: x.bio || '', emo: x.emo || defEmo(x.gender),
      verified: !!x.face, kyc: !!x.kyc, sample: !!x.sample, ints: x.ints || [], met: x.met || 0, shows: x.shows || 0,
    };
  });
  const acts: Plan[] = (st.acts ?? []).map(a => ({
    id: a.id, host: a.host, cat: a.cat, desc: a.desc, cap: a.cap, when: a.when, aud: a.aud && a.aud.length ? a.aud : 'everyone',
    venue: a.venue, cost: a.cost, total: a.total || null, hood: a.hood, ll: a.lat != null && a.lng != null ? [a.lat, a.lng] : null,
    repeat: a.repeat, status: a.when <= now ? 'past' : a.status, created: a.created,
    /* members are only sent for plans you host or joined; elsewhere just how many */
    members: a.members.length === a.mcount ? a.members : Array.from({ length: a.mcount }, () => '?'),
    wl: a.wl || 0, mypos: a.mypos || 0,
  }));
  const past = new Set(acts.filter(a => a.status === 'past').map(a => a.id));
  const reported = new Set(st.reported ?? []);
  const chats: Record<string, Msg[]> = {};
  (st.msgs ?? []).forEach(m => {
    (chats[m.act] ||= []).push({
      id: m.id, from: m.sys ? 'sys' : m.from ?? '?', sys: m.sys, text: m.text, at: m.at, reported: reported.has(m.id),
      poll: m.poll ? { q: m.poll.q, opts: m.poll.opts.map((t, j) => ({ t, v: (m.votes ?? []).filter(v => v.o === j).map(v => v.u) })) } : null,
    });
  });
  return {
    me: st.me, skew: now - Date.now(), mode: st.mode, verify: st.verify, profile: st.profile,
    priv: st.profile?.state && typeof st.profile.state === 'object' ? st.profile.state : {},
    people, acts,
    reqs: (st.reqs ?? []).sort((x, y) => x.at - y.at)
      .map(r => (past.has(r.act) && (r.status === 'pending' || r.status === 'waitlist') ? { ...r, status: 'rejected' as const } : r)),
    chats, notes: st.notes ?? [], blocked: st.blocked ?? [],
    cities: Array.isArray(st.cities) ? st.cities : [], city: st.city ?? null, cityAuto: !!st.city_auto,
    termsV: st.terms_v ?? null, locked: st.locked ?? 0,
  };
}

/* ---------- helpers (ported from web/app.js) ---------- */
export const nowOf = (m: Model) => Date.now() + m.skew;
export const spots = (a: Plan) => a.cap - a.members.length;
export const spotTxt = (a: Plan) => (spots(a) <= 0 ? 'Full' : `${spots(a)} spot${spots(a) === 1 ? '' : 's'} open`);
export const myReq = (m: Model, act: string) => m.reqs.find(r => r.act === act && r.user === m.me);
export const dismissed = (m: Model): string[] => (Array.isArray(m.priv.dismissed) ? (m.priv.dismissed as unknown[]).filter(isUuid) : []);
export const audOK = (m: Model, a: Plan) => a.aud === 'everyone' || (!!m.profile && a.aud.includes(m.profile.gender));
export const homeLL = (m: Model): [number, number] =>
  m.profile?.lat != null && m.profile?.lng != null ? [m.profile.lat, m.profile.lng] : [30.74, 76.78];

export function kmBetween([a1, o1]: [number, number], [a2, o2]: [number, number]) {
  const r = Math.PI / 180, x = Math.sin(((a2 - a1) * r) / 2) ** 2 + Math.cos(a1 * r) * Math.cos(a2 * r) * Math.sin(((o2 - o1) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
}
const viewCity = (m: Model) => (m.city ? m.cities.find(c => c[0] === m.city) : undefined);
/* A city you picked shows only that city; the automatic one comes with whatever is posted near home. */
const inView = (m: Model, a: Plan) => {
  const c = viewCity(m);
  return !c || m.cityAuto || !a.ll || kmBetween([c[2], c[3]], a.ll) <= NEAR_KM;
};
export const kmAway = (m: Model, a: Plan) => (a.ll ? kmBetween(homeLL(m), a.ll) : null);

/* visible: listed in Discover (full ones too, for the waitlist). eligible: can be requested right now. */
export const visible = (m: Model, a: Plan) =>
  (a.status === 'open' || a.status === 'full') && a.host !== m.me && audOK(m, a) && !m.blocked.includes(a.host) && a.when > nowOf(m) && inView(m, a);
export const eligible = (m: Model, a: Plan) => visible(m, a) && a.status === 'open' && spots(a) > 0 && !dismissed(m).includes(a.id);

/* Swipe shows today and tomorrow; Discover starts the day after, so the two never show the same plan. */
export const swipeEnd = (m: Model) => { const d = new Date(nowOf(m)); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 2); return d.getTime(); };
const isSample = (m: Model, id: string) => !!m.people[id]?.sample;
export const deck = (m: Model) =>
  m.acts.filter(a => eligible(m, a) && !myReq(m, a.id) && a.when < swipeEnd(m))
    .sort((a, b) => Number(isSample(m, a.host)) - Number(isSample(m, b.host)) || a.when - b.when);
export const feed = (m: Model) => m.acts.filter(a => visible(m, a) && !myReq(m, a.id) && a.when >= swipeEnd(m)).sort((a, b) => a.when - b.when);

/* Plans whose group chat you are in: hosting, or accepted. */
export const inChat = (m: Model, a: Plan) => a.host === m.me || myReq(m, a.id)?.status === 'accepted';
export const myPlans = (m: Model) => m.acts.filter(a => a.host === m.me || !!myReq(m, a.id)).sort((a, b) => a.when - b.when);

export const uname = (m: Model, id: string) => (id === m.me ? 'You' : m.people[id]?.name || 'Someone');
export const isVer = (m: Model, id: string) => m.mode.face === 'live' && !!m.people[id]?.verified;

export function whenParts(t: number, now = Date.now()): [string, string] {
  const d = new Date(t), n = new Date(now), day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(d) - day(n)) / 864e5), tm = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return [diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }), tm];
}
export function whenStr(t: number, now?: number) { const [d, tm] = whenParts(t, now); return d === 'Today' || d === 'Tomorrow' ? `${d} ${tm}` : `${d} · ${tm}`; }
export function ago(t: number, now = Date.now()) {
  const s = Math.max(0, (now - t) / 1000);
  return s < 60 ? 'just now' : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : s < 14 * 86400 ? `${Math.floor(s / 86400)}d ago` : `${Math.floor(s / 604800)}w ago`;
}
export const tags = (a: Plan) => [COST_S[a.cost], ...(a.aud === 'everyone' ? [] : [`${a.aud.join(' / ')} only`]), ...(a.repeat ? [REPEAT[a.repeat]] : [])];
export const rupees = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

/* The venue line under a plan's title, without the place's name when the title already says it. */
const wordsOf = (s: string) => ' ' + String(s || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ') + ' ';
export const placeLine = (a: Plan) => {
  const [name, ...rest] = (a.venue || '').split(/\s*,\s*/);
  return rest.length && wordsOf(name).trim() && wordsOf(a.desc).includes(wordsOf(name)) ? rest.join(', ') : a.venue;
};

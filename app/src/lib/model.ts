import { avatarUrl } from './avatar';
import { geo } from './spots';
import type { AppStateResponse, Cat, Cost, Gender, RawNote, RawProfile, RawReq } from './types';

/* The app's view of app_state(), and the same rules web/app.js uses to decide what goes in Swipe and Discover. */

export type Person = {
  id: string; name: string; gender: Gender | ''; age: number | ''; job: string; bio: string; emo: string; photo: string; photo2: string;
  verified: boolean; kyc: boolean; sample: boolean; ints: string[]; avail: string[]; met: number; shows: number;
  hist: [string, Cat, number, string][];   // plans from before the app: title, category, days ago, Hosted/Joined
};
export type Rating = { ok: 'yes' | 'no'; stars: number; people: Record<string, string>; at: number };

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
  ratings: Record<string, Rating>;        // your ratings of past meetups, by plan
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
      id: x.id, name: x.name, gender: x.gender, age: x.age, job: x.job || '', bio: x.bio || '', emo: x.emo || defEmo(x.gender), photo: avatarUrl(x.photo), photo2: avatarUrl(x.photo2),
      verified: !!x.face, kyc: !!x.kyc, sample: !!x.sample, ints: x.ints || [], avail: x.avail || [], met: x.met || 0, shows: x.shows || 0,
      hist: Array.isArray(x.hist) ? x.hist as Person['hist'] : [],
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
    ratings: Object.fromEntries((st.ratings ?? []).map(r => [r.act, { ok: r.ok, stars: r.stars, people: r.people || {}, at: r.at }])),
  };
}

/* ---------- helpers (ported from web/app.js) ---------- */
export const nowOf = (m: Model) => Date.now() + m.skew;
/* A group chat is read-only from 3 hours after its plan starts (_chat_closed in web/schema-app.sql decides). */
export const CHAT_OPEN_H = 3;
export const chatClosed = (m: Model, a: Plan) => a.when + CHAT_OPEN_H * 3600e3 < nowOf(m);
export const spots = (a: Plan) => a.cap - a.members.length;
export const spotTxt = (a: Plan) => (spots(a) <= 0 ? 'Full' : `${spots(a)} spot${spots(a) === 1 ? '' : 's'} open`);
export const myReq = (m: Model, act: string) => m.reqs.find(r => r.act === act && r.user === m.me);
export const dismissed = (m: Model): string[] => (Array.isArray(m.priv.dismissed) ? (m.priv.dismissed as unknown[]).filter(isUuid) : []);
/* Plans saved for later (profiles.state.saved, like the website's S.saved). */
/* Your trusted contact for SOS (profiles.state.trusted, the same as the website's S.me.trusted). Only you see it. */
export const trustedOf = (m: Model): { name: string; phone: string } | null => {
  const t = m.priv.trusted as { name?: unknown; phone?: unknown } | null | undefined;
  return t && typeof t.name === 'string' && typeof t.phone === 'string' && t.name && t.phone ? { name: t.name, phone: t.phone } : null;
};
export const saved = (m: Model): string[] => (Array.isArray(m.priv.saved) ? (m.priv.saved as unknown[]).filter(isUuid) : []);
export const audOK = (m: Model, a: Plan) => a.aud === 'everyone' || (!!m.profile && a.aud.includes(m.profile.gender));
export const homeLL = (m: Model): [number, number] =>
  m.profile?.lat != null && m.profile?.lng != null ? [m.profile.lat, m.profile.lng] : [30.74, 76.78];

export function kmBetween([a1, o1]: [number, number], [a2, o2]: [number, number]) {
  const r = Math.PI / 180, x = Math.sin(((a2 - a1) * r) / 2) ** 2 + Math.cos(a1 * r) * Math.cos(a2 * r) * Math.sin(((o2 - o1) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
}
/* Cities with sample plans (m.cities: [key, name, lat, lng]). Besides plans near your home area you see one city's: the
   one you picked, or the nearest one when none is near home (m.cityAuto). */
export const viewCity = (m: Model) => (m.city ? m.cities.find(c => c[0] === m.city) : undefined);
export const homeName = (m: Model) => (m.profile?.hood || '').split(',')[0];
export const viewName = (m: Model) => viewCity(m)?.[1] || homeName(m);
export const whereTxt = (m: Model) => (!viewCity(m) ? `within ${NEAR_KM} km of ${homeName(m)}` : m.cityAuto ? `in ${viewName(m)} and near ${homeName(m)}` : `in ${viewName(m)}`);
/* A city you picked shows only that city; the automatic one comes with whatever is posted near home. */
/* Plans posted before venues had coordinates are placed at a place they name (geo, lib/spots.ts), as on the website. */
const inView = (m: Model, a: Plan) => {
  const c = viewCity(m);
  return !c || m.cityAuto || kmBetween([c[2], c[3]], geo(a)) <= NEAR_KM;
};
/* from your home area, or from the city you browse for that city's plans (kmAway in web/app.js) */
export const kmAway = (m: Model, a: Plan): number => {
  const g = geo(a), h = kmBetween(homeLL(m), g), c = viewCity(m);
  return h <= NEAR_KM || !c ? h : kmBetween([c[2], c[3]], g);
};

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
/* Discover plans (after Swipe's days) can be saved for later; Swipe plans can be shared, not saved. */
export const canSave = (m: Model, a: Plan) => a.when >= swipeEnd(m) && a.status !== 'past' && a.host !== m.me;
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

/* ---------- people: show-up record, what you have in common, past plans (trust, signals, pastList in web/app.js) ---------- */
const strs = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
export const following = (m: Model): string[] => strs(m.priv.following);
export const isPast = (m: Model, a: Plan) => a.status === 'past' || a.when <= nowOf(m);
export const attended = (m: Model, a: Plan) => a.host === m.me || a.members.includes(m.me);
export const isBlocked = (m: Model, id: string) => m.blocked.includes(id);
export function trust(m: Model, id: string) {
  const p = m.people[id];
  const met = p?.met || 0, shows = p?.shows || 0;
  return { met, shows, rate: met ? Math.round((shows / met) * 100) : null };
}
export const trustTxt = (m: Model, id: string) => { const t = trust(m, id); return t.met ? `Showed up ${t.shows} · No-show ${t.met - t.shows}` : 'New to meetups'; };
const metWith = (m: Model, u: string) => m.acts.filter(a => isPast(m, a) && attended(m, a) && (a.host === u || a.members.includes(u))).length;
/* chips: what you both like and when you're both free, how often you've met, and a warning after missed meetups */
export function signals(m: Model, u: string): { text: string; tone: 'acc' | 'ok' | 'warn' }[] {
  const p = m.people[u], me = m.profile, t = trust(m, u), met = metWith(m, u);
  const out: { text: string; tone: 'acc' | 'ok' | 'warn' }[] = [
    ...(p?.ints || []).filter(x => (me?.ints || []).includes(x)).map(x => ({ text: 'Both like ' + x, tone: 'acc' as const })),
    ...(p?.avail || []).filter(x => (me?.avail || []).includes(x)).map(x => ({ text: 'Both free ' + x.toLowerCase(), tone: 'acc' as const })),
  ];
  if (met) out.push({ text: `Met you ${met}× before`, tone: 'ok' });
  if (t.met >= 3 && (t.rate ?? 100) < 90) out.push({ text: `Missed ${t.met - t.shows} of ${t.met} meetups`, tone: 'warn' });
  return out;
}
export type PastItem = { t: string; cat: Cat; at: number; role: 'Hosted' | 'Joined'; act?: string };
/* real past plans (other people's only once you rated them, as on the website) and history from before the app */
export function pastList(m: Model, id: string): PastItem[] {
  const now = nowOf(m);
  const real = m.acts.filter(a => isPast(m, a) && (a.host === id || a.members.includes(id)) && (id === m.me || m.ratings[a.id]))
    .map(a => ({ t: a.desc, cat: a.cat, at: a.when, role: a.host === id ? 'Hosted' as const : 'Joined' as const, act: a.id }));
  const old = (m.people[id]?.hist || []).map(([t, cat, d, role]) => ({ t, cat, at: now - d * 864e5, role: role === 'Hosted' ? 'Hosted' as const : 'Joined' as const }));
  return [...real, ...old].sort((a, b) => b.at - a.at);
}
/* a past plan you were in, with people there, that you haven't rated yet */
export const canRate = (m: Model, a: Plan) => isPast(m, a) && attended(m, a) && a.members.length > 0 && !m.ratings[a.id];

/* ---------- Discover: filters and "For you" (matchF, reasons, score in web/app.js) ---------- */
export type Tod = 'any' | 'morning' | 'afternoon' | 'evening' | 'night';
export type Filters = { cat: Cat | 'all'; dfrom: string; dto: string; tod: Tod; dist: number };
export const NO_FILTERS: Filters = { cat: 'all', dfrom: '', dto: '', tod: 'any', dist: 0 };
export const DISTS = [2, 5, 10, 25];
export const dayKey = (t: number) => { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
export const tod = (t: number): Tod => { const h = new Date(t).getHours(); return h >= 5 && h < 12 ? 'morning' : h >= 12 && h < 17 ? 'afternoon' : h >= 17 && h < 21 ? 'evening' : 'night'; };
export const matchF = (m: Model, a: Plan, f: Filters) => (f.cat === 'all' || a.cat === f.cat) && (!f.dfrom || dayKey(a.when) >= f.dfrom)
  && (!f.dto || dayKey(a.when) <= f.dto) && (f.tod === 'any' || tod(a.when) === f.tod) && (!f.dist || kmAway(m, a) <= f.dist);
const CAT_INT: Record<Cat, string> = { movies: 'Movies', cafe: 'Cafe / Food', concerts: 'Concerts' };
function slotOf(t: number) {
  const d = new Date(t), h = d.getHours(), we = d.getDay() === 0 || d.getDay() === 6;
  if (h >= 23 || h < 5) return 'Late nights';
  if (we) return h < 17 ? 'Weekend days' : 'Weekend evenings';
  return h >= 17 ? 'Weekday evenings' : null;
}
export function reasons(m: Model, a: Plan): [string, number][] {
  const r: [string, number][] = [], s = slotOf(a.when);
  if (following(m).includes(a.host)) r.push(['You follow ' + uname(m, a.host), 3]);
  if ((m.profile?.ints || []).includes(CAT_INT[a.cat])) r.push(['You like ' + CAT_INT[a.cat], 2]);
  if (s && (m.profile?.avail || []).includes(s)) r.push(['Fits your ' + s.toLowerCase(), 1]);
  return r;
}
export const score = (m: Model, a: Plan) => reasons(m, a).reduce((n, x) => n + x[1], 0);
const dLbl = (k: string) => new Date(k + 'T12:00:00').toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
export const rangeLbl = (f: Filters) => (f.dfrom && f.dto ? (f.dfrom === f.dto ? dLbl(f.dfrom) : dLbl(f.dfrom) + ' – ' + dLbl(f.dto)) : f.dfrom ? 'From ' + dLbl(f.dfrom) : 'Until ' + dLbl(f.dto));
/* the active filters as [which, label], shown as removable chips */
export function filterLabels(f: Filters): ['cat' | 'date' | 'tod' | 'dist', string][] {
  const out: ['cat' | 'date' | 'tod' | 'dist', string][] = [];
  if (f.cat !== 'all') out.push(['cat', CATS[f.cat].label]);
  if (f.dfrom || f.dto) out.push(['date', rangeLbl(f)]);
  if (f.tod !== 'any') out.push(['tod', f.tod[0].toUpperCase() + f.tod.slice(1)]);
  if (f.dist) out.push(['dist', `Within ${f.dist} km`]);
  return out;
}
/* today and tomorrow are in Swipe, so every preset starts the day after */
export function datePresets(m: Model): Record<'weekend' | 'week' | 'month', [string, string, string]> {
  const t = new Date(swipeEnd(m)), k = (d: Date) => dayKey(d.getTime()), plus = (n: number) => { const d = new Date(t); d.setDate(d.getDate() + n); return d; };
  const dow = t.getDay(), sat = dow === 0 ? -1 : 6 - dow;
  return { weekend: ['This weekend', k(plus(Math.max(sat, 0))), k(plus(sat + 1))], week: ['Next 7 days', k(t), k(plus(6))], month: ['Next 30 days', k(t), k(plus(29))] };
}
/* An alert: tell me about new plans like these (no dates). Saved filters: one tap to filter Discover the same way again.
   Both live in profiles.state, shared with the website. */
export type Alert = { id: string; cat: Cat | 'all'; tod: Tod; dist: number; label: string };
export type Sort = 'for' | 'soon' | 'near';
/* datep: a date preset key (weekend, week, month), so "This weekend" still means this weekend next time */
export type SavedF = { id: string; label: string; f: { cat?: Cat | 'all'; tod?: Tod; dist?: number; sort?: Sort; datep?: string } };
export const alertLabel = (f: Pick<Filters, 'cat' | 'tod' | 'dist'>) => {
  const p = [f.cat === 'all' ? 'Any plan' : CATS[f.cat].label];
  if (f.tod !== 'any') p.push(f.tod[0].toUpperCase() + f.tod.slice(1));
  if (f.dist) p.push(`Within ${f.dist} km`);
  return p.join(' · ');
};
export const alertsOf = (m: Model): Alert[] => (Array.isArray(m.priv.alerts) ? m.priv.alerts as Alert[] : []);
export const savedFOf = (m: Model): SavedF[] => (Array.isArray(m.priv.savedF) ? m.priv.savedF as SavedF[] : []);
export const mutedOf = (m: Model): Record<string, boolean> => (m.priv.muted && typeof m.priv.muted === 'object' ? m.priv.muted as Record<string, boolean> : {});
export const short = (s: string) => (s.length > 40 ? s.slice(0, 40) + '…' : s);

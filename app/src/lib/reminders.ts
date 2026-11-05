import { useEffect, useRef } from 'react';
import { api } from './api';
import { alertsOf, attended, following, matchF, nowOf, short, uname, visible, whenStr, type Model } from './model';
import { useStore } from './store';

/* Reminders and check-ins for plans you're part of, and news of new plans from people you follow or that match an
   alert: the same as tick() and checkNewPlans() in web/app.js. Each becomes a notification with the website's key
   (add_notification ignores a key it already has), so the app and the website never make the same one twice.
   What was already done is kept in profiles.state.actf (per plan) and seenPost, which the website shares. */
type Flags = { arrive?: 'asked' | 'ok'; arriveAt?: number; arriveNag?: boolean; reminded?: boolean; remind24?: boolean; checkin?: boolean };
type Note = Parameters<typeof api.addNotification>[0];
export const actfOf = (m: Model): Record<string, Flags> =>
  (m.priv.actf && typeof m.priv.actf === 'object' ? m.priv.actf as Record<string, Flags> : {});

function due(m: Model): { notes: Note[]; actf: Record<string, Flags>; seenPost?: number } {
  const now = nowOf(m), done = actfOf(m), out: Note[] = [], actf: Record<string, Flags> = {};
  const set = (id: string, f: Flags) => { actf[id] = { ...done[id], ...actf[id], ...f }; };
  const tc = m.priv.trusted as { name?: string } | undefined;
  m.acts.forEach(a => {
    const f = { ...done[a.id], ...actf[a.id] }, mine = attended(m, a), left = a.when - now, d = short(a.desc);
    /* a safety check-in when the meetup starts, and a nudge if there's no answer after 30 minutes */
    if (mine && a.members.length && !f.arrive && left <= 0 && -left < 3 * 3600e3) {
      set(a.id, { arrive: 'asked', arriveAt: now });
      out.push({ kind: 'remind', title: 'Arrived safely?', tag: 'Check in', tone: 'warn', act: a.id, flags: ['safe'], key: 'arrive:' + a.id, body: `"${d}" is starting. Tap to confirm you arrived safely.` });
    }
    if (f.arrive === 'asked' && !f.arriveNag && now - (f.arriveAt || now) >= 30 * 6e4) {
      set(a.id, { arriveNag: true });
      out.push({ kind: 'remind', title: 'No reply yet', tag: 'Safety', tone: 'bad', act: a.id, flags: ['safe'], key: 'arrivenag:' + a.id,
        body: `You haven't confirmed you're OK at "${d}". Tap to answer or alert ${tc?.name || 'your trusted contact'}.` });
    }
    if (mine && left > 0) {
      if (!f.reminded && left <= 2 * 3600e3) {
        set(a.id, { reminded: true, remind24: true });
        out.push({ kind: 'remind', title: 'Activity in 2 hours', tag: 'Soon', tone: 'warn', act: a.id, flags: [], key: 'remind2:' + a.id,
          body: `"${d}" at ${a.venue} starts at ${new Date(a.when).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}. Don't be late!` });
      } else if (!f.remind24 && left <= 24 * 3600e3) {
        set(a.id, { remind24: true });
        out.push({ kind: 'remind', title: 'Coming up', tag: 'Within 24h', tone: 'warn', act: a.id, flags: [], key: 'remind24:' + a.id,
          body: `"${d}" is ${whenStr(a.when).replace(/^(Today|Tomorrow)/, w => w.toLowerCase())} at ${a.venue}.` });
      }
    }
    /* check in about 3 hours after the start, once it has surely ended (only for recent ones) */
    if (left <= 0 && !f.checkin && mine && a.members.length && now - a.when >= 3 * 3600e3 && now - a.when < 3 * 864e5 && !m.ratings[a.id]) {
      set(a.id, { checkin: true });
      out.push({ kind: 'remind', title: 'How did it go?', tag: 'Check in', tone: 'warn', act: a.id, flags: ['check'], key: 'checkin:' + a.id,
        body: `"${d}" has ended. Let us know it went OK and who showed up.` });
    }
  });

  /* new plans since you last looked, from people you follow or matching an alert */
  const newest = Math.max(0, ...m.acts.map(a => a.created || 0));
  const seen = typeof m.priv.seenPost === 'number' ? m.priv.seenPost : 0;
  let seenPost: number | undefined;
  if (!seen) seenPost = newest;
  else {
    const fresh = m.acts.filter(a => a.created > seen && a.host !== m.me && visible(m, a));
    if (fresh.length) {
      seenPost = newest;
      fresh.forEach(a => {
        const al = alertsOf(m).find(x => matchF(m, a, { ...x, dfrom: '', dto: '' }));
        if (following(m).includes(a.host)) out.push({ kind: 'update', title: 'New plan from someone you follow', tag: 'Following', tone: 'info', act: a.id, flags: [], key: 'follow:' + a.id,
          body: `${uname(m, a.host)} posted "${short(a.desc)}" for ${whenStr(a.when)}.` });
        if (al) out.push({ kind: 'update', title: 'New plan for your alert', tag: 'Alert', tone: 'info', act: a.id, flags: [], key: 'alert:' + a.id,
          body: `"${short(a.desc)}", ${whenStr(a.when)}, matches your alert "${al.label}".` });
      });
    }
  }
  return { notes: out, actf, seenPost };
}

/* Runs while you're signed in: on every change, and every 30 seconds for the time-based ones. */
export function useReminders() {
  const { model, savePriv, refresh, toast } = useStore();
  const latest = useRef(model);
  useEffect(() => { latest.current = model; }, [model]);
  useEffect(() => {
    const check = () => {
      const m = latest.current;
      if (!m) return;
      const { notes, actf, seenPost } = due(m);
      if (!notes.length && !Object.keys(actf).length && seenPost === undefined) return;
      savePriv(p => ({
        ...(Object.keys(actf).length ? { actf: { ...(p.actf as object), ...actf } } : {}),
        ...(seenPost !== undefined ? { seenPost } : {}),
      }));
      if (notes.length) {
        toast(notes[0].title + ' · ' + notes[0].body);
        Promise.all(notes.map(n => api.addNotification(n).catch(() => {}))).then(() => refresh());
      }
    };
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, [model, savePriv, refresh, toast]);
}

import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { api, friendly } from './api';
import { askedFrom, type Asked, type MicroKey } from './feedback';
import { learnTaste, saved, toModel, type Model } from './model';
import { forgetPush } from './push';
import { supabase } from './supabase';

const EVERYONE = '00000000-0000-0000-0000-000000000000';
type Priv = Record<string, unknown>;

type Store = {
  ready: boolean;                 // the saved login has been read
  session: Session | null;
  model: Model | null;            // null until the first app_state after signing in
  error: string;
  toastMsg: string;
  toast: (msg: string) => void;
  hideToast: () => void;
  refresh: () => Promise<void>;
  /* Run an action, then read everything again. Returns the answer, or undefined if it failed (already shown). */
  run: <T>(fn: () => Promise<T>) => Promise<T | true | undefined>;
  /* Change private settings (profiles.state). The whole object is saved, so other keys are kept. Pass a function to
     build the change from the latest settings, so two quick changes don't undo each other. */
  savePriv: (patch: Priv | ((priv: Priv) => Priv)) => void;
  /* What has been asked for feedback (profiles.state.asked, lib/feedback.ts), changed from its latest value. */
  saveAsked: (f: (a: Asked) => Asked) => void;
  /* The quick question after a key moment, shown over the tabs (MicroAsk), once per moment. */
  micro: MicroKey | null;
  askMicro: (k: MicroKey) => void;
  endMicro: () => void;
  signOut: () => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const toastT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const busy = useRef<Promise<void> | null>(null);
  const again = useRef(false);
  const modelRef = useRef<Model | null>(null);
  useEffect(() => { modelRef.current = model; }, [model]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(toastT.current);
    /* longer messages (reminders) stay up a little longer, and the cross on the toast closes it sooner */
    toastT.current = setTimeout(() => setToastMsg(''), msg.length > 70 ? 5000 : 2800);
  }, []);
  const hideToast = useCallback(() => { clearTimeout(toastT.current); setToastMsg(''); }, []);

  /* Settings changed here but not saved yet (savePriv waits 700ms). A read that lands in between would bring back the
     old settings and undo them, which made reminders fire again and again, so they're laid back over every read. */
  const unsaved = useRef<Priv | null>(null);

  /* Read everything again. Several calls at once collapse into one extra read (refresh() in web/app.js). */
  const refresh = useCallback((): Promise<void> => {
    if (busy.current) { again.current = true; return busy.current; }
    busy.current = (async () => {
      do {
        again.current = false;
        try {
          const next = toModel(await api.appState());
          if (unsaved.current) next.priv = { ...next.priv, ...unsaved.current };
          setModel(next); setError('');
        }
        catch (e) { setError(friendly(e)); }
      } while (again.current);
      busy.current = null;
    })();
    return busy.current;
  }, []);

  const run = useCallback(async <T,>(fn: () => Promise<T>) => {
    try {
      const r = await fn();
      await refresh();
      return r === null || r === undefined ? true : r;
    } catch (e) { toast(friendly(e)); return undefined; }
  }, [refresh, toast]);

  const saveT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const savePriv = useCallback((patch: Priv | ((priv: Priv) => Priv)) => {
    setModel(m => {
      if (!m) return m;
      const ch = typeof patch === 'function' ? patch(m.priv) : patch;
      unsaved.current = { ...unsaved.current, ...ch };
      return { ...m, priv: { ...m.priv, ...ch } };
    });
    clearTimeout(saveT.current);
    saveT.current = setTimeout(async () => {
      const m = modelRef.current, sent = unsaved.current;
      if (!m) return;
      try {
        await api.saveState(m.priv);
        /* saved, unless more changes came in while it was on its way (those keep a newer object) */
        if (unsaved.current === sent) unsaved.current = null;
      } catch { toast("Couldn't save your settings. Check your connection."); }
    }, 700);
  }, [toast]);
  const saveAsked = useCallback((f: (a: Asked) => Asked) =>
    savePriv(p => ({ asked: { ...askedFrom(p), ...f(askedFrom(p)) } })), [savePriv]);

  const [micro, setMicro] = useState<MicroKey | null>(null);
  const askMicro = useCallback((k: MicroKey) => {
    const m = modelRef.current;
    if (m && !askedFrom(m.priv)[k]) setMicro(k);
  }, []);
  const endMicro = useCallback(() => setMicro(null), []);

  const signOut = useCallback(async () => {
    await forgetPush();
    await supabase.auth.signOut();
    unsaved.current = null;
    setModel(null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_ev, s) => {
      setSession(s);
      if (!s) setModel(null);   // signed out (here, elsewhere, or the login expired)
    });
    return () => data.subscription.unsubscribe();
  }, []);

  /* Signed in: read the state, then listen to `pings`, which the database touches when something changes for you. */
  const uid = session?.user.id;
  useEffect(() => {
    if (!uid) return;
    refresh();
    let t: ReturnType<typeof setTimeout>;
    const soon = () => { clearTimeout(t); t = setTimeout(refresh, 300); };
    const ch = supabase.channel('pings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pings', filter: 'user_id=eq.' + uid }, soon)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pings', filter: 'user_id=eq.' + EVERYONE }, soon)
      .subscribe();
    const sub = AppState.addEventListener('change', s => { if (s === 'active') soon(); });
    return () => { clearTimeout(t); supabase.removeChannel(ch); sub.remove(); };
  }, [uid, refresh]);

  const value = useMemo<Store>(() => ({ ready, session, model, error, toastMsg, toast, hideToast, refresh, run, savePriv, saveAsked, micro, askMicro, endMicro, signOut }),
    [ready, session, model, error, toastMsg, toast, hideToast, refresh, run, savePriv, saveAsked, micro, askMicro, endMicro, signOut]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
}

/* For screens that only render once signed in with a profile (the root layout guarantees it). */
export function useModel(): Model {
  const m = useStore().model;
  if (!m) throw new Error('useModel before the state loaded');
  return m;
}

/* Save a plan for later, or take it off the list (kept in profiles.state.saved, like the website). */
export function useToggleSave() {
  const { model, savePriv, toast } = useStore();
  return (id: string) => {
    const l = model ? saved(model) : [], on = l.includes(id), cat = model?.acts.find(a => a.id === id)?.cat;
    /* saving a plan counts a little towards its category in Swipe's order (learnTaste) */
    savePriv(p => ({ saved: on ? l.filter(x => x !== id) : [...l, id].slice(-100), ...(!on && cat ? learnTaste(p, cat, 0.5) : {}) }));
    toast(on ? 'Removed from saved' : 'Saved. Find it in My plans.');
  };
}

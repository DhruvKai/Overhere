import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { api, friendly } from './api';
import { toModel, type Model } from './model';
import { supabase } from './supabase';

const EVERYONE = '00000000-0000-0000-0000-000000000000';

type Store = {
  ready: boolean;                 // the saved login has been read
  session: Session | null;
  model: Model | null;            // null until the first app_state after signing in
  error: string;
  toastMsg: string;
  toast: (msg: string) => void;
  refresh: () => Promise<void>;
  /* Run an action, then read everything again. Returns the answer, or undefined if it failed (already shown). */
  run: <T>(fn: () => Promise<T>) => Promise<T | true | undefined>;
  /* Change private settings (profiles.state). The whole object is saved, so other keys are kept. */
  savePriv: (patch: Record<string, unknown>) => void;
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
    toastT.current = setTimeout(() => setToastMsg(''), 2800);
  }, []);

  /* Read everything again. Several calls at once collapse into one extra read (refresh() in web/app.js). */
  const refresh = useCallback((): Promise<void> => {
    if (busy.current) { again.current = true; return busy.current; }
    busy.current = (async () => {
      do {
        again.current = false;
        try { setModel(toModel(await api.appState())); setError(''); }
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
  const savePriv = useCallback((patch: Record<string, unknown>) => {
    setModel(m => (m ? { ...m, priv: { ...m.priv, ...patch } } : m));
    clearTimeout(saveT.current);
    saveT.current = setTimeout(async () => {
      const m = modelRef.current;
      if (!m) return;
      try { await api.saveState(m.priv); } catch { toast("Couldn't save your settings. Check your connection."); }
    }, 700);
  }, [toast]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
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

  const value = useMemo<Store>(() => ({ ready, session, model, error, toastMsg, toast, refresh, run, savePriv, signOut }),
    [ready, session, model, error, toastMsg, toast, refresh, run, savePriv, signOut]);
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

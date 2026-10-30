import { useCallback, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { SITE, TURNSTILE_SITE_KEY } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';

/* Cloudflare Turnstile, which Supabase Auth requires on sign-in, sign-up and codes (Attack Protection -> CAPTCHA).
   It runs in a WebView whose page claims overhere.social as its address, so the site key's hostname check passes.
   Usually it finishes on its own; when Cloudflare wants a tap, the sheet shows it. */
const html = (key: string) => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=go&render=explicit" async defer
 onerror="window.ReactNativeWebView.postMessage(JSON.stringify({t:'err',m:'The security check couldn\\'t load. Check your connection and try again.'}))"></script>
<style>html,body{margin:0;background:transparent;display:flex;justify-content:center}</style></head><body><div id="b"></div><script>
function send(o){window.ReactNativeWebView.postMessage(JSON.stringify(o))}
function go(){turnstile.render('#b',{sitekey:${JSON.stringify(key)},appearance:'interaction-only',
 'before-interactive-callback':function(){send({t:'show'})},
 callback:function(tok){send({t:'ok',tok:tok})},
 'error-callback':function(){send({t:'err',m:'The security check failed. Please try again.'})},
 'timeout-callback':function(){send({t:'err',m:'The security check timed out. Please try again.'})}})}
</script></body></html>`;

type Pending = { ok: (t: string | undefined) => void; bad: (e: Error) => void };

export function useCaptcha() {
  const t = useTheme();
  const [run, setRun] = useState(0);        // a new number mounts a fresh widget, so each token is used once
  const [show, setShow] = useState(false);
  const pending = useRef<Pending | null>(null);

  const getToken = useCallback((): Promise<string | undefined> => {
    if (!TURNSTILE_SITE_KEY) return Promise.resolve(undefined);
    return new Promise((ok, bad) => { pending.current = { ok, bad }; setRun(n => n + 1); });
  }, []);

  const onMessage = (e: WebViewMessageEvent) => {
    const m = JSON.parse(e.nativeEvent.data) as { t: string; tok?: string; m?: string };
    if (m.t === 'show') { setShow(true); return; }
    const p = pending.current;
    pending.current = null;
    setShow(false);
    setRun(0);
    if (m.t === 'ok') p?.ok(m.tok);
    else p?.bad(new Error(m.m || 'The security check failed. Please try again.'));
  };

  const node = run ? (
    <Modal transparent visible animationType="fade" onRequestClose={() => { pending.current?.bad(new Error('Security check cancelled')); pending.current = null; setRun(0); setShow(false); }}>
      <View style={[s.wrap, { backgroundColor: show ? 'rgba(0,0,0,.35)' : 'transparent' }]} pointerEvents={show ? 'auto' : 'none'}>
        <View style={[s.box, { backgroundColor: t.card, opacity: show ? 1 : 0 }]}>
          <Text style={[s.title, { color: t.ink }]}>Quick security check</Text>
          <WebView key={run} originWhitelist={['*']} source={{ html: html(TURNSTILE_SITE_KEY), baseUrl: SITE }}
            onMessage={onMessage} style={s.web} containerStyle={s.web} javaScriptEnabled />
        </View>
      </View>
    </Modal>
  ) : null;

  return { node, getToken };
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  box: { width: '100%', maxWidth: 360, borderRadius: 20, padding: 16, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  /* also the WebView's own wrapper (containerStyle), which is flex: 1 + overflow hidden: in this auto-height box that
     collapses to 0 px, hiding Cloudflare's checkbox so the check can never finish */
  web: { width: 320, height: 80, flex: 0, backgroundColor: 'transparent' },
});

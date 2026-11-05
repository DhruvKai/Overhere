import { Modal, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { FaceSession } from '@/lib/api';
import { SITE } from '@/lib/supabase';
import { type Theme, useTheme } from '@/lib/theme';

/* The camera part of the live face check: the website's own widget (web/face-widget.js, AWS Face Liveness) in a
   WebView at overhere.social, so the app and the website run the same check. It films a few seconds straight to
   AWS and says when AWS has the video; face-result then asks AWS for the verdict. Nothing here decides a pass.
   The WebView asks Android for the camera itself (app.json lists the permission). */
/* The widget's theme (face-widget/src/theme.css) reads the site's colour tokens; here they come from the app's. */
const html = (ses: FaceSession, t: Theme) => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${SITE}/fonts/fonts.css"><link rel="stylesheet" href="${SITE}/face-widget.css">
<style>:root{--bg:${t.bg};--card:${t.card};--ink:${t.ink};--mute:${t.mute};--line:${t.line};--field:${t.field};--btn:#3F7D4E;--btnh:#336842;--acc2:${t.acc2};--accink:${t.accink};--bad:${t.bad};color-scheme:${t.dark ? 'dark' : 'light'}}
html,body{margin:0;height:100%;background:${t.bg}}#box{height:100%;padding:12px 16px;box-sizing:border-box}</style></head><body><div id="box"></div><script>
function send(o){window.ReactNativeWebView.postMessage(JSON.stringify(o))}
</script><script src="${SITE}/face-widget.js" onerror="send({t:'err',m:'The face check could not load. Check your connection and try again.'})"></script><script>
if(window.OverhereFaceWidget)OverhereFaceWidget.run(document.getElementById('box'),${JSON.stringify(ses).replace(/</g, '\\u003c')})
 .then(function(){send({t:'ok'})},function(e){send({t:'err',m:(e&&e.message)||'The face check stopped. Please try again.'})});
</script></body></html>`;

export function FaceScan({ ses, onDone }: { ses: FaceSession; onDone: (err?: string) => void }) {
  const t = useTheme();
  const onMessage = (e: WebViewMessageEvent) => {
    const m = JSON.parse(e.nativeEvent.data) as { t: 'ok' | 'err'; m?: string };
    onDone(m.t === 'ok' ? undefined : m.m || 'The face check stopped. Please try again.');
  };
  return (
    <Modal visible animationType="slide" onRequestClose={() => onDone('Face check cancelled.')}>
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <View style={{ flex: 1 }}>
          <WebView originWhitelist={['*']} source={{ html: html(ses, t), baseUrl: SITE }} onMessage={onMessage}
            javaScriptEnabled mediaPlaybackRequiresUserAction={false} allowsInlineMediaPlayback
            mediaCapturePermissionGrantType="grant" style={{ flex: 1 }} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

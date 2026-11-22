import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { CATS, canSave, homeLL, saved, whenStr, type Model, type Plan } from '@/lib/model';
import type { LL } from '@/lib/here';
import { geo } from '@/lib/spots';
import { useToggleSave } from '@/lib/store';
import { MAPKIT_JS } from '@/lib/mapkit-source';
import { GOOGLE_MAPS_KEY, SITE } from '@/lib/supabase';
import { R, useTheme } from '@/lib/theme';
import { Btn, Icon, PlanRow, SaveToggle } from './ui';

/* Discover's map, the same as the website's (drawMap in web/app.js): Google Maps, or OpenStreetMap under Leaflet without
   a key, through the site's map engine (web/mapkit.js, copied into the app as lib/mapkit-source.ts so it never depends on the
   live site's version), in a WebView whose page claims overhere.social as its address (Leaflet loads from the site,
   and Google sees the site's address, which the browser key allows). Pins closer than a finger's width
   merge into a numbered bubble that zooms in when tapped, or lists the plans when they share a spot. A tapped pin
   shows a preview card here, drawn natively; the WebView only tells us which plans were tapped. */
const ICON: Record<string, string> = {   // the website's icons (lucide), inside the pins
  movies: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
  cafe: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
  concerts: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
};

const page = (home: [number, number], here: [number, number] | null) => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<style>html,body,#m{margin:0;height:100%;background:#E8E4DA}
.p{width:34px;height:34px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 10px rgba(0,0,0,.3)}
.p svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.c{display:flex;align-items:center;justify-content:center;border-radius:50%;background:#3F7D4E;color:#fff;font:800 14px system-ui,sans-serif;border:3px solid #fff;box-shadow:0 0 0 6px rgba(63,125,78,.25),0 4px 10px rgba(0,0,0,.25)}
.y{display:block;width:18px;height:18px;border-radius:50%;background:#3B82F6;border:3px solid #fff;box-shadow:0 0 0 7px rgba(59,130,246,.25)}
.leaflet-control-attribution{font-size:10px}</style></head><body><div id="m"></div>
<script>${MAPKIT_JS.replace(/<\/script/gi, '<\\/script')}</script>
<script>
function send(o){window.ReactNativeWebView.postMessage(JSON.stringify(o))}
var ICON=${JSON.stringify(ICON)},HOME=${JSON.stringify(home)},HERE=${JSON.stringify(here)},KEY=${JSON.stringify(GOOGLE_MAPS_KEY)},pins=[],m=null;
/* the map's middle: where you are when location is on (with the blue dot), else your profile's home area (no dot) */
function mid(){return HERE||HOME}
function draw(){
  if(!m)return;m.clearPins();var groups=[];
  pins.forEach(function(a){var p=m.point([a.lat,a.lng]);var g=null;for(var i=0;i<groups.length;i++){if(groups[i].p.distanceTo(p)<40){g=groups[i];break}}if(g)g.items.push(a);else groups.push({p:p,items:[a]})});
  groups.forEach(function(g){
    if(g.items.length===1){var a=g.items[0];
      m.pin([a.lat,a.lng],{size:34,html:'<span class="p" style="background:'+a.color+'"><svg viewBox="0 0 24 24">'+(ICON[a.cat]||'')+'</svg></span>',onClick:function(){send({t:'pick',ids:[a.id]})}});return}
    var lat=0,lng=0,lls=g.items.map(function(a){lat+=a.lat;lng+=a.lng;return [a.lat,a.lng]});lat/=g.items.length;lng/=g.items.length;
    var n=g.items.length,size=n<10?38:n<50?44:50;
    var span=MapKit.meters([Math.min.apply(null,lls.map(function(x){return x[0]})),Math.min.apply(null,lls.map(function(x){return x[1]}))],
      [Math.max.apply(null,lls.map(function(x){return x[0]})),Math.max.apply(null,lls.map(function(x){return x[1]}))]);
    m.pin([lat,lng],{size:size,z:10,html:'<span class="c" style="width:'+size+'px;height:'+size+'px">'+n+'</span>',onClick:function(){
      if(m.zoom()>=17||span<30)send({t:'pick',ids:g.items.map(function(a){return a.id})});
      else m.fit(lls,{maxZoom:17,fly:true,pad:0.4});
    }});
  });
}
function fit(fly){if(m)m.fit([mid()].concat(pins.map(function(a){return [a.lat,a.lng]})),{maxZoom:15,fly:fly})}
function home(){if(m)m.flyTo(mid(),14)}
/* location turned on or off, or you moved: draw the map again around the new middle, with or without the dot */
window.setHere=function(ll){HERE=ll;start()};
window.setPins=function(p,refit){pins=p;if(refit)fit(true);draw()};
/* the map engine (web/mapkit.js): Google when the app has a key, Leaflet over OpenStreetMap otherwise or if Google
   refuses the key (then the map is drawn again) */
function start(){
  MapKit.load(KEY).then(function(){
    var el=document.getElementById('m');
    if(m){m.remove();m=null}
    m=MapKit.create(el,{center:mid(),zoom:13,zoomControl:false});
    if(HERE)m.dot(HERE,{size:18,html:'<span class="y"></span>'});
    m.on('zoom',draw);m.on('click',function(){send({t:'clear'})});
    if(pins.length){fit(false);draw()}
    send({t:'ready'});
  },function(){send({t:'err'})});
}
if(window.MapKit){MapKit.onFail(start);start()}
</script></body></html>`;

export function PlanMap({ m, list, here }: { m: Model; list: Plan[]; here: LL | null }) {
  const t = useTheme();
  const toggleSave = useToggleSave();
  const web = useRef<ComponentRef<typeof WebView>>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const [html] = useState(() => page(homeLL(m), here));   // built once, so the WebView never reloads
  const pins = useMemo(() => list.map(a => { const [lat, lng] = geo(a); return { id: a.id, lat, lng, cat: a.cat, color: CATS[a.cat].fg }; }), [list]);
  const [ready, setReady] = useState(false);

  /* location turned on or off, or you moved more than about 100 m (not every small GPS wobble): move the dot */
  const hereKey = here ? `${here[0].toFixed(3)},${here[1].toFixed(3)}` : '';
  const shownKey = useRef(hereKey);
  useEffect(() => {
    if (!ready || hereKey === shownKey.current) return;
    shownKey.current = hereKey;
    setPicked([]);
    web.current?.injectJavaScript(`window.setHere&&window.setHere(${JSON.stringify(here)});true;`);
  }, [ready, hereKey, here]);

  /* hand the pins over once the map is ready, and again when the list changes (fitting the view to the new set) */
  useEffect(() => {
    if (ready) web.current?.injectJavaScript(`window.setPins&&window.setPins(${JSON.stringify(pins)},true);true;`);
  }, [ready, pins]);

  const onMessage = (e: WebViewMessageEvent) => {
    let d: { t: string; ids?: string[] };
    try { d = JSON.parse(e.nativeEvent.data); } catch { return; }
    if (d.t === 'ready') setReady(true);
    else if (d.t === 'pick') setPicked(d.ids ?? []);
    else if (d.t === 'clear') setPicked([]);
    else if (d.t === 'err') setFailed(true);
  };

  const shown = picked.map(id => list.find(a => a.id === id)).filter((a): a is Plan => !!a);
  const open = (a: Plan) => router.push({ pathname: '/plan/[id]', params: { id: a.id } });

  if (failed) {
    return <View style={[st.box, { backgroundColor: t.field, alignItems: 'center', justifyContent: 'center', padding: 24 }]}><Text style={{ color: t.mute, textAlign: 'center' }}>The map could not load. Check your connection, or switch to the list.</Text></View>;
  }
  return (
    <View style={st.box}>
      <WebView ref={web} originWhitelist={['*']} source={{ html, baseUrl: SITE }} onMessage={onMessage} javaScriptEnabled
        onError={() => setFailed(true)} style={{ flex: 1, backgroundColor: '#E8E4DA' }} containerStyle={{ borderRadius: R, overflow: 'hidden' }} />
      <View style={st.ctl}>
        <Pressable accessibilityRole="button" accessibilityLabel="Show all plans" onPress={() => { setPicked([]); web.current?.injectJavaScript('fit(true);true;'); }} style={[st.cb, { backgroundColor: t.card }]}><Icon name="layers" size={18} /></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={here ? 'Show where you are' : 'Back to your home area'} onPress={() => { setPicked([]); web.current?.injectJavaScript('home();true;'); }} style={[st.cb, { backgroundColor: t.card }]}><Icon name="crosshair" size={18} /></Pressable>
      </View>
      {shown.length ? (
        <View style={[st.prev, { backgroundColor: t.card }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close preview" hitSlop={10} onPress={() => setPicked([])} style={st.x}><Icon name="x" size={18} color={t.mute} /></Pressable>
          {shown.length === 1 ? (<>
            <PlanRow m={m} a={shown[0]} onPress={() => open(shown[0])} />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center' }}>
              <Btn title="View plan" onPress={() => open(shown[0])} style={{ flex: 1 }} />
              {canSave(m, shown[0]) ? <SaveToggle on={saved(m).includes(shown[0].id)} onPress={() => toggleSave(shown[0].id)} /> : null}
            </View>
          </>) : (<>
            <Text style={{ color: t.ink, fontWeight: '700', marginBottom: 8 }}>{shown.length} plans at this spot</Text>
            <ScrollView style={{ maxHeight: 220 }}>
              {shown.map(a => (
                <Pressable key={a.id} accessibilityRole="button" accessibilityLabel={a.desc} onPress={() => open(a)} style={[st.row, { backgroundColor: t.field }]}>
                  <Text style={{ color: t.ink, fontWeight: '700', flex: 1 }} numberOfLines={1}>{a.desc}</Text>
                  <Text style={{ color: t.mute, fontSize: 13 }}>{whenStr(a.when)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>)}
        </View>
      ) : null}
    </View>
  );
}

const st = StyleSheet.create({
  box: { flex: 1, marginHorizontal: 16, marginBottom: 12, borderRadius: R, overflow: 'hidden' },
  ctl: { position: 'absolute', top: 10, right: 10, gap: 8 },
  cb: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  prev: { position: 'absolute', left: 10, right: 10, bottom: 10, borderRadius: 18, padding: 12, paddingTop: 14, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  x: { position: 'absolute', top: 6, right: 6, zIndex: 2, padding: 6 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 10, borderRadius: 12, marginBottom: 6 },
});

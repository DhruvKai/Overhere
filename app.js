"use strict";
/* ---------- icons (Lucide, ISC licence) ---------- */
const IC={
  'arrow-up-down':'<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  'log-out':'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  calendar:'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  'calendar-check':'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  'map-pin':'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'user-check':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  'bell-off':'<path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/><path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="m2 2 20 20"/>',
  'settings-2':'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  'message-circle':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  compass:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  film:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
  coffee:'<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
  music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
  'chevron-right':'<path d="m9 18 6-6-6-6"/>',
  'chevron-left':'<path d="m15 18-6-6 6-6"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  'bar-chart':'<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>',
  wallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  map:'<path d="M14.1 6 9.9 3.9a2 2 0 0 0-1.8 0L3.6 6.2A1 1 0 0 0 3 7.1v12.3a1 1 0 0 0 1.4.9l4.2-2.1a2 2 0 0 1 1.8 0l4.2 2.1a2 2 0 0 0 1.8 0l4.5-2.3a1 1 0 0 0 .6-.9V4.6a1 1 0 0 0-1.4-.9l-4.2 2.1a2 2 0 0 1-1.8 0z"/><path d="M15 5.8v15"/><path d="M9 3.2v15"/>',
  list:'<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  sparkles:'<path d="M9.9 15.5A2 2 0 0 0 8.5 14.1l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  'user-plus':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>',
  repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  'circle-check':'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'badge-check':'<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
  'shield-check':'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'alert-triangle':'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'scan-face':'<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>',
  'id-card':'<rect width="20" height="14" x="2" y="5" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4"/><path d="M14 14h4"/><path d="M5 17c.5-1 1.6-1.5 3-1.5s2.5.5 3 1.5"/>',
  briefcase:'<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  pencil:'<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>',
  layers:'<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off':'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  circle:'<circle cx="12" cy="12" r="9"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  'rotate-cw':'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  'zoom-in':'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/>',
  'zoom-out':'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/>'
};
const I=(n,s=16)=>`<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;

/* ---------- constants ---------- */
const HOODS=['Sector 17','Sector 7','Sector 22'];   // Chandigarh launch areas
const GENDERS=['Woman','Man','Non-binary'];
const INTERESTS=['Movies','Cafe / Food','Concerts'];
const TIMES=['Weekday evenings','Weekend days','Weekend evenings','Late nights'];
const CATS={
  movies:{label:'Movies',icon:'film',fg:'#7C3AED',bg:'#EDE9FE',g:'radial-gradient(120% 70% at 50% 115%,rgba(234,88,12,.55),transparent 60%),radial-gradient(60% 40% at 50% 35%,rgba(148,163,255,.22),transparent 70%),linear-gradient(180deg,#0f0d1a,#1c1530 60%,#120e0b)'},
  cafe:{label:'Cafe/Food',icon:'coffee',fg:'#15803D',bg:'#DCFCE7',g:'radial-gradient(80% 60% at 70% 20%,rgba(253,186,116,.85),transparent 60%),linear-gradient(160deg,#b45309,#7c2d12 55%,#2a1206)'},
  concerts:{label:'Concerts',icon:'music',fg:'#DB2777',bg:'#FCE7F3',g:'radial-gradient(70% 55% at 30% 25%,rgba(244,114,182,.6),transparent 60%),radial-gradient(60% 50% at 80% 80%,rgba(250,204,21,.35),transparent 60%),linear-gradient(160deg,#4a0d2e,#1a0a1f)'}
};
const COST={split:'Split equally',own:'Everyone pays their own way',host:'Host is covering everyone'};
const COST_S={split:'Equal Split',own:'Go Dutch',host:'Host Pays'};
/* Swipe shows today and tomorrow; Discover starts the day after, so the two never show the same plan. */
const swipeEnd=()=>{const d=new Date(now());d.setHours(0,0,0,0);d.setDate(d.getDate()+2);return d.getTime()};

/* ---------- plan photos ---------- */
/* Real, freely licensed photos from Wikimedia Commons, stored in img/plans (credits.html names each one).
   A plan gets, in order: a photo of what it clearly is (karaoke, ramen...), else of its place if that's a
   Chandigarh landmark, else a looser match within its category, else one of its category's photos. */
const PHOTO_WHAT=[[/outdoor movie|movie on the lawn/,'outdoorfilm'],[/jazz/,'jazz'],[/karaoke/,'karaoke'],[/sufi|qawwali/,'sufi'],
  [/carnatic|classical/,'classical'],[/dhol|bhangra|folk/,'dhol'],[/open.?mic|songwriting|poetry/,'openmic'],[/techno|nightclub|\bdj\b|\bedm\b/,'club'],
  [/vinyl|record store/,'vinyl'],[/ramen/,'ramen'],[/momo/,'momos'],[/paratha|parantha/,'parantha'],[/chole|bhature/,'cholebhature'],
  [/dessert|sweets|mithai/,'dessert'],[/cook.?along|cooking/,'cooking'],[/tea (tasting|room|flight)/,'tea'],
  [/board ?game|pictionary|catan/,'boardgames'],[/book (swap|club|exchange)/,'books'],[/maggi|dhaba/,'dhaba'],[/crossword|filter coffee/,'coffee']];
const PHOTO_PLACE=[[/sukhna/,'sukhna'],[/rock garden/,'rockgarden'],[/rose garden/,'rosegarden'],[/sector 17 (plaza|architecture)|plaza fountain/,'plaza17'],
  [/capitol|le corbusier/,'capitol'],[/leisure valley/,'leisure'],[/museum/,'museum'],[/panjab university/,'pu'],[/elante/,'elante']];
const PHOTO_LOOSE={cafe:[[/brunch|pancake|breakfast/,'brunch'],[/chai/,'chai'],[/picnic/,'picnic']],
  concerts:[[/sitar|recital|raga/,'classical'],[/band|gig|live music|acoustic|rock/,'liveband']],
  movies:[[/classic|re-?run|re-?release|\b90s\b|matinee|satyajit|retro/,'classicfilm']]};
const PHOTO_CAT={movies:['cinema','classicfilm'],cafe:['coffee','brunch','chai'],concerts:['concert','liveband']};
function photoOf(a){
  const t=(a.venue+' '+a.desc).toLowerCase(),hit=l=>(l.find(([re])=>re.test(t))||[])[1];
  const k=hit(PHOTO_WHAT)||hit(PHOTO_PLACE)||hit(PHOTO_LOOSE[a.cat]||[]);
  if(k)return 'img/plans/'+k+'.webp';
  const pool=PHOTO_CAT[a.cat]||PHOTO_CAT.cafe;let h=0;for(const ch of String(a.id))h=(h*31+ch.charCodeAt(0))>>>0;
  return 'img/plans/'+pool[h%pool.length]+'.webp';
}
/* The photo over the category's colours (shown while it loads), and the category icon only when there's no photo. */
const planBg=a=>{const c=CATS[a.cat]||CATS.cafe,p=photoOf(a);return p?`url('${p}') center/cover no-repeat,${c.g}`:c.g};
const planThumb=a=>`<div class="thumb" style="background:${planBg(a)}"></div>`;
/* Dummy portraits for the demo; if one fails to load the initial shows instead. */
/* Everyone gets an emoji avatar; your own can be an uploaded photo instead. */
const defEmo=g=>g==='Woman'?'👩':g==='Man'?'👨':'🧑';
const EMOJIS=['👩🏻','👩🏽','👩🏿','👨🏻','👨🏽','👨🏿','🧑🏼','🧑🏾','👩🏽‍🦱','👨🏻‍🦱','👩🏾‍🦳','🧔🏽','👱🏻‍♀️','👳🏽‍♂️','🧕🏽','👩🏽‍💻','👨🏾‍💻','👩🏻‍🎨','👨🏽‍🍳','🧑🏽‍🎤','👩🏾‍🏫','👨🏻‍🎓','👩🏽‍🔬','🧑🏻‍🚀','😀','😎','🤓','🥳','🦊','🐼','🐯','🐨','🦉','🌻','🎧','🎬','☕','🎸'];
/* Other people, filled in from the database: name, gender, age, job, bio, emoji, verified, show-up record, past plans, likes. */
let USERS={};
const CAT_INT={movies:'Movies',cafe:'Cafe / Food',concerts:'Concerts'};
const CHAT_REASONS=['Harassment or threats','Sexual or unwanted messages','Spam or scam','Hate speech','Something else'];
const MICRO={swipe:'Was swiping an easy way to find plans?',request:'How easy was it to ask to join?',post:'How easy was posting your plan?',rating:'Was rating the meetup quick enough?'};
const REPORT_REASONS=['Made me feel unsafe','Inappropriate messages or behaviour','Fake profile or scam',"Didn't show up",'Something else'];
const REPEAT={weekly:'Every week',biweekly:'Every 2 weeks',monthly:'Every month'};
const NK={req:{ic:'user-check',bg:'#E7F0E1',fg:'#336842'},update:{ic:'layers',bg:'#DBEAFE',fg:'#1D4ED8'},remind:{ic:'calendar',bg:'#FEF3C7',fg:'#A16207'}};

/* ---------- state ---------- */
/* Everything lives in Supabase and is read again (app_state) whenever something changes for you.
   Inside the page your own id is written 'me', so the screens can say "You". */
const CFG=window.APP_CONFIG||{};
const SB_URL=(CFG.SUPABASE_URL||'').replace(/\/+$/,'').replace(/\/rest\/v1$/,'');
const ONLINE=!!(SB_URL&&CFG.SUPABASE_ANON_KEY&&/^https?:$/.test(location.protocol)&&window.supabase);
const SB=ONLINE?window.supabase.createClient(SB_URL,CFG.SUPABASE_ANON_KEY):null;
const EVERYONE='00000000-0000-0000-0000-000000000000';
let ME=null,MYPHONE='',MODE={face:'simulated',kyc:'simulated'},VER={face:{fails:0,attempts:0,max:5,review:false},kyc:{fails:0,attempts:0,max:5,review:false}},skew=0,loaded=false,DRAFT=null,LOCKED=0;
const isUuid=x=>typeof x==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x);
/* Your private settings, saved to your account. ACT_FLAGS remember which reminders an activity already gave you. */
const PRIV=['dismissed','following','alerts','muted','tips','asked','actf','seenPost'];
const ACT_FLAGS=['arrive','arriveAt','arriveNag','reminded','remind24','checkin'];
const blank=()=>({me:null,acts:[],reqs:[],chats:{},notes:[],ratings:{},blocked:[],reported:{},dismissed:[],following:[],alerts:[],muted:{},tips:{},asked:{},actf:{},seenPost:0});
let S=blank();
const freshF=()=>({cat:'all',dfrom:'',dto:'',tod:'any',dist:0,sort:'for',view:'list'});
const SORTS={for:['sparkles','My interests','Plans that match what you like come first'],soon:['clock','Time','Soonest first'],near:['map-pin','Distance','Closest to you first']};
const DISTS=[2,5,10];
const freshUi=()=>({tab:'swipe',modal:null,f:freshF(),auth:{mode:'in'}});
let ui=freshUi();
const sid=id=>id==='me'?ME:id;   // back to a database id

/* Turn the database's answer into the shapes the screens use. */
function applyState(st){
  ME=st.me;MODE=st.mode||MODE;VER=st.verify||VER;skew=(st.now||Date.now())-Date.now();DRAFT=st.draft||null;LOCKED=st.locked||0;
  const mid=id=>id===ME?'me':id,p=st.profile,first=!loaded,known=new Set(S.notes.map(n=>n.id));
  const keepLocal=dirty?Object.fromEntries(PRIV.map(k=>[k,S[k]])):null,keepTrusted=dirty?S.me?.trusted:undefined;
  loaded=true;
  if(!p){S=blank();USERS={};return}
  const priv=p.state||{};
  USERS={};let mine={};
  (st.people||[]).forEach(x=>{
    const u={name:x.name,gender:x.gender,age:x.age,job:x.job||'',bio:x.bio||'',emo:x.emo||defEmo(x.gender),verified:!!x.face,trust:[x.met||0,x.shows||0],hist:x.hist||[],ints:x.ints||[],avail:x.avail||[],sample:!!x.sample};
    if(x.id===ME)mine=u;else USERS[x.id]=u;
  });
  S=blank();
  PRIV.forEach(k=>{if(priv[k]!=null)S[k]=priv[k]});
  if(keepLocal)Object.assign(S,keepLocal);   // settings you changed a moment ago and are still being saved
  S.following=(Array.isArray(S.following)?S.following:[]).filter(isUuid);S.dismissed=(Array.isArray(S.dismissed)?S.dismissed:[]).filter(isUuid);
  ['muted','tips','asked','actf'].forEach(k=>{if(!S[k]||typeof S[k]!=='object'||Array.isArray(S[k]))S[k]={}});if(typeof S.seenPost!=='number')S.seenPost=0;
  S.alerts=(Array.isArray(S.alerts)?S.alerts:[]).filter(x=>x&&/^al[0-9a-z]+$/.test(x.id)&&typeof x.label==='string');
  S.me={name:p.name,dob:p.dob,gender:p.gender,hood:p.hood,job:p.job||'',bio:p.bio||'',ints:p.ints||[],avail:p.avail||[],emo:p.emo||defEmo(p.gender),
    face:!!p.face,kyc:!!p.kyc,obDone:!!p.onboarded,trusted:keepTrusted!==undefined?keepTrusted:(priv.trusted||null),trustv:mine.trust||[0,0],hist:mine.hist||[],photo:loadPhoto()};
  const t=now();
  S.acts=(st.acts||[]).map(a=>{
    const mem=(a.members||[]).map(mid);
    return {id:a.id,host:mid(a.host),cat:a.cat,desc:a.desc,cap:a.cap,when:a.when,aud:a.aud&&a.aud.length?a.aud:'everyone',venue:a.venue,cost:a.cost,
      ...(a.total?{total:a.total}:{}),...(a.repeat?{repeat:a.repeat}:{}),hood:a.hood,status:a.when<=t?'past':a.status,created:a.created,
      members:mem.length===a.mcount?mem:Array.from({length:a.mcount},()=>'?'),wl:a.wl||0,mypos:a.mypos||0,...flagsOf(a.id)};
  });
  const pastIds=new Set(S.acts.filter(a=>a.status==='past').map(a=>a.id));
  S.reqs=(st.reqs||[]).sort((x,y)=>x.at-y.at).map(r=>({id:r.id,act:r.act,user:mid(r.user),note:r.note||'',
    status:pastIds.has(r.act)&&(r.status==='pending'||r.status==='waitlist')?'no_action':r.status}));
  (st.reported||[]).forEach(m=>{S.reported[m]=true});
  (st.msgs||[]).forEach(m=>{(S.chats[m.act]=S.chats[m.act]||[]).push({id:m.id,from:m.sys?'sys':m.from?mid(m.from):'?',text:m.text,at:m.at,reported:!!S.reported[m.id],
    ...(m.poll?{poll:{q:m.poll.q,opts:m.poll.opts.map((o,j)=>({t:o,v:(m.votes||[]).filter(v=>v.o===j).map(v=>mid(v.u))}))}}:{})})});
  S.notes=(st.notes||[]).map(n=>({id:n.id,at:n.at,kind:n.kind,title:n.title,tag:n.tag,tone:n.tone,act:n.act,text:n.text,read:n.read,
    check:n.flags.includes('check'),safe:n.flags.includes('safe'),chat:n.flags.includes('chat')}));
  (st.ratings||[]).forEach(r=>{S.ratings[r.act]={at:r.at,ok:r.ok,stars:r.stars,people:Object.fromEntries(Object.entries(r.people||{}).map(([k,v])=>[mid(k),v]))}});
  S.blocked=(st.blocked||[]).map(mid);
  if(!first){const fresh=S.notes.filter(n=>!n.read&&!known.has(n.id));if(fresh.length)toast(fresh[0].title+' · '+fresh[0].text)}
  checkNewPlans();
  try{localStorage.setItem('overhere_participant',JSON.stringify({id:ME,name:S.me.name}))}catch(e){}
}
/* Reminder flags saved for one activity: only the known keys, with plain values. */
function flagsOf(id){const f=S.actf&&S.actf[id],o={};if(f&&typeof f==='object')ACT_FLAGS.forEach(k=>{const v=f[k];if(typeof v==='boolean'||typeof v==='number'||v==='asked'||v==='ok')o[k]=v});return o}
/* Your photo stays on this device only; other people see your emoji. */
const photoKey=()=>'overhere_photo:'+ME;
function loadPhoto(){try{const v=localStorage.getItem(photoKey());return PHOTO_RE.test(v||'')?v:''}catch(e){return ''}}
function savePhoto(url){try{if(url)localStorage.setItem(photoKey(),url);else localStorage.removeItem(photoKey());return true}catch(e){return false}}

/* Private settings are saved to your account a moment after the last change. */
let saveT=null,dirty=false;
function save(){
  if(!S.me||!SB)return true;
  S.acts.forEach(a=>{const f={};ACT_FLAGS.forEach(k=>{if(a[k]!=null&&a[k]!==false)f[k]=a[k]});if(Object.keys(f).length)S.actf[a.id]=f});
  dirty=true;clearTimeout(saveT);saveT=setTimeout(pushState,700);return true;
}
async function pushState(){
  saveT=null;if(!S.me)return;
  const ids=new Set(S.acts.map(a=>a.id));
  Object.keys(S.actf).forEach(k=>{if(!ids.has(k))delete S.actf[k]});
  S.dismissed=S.dismissed.filter(id=>ids.has(id));
  const st={};PRIV.forEach(k=>{st[k]=S[k]});if(S.me.trusted)st.trusted=S.me.trusted;
  try{await call('save_state',{s:st},true);if(!saveT)dirty=false}catch(e){toast("Couldn't save your settings. Check your connection.")}
}

/* ---------- helpers ---------- */
const now=()=>Date.now()+skew;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uname=id=>id==='me'?'You':(USERS[id]?.name||'Someone');
/* Host name + age; opens their profile unless it's you. */
const hostName=id=>{const p=profileOf(id),t=`<span><span class="hname">${esc(id==='me'?'You':p.name)}</span>${id==='me'?'':', '+p.age}</span>`;
  return id==='me'?t:`<button class="hlink" data-a="user" data-id="${id}" title="View ${esc(p.name)}'s profile">${t}</button>`};
const short=s=>s.length>40?s.slice(0,40)+'…':s;
const fmt=t=>new Date(t).toLocaleString([], {weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
function whenStr(t){
  const d=new Date(t),n=new Date(now()),day=x=>new Date(x.getFullYear(),x.getMonth(),x.getDate()).getTime();
  const diff=Math.round((day(d)-day(n))/864e5),tm=d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  return diff===0?'Today '+tm:diff===1?'Tomorrow '+tm:d.toLocaleDateString([], {weekday:'short',day:'numeric',month:'short'})+' · '+tm;
}
function ago(t){
  const s=Math.max(0,(now()-t)/1000);
  return s<60?'just now':s<3600?Math.floor(s/60)+'m ago':s<86400?Math.floor(s/3600)+'h ago':s<14*86400?Math.floor(s/86400)+'d ago':Math.floor(s/604800)+'w ago';
}
const dayKey=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const tod=t=>{const h=new Date(t).getHours();return h>=5&&h<12?'morning':h>=12&&h<17?'afternoon':h>=17&&h<21?'evening':'night'};
const spots=a=>a.cap-a.members.length;
const spotTxt=a=>spots(a)<=0?'Full':spots(a)+' spot'+(spots(a)===1?'':'s')+' open';
const tags=a=>[COST_S[a.cost],...(a.aud==='everyone'?[]:[a.aud.join(' / ')+' only']),...(a.repeat?[REPEAT[a.repeat]]:[])];
const actOf=id=>S.acts.find(a=>a.id===id);
const myReq=id=>S.reqs.find(r=>r.act===id&&r.user==='me');
/* the trusted contact has to be someone else, not the number this account signed in with */
const ownPhone=p=>!!MYPHONE&&p.replace(/\D/g,'').slice(-10)===MYPHONE;
const audOK=a=>a.aud==='everyone'||a.aud.includes(S.me.gender);
const isBlocked=id=>S.blocked.includes(id);
const isVer=id=>id==='me'?!!S.me.face:!!USERS[id]?.verified;
const vf=(id,long)=>isVer(id)?`<span class="vf">${long?I('badge-check',14)+' Verified':'✓'}</span>`:'';
/* Hosts see the whole waitlist; everyone else only its length and their own place in it. */
const waitlist=id=>{const a=actOf(id);if(a&&a.host!=='me')return Array.from({length:a.wl||0},(_,i)=>({user:i+1===a.mypos?'me':'?'}));return S.reqs.filter(r=>r.act===id&&r.status==='waitlist')};
const isPast=a=>a.status==='past'||a.when<=now();
const attended=a=>a.host==='me'||a.members.includes('me');
const actLink=a=>location.href.split('#')[0].split('?')[0]+'#act='+a.id;
/* Show-up record, counted by the database from everyone's check-ins after meetups. */
function trust(id){
  const [met,shows]=(id==='me'?S.me.trustv:USERS[id]?.trust)||[0,0];
  return {met,shows,rate:met?Math.round(shows/met*100):null};
}
const trustTxt=id=>{const t=trust(id);return t.met?`Showed up ${t.shows} · No-show ${t.met-t.shows}`:'New to meetups'};
/* Past activities for a profile: history from before the app plus real ones. */
function pastList(id){
  const real=S.acts.filter(a=>a.status==='past'&&(a.host===id||a.members.includes(id))&&(id==='me'||S.ratings[a.id]))
    .map(a=>({t:a.desc,cat:a.cat,at:a.when,role:a.host===id?'Hosted':'Joined',act:a.id}));
  const old=((id==='me'?S.me.hist:USERS[id]?.hist)||[]).map(([t,cat,d,role])=>({t,cat,at:now()-d*864e5,role}));
  return [...real,...old].sort((a,b)=>b.at-a.at);
}
function pastHtml(list,none){
  if(!list.length)return `<p class="small mute">${none}</p>`;
  return `<div class="past">${list.slice(0,6).map(x=>{const a=x.act&&actOf(x.act);
    const rate=a&&attended(a)&&a.members.length&&!S.ratings[a.id]?`<button class="btn xs" data-a="rate" data-id="${a.id}">Rate</button>`:'';
    return `<div class="pi"><div class="pth" style="background:${planBg(a||{id:x.t,cat:x.cat,venue:'',desc:x.t})}"></div><div class="pm"><div class="t">${esc(x.t)}</div><div class="small mute">${esc(x.role)} · ${ago(x.at)}</div></div>${rate}</div>`}).join('')}</div>`;
}
/* ---- recommendations, distance, cost, host signals ---- */
function slotOf(t){const d=new Date(t),h=d.getHours(),we=d.getDay()===0||d.getDay()===6;if(h>=23||h<5)return 'Late nights';if(we)return h<17?'Weekend days':'Weekend evenings';return h>=17?'Weekday evenings':null}
function reasons(a){
  const r=[],s=slotOf(a.when);
  if(S.following.includes(a.host))r.push(['You follow '+uname(a.host),3]);
  if((S.me.ints||[]).includes(CAT_INT[a.cat]))r.push(['You like '+CAT_INT[a.cat],2]);
  if(s&&(S.me.avail||[]).includes(s))r.push(['Fits your '+s.toLowerCase(),1]);
  return r;
}
const score=a=>reasons(a).reduce((n,x)=>n+x[1],0);
/* Approximate spot for the map and distance, stable per activity, within ~4 km of your neighbourhood centre. */
/* ---------- where plans are ---------- */
/* Real coordinates from OpenStreetMap, looked up once. A plan is pinned at its landmark, else at the centre of the
   sector its venue names, else at the centre of its neighbourhood. That is approximate on purpose: hosts share the
   exact spot only once you're accepted. */
const SECTOR_LL={1:[30.76116,76.80215],2:[30.76379,76.79137],3:[30.75829,76.79616],4:[30.75186,76.80141],5:[30.74556,76.80678],6:[30.73903,76.81245],7:[30.73587,76.80428],8:[30.7417,76.79945],9:[30.7474,76.79393],10:[30.75419,76.78896],11:[30.75987,76.7845],12:[30.7644,76.77885],14:[30.75985,76.76683],15:[30.75299,76.77265],16:[30.74676,76.77752],17:[30.74007,76.78259],18:[30.7345,76.78825],19:[30.7283,76.79306],20:[30.72118,76.78158],21:[30.7269,76.77654],22:[30.73343,76.77135],23:[30.73992,76.7662],24:[30.74578,76.76173],25:[30.75165,76.75673],26:[30.73001,76.80911],27:[30.72275,76.79842],28:[30.71719,76.80372],29:[30.71026,76.79242],30:[30.71568,76.78697],31:[30.70288,76.78109],32:[30.70839,76.77529],33:[30.71413,76.77014],34:[30.71992,76.76521],35:[30.72612,76.75989],36:[30.73247,76.75491],37:[30.73853,76.75034],38:[30.74468,76.74577],39:[30.74374,76.73028],40:[30.73798,76.7354],41:[30.73254,76.7378],42:[30.72608,76.74315],43:[30.71909,76.74879],44:[30.7129,76.75411],45:[30.70659,76.75693],46:[30.7014,76.76423],47:[30.69581,76.76905],48:[30.68794,76.75732],49:[30.69403,76.75214],50:[30.7,76.74775],51:[30.70562,76.74276],52:[30.71217,76.73725],53:[30.71924,76.73215],54:[30.72608,76.72921],55:[30.73008,76.72283],56:[30.73665,76.7189],61:[30.70889,76.73076],63:[30.69297,76.73648]};
const PLACE_LL=[
  [/sukhna/,[30.74198,76.81767]],
  [/rock garden/,[30.7532,76.80663]],
  [/rose garden/,[30.74582,76.78148]],
  [/capitol|le corbusier/,[30.76099,76.80322]],
  [/leisure valley/,[30.7536,76.7938]],
  [/museum/,[30.74895,76.78744]],
  [/panjab university/,[30.76024,76.76649]],
  [/elante/,[30.70544,76.80096]],
  [/tagore theatre/,[30.73323,76.78954]],
  [/kala bhawan/,[30.74676,76.77752]],
  [/piccadily/,[30.72352,76.76759]],
  [/indian coffee house/,[30.74022,76.7806]]];
/* Areas of Chandigarh outside the numbered sectors (also looked up on OpenStreetMap). */
const LOCALITY_LL={'Manimajra':[30.71275,76.83294],'Industrial Area Phase 1':[30.7054,76.80096],'Industrial Area Phase 2':[30.69813,76.78801],'IT Park':[30.72732,76.84352],'Daria':[30.69838,76.81428],'Dhanas':[30.769,76.75515],'Hallomajra':[30.6923,76.79997],'Kaimbwala':[30.75847,76.82606],'Khuda Lahora':[30.77582,76.77184],'Kishangarh':[30.73443,76.82821],'Maloya':[30.75315,76.71713],'Mauli Jagran':[30.69703,76.82901],'Sarangpur':[30.78087,76.7576]};
const hoodLL=h=>SECTOR_LL[(/\d+/.exec(h||'')||[17])[0]]||SECTOR_LL[17];
/* A venue's spot: a landmark it names, else the sector it names, else the area it names. */
const spotOf=t=>{t=(t||'').toLowerCase();const p=PLACE_LL.find(([re])=>re.test(t));if(p)return p[1];
  const s=/sector[\s-]*(\d{1,2})\b/.exec(t);if(s&&SECTOR_LL[+s[1]])return SECTOR_LL[+s[1]];
  const l=Object.keys(LOCALITY_LL).find(n=>t.includes(n.toLowerCase()));return l&&LOCALITY_LL[l]};
/* ", Sector 26" or ", Manimajra" at the end of a venue: what picking an area adds (and replaces when you pick another). */
const AREA_TAIL=new RegExp(',\\s*(sector\\s*\\d{1,2}|'+Object.keys(LOCALITY_LL).join('|')+')\\s*$','i');
function geo(a){
  const exact=PLACE_AT[(a.venue||'').trim().toLowerCase()],base=exact||spotOf(a.venue)||spotOf(a.desc)||hoodLL(a.hood);
  /* plans at the same spot are spread out a little (up to about 270 m, or 45 m at a known place) so their pins don't hide each other */
  let h=2166136261;for(const c of a.id){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}h>>>=0;
  const ang=(h%360)*Math.PI/180,r=(0.25+((h>>>9)%75)/100)*(exact?0.0004:0.0025);
  return [base[0]+r*Math.sin(ang),base[1]+r*Math.cos(ang)];
}
function kmBetween([a1,o1],[a2,o2]){const r=Math.PI/180,x=Math.sin((a2-a1)*r/2)**2+Math.cos(a1*r)*Math.cos(a2*r)*Math.sin((o2-o1)*r/2)**2;return 12742*Math.asin(Math.sqrt(x))}
/* distance from the centre of your neighbourhood (the app never asks for your own location) */
const kmAway=a=>kmBetween(hoodLL(S.me.hood),geo(a));
const distKm=a=>kmAway(a).toFixed(1);

/* ---------- venue search (post and edit forms) ---------- */
/* places.json: Chandigarh's named meetup places from OpenStreetMap (tools/update-places.py rebuilds it).
   Loaded once in the background, and searched in the browser: nothing is sent anywhere while typing. */
let PLACES=null,placesP=null,PLACE_AT={},vPick=-1;
const normTxt=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
function loadPlaces(){
  return placesP||(placesP=fetch('places.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>{
    PLACES=d.places.map(([label,kind,lat,lon])=>({label,kind,ll:[lat,lon],key:' '+normTxt(label+' '+kind)}));
    PLACES.forEach(p=>{PLACE_AT[p.label.toLowerCase()]=p.ll});
    if(loaded)redraw();   // pins and distances for picked venues become exact
  }).catch(()=>{placesP=null}));
}
/* Every word typed must start a word of the place's name, sector or kind ("cafe sector 17" works).
   Names that start with what was typed come first, then the nearest to your neighbourhood. */
function findPlaces(q){
  const whole=normTxt(q),w=whole.split(' ').filter(Boolean),home=hoodLL(S.me.hood);
  if(!w.length||!PLACES)return [];
  return PLACES.filter(p=>w.every(x=>p.key.includes(' '+x)))
    .map(p=>[normTxt(p.label).startsWith(whole)?0:1,kmBetween(home,p.ll),p]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).slice(0,8).map(x=>x[2]);
}
function venueList(show){
  const inp=document.getElementById('f_venue'),box=document.getElementById('f_vlist');if(!inp||!box)return;
  const q=inp.value.trim(),list=show&&q.length>=2?findPlaces(q):[];
  if(show&&q.length>=2&&!PLACES)loadPlaces().then(()=>{if(document.activeElement===inp)venueList(true)});
  /* last option: the venue as typed. If it already names a place or area the map knows, it's used as it is; if not, you pick its area. */
  const n=list.length,exact=list.some(p=>p.label.toLowerCase()===q.toLowerCase()),known=PLACE_AT[q.toLowerCase()]||spotOf(q);
  const other=!show||q.length<2||exact?'':known
    ?`<button type="button" class="vopt vother" role="option" id="f_vo${n}" aria-selected="false" data-a="pickvenue" data-v="${esc(q)}"><b>Use “${esc(q)}”</b><span>As typed. It shows on the map in that area.</span></button>`
    :`<button type="button" class="vopt vother" role="option" id="f_vo${n}" aria-selected="false" data-a="venueother"><b>Not listed? Use “${esc(q)}”</b><span>Then pick its area, so it shows on the map</span></button>`;
  vPick=-1;box.hidden=!n&&!other;inp.setAttribute('aria-expanded',String(!box.hidden));inp.removeAttribute('aria-activedescendant');
  box.innerHTML=list.map((p,i)=>`<button type="button" class="vopt" role="option" id="f_vo${i}" aria-selected="false" data-a="pickvenue" data-v="${esc(p.label)}"><b>${esc(p.label)}</b><span>${esc(p.kind)} · ${kmBetween(hoodLL(S.me.hood),p.ll).toFixed(1)} km from ${esc(S.me.hood)}</span></button>`).join('')+other;
}
/* The area picker, shown after "Not listed?" (or when a venue can't be placed on the map). */
const areaPicker=()=>`<div class="varea"><label for="f_area">Which area is it in?</label><select id="f_area"><option value="">Pick an area…</option>
  <optgroup label="Sectors">${Object.keys(SECTOR_LL).map(n=>`<option>Sector ${n}</option>`).join('')}</optgroup>
  <optgroup label="Other areas">${Object.keys(LOCALITY_LL).map(n=>`<option>${esc(n)}</option>`).join('')}</optgroup></select>
  <p class="small mute" style="margin-top:6px">The pin goes in the middle of that area, so people can see roughly where it is.</p></div>`;
function askArea(){if(ui.modal?.type!=='post')return;ui.modal.other=true;venueList(false);redraw();document.getElementById('f_area')?.focus()}
/* Arrow keys move through the suggestions, Enter picks one, Escape closes them (and not the whole form). */
function venueKey(e){
  const box=document.getElementById('f_vlist'),opts=box&&!box.hidden?[...box.children]:[];
  if(!opts.length||!['ArrowDown','ArrowUp','Enter','Escape'].includes(e.key))return false;
  e.preventDefault();
  if(e.key==='Escape'){venueList(false);return true}
  if(e.key==='Enter'){opts[Math.max(vPick,0)].click();return true}
  vPick=(vPick+(e.key==='ArrowDown'?1:-1)+opts.length)%opts.length;
  opts.forEach((o,i)=>{o.classList.toggle('on',i===vPick);o.setAttribute('aria-selected',String(i===vPick))});
  opts[vPick].scrollIntoView({block:'nearest'});e.target.setAttribute('aria-activedescendant',opts[vPick].id);
  return true;
}
const rupees=n=>'₹'+Math.round(n).toLocaleString('en-IN');
function costLine(a){
  const t=a.total,each=t?Math.ceil(t/(a.cap+1)/10)*10:0;
  if(a.cost==='host')return a.host==='me'?`You cover everyone${t?' · about '+rupees(t)+' total':''}`:'Host covers it · free for you';
  if(a.cost==='own')return 'Everyone pays their own way'+(t?` · about ${rupees(each)} each`:'');
  return t?`Split equally · about ${rupees(each)} each when full (${rupees(t)} total)`:'Split equally';
}
const metWith=u=>S.acts.filter(a=>a.status==='past'&&attended(a)&&(a.host===u||a.members.includes(u))).length;
function signals(u){
  const ints=USERS[u]?.ints||[],av=USERS[u]?.avail||[],t=trust(u),met=metWith(u);
  const chips=[...ints.filter(x=>(S.me.ints||[]).includes(x)).map(x=>'Both like '+x),...av.filter(x=>(S.me.avail||[]).includes(x)).map(x=>'Both free '+x.toLowerCase())].map(x=>`<span class="chip acc">${esc(x)}</span>`);
  if(met)chips.push(`<span class="chip ok">${I('users',11)} Met you ${met}× before</span>`);
  if(t.met>=3&&t.rate<90)chips.push(`<span class="chip warn">${I('alert-triangle',11)} Missed ${t.met-t.shows} of ${t.met} meetups</span>`);
  return `<div class="sig">${chips.length?chips.join(''):'<span class="small mute">Nothing in common yet</span>'}</div>`;
}
function matchF(a,f){return (f.cat==='all'||a.cat===f.cat)&&(!f.dfrom||dayKey(a.when)>=f.dfrom)&&(!f.dto||dayKey(a.when)<=f.dto)&&(f.tod==='any'||tod(a.when)===f.tod)&&(!f.dist||kmAway(a)<=f.dist)}
function alertLabel(f){const p=[f.cat==='all'?'Any plan':CATS[f.cat].label];if(f.tod!=='any')p.push(f.tod[0].toUpperCase()+f.tod.slice(1));if(f.dist)p.push(`Within ${f.dist} km`);return p.join(' · ')}
/* ---- usage events: sent to Supabase from the published site, kept in this browser when running from a file ---- */
const uuid4=()=>crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16)});
const SESSION=uuid4();
function track(name,props={}){
  try{
    const row={id:uuid4(),participant_id:ME,session_id:SESSION,name,props};
    const C=window.APP_CONFIG||{};
    if(C.SUPABASE_URL&&C.SUPABASE_ANON_KEY&&location.protocol.startsWith('http')){
      const h={apikey:C.SUPABASE_ANON_KEY,'Content-Type':'application/json',Prefer:'return=minimal'};
      if(C.SUPABASE_ANON_KEY.startsWith('eyJ'))h.Authorization='Bearer '+C.SUPABASE_ANON_KEY;
      fetch(C.SUPABASE_URL.replace(/\/+$/,'').replace(/\/rest\/v1$/,'')+'/rest/v1/events',{method:'POST',headers:h,body:JSON.stringify(row),keepalive:true}).catch(()=>{});
    }else{
      const k='overhere_local_data',all=JSON.parse(localStorage.getItem(k)||'{"participants":[],"feedback":[]}');
      (all.events=all.events||[]).push({...row,created_at:new Date().toISOString()});
      if(all.events.length>2000)all.events.splice(0,all.events.length-2000);
      localStorage.setItem(k,JSON.stringify(all));
    }
  }catch(e){}
}
/* ---- one-question feedback after key moments, asked once each ---- */
function askMicro(k){if(MICRO[k]&&!S.asked[k])ui.micro=k}
function microHtml(){
  const k=ui.micro;if(!k||ui.modal)return '';
  return `<div class="micro" role="dialog" aria-label="Quick question"><div class="mq"><span>Quick question</span><button class="ib" data-a="microx" aria-label="Dismiss question">${I('x',15)}</button></div><p>${MICRO[k]}</p>
  <div class="mf">${[['😞','Hard',1],['😐','OK',2],['🙂','Easy',3],['😀','Very easy',4]].map(([e,l,n])=>`<button data-a="microans" data-n="${n}"><span aria-hidden="true">${e}</span>${l}</button>`).join('')}</div></div>`;
}
/* ---- theme + install ---- */
let installEvt=null;
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
function applyTheme(t){
  if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.removeAttribute('data-theme');
  const dark=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name=theme-color]')?.setAttribute('content',dark?'#15130F':'#3F7D4E');
}
const themePref=()=>{try{return localStorage.getItem('overhere_theme')||'system'}catch(e){return 'system'}};
/* ---- new plans since you last looked: tell you about ones from people you follow, or that match an alert ---- */
function newPlanPosted(a){
  if(!visible(a))return;
  const fol=S.following.includes(a.host),al=S.alerts.find(x=>matchF(a,{...x,dfrom:'',dto:''}));
  if(fol)notify(`${uname(a.host)} posted "${short(a.desc)}" for ${whenStr(a.when)}.`,{kind:'update',title:'New plan from someone you follow',tag:'Following',tone:'info',act:a.id,key:'follow:'+a.id});
  if(al)notify(`"${short(a.desc)}", ${whenStr(a.when)}, matches your alert "${al.label}".`,{kind:'update',title:'New plan for your alert',tag:'Alert',tone:'info',act:a.id,key:'alert:'+a.id});
}
function checkNewPlans(){
  const newest=Math.max(0,...S.acts.map(a=>a.created||0));
  if(!S.seenPost){S.seenPost=newest;save();return}
  const fresh=S.acts.filter(a=>a.created>S.seenPost&&a.host!=='me');
  if(!fresh.length)return;
  fresh.forEach(newPlanPosted);S.seenPost=newest;save();
}
function msgHtml(a,x,i){
  if(x.from==='sys')return `<div class="msg sys">${esc(x.text)}</div>`;
  const me=x.from==='me',who=me?'':`<div class="who">${esc(uname(x.from))}${x.poll||x.reported?'':`<button class="mflag" data-a="msgrep" data-id="${a.id}" data-m="${i}" title="Report message" aria-label="Report this message">${I('flag',12)}</button>`}</div>`;
  if(x.poll){
    const tot=x.poll.opts.reduce((n,o)=>n+o.v.length,0);
    return `<div class="msg poll ${me?'mine':''}">${who}<div class="pq">${I('bar-chart',14)} ${esc(x.poll.q)}</div>${x.poll.opts.map((o,j)=>{const on=o.v.includes('me'),pct=tot?Math.round(o.v.length/tot*100):0;
      return `<button class="po ${on?'on':''}" data-a="vote" data-id="${a.id}" data-m="${i}" data-o="${j}" aria-pressed="${on}" aria-label="${esc(o.t)}: ${o.v.length} ${o.v.length===1?'vote':'votes'}"><span class="pb" style="width:${pct}%"></span><span class="pt3">${esc(o.t)}</span><span class="pn2">${o.v.length}</span></button>`}).join('')}
      <div class="small mute">${tot} ${tot===1?'vote':'votes'} · tap to vote</div></div>`;
  }
  return `<div class="msg ${me?'me':''} ${x.reported?'rep':''}">${who}${x.reported?'<i>You reported this message.</i>':esc(x.text)}</div>`;
}
function getLoc(){
  const done=(st,loc)=>{if(ui.modal?.type==='sos'){ui.modal.locState=st;if(loc)ui.modal.loc=loc;render()}};
  if(!navigator.geolocation)return done('fail');
  navigator.geolocation.getCurrentPosition(p=>done('ok',{lat:p.coords.latitude,lng:p.coords.longitude,acc:p.coords.accuracy}),()=>done('fail'),{enableHighAccuracy:true,timeout:10000,maximumAge:60000});
}
const backB=m=>m.back?`<button class="ib" data-a="close" title="Back" aria-label="Back" style="margin-left:-8px">${I('chevron-left',18)}</button>`:'';
const ageOf=dob=>{const d=new Date(dob);return isNaN(d)?'?':Math.floor((Date.now()-d)/31557600000)};
const localInput=ts=>new Date(ts-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16);
function profileOf(id){
  if(id==='me')return {name:S.me.name,gender:S.me.gender,age:ageOf(S.me.dob),job:S.me.job||'',bio:S.me.bio||''};
  return USERS[id]||{name:'Someone',gender:'',age:'',job:'',bio:''};
}
const PASTEL=['#E3EFDB','#E9E4FB','#D9F2E6','#FBE3EE','#DDEEFB','#FBF0D2'];
function av(id,cls=''){
  const n=id==='me'?(S.me?.name||'?'):(USERS[id]?.name||'?'),hues=['#3F7D4E','#8B5CF6','#10B981','#EC4899','#0EA5E9','#EAB308'];
  const me=id==='me'?' data-me':'';
  if(me&&PHOTO_RE.test(S.me?.photo||''))return `<span class="av ${cls}"${me}><img src="${S.me.photo}" alt="${esc(n)}"></span>`;
  let h=0;for(const c of n)h+=c.charCodeAt(0);
  const emo=me?(S.me?.emo||defEmo(S.me?.gender)):USERS[id]?.emo;
  if(emo)return `<span class="av emo ${cls}"${me} style="background:${PASTEL[h%PASTEL.length]}" aria-hidden="true">${esc(emo)}</span>`;
  return `<span class="av ${cls}"${me} style="background:${hues[h%hues.length]}">${esc(n[0].toUpperCase())}</span>`;
}
const catPill=(k,tint)=>{const c=CATS[k];return `<span class="cat" style="color:${c.fg}${tint?';background:'+c.bg:''}">${I(c.icon,12)}${c.label}</span>`};
const opts=(name,list,sel)=>`<div class="opts">${list.map(v=>`<label class="opt"><input type="checkbox" name="${name}" value="${esc(v)}" ${sel&&sel.includes(v)?'checked':''}>${esc(v)}</label>`).join('')}</div>`;
const many=n=>[...document.querySelectorAll(`input[name="${n}"]:checked`)].map(x=>x.value);
let toastT;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2600)}
/* A notification for you, made by the app (reminders, alerts). The key stops the same one being made twice. */
function notify(text,o={}){
  const n={id:'tmp'+Math.random().toString(36).slice(2),text,at:now(),read:false,kind:o.kind||'update',title:o.title||'Update',tag:o.tag||'',tone:o.tone||'',act:o.act||null,check:!!o.check,safe:!!o.safe,chat:!!o.chat};
  S.notes.unshift(n);toast(n.title+' · '+text);
  if(SB)call('add_notification',{p_kind:n.kind,p_title:n.title,p_tag:n.tag,p_tone:n.tone,p_act:n.act,p_body:text,p_flags:['check','safe','chat'].filter(k=>n[k]),p_key:o.key||null},true).catch(()=>{});
}

/* ---------- domain logic ---------- */
/* visible: listed in Discover (full ones too, for the waitlist). eligible: can be requested right now. */
function visible(a){return (a.status==='open'||a.status==='full')&&a.host!=='me'&&a.hood===S.me.hood&&audOK(a)&&!isBlocked(a.host)&&a.when>now()}
function eligible(a){return visible(a)&&a.status==='open'&&spots(a)>0&&!S.dismissed.includes(a.id)}
/* Real people's plans come before the sample hosts' ones, so a new post isn't buried behind them. */
const isSample=id=>!!USERS[id]?.sample;
const deck=()=>S.acts.filter(a=>eligible(a)&&!myReq(a.id)&&a.when<swipeEnd()).sort((a,b)=>isSample(a.host)-isSample(b.host)||a.when-b.when);
/* Discover lists plans from the day after tomorrow on; today and tomorrow are Swipe's.
   Plans that declined you drop out of Discover; they stay in Requests (where you can still share them). */
const feed=()=>S.acts.filter(a=>visible(a)&&!myReq(a.id)&&a.when>=swipeEnd()).sort((a,b)=>a.when-b.when);

/* ---------- talking to the database ---------- */
async function call(fn,args={},quiet){
  const {data,error}=await SB.rpc(fn,args);
  if(error){if(!quiet)toast(friendly(error));throw error}
  return data;
}
/* Edge Functions (the real face check). */
async function edge(name,body){
  const {data,error}=await SB.functions.invoke(name,{body});
  if(error){let m=error.message;try{const j=await error.context?.json();if(j?.error)m=j.error}catch(e){}throw new Error(m)}
  return data;
}
function friendly(e){
  const m=String(e?.message||e||'');
  if(/Failed to fetch|NetworkError|Load failed/i.test(m))return "Can't reach Overhere. Check your connection and try again.";
  if(/JWT|sign in again|not signed|refresh token/i.test(m))return 'Please sign in again.';
  if(/phone (signups|provider|logins?) .*disabled|unsupported phone provider/i.test(m))return "Phone sign-in isn't switched on yet. Please use Google or email for now.";
  if(/token has expired|otp.*(expired|invalid)|invalid.*(otp|token)/i.test(m))return 'That code is wrong or has expired. Check it, or tap Resend code.';
  if(/(error|fail).*send.*(sms|otp)|sms.*(fail|error)|invalid phone/i.test(m))return "We couldn't send the SMS. Check the number, or try again in a minute.";
  if(/violates|invalid input|syntax|permission denied|does not exist|schema cache/i.test(m))return 'Something there was not accepted. Please check it and try again.';
  return m&&m.length<160?m:'Something went wrong. Please try again.';
}
/* Read everything again. Several calls at once collapse into one extra read. */
let busy=null,again=false;
function refresh(){
  if(busy){again=true;return busy}
  busy=(async()=>{
    try{applyState(await call('app_state',{},true));ui.err=''}
    catch(e){ui.err=friendly(e);if(!loaded)loaded=false}
    busy=null;
    if(again){again=false;return refresh()}
    tick();redraw();
  })();
  return busy;
}
/* Supabase Realtime: the database touches your row in `pings` when something changes for you (or for everyone). */
let soonT;
const soon=()=>{clearTimeout(soonT);soonT=setTimeout(refresh,300)};
function listen(){
  SB.channel('pings').on('postgres_changes',{event:'*',schema:'public',table:'pings',filter:'user_id=eq.'+ME},soon)
    .on('postgres_changes',{event:'*',schema:'public',table:'pings',filter:'user_id=eq.'+EVERYONE},soon).subscribe();
}
/* Run an action, then read everything again. Returns the function's answer, or undefined if it failed (already shown). */
async function run(fn,args){
  try{const r=await call(fn,args);await refresh();return r===null?true:r}catch(e){return undefined}
}

/* Reminders and check-ins for plans you are part of, made on this device. */
function tick(){
  if(!S.me||!loaded)return false;
  let ch=false;
  S.acts.forEach(a=>{
    const mine=attended(a),left=a.when-now();
    if(a.status!=='past'&&left<=0){a.status='past';ch=true}
    /* Safety check-in when the meetup starts, and a nudge if there's no answer after 30 minutes. */
    if(mine&&a.members.length&&!a.arrive&&left<=0&&-left<3*3600e3){
      a.arrive='asked';a.arriveAt=now();ch=true;
      notify(`"${short(a.desc)}" is starting. Tap to confirm you arrived safely.`,{kind:'remind',title:'Arrived safely?',tag:'Check in',tone:'warn',act:a.id,safe:true,key:'arrive:'+a.id});
    }
    if(a.arrive==='asked'&&!a.arriveNag&&now()-a.arriveAt>=30*6e4){
      a.arriveNag=true;ch=true;
      notify(`You haven't confirmed you're OK at "${short(a.desc)}". Tap to answer or alert ${S.me.trusted?S.me.trusted.name:'your trusted contact'}.`,{kind:'remind',title:'No reply yet',tag:'Safety',tone:'bad',act:a.id,safe:true,key:'arrivenag:'+a.id});
    }
    if(a.status!=='past'&&mine&&left>0){
      if(!a.reminded&&left<=2*3600e3){
        a.reminded=a.remind24=true;ch=true;
        notify(`"${short(a.desc)}" at ${a.venue} starts at ${new Date(a.when).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}. Don't be late!`,{kind:'remind',title:'Activity in 2 hours',tag:'Soon',tone:'warn',act:a.id,key:'remind2:'+a.id});
      }else if(!a.remind24&&left<=24*3600e3){
        a.remind24=true;ch=true;
        notify(`"${short(a.desc)}" is ${whenStr(a.when).replace(/^(Today|Tomorrow)/,w=>w.toLowerCase())} at ${a.venue}.`,{kind:'remind',title:'Coming up',tag:'Within 24h',tone:'warn',act:a.id,key:'remind24:'+a.id});
      }
    }
    /* Check in about 3 hours after the start, once it has surely ended (only for recent ones). */
    if(a.status==='past'&&!a.checkin&&mine&&a.members.length&&now()-a.when>=3*3600e3&&now()-a.when<3*864e5&&!S.ratings[a.id]){
      a.checkin=true;ch=true;
      notify(`"${short(a.desc)}" has ended. Let us know it went OK and who showed up.`,{kind:'remind',title:'How did it go?',tag:'Check in',tone:'warn',act:a.id,check:true,key:'checkin:'+a.id});
    }
  });
  if(ch)save();return ch;
}

/* ---------- verification: face scan and ID check ----------
   Each check is 'simulated' or 'live', set in the database (app_config face_check / id_check).
   Simulated: the database function verify_simulated records a pretend pass.
   Live face check (AWS Face Liveness, see face-scan.md):
     1. the Edge Function face-start creates a session and records that you started it
     2. face-widget.js (window.OverhereFaceWidget) films a few seconds straight to AWS, not to us
     3. the Edge Function face-result asks AWS for the result and records pass or fail.
   The browser never decides whether a check passed. */
function loadScript(src){
  return new Promise((ok,no)=>{
    if(document.querySelector(`script[src="${src}"]`))return ok();
    /* before the page's own styles, so the widget's global body/html rules don't override the app's */
    const css=document.createElement('link');css.rel='stylesheet';css.href=src.replace(/\.js$/,'.css');document.head.insertBefore(css,document.head.querySelector('style'));
    const el=document.createElement('script');el.src=src;el.onload=()=>ok();el.onerror=()=>no(new Error('The face check could not load. Please try again.'));document.head.appendChild(el);
  });
}
const CHECKS={
  async simulated(kind){await new Promise(r=>setTimeout(r,1300));return call('verify_simulated',{p_kind:kind,p_pass:true,p_consent:true},true)},
  async live(kind){
    if(kind!=='face')throw new Error('The ID check is not connected yet. Please try again later.');
    const ses=await edge('face-start',{consent:true});
    if(ses?.status==='review')return ses;   // out of tries: blocked until a person reviews it, no camera
    await loadScript('face-widget.js');
    if(!window.OverhereFaceWidget)throw new Error('The face check is not available yet. Please try again later.');
    await window.OverhereFaceWidget.run(document.getElementById('face_box'),ses);   // resolves once the video is analysed
    return edge('face-result',{sessionId:ses.sessionId});
  }
};
function openVerify(kind,next){
  ui.modal={type:'verify',kind,next,state:VER[kind]?.review?'flagged':'idle'};render();
}
async function scan(){
  const m=ui.modal;if(!m||m.state==='scanning')return;
  const v=VER[m.kind]||{},out=(v.attempts||0)>=(v.max||5);   // out of tries: the call only files the review, no scan
  if(!out&&!document.getElementById('v_ok')?.checked)return toast('Please tick the box to agree first');
  m.state='scanning';m.err='';render();
  try{
    const r=await (MODE[m.kind]==='live'?CHECKS.live(m.kind):CHECKS.simulated(m.kind));
    if(r?.verify)VER=r.verify;
    if(r?.status==='passed'){
      track('verify_passed',{kind:m.kind});
      const nx=m.next;ui.modal=null;toast(m.kind==='face'?'Face check passed':'ID verified');
      await refresh();if(nx)nx();return;
    }
    m.state=r?.status==='review'?'flagged':'fail';
  }catch(e){m.state='fail';m.err=friendly(e)}
  await refresh();
  if(ui.modal===m){if(VER[m.kind]?.review)m.state='flagged';render()}
}
/* Browsing is open to everyone; posting and asking to join need the face check. The ID check is off for now. */
const gate=fn=>{if(S.me.face)fn();else openVerify('face',fn)};

/* ---------- swipe ---------- */
function swipe(dir){
  const a=deck()[0];if(!a)return;
  const el=document.querySelector('.card.top');
  track('swipe',{dir});
  if(dir==='right'){if(el)el.style.transform='';ui.modal={type:'confirm',id:a.id};render();return}
  if(el){el.style.transition='transform .25s';el.style.transform='translateX(-600px) rotate(-25deg)'}
  setTimeout(()=>{
    S.dismissed.push(a.id);askMicro('swipe');save();
    if(!deck().length){ui.tab='discover';toast("You've seen everything nearby. Here's Discover.")}
    render();
  },230);
}
function bindDrag(){
  const el=document.querySelector('.card.top');if(!el)return;
  let sx=0,dx=0,down=false,dragged=false;
  const st=el.querySelector('.stamp');
  /* a tap opens the details; a drag must not */
  el.addEventListener('click',e=>{if(dragged){e.stopPropagation();dragged=false}});
  el.onpointerdown=e=>{if(e.target.closest('button'))return;down=true;sx=e.clientX;el.setPointerCapture(e.pointerId);el.style.transition='none'};
  el.onpointermove=e=>{
    if(!down)return;dx=e.clientX-sx;
    el.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;
    st.textContent=dx>0?'REQUEST':'SKIP';st.style.color=dx>0?'#A7D7A0':'#FECACA';st.style.opacity=Math.min(Math.abs(dx)/100,1);
  };
  el.onpointerup=()=>{
    if(!down)return;down=false;el.style.transition='transform .25s';
    const d=dx;dx=0;st.style.opacity=0;dragged=Math.abs(d)>6;
    if(d>110)swipe('right');else if(d<-110)swipe('left');else el.style.transform='';
  };
}

/* ---------- render: cards & lists ---------- */
function cardHtml(a,cls){
  const h=profileOf(a.host);
  return `<div class="card ${cls}" style="background:${planBg(a)}"${cls==='top'?` data-a="detail" data-id="${a.id}" role="button" tabindex="0" aria-label="${esc(a.desc)}: view details"`:''}><div class="shade"></div><div class="stamp"></div>
  <div class="cp">${catPill(a.cat)}</div>
  <div class="body"><div class="who">${a.host==='me'?`${av('me','sm')}You`:`<button class="hlink" data-a="user" data-id="${a.host}" title="View ${esc(h.name)}'s profile">${av(a.host,'sm')}<span><span class="hname">${esc(h.name)}</span>, ${h.age}</span></button>`} ${vf(a.host)}</div>
  <h2>${esc(a.desc)}</h2>
  <div class="meta"><span>${I('calendar',14)}${whenStr(a.when)}</span><span>${I('map-pin',14)}${esc(a.venue)}</span><span>${I('users',14)}${spotTxt(a)}</span></div>
  <div class="tags">${tags(a).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></div>`;
}
const REQ_LBL={pending:'Requested',accepted:'Accepted',rejected:'Declined',waitlist:'Waitlisted',left:'Left',removed:'Removed',no_action:'No response'};
const REQ_TONE={pending:'acc',accepted:'ok',rejected:'bad',waitlist:'info'};
function acCard(a){
  const rq=myReq(a.id),full=spots(a)<=0;
  return `<div class="ac" data-a="detail" data-id="${a.id}"><div class="media" style="background:${planBg(a)}">${catPill(a.cat)}</div>
  <div class="bd">${ui.f.sort==='for'&&reasons(a)[0]?`<div class="why">${I('sparkles',12)} ${esc(reasons(a)[0][0])}</div>`:''}<h4>${esc(a.desc)}</h4>
  <div class="meta2"><span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(a.venue)} · ${distKm(a)} km</span></div>
  <div class="tg"><span>${I('users',12)}${spotTxt(a)}</span>${tags(a).map(t=>`<span>${esc(t)}</span>`).join('')}</div>
  <div class="ft"><div class="hn">${av(a.host,'sm')}${hostName(a.host)} ${vf(a.host)}</div>
  ${rq?`<span class="chip ${REQ_TONE[rq.status]||''}">${REQ_LBL[rq.status]||esc(rq.status)}</span>`
    :full?`<button class="btn xs sec" data-a="askreq" data-id="${a.id}">Join waitlist</button>`
    :`<button class="btn xs" data-a="askreq" data-id="${a.id}">Request ${I('chevron-right',13)}</button>`}</div></div></div>`;
}
function liHtml(a,act,meta,chips,right){
  return `<div class="panel tap li" data-a="${act}" data-id="${a.id}" role="button" tabindex="0">${planThumb(a)}
  <div style="flex:1;min-width:0"><div class="t">${esc(a.desc)}</div><div class="meta2" style="margin:4px 0 8px">${meta}</div>${chips}</div>${right||`<span class="mute">${I('chevron-right',18)}</span>`}</div>`;
}
// host=true renders from the poster's side (e.g. "Left" instead of "You left")
const statusChip=(s,host)=>({pending:'<span class="chip warn">Pending</span>',accepted:'<span class="chip ok">Accepted</span>',rejected:'<span class="chip bad">Declined</span>',no_action:`<span class="chip">${host?'No response':'No action from poster'}</span>`,waitlist:'<span class="chip info">Waitlisted</span>',left:`<span class="chip">${host?'Left':'You left'}</span>`,removed:`<span class="chip bad">${host?'Removed':'Removed by host'}</span>`}[s]);
const actChip=s=>({open:'<span class="chip ok">Open</span>',full:'<span class="chip acc">Full</span>',past:'<span class="chip">Past</span>'}[s]);
const empty=(ic,t,sub,btn)=>`<div class="empty"><div class="big">${I(ic,30)}</div><h2>${t}</h2><p>${sub}</p>${btn||''}</div>`;

/* ---------- render: tabs ---------- */
/* Audience-limited plans (e.g. women-only) are only sent to people whose ID check passed. */
const lockedNote=()=>LOCKED&&!S.me.face?`<div class="dn" style="margin:0 0 14px;text-align:left">${I('shield-check',14)} ${LOCKED} ${LOCKED===1?'plan near you is':'plans near you are'} only open to certain groups, like women-only plans. <button class="lnk" data-a="unlock">Do the face check to see ${LOCKED===1?'it':'them'}</button></div>`:'';
function tabSwipe(){
  const d=deck();
  if(!d.length)return lockedNote()+empty('compass','Nothing new right now','You have gone through all plans happening soon in '+esc(S.me.hood)+'. Check Discover for plans further out.','<button class="btn" data-a="tab" data-t="discover">Go to Discover</button>');
  return `<div class="deck"><h1 class="pt">What's happening tonight?</h1><p class="sub">Activities today and tomorrow · Tap a card for details</p>${lockedNote()}
  <div class="stack">${d[1]?cardHtml(d[1],'back'):''}${cardHtml(d[0],'top')}</div>
  <div class="acts"><button class="rb" data-a="swipe" data-d="left" title="Skip">${I('x',24)}</button>
  <div class="cnt">1 of ${d.length}<br>← dismiss · request →</div>
  <button class="rb go" data-a="swipe" data-d="right" title="Request to join">${I('heart',24)}</button></div>
  <p class="small mute kb" style="margin-top:6px">Use ← → arrow keys to navigate</p></div>`;
}
/* Date range: YYYY-MM-DD strings, either end optional */
const dLbl=k=>new Date(k+'T12:00:00').toLocaleDateString([], {weekday:'short',day:'numeric',month:'short'});
const rangeLbl=f=>f.dfrom&&f.dto?(f.dfrom===f.dto?dLbl(f.dfrom):dLbl(f.dfrom)+' – '+dLbl(f.dto)):f.dfrom?'From '+dLbl(f.dfrom):'Until '+dLbl(f.dto);
function datePresets(){
  /* today and tomorrow are in Swipe, so every preset starts the day after */
  const t=new Date(swipeEnd()),k=d=>dayKey(d.getTime()),plus=n=>{const d=new Date(t);d.setDate(d.getDate()+n);return d};
  const dow=t.getDay(),sat=dow===0?-1:6-dow;
  return {weekend:['This weekend',k(plus(Math.max(sat,0))),k(plus(sat+1))],week:['Next 7 days',k(t),k(plus(6))],month:['Next 30 days',k(t),k(plus(29))]};
}
/* Active filters, as removable chips: [key, label] */
function activeFilters(f){
  const a=[];
  if(f.cat!=='all')a.push(['cat',CATS[f.cat].label]);
  if(f.dfrom||f.dto)a.push(['date',rangeLbl(f)]);
  if(f.tod!=='any')a.push(['tod',f.tod[0].toUpperCase()+f.tod.slice(1)]);
  if(f.dist)a.push(['dist',`Within ${f.dist} km`]);
  return a;
}
const SEG=(act,cur,opts)=>`<span class="seg" role="radiogroup">${opts.map(([k,l,name])=>`<button role="radio" aria-checked="${cur===k}" class="${cur===k?'on':''}" data-a="${act}" data-k="${k}"${name?` aria-label="${name}" title="${name}"`:''}>${l}</button>`).join('')}</span>`;
function tabDiscover(){
  const all=feed(),f=ui.f,list=all.filter(a=>matchF(a,f)),act=activeFilters(f);
  if(f.sort==='for')list.sort((a,b)=>score(b)-score(a)||a.when-b.when);
  else if(f.sort==='near')list.sort((a,b)=>kmAway(a)-kmAway(b)||a.when-b.when);
  const alertable=act.some(([k])=>k!=='date'),saved=S.alerts.some(x=>x.label===alertLabel(f));
  return `<div class="hd"><div><h1 class="pt">All upcoming plans</h1><p class="sub">${all.length} upcoming in ${esc(S.me.hood)}, from ${dLbl(dayKey(swipeEnd()))} onwards</p></div><button class="btn sm mobonly" data-a="newpost">${I('plus',15)} Post</button></div>
  ${lockedNote()}${S.alerts.length?`<div class="alerts"><span class="small mute" style="display:inline-flex;align-items:center;gap:4px">${I('bell',13)} Your alerts</span>${S.alerts.map(al=>`<span class="alchip">${esc(al.label)}<button data-a="rmalert" data-id="${al.id}" aria-label="Remove alert ${esc(al.label)}">${I('x',12)}</button></span>`).join('')}</div>`:''}
  <div class="dtools"><button class="fbtn ${act.length?'on':''}" data-a="filters" aria-haspopup="dialog">${I('filter',14)} Filters${act.length?`<b aria-label="${act.length} active">${act.length}</b>`:''}</button>
  <button class="fbtn" data-a="sortmenu" aria-haspopup="dialog" aria-label="Sort by ${SORTS[f.sort][1]}">${I('arrow-up-down',14)} Sort: ${SORTS[f.sort][1]}</button>
  ${SEG('fview',f.view,[['list',I('list',13)+'<span class="tl">List</span>','List view'],['map',I('map',13)+'<span class="tl">Map</span>','Map view']])}</div>
  <div class="small mute fact"><span>Showing <b>${list.length}</b> ${list.length===1?'activity':'activities'}</span>
  ${act.map(([k,l])=>`<span class="alchip">${esc(l)}<button data-a="fclear" data-k="${k}" aria-label="Remove filter ${esc(l)}">${I('x',12)}</button></span>`).join('')}
  ${act.length?`<button class="lnk" data-a="freset">Reset</button>`:''}${alertable&&!saved?`<button class="lnk" data-a="saveal">${I('bell',13)} Alert me about new matches</button>`:''}</div>
  ${!list.length?empty('calendar',all.length?'No matches':'No plans yet',all.length?'Try different filters.':'Be the first to post one in your neighborhood.',act.length&&all.length?'<button class="btn sec" data-a="freset">Reset filters</button>':'')
   :f.view==='map'?mapHtml(list):`<div class="grid">${list.map(a=>acCard(a)).join('')}</div>`}`;
}
/* Discover's map: OpenStreetMap under Leaflet (both loaded only when the map is first opened). */
let mapList=[],mapView=null,liveMap=null,leafletP=null;
function mapHtml(list){
  mapList=list;
  return `<div id="lmap" class="map" role="region" aria-label="Map of plans near you"></div>
  <p class="small mute" style="margin-top:8px">The blue dot is the centre of ${esc(S.me.hood)}, Chandigarh. A pin is at the place when the host picked it from the list, otherwise in the middle of the area the venue is in.</p>`;
}
function loadLeaflet(){
  if(window.L)return Promise.resolve();
  return leafletP||(leafletP=new Promise((ok,bad)=>{
    const css=document.createElement('link');css.rel='stylesheet';css.href='vendor/leaflet/leaflet.css';document.head.appendChild(css);
    const s=document.createElement('script');s.src='vendor/leaflet/leaflet.js';s.onload=ok;s.onerror=()=>{leafletP=null;bad()};document.head.appendChild(s);
  }));
}
async function drawMap(){
  const el=document.getElementById('lmap');if(!el)return;
  try{await loadLeaflet()}catch(e){el.innerHTML='<p class="small mute" style="padding:16px">The map could not load. Check your connection, or switch to the list.</p>';return}
  if(!el.isConnected||el.dataset.on)return;
  el.dataset.on='1';
  if(liveMap){liveMap.remove();liveMap=null}   // the previous render's map
  const home=hoodLL(S.me.hood),m=L.map(el).setView(mapView?.c||home,mapView?.z||13);
  liveMap=m;
  m.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(m);
  L.marker(home,{zIndexOffset:1000,keyboard:false,icon:L.divIcon({className:'',iconSize:[18,18],iconAnchor:[9,9],html:'<span class="lyou"></span>'})}).addTo(m).bindTooltip('Centre of '+esc(S.me.hood));
  mapList.forEach(a=>{
    const c=CATS[a.cat],label=`${short(a.desc)} · ${whenStr(a.when)} · ${distKm(a)} km`;
    L.marker(geo(a),{title:label,keyboard:true,icon:L.divIcon({className:'',iconSize:[34,34],iconAnchor:[17,17],html:`<span class="lpin" style="--pc:${c.fg}">${I(c.icon,15)}</span>`})})
      .addTo(m).bindTooltip(esc(label),{direction:'top',offset:[0,-16]}).on('click',()=>A.detail({id:a.id}));
  });
  m.on('moveend',()=>{mapView={c:m.getCenter(),z:m.getZoom()}});
  if(!mapView&&mapList.length)m.fitBounds(L.latLngBounds([home,...mapList.map(geo)]).pad(0.15),{maxZoom:15});
}
function tabActs(){
  const mine=S.acts.filter(a=>a.host==='me').sort((a,b)=>(a.status==='past')-(b.status==='past')||(a.status==='past'?b.when-a.when:a.when-b.when));
  return `<div class="hd"><div><h1 class="pt">My Activities</h1><p class="sub">Plans you are hosting</p></div><button class="btn sm" data-a="newpost">${I('plus',15)} Post</button></div>`
    +(mine.length?mine.map(a=>{
      const p=S.reqs.filter(r=>r.act===a.id&&r.status==='pending').length,w=waitlist(a.id).length;
      return liHtml(a,'hostview',`<span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('users',13)}${a.members.length}/${a.cap} accepted</span>`,
        `${actChip(a.status)} ${p?`<span class="chip warn">${p} pending</span>`:''} ${w?`<span class="chip info">${w} waitlisted</span>`:''} ${a.repeat&&a.status!=='past'?`<span class="chip">${REPEAT[a.repeat]}</span>`:''} ${a.status==='past'&&a.members.length&&!S.ratings[a.id]?'<span class="chip warn">Rate meetup</span>':''}`);
    }).join(''):empty('calendar-check','You have not posted anything','Post a plan you are already making and see who wants to join.','<button class="btn" data-a="newpost">Post an activity</button>'));
}
function tabReqs(){
  const mine=S.reqs.filter(r=>r.user==='me'&&actOf(r.act));
  return `<h1 class="pt">My Requests</h1><p class="sub">Plans you asked to join</p>`+(mine.length?mine.map(r=>{
    const a=actOf(r.act);
    const past=isPast(a);
    return liHtml(a,'detail',`<span>${I('calendar',13)}${whenStr(a.when)}</span><span>by ${esc(uname(a.host))}</span>`,statusChip(r.status),
      r.status==='accepted'&&!past?`<button class="btn sm sec" style="flex:0 0 auto" data-a="chat" data-id="${a.id}">${I('message-circle',14)} Chat</button>`
      :r.status==='accepted'&&past&&!S.ratings[a.id]?`<button class="btn sm" style="flex:0 0 auto" data-a="rate" data-id="${a.id}">${I('star',14)} Rate</button>`:'');
  }).join(''):empty('mail','No requests yet','Swipe right on a plan or request one from Discover.'));
}
/* One compact row per notification: tap opens it and marks it read. Notifications are never deleted. */
function noteHtml(n){
  const k=NK[n.kind]||NK.update;
  const fresh=!n.read||ui.seen?.has(n.id);
  return `<div class="nr ${fresh?'new':''}" data-a="opennote" data-id="${n.id}" role="button" tabindex="0"><div class="nic" style="background:${k.bg};color:${k.fg}">${I(k.ic,17)}</div>
  <div class="nm"><div class="nt">${esc(n.title||'Update')}</div><div class="nx">${esc(n.text)}</div><div class="tm">${ago(n.at)}</div></div>
  ${fresh?'<span class="udot" aria-label="New"></span>':''}</div>`;
}
function tabNotes(){
  const N=S.notes,unread=N.filter(n=>!n.read).length;
  const sec=(title,list,none)=>`<h3 class="nsh">${title}${list.some(n=>!n.read)?` <b>${list.filter(n=>!n.read).length}</b>`:''}</h3>
  ${list.length?`<div class="nl">${list.map(noteHtml).join('')}</div>`:`<p class="small mute nnone">${none}</p>`}`;
  return `<div class="nh"><h1 class="pt" style="font-size:22px;flex:1;margin:0">Notifications</h1>${unread?`<button class="lnk" data-a="readall">Mark all read</button>`:''}</div>
  ${sec('Notifications',N.filter(n=>n.kind!=='req'),'Updates and reminders about your activities will show up here.')}
  ${sec('Requests',N.filter(n=>n.kind==='req'),'Join requests, and replies to yours, will show up here.')}`;
}
function tabProfile(){
  const m=S.me,th=themePref(),ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  const V=[['mail','Email Verified',true],['scan-face','Face Verified',!!m.face],['id-card','Government ID',false,'soon'],['user','Profile Complete',!!(m.job&&m.bio&&(m.ints||[]).length&&(m.avail||[]).length)]];
  const done=V.filter(v=>v[2]).length;
  /* face check can be done from here; the ID check is greyed out until it's switched on */
  const vi=([ic,l,y,k])=>k==='soon'?`<div class="vi off" aria-disabled="true">${I(ic,14)}${l}<span class="e small">Coming soon</span></div>`
    :!y&&ic==='scan-face'?`<button class="vi act" data-a="doface">${I(ic,14)}Face check<span class="e small">Start</span></button>`
    :`<div class="vi ${y?'y':''}">${I(ic,14)}${l}${y?`<span class="e">${I('circle-check',14)}</span>`:''}</div>`;
  const soft=(arr,none)=>arr&&arr.length?`<div class="soft">${arr.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:`<p class="small mute">${none}</p>`;
  return `<div class="panel"><div class="ph">${I('user',15)} Your profile<button class="btn sm sec" data-a="editprofile">${I('pencil',14)} Edit profile</button></div>
  <div class="pt2"><div class="phw" data-a="photo">${av('me','lg')}<button class="pe" id="p_pe" title="Change profile picture" aria-label="Change profile picture" aria-haspopup="menu" aria-expanded="false">${I('camera',14)}</button>
  <div class="pmenu" id="p_menu" role="menu" hidden></div></div><div><div class="pn">${esc(m.name)} ${m.face?`<span class="vf">${I('badge-check',14)} Verified</span>`:''}</div><div class="small mute">${esc(m.hood)}, Chandigarh</div><div class="small" style="margin-top:4px">${trustTxt('me')}</div></div></div>
  <input type="file" id="p_photo" accept="image/jpeg,image/png,image/webp,image/*" hidden>
  <div class="facts"><span>${ageOf(m.dob)} yrs</span><span>${esc(m.gender)}</span>${m.job?`<span>${I('briefcase',14)}${esc(m.job)}</span>`:''}</div>
  <p>${m.bio?esc(m.bio):'<span class="mute">Add a short bio so hosts know who you are. Tap Edit profile.</span>'}</p></div>
  <div class="panel"><div class="ph">${I('star',15)} Interests</div>${soft(m.ints,'Add what you would like to do with company in Edit profile.')}</div>
  <div class="panel"><div class="ph">${I('clock',15)} Usually free</div>${soft(m.avail,'Tell hosts when you are usually free in Edit profile.')}</div>
  <div class="panel"><div class="ph">${I('calendar-check',15)} Past activities</div>${pastHtml(pastList('me'),'Activities you host or join show up here.')}</div>
  <div class="panel"><div class="ph">${I('shield-check',15)} Verifications <span class="r">${done}/${V.length} complete</span></div>
  <div class="bar"><i style="width:${done/V.length*100}%"></i></div>
  <div class="vg">${V.map(vi).join('')}</div></div>
  <div class="panel"><div class="ph">${I('user-plus',15)} Following</div>${S.following.length?S.following.map(u=>`<div class="blk">${av(u,'sm')}<button class="hlink" data-a="user" data-id="${u}">${esc(uname(u))}</button><button class="lnk" data-a="follow" data-id="${u}">Unfollow</button></div>`).join(''):'<p class="small mute" style="margin:0">Follow hosts from their profile to hear when they post a new plan.</p>'}</div>
  <div class="panel"><div class="ph">${I('sun',15)} App</div>
  <label style="margin-top:0">Appearance</label><span class="seg" role="radiogroup" aria-label="Appearance">${[['system','System'],['light','Light'],['dark','Dark']].map(([k,l])=>`<button role="radio" aria-checked="${th===k}" class="${th===k?'on':''}" data-a="theme" data-k="${k}">${l}</button>`).join('')}</span>
  <label>Install</label>${isStandalone()?'<p class="small mute" style="margin:0">Overhere is installed on this device.</p>':installEvt?`<button class="btn sm sec" data-a="install">${I('download',14)} Install Overhere</button>`:ios?'<p class="small mute" style="margin:0">On iPhone: tap Share, then “Add to Home Screen”.</p>':'<p class="small mute" style="margin:0">Open the published site in Chrome or Edge and use “Install app” in the address bar. Installing is not available from a file or inside the beta page.</p>'}</div>
  <div class="panel"><div class="ph">${I('shield-check',15)} Safety</div>
  <label style="margin-top:0">Trusted contact</label><p class="small mute" style="margin-top:0">Someone you can send your plans to, or alert with SOS, in one tap. Only you see this.</p>
  ${m.trusted?`<div class="blk">${I('phone',15)}<span><b>${esc(m.trusted.name)}</b> · ${esc(m.trusted.phone)}</span><button class="lnk" data-a="editprofile" data-k="safety">Change</button></div>`:`<button class="btn sm sec" data-a="editprofile" data-k="safety">${I('user-plus',14)} Add a trusted contact</button>`}
  <label>Blocked people</label>${S.blocked.length?S.blocked.map(u=>`<div class="blk">${av(u,'sm')}${esc(uname(u))}<button class="lnk" data-a="unblock" data-id="${u}">Unblock</button></div>`).join(''):'<p class="small mute" style="margin:0">You have not blocked anyone.</p>'}</div>
  <div class="panel"><div class="ph">${I('user',15)} Account</div>
  <p class="small mute" style="margin-top:0">To delete your account and data, email ${esc(CFG.CONTACT_EMAIL||'the beta team')}. <a href="privacy.html" target="_blank" rel="noopener" style="color:inherit">Privacy policy</a> · <a href="credits.html" target="_blank" rel="noopener" style="color:inherit">Credits</a></p>
  <button class="btn sm ghost" data-a="signout">${I('log-out',14)} Sign out</button></div>
`;
}

/* ---------- render: modals ---------- */
function modalHtml(){
  const m=ui.modal;if(!m)return '';
  const sheet=(title,body,cls='')=>`<div class="ov" data-a="closebg"><div class="sheet ${cls}" data-stop="1"><div class="sh"><h2>${title}</h2><button class="ib" data-a="close" title="Close">${I('x',18)}</button></div>${body}</div></div>`;
  if(m.type==='verify'){
    const face=m.kind==='face',v=VER[m.kind]||{fails:0,attempts:0,max:5},left=Math.max(0,(v.max||5)-(v.attempts||0)),ic=face?'scan-face':'id-card',live=MODE[m.kind]==='live';
    let inner;
    if(m.state==='flagged'||v.review)inner=`<div class="scan">${I('shield-check',56)}</div><p style="text-align:center"><strong>Sent for human review</strong></p><p class="mute" style="text-align:center">You have used all ${v.max||5} tries, so the check is paused. A person on our team will check it by hand and you will get a notification. You are not locked out permanently.</p>`;
    else if(m.state==='scanning')inner=(live&&face?'<div id="face_box" class="facebox"></div>':`<div class="scan go">${I(ic,56)}</div>`)+`<p style="text-align:center" class="mute">${face?'Checking liveness…':'Reading your ID…'}</p>`;
    else if(!left)inner=`<div class="scan">${I('shield-check',56)}</div><p style="text-align:center"><strong>No tries left</strong></p><p class="mute" style="text-align:center">You have used all ${v.max||5} tries. A person on our team will check it by hand and send you a notification.</p>
      <button class="btn" data-a="scan">Send for review</button>`;
    else inner=`<div class="scan">${I(ic,56)}</div>
      <p style="text-align:center" class="mute">${face?'A few seconds of video selfie confirm you are a real person. You need it to post a plan or ask to join one.':'Government ID check. Needed once, the first time you post or request. It unlocks both.'}</p>
      ${m.state==='fail'?`<p style="text-align:center;color:var(--bad)"><strong>${esc(m.err||'Verification failed.')}</strong> Please try again.</p>`:''}
      ${v.attempts?`<p style="text-align:center" class="small mute">${left} of ${v.max||5} tries left. After that, a person on our team checks it by hand.</p>`:''}
      <label class="chk top"><input type="checkbox" id="v_ok"> <span>${face?'I agree to a face scan. The video goes only to our verification provider to check that I am a real person, and is not kept. Overhere stores only whether it passed and the provider\'s confidence score.':'I agree to an ID check. Overhere stores only whether it passed, never my ID number or ID photo.'}</span></label>
      ${live?'':'<div class="dn">Demo: this check is simulated. No camera or ID is used.</div>'}
      <button class="btn" data-a="scan">${m.state==='fail'?'Try again':(face?'Start face check':'Start ID check')}</button>`;
    return sheet(face?'Face verification':'Identity verification',`<div class="sb">${inner}</div>`);
  }
  if(m.type==='post'){
    const mn=localInput(now()+3600e3),e=m.id&&actOf(m.id),t=!e&&m.tpl&&actOf(m.tpl),src=e||t,minCap=Math.max(1,e?e.members.length:1),aud=src?src.aud:'everyone';
    const tplWhen=t?(()=>{let w=t.when;while(w<now()+3600e3)w+=7*864e5;return w})():0;
    const past=[...new Map(S.acts.filter(a=>a.host==='me').sort((a,b)=>b.when-a.when).map(a=>[a.desc,a])).values()].slice(0,8);
    return sheet(e?'Edit activity':'Create Activity',`<div class="sb">
      ${e&&e.members.length?`<div class="dn" style="margin-top:0">${e.members.length} ${e.members.length===1?'person is':'people are'} already going. They'll see a note about your changes in the group chat.</div>`:''}
      ${!e&&past.length?`<label style="margin-top:0" for="f_tpl">Start from a past plan <span class="mute" style="font-weight:400">(optional)</span></label><select id="f_tpl"><option value="">Start fresh</option>${past.map(a=>`<option value="${a.id}" ${t&&t.id===a.id?'selected':''}>${esc(short(a.desc))}</option>`).join('')}</select>`:''}
      <label ${!e&&past.length?'':'style="margin-top:0"'}>Category</label><select id="f_cat">${Object.entries(CATS).map(([k,c])=>`<option value="${k}" ${src&&src.cat===k?'selected':''}>${c.label}</option>`).join('')}</select>
      <label>What is the plan?</label><textarea id="f_desc" maxlength="160" placeholder="Short description of what you are doing">${src?esc(src.desc):''}</textarea>
      <label>Group capacity <span class="mute" style="font-weight:400">(excluding you)</span></label><select id="f_cap">${[1,2,3,4,5,6,7,8,9,10].filter(n=>n>=minCap).map(n=>`<option ${n===(src?src.cap:2)?'selected':''}>${n}</option>`).join('')}</select>
      <p class="small mute" style="margin-top:6px">Shows on your card as "spots open", so 2 means two people can join you.</p>
      <label>Date and time</label><input id="f_when" type="datetime-local" min="${mn}" value="${localInput(e?e.when:t?tplWhen:now()+26*3600e3)}">
      <label>Repeats</label><select id="f_rep"><option value="">Does not repeat</option>${Object.entries(REPEAT).map(([k,v])=>`<option value="${k}" ${src&&src.repeat===k?'selected':''}>${v}</option>`).join('')}</select>
      <p class="small mute" style="margin-top:6px">The next one is posted automatically when this one ends.</p>
      <label>Who can see and request this?</label>
      <label class="chk"><input type="checkbox" id="f_all" ${aud==='everyone'?'checked':''}> Everyone</label>
      ${GENDERS.map(g=>`<label class="chk"><input type="checkbox" class="f_g" value="${g}" ${aud!=='everyone'&&aud.includes(g)?'checked':''}> ${g}</label>`).join('')}
      <label for="f_venue">Venue</label><div class="vbox"><input id="f_venue" maxlength="120" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="f_vlist" placeholder="Search a place, e.g. Indian Coffee House" value="${src?esc(src.venue):''}"><div id="f_vlist" class="vlist" role="listbox" aria-label="Places in Chandigarh" hidden></div></div>
      <p class="small mute" style="margin-top:6px">Pick a Chandigarh place from the list. Not listed? Type its name, choose “Not listed”, then pick its area.</p>
      ${m.other?areaPicker():''}
      <label>How will costs work? (informational only)</label><select id="f_cost">${Object.entries(COST).map(([k,v])=>`<option value="${k}" ${src&&src.cost===k?'selected':''}>${v}</option>`).join('')}</select>
      <label for="f_total">Estimated total cost <span class="mute" style="font-weight:400">(₹, optional)</span></label><input id="f_total" type="number" min="0" max="1000000" step="50" inputmode="numeric" placeholder="e.g. 1200" value="${src?.total||''}">
      <p class="small mute" style="margin-top:6px">We show each person's rough share. Payments stay between you.</p>
      <div style="height:16px"></div><button class="btn" data-a="submitpost">${e?'Save changes':'Post activity'}</button></div>`,'full wide');
  }
  if(m.type==='detail'||m.type==='confirm'){
    const a=actOf(m.id);if(!a)return '';
    const h=profileOf(a.host),rq=myReq(a.id),past=isPast(a),wl=waitlist(a.id).length;
    const open=a.host!=='me'&&!past&&(a.status==='open'||a.status==='full')&&audOK(a)&&!isBlocked(a.host)&&!rq;
    const can=open&&a.status==='open'&&spots(a)>0,canWait=open&&!can;
    const top=`<div class="sum">${planThumb(a)}<div style="min-width:0">${catPill(a.cat,true)}<div class="t">${esc(a.desc)}</div>
      <div class="meta2"><span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(a.venue)}${a.host==='me'?'':` · ${distKm(a)} km`}</span></div>
      <div class="meta2" style="margin-top:3px"><span>${I('users',13)}${a.members.length} going · ${spotTxt(a)}${wl?` · ${wl} on waitlist`:''}</span></div>
      <div class="meta2" style="margin-top:3px"><span>${I('wallet',13)}${costLine(a)}</span></div>
      <div class="tg" style="margin-top:8px"><span>${COST_S[a.cost]}</span><span>${a.aud==='everyone'?'Open to everyone':esc(a.aud.join(' / '))+' only'}</span>${a.repeat?`<span>${REPEAT[a.repeat]}</span>`:''}</div></div></div>
      <div class="hostline">Hosted by ${a.host==='me'?`${av('me','sm')}<b style="color:var(--ink);font-weight:600">You</b>`:`<button class="hlink" data-a="user" data-id="${a.host}" title="View ${esc(h.name)}'s profile">${av(a.host,'sm')}<span><b style="color:var(--ink);font-weight:600">${esc(h.name)}</b>, ${h.age}</span></button> ${vf(a.host,true)}`}</div>`;
    if(m.type==='confirm'&&(can||canWait))return sheet(can?'Request to Join':'Join the waitlist',`<div class="sb">${top}
      ${canWait?`<div class="warnbox" style="background:var(--infobg);border-color:#BFDBFE;color:var(--info)">${I('users',16)}<span>This activity is full. Join the waitlist and your request goes to ${esc(h.name)} automatically if a spot opens${wl?` (${wl} ahead of you)`:''}.</span></div>`:''}
      <label for="r_note" style="font-size:14px;margin-top:18px">Add a note <span class="mute" style="font-weight:400">(optional)</span></label>
      <p class="small mute">Introduce yourself or mention why you want to join.</p>
      <textarea id="r_note" maxlength="100" placeholder="Hey! I'd love to join, happy to be on time and split costs."></textarea><div class="cc"><span id="r_cnt">0</span>/100</div>
      ${S.me.face?'<div style="height:14px"></div>':`<div class="warnbox">${I('alert-triangle',16)}<span>You'll need to do a quick face check before your request is sent. It takes about a minute.</span></div>`}
      <button class="btn" data-a="request" data-id="${a.id}">${I('send',16)} ${canWait?(S.me.face?'Join waitlist':'Verify &amp; join waitlist'):(S.me.face?'Send Request':'Verify &amp; Send Request')}</button>
      <div style="height:8px"></div><button class="btn ghost" data-a="close">Not now</button></div>`);
    const acc=rq?.status==='accepted',pos=rq?.status==='waitlist'?waitlist(a.id).findIndex(r=>r.user==='me')+1:0;
    return sheet(backB(m)+'Activity',`<div class="sb">${top}
      ${rq?`<p style="margin-top:14px">Your request: ${statusChip(rq.status)}${pos?` <span class="small mute">#${pos} in line</span>`:''}</p>${rq.note?`<p class="small mute">Your note: ${esc(rq.note)}</p>`:''}`:''}
      ${can?`<div style="height:16px"></div><button class="btn" data-a="askreq" data-id="${a.id}">Request to join</button>`
      :canWait?`<div style="height:16px"></div><button class="btn sec" data-a="askreq" data-id="${a.id}">${I('users',16)} Full · Join waitlist</button>`
      :(!rq?`<p class="mute" style="margin-top:14px">${a.host==='me'?'This is your activity.':past?'This activity has ended.':'No request available.'}</p>`:'')}
      ${acc&&!past?`<div style="height:8px"></div><button class="btn sec" data-a="chat" data-id="${a.id}">${I('message-circle',16)} Open group chat</button>
        <div style="height:8px"></div><button class="btn ghost" data-a="share" data-k="trust" data-id="${a.id}">${I('shield-check',16)} Share plan with trusted contact</button>`:''}
      ${attended(a)&&past&&a.members.length?(S.ratings[a.id]?`<p class="small mute" style="margin-top:14px">${I('circle-check',14)} You rated this meetup. Thanks!</p>`:`<div style="height:12px"></div><button class="btn" data-a="rate" data-id="${a.id}">${I('star',16)} Rate the meetup</button>`):''}
      <div class="dlinks">${!past&&(a.status==='open'||a.status==='full')?`<button class="lnk" data-a="share" data-k="invite" data-id="${a.id}">${I('send',13)} Invite a friend</button>`:''}${rq&&(rq.status==='pending'||rq.status==='waitlist')?`<button class="lnk m" data-a="withdraw" data-id="${a.id}">${I('x',13)} Withdraw request</button>`:''}${acc&&!past?`<button class="lnk m" data-a="leave" data-id="${a.id}">Leave activity</button>`:''}</div>
      </div>`);
  }
  if(m.type==='user'){
    const p=USERS[m.id];if(!p)return '';
    const ups=S.acts.filter(a=>a.host===m.id&&visible(a)).sort((a,b)=>a.when-b.when),bl=isBlocked(m.id),t=trust(m.id);
    return sheet(backB(m)+'Profile',`<div class="sb">
      <div class="pt2">${av(m.id,'lg')}<div><div class="pn">${esc(p.name)} ${vf(m.id,true)}</div><div class="small mute">${esc(p.gender)}, ${p.age}${p.job?' · '+esc(p.job):''}</div></div></div>
      ${p.bio?`<p style="margin:16px 0 0">${esc(p.bio)}</p>`:''}
      <div class="tstats"><div><b>${t.met}</b><span>meetups</span></div><div><b>${t.shows}</b><span>showed up</span></div><div><b>${t.met-t.shows}</b><span>no-shows</span></div></div>
      ${signals(m.id)}
      <div style="height:12px"></div><button class="btn ${S.following.includes(m.id)?'ghost':'sec'}" data-a="follow" data-id="${m.id}" aria-pressed="${S.following.includes(m.id)}">${S.following.includes(m.id)?I('circle-check',16)+' Following':I('user-plus',16)+' Follow'}</button>
      <p class="small mute" style="margin:6px 0 0;text-align:center">${S.following.includes(m.id)?`You'll hear when ${esc(p.name)} posts a new plan.`:`Get notified when ${esc(p.name)} posts a new plan.`}</p>
      ${isVer(m.id)?'':`<div class="warnbox">${I('alert-triangle',16)}<span>${esc(p.name)} has not verified their ID yet. Meet in busy public places and share your plan with someone you trust.</span></div>`}
      <h3>Upcoming activities${ups.length?` (${ups.length})`:''}</h3>
      ${ups.length?ups.map(a=>{const rq=myReq(a.id);return liHtml(a,'detailback',`<span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(a.venue)} · ${distKm(a)} km</span>`,
        rq?`<span class="chip ${REQ_TONE[rq.status]||''}">${REQ_LBL[rq.status]||esc(rq.status)}</span>`:`<span class="chip">${spotTxt(a)}</span>`)}).join('')
        :`<p class="small mute">No upcoming activities near you right now.</p>`}
      <h3>Past activities</h3>${pastHtml(pastList(m.id),'No past activities yet.')}
      <div class="row" style="margin-top:12px">${bl?`<button class="btn sec" data-a="unblock" data-id="${m.id}">Unblock ${esc(p.name)}</button>`
        :`<button class="btn ghost" data-a="report" data-id="${m.id}">${I('alert-triangle',15)} Report</button><button class="btn bad" data-a="block" data-id="${m.id}">Block</button>`}</div>
      ${bl?`<p class="small mute">You blocked ${esc(p.name)}. You won't see their activities and they can't request yours.</p>`:''}</div>`);
  }
  if(m.type==='report'){
    const p=USERS[m.id];if(!p)return '';
    return sheet(backB(m)+'Report '+esc(p.name),`<div class="sb">
      <p class="small mute" style="margin-top:0">Reports are confidential: ${esc(p.name)} won't know who reported them. If you are in danger right now, call local emergency services.</p>
      <label>What happened?</label>${REPORT_REASONS.map(x=>`<label class="chk"><input type="radio" name="rp_r" value="${esc(x)}"> ${esc(x)}</label>`).join('')}
      <label for="rp_note">Details <span class="mute" style="font-weight:400">(optional)</span></label><textarea id="rp_note" maxlength="500" placeholder="What happened, and when?"></textarea>
      ${isBlocked(m.id)?'':`<label class="chk"><input type="checkbox" id="rp_block" checked> Also block ${esc(p.name)}</label>`}
      <div style="height:12px"></div><button class="btn bad" data-a="dorep" data-id="${m.id}">Send report</button></div>`);
  }
  if(m.type==='rate'){
    const a=actOf(m.id);if(!a)return '';
    const ppl=[a.host,...a.members].filter(x=>x!=='me'),prev=S.ratings[a.id];
    return sheet(backB(m)+'How did it go?',`<div class="sb">
      <div class="sum">${planThumb(a)}<div style="min-width:0"><div class="t">${esc(a.desc)}</div><div class="meta2"><span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(a.venue)}</span></div></div></div>
      <label>Did everything go OK?</label><div class="opts"><label class="opt"><input type="radio" name="rt_ok" value="yes" ${prev?.ok!=='no'?'checked':''}>Yes, all good</label><label class="opt"><input type="radio" name="rt_ok" value="no" ${prev?.ok==='no'?'checked':''}>Something went wrong</label></div>
      <label>How much did you enjoy it?</label><div class="rstars" role="radiogroup" aria-label="How much you enjoyed it">${[5,4,3,2,1].map(n=>`<label title="${n} star${n>1?'s':''}"><input type="radio" name="rt_star" value="${n}" aria-label="${n} star${n>1?'s':''}" ${prev?.stars===n?'checked':''}><span>★</span></label>`).join('')}</div>
      <label>Who showed up?</label>
      ${ppl.map(u=>{const v=prev?.people?.[u]||'show';return `<div class="rp">${av(u,'sm')}<button class="hlink" data-a="user" data-id="${u}">${esc(uname(u))}</button><span class="rpo"><label class="opt"><input type="radio" name="rt_${u}" value="show" ${v==='show'?'checked':''}>Came</label><label class="opt"><input type="radio" name="rt_${u}" value="noshow" ${v==='noshow'?'checked':''}>No-show</label></span></div>`}).join('')}
      <p class="small mute">Show-up rates appear on profiles so everyone can see who is reliable. Tap a name to report someone.</p>
      <div style="height:6px"></div><button class="btn" data-a="dorate" data-id="${a.id}">Submit</button></div>`);
  }
  if(m.type==='share'){
    const a=actOf(m.id);if(!a)return '';
    const tr=m.k==='trust',t=S.me.trusted;
    if(tr&&(!t||m.edit))return sheet(backB(m)+'Trusted contact',`<div class="sb"><p class="small mute" style="margin-top:0">Pick someone you trust. When you join a plan you can send them where you'll be and who with. Only you see this.</p>
      <label>Name</label><input id="t_name" value="${esc(t?.name||'')}" placeholder="e.g. Mum, Riya">
      <label>Phone</label><input id="t_phone" type="tel" value="${esc(t?.phone||'')}" placeholder="+91 98765 43210">
      <div style="height:16px"></div><button class="btn" data-a="savetrusted">Save and continue</button></div>`);
    const who=a.members.filter(x=>x!=='me').map(uname).join(', ');
    const text=tr?`Hi ${t.name}, sharing my plan: "${a.desc}" on ${fmt(a.when)} at ${a.venue}. Hosted by ${uname(a.host)}${who?`, also going: ${who}`:''}. I'll message you when I'm done. (Sent from Overhere)`
      :`Want to come along? "${a.desc}", ${fmt(a.when)} at ${a.venue}. ${spotTxt(a)} on Overhere: ${actLink(a)}`;
    const enc=encodeURIComponent(text),ph=tr?t.phone.replace(/[^\d+]/g,''):'';
    return sheet(backB(m)+(tr?'Share with trusted contact':'Invite a friend'),`<div class="sb">
      ${tr?`<div class="hostline" style="margin-top:0">${I('shield-check',15)} To <b style="color:var(--ink)">${esc(t.name)}</b> · ${esc(t.phone)} <button class="lnk" data-a="edittrusted">Change</button></div>`
        :'<p class="small mute" style="margin-top:0">The link opens this activity so your friend can request to join too.</p>'}
      <textarea id="sh_txt" readonly style="margin-top:10px">${esc(text)}</textarea>
      <div style="height:12px"></div>
      ${tr?`<a class="btn" href="sms:${esc(ph)}?&amp;body=${enc}">${I('message-circle',16)} Send as SMS</a><div style="height:8px"></div><a class="btn sec" href="https://wa.me/${esc(ph.replace('+',''))}?text=${enc}" target="_blank" rel="noopener">Send on WhatsApp</a>`
        :`${navigator.share?`<button class="btn" data-a="nshare">${I('send',16)} Share…</button><div style="height:8px"></div>`:''}<a class="btn sec" href="https://wa.me/?text=${enc}" target="_blank" rel="noopener">Send on WhatsApp</a>`}
      <div style="height:8px"></div><button class="btn ghost" data-a="copyshare">Copy message</button></div>`);
  }
  if(m.type==='leave'){
    const a=actOf(m.id);if(!a)return '';
    return sheet(backB(m)+'Leave activity?',`<div class="sb"><div class="warnbox" style="margin-top:0">${I('alert-triangle',16)}<span>You'll leave <b>"${esc(short(a.desc))}"</b> and its group chat. ${esc(uname(a.host))} will be told, your spot goes to the next person on the waitlist, and you can't request this one again.</span></div>
      <button class="btn bad" data-a="doleave" data-id="${a.id}">Yes, leave</button><div style="height:8px"></div><button class="btn ghost" data-a="close">Stay</button></div>`);
  }
  if(m.type==='cancelconfirm'){
    const a=actOf(m.id);if(!a)return '';
    const n=a.members.length,p=S.reqs.filter(r=>r.act===a.id&&r.status==='pending').length;
    return sheet('Cancel activity?',`<div class="sb">
      <div class="warnbox" style="margin-top:0;background:var(--badbg);border-color:#FECACA;color:var(--bad)">${I('alert-triangle',16)}<span>You're about to cancel <b>"${esc(short(a.desc))}"</b> on ${whenStr(a.when)}. This can't be undone.</span></div>
      <p class="small mute">${n?`${n} accepted ${n===1?'member':'members'} will be notified and the group chat will be closed.`:'No one has been accepted yet.'}${p?` ${p} pending ${p===1?'request':'requests'} will be dropped.`:''}</p>
      <div style="height:12px"></div><button class="btn bad" data-a="docancel" data-id="${a.id}">Yes, cancel activity</button>
      <div style="height:8px"></div><button class="btn ghost" data-a="hostview" data-id="${a.id}">Keep activity</button></div>`);
  }
  if(m.type==='host'){
    const a=actOf(m.id);if(!a)return '';
    const reqs=S.reqs.filter(r=>r.act===a.id),pend=reqs.filter(r=>r.status==='pending'),wl=waitlist(a.id),done=reqs.filter(r=>r.status!=='pending'&&r.status!=='waitlist'),past=isPast(a);
    const person=r=>{const p=profileOf(r.user);return `<div class="panel" style="background:var(--bg);box-shadow:none"><div class="hn">${av(r.user)}<div><button class="hlink" data-a="user" data-id="${r.user}"><strong>${esc(p.name)}</strong></button> ${vf(r.user)}<div class="mute small">${esc(p.gender)}, ${p.age}${p.job?' · '+esc(p.job):''}</div><div class="small" style="margin-top:2px">${trustTxt(r.user)}</div></div></div>${signals(r.user)}<p class="small mute" style="margin:8px 0 4px">${esc(p.bio)}</p>${r.note?`<div class="dn">Note: ${esc(r.note)}</div>`:'<p class="small mute">No note attached</p>'}`;};
    return sheet('Manage activity',`<div class="sb"><div class="sum">${planThumb(a)}<div style="min-width:0"><div class="t">${esc(a.desc)}</div><div class="meta2" style="margin-bottom:6px"><span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(a.venue)}</span></div>${actChip(a.status)} <span class="chip">${a.members.length}/${a.cap} accepted</span></div></div>
      <div style="height:12px"></div>
      ${a.members.length?`<button class="btn sec" data-a="chat" data-id="${a.id}">${I('message-circle',16)} Open group chat</button>`:'<p class="small mute">Chat opens when you accept the first member.</p>'}
      ${past?`<div class="row" style="margin-top:8px"><button class="btn sm ghost" data-a="postagain" data-id="${a.id}">${I('repeat',14)} Post again</button></div>`+(a.members.length?(S.ratings[a.id]?`<p class="small mute">${I('circle-check',14)} You rated this meetup.</p>`:`<div style="height:8px"></div><button class="btn" data-a="rate" data-id="${a.id}">${I('star',16)} Rate the meetup</button>`):'')
        :`<div class="row" style="margin-top:8px"><button class="btn sm ghost" data-a="editact" data-id="${a.id}">${I('pencil',14)} Edit details</button><button class="btn sm ghost" data-a="share" data-k="invite" data-id="${a.id}">${I('send',14)} Invite a friend</button></div>`}
      <h3>Pending requests (${pend.length})</h3>
      ${pend.length?pend.map(r=>person(r)+`<div class="row" style="margin-top:10px"><button class="btn sm bad" data-a="rej" data-id="${r.id}">Decline</button><button class="btn sm ok" data-a="acc" data-id="${r.id}">Accept</button></div></div>`).join(''):'<p class="mute small">No pending requests yet. Invite a friend to get the word out.</p>'}
      ${wl.length?`<h3>Waitlist (${wl.length})</h3><p class="small mute" style="margin-top:0">They move up to requests automatically, in this order, when a spot opens.</p>`+wl.map((r,i)=>`<div class="panel row" style="padding:12px 16px"><div class="hn">${av(r.user,'sm')}${esc(uname(r.user))}</div><div style="text-align:right"><span class="chip info">#${i+1}</span></div></div>`).join(''):''}
      ${done.length?`<h3>Decided</h3>`+done.map(r=>`<div class="panel row" style="padding:12px 16px"><div class="hn">${av(r.user,'sm')}${esc(uname(r.user))}</div><div style="text-align:right">${statusChip(r.status,true)}</div></div>`).join(''):''}
      ${past?'':`<div style="height:10px"></div><button class="btn bad" data-a="cancelact" data-id="${a.id}">Cancel this activity</button>`}</div>`,'full wide');
  }
  if(m.type==='sort'){
    const cur=ui.f.sort;
    return sheet('Sort by',`<div class="sb sortl" role="radiogroup" aria-label="Sort by">${Object.entries(SORTS).map(([k,[ic,l,sub]])=>`<button class="sorto ${cur===k?'on':''}" role="radio" aria-checked="${cur===k}" data-a="fsort" data-k="${k}">${I(ic,18)}<span><b>${l}</b><small>${sub}</small></span>${cur===k?I('check',18):''}</button>`).join('')}</div>`);
  }
  if(m.type==='filters'){
    const f=ui.f,n=feed().filter(a=>matchF(a,f)).length,any=activeFilters(f).length;
    const C=(k,l)=>`<button class="fc ${f.cat===k?'on':''}" data-a="fcat" data-k="${k}" aria-pressed="${f.cat===k}">${l}</button>`;
    const T=(k,l)=>`<button class="fc ${f.tod===k?'on':''}" data-a="ftod" data-k="${k}" aria-pressed="${f.tod===k}">${l}</button>`;
    return `<div class="ov" data-a="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="fl_t"><div class="sh"><h2 id="fl_t">Filters</h2><button class="ib" data-a="close" title="Close">${I('x',18)}</button></div>
      <div class="sb fsec">
      <h3>Category</h3><div class="fchips">${C('all','All')}${Object.entries(CATS).map(([k,c])=>C(k,c.label)).join('')}</div>
      <h3>Date</h3><div class="fchips"><button class="fc ${!f.dfrom&&!f.dto?'on':''}" data-a="fdate" aria-pressed="${!f.dfrom&&!f.dto}">${I('calendar',13)} Any date</button>${Object.entries(datePresets()).map(([k,[l,a,b]])=>{const on=f.dfrom===a&&f.dto===b;return `<button class="fc ${on?'on':''}" data-a="fdate" data-k="${k}" aria-pressed="${on}">${l}</button>`}).join('')}</div>
      <div class="row drange"><div><label for="d_from">From</label><input type="date" id="d_from" value="${esc(f.dfrom)}" min="${dayKey(swipeEnd())}" ${f.dto?`max="${f.dto}"`:''}></div><div><label for="d_to">To</label><input type="date" id="d_to" value="${esc(f.dto)}" min="${f.dfrom||dayKey(swipeEnd())}"></div></div>
      <h3>Time of day</h3><div class="fchips">${T('any',I('clock',13)+' Any time')}${T('morning','Morning')}${T('afternoon','Afternoon')}${T('evening','Evening')}${T('night','Night')}</div>
      <h3>Distance</h3><div class="fchips"><button class="fc ${!f.dist?'on':''}" data-a="fdist" data-k="0" aria-pressed="${!f.dist}">${I('map-pin',13)} Any distance</button>${DISTS.map(k=>`<button class="fc ${f.dist===k?'on':''}" data-a="fdist" data-k="${k}" aria-pressed="${f.dist===k}">Within ${k} km</button>`).join('')}</div>
      </div>
      <div class="sfoot">${any?'<button class="btn ghost" data-a="freset">Reset</button>':''}<button class="btn" data-a="close">Show ${n} ${n===1?'activity':'activities'}</button></div></div></div>`;
  }
  if(m.type==='editprofile'){
    const me=S.me,cur=m.emo||me.emo||defEmo(me.gender),photo=!!me.photo&&!m.emo;
    return sheet('Edit profile',`<div class="sb">
      <h3 style="margin-top:0">Profile picture</h3>
      <div class="epav"><span id="ep_av">${photo?av('me','lg'):`<span class="av emo lg" style="background:${PASTEL[0]}" aria-hidden="true">${esc(cur)}</span>`}</span>
        <div><p class="small mute" style="margin:0 0 8px">${photo?'You are using a photo. Pick an emoji below to switch back.':'Pick the emoji that feels like you.'}</p>
        <div class="row" style="gap:8px"><button class="btn sm ghost" data-a="pickphoto">${I('camera',14)} Upload a photo</button>${photo?`<button class="btn sm bad" data-a="rmphoto">${I('trash',14)} Remove photo</button>`:''}</div></div></div>
      <div class="emogrid" role="radiogroup" aria-label="Emoji">${EMOJIS.map(e=>`<button role="radio" aria-checked="${!photo&&e===cur}" class="${!photo&&e===cur?'on':''}" data-a="pickemo" data-e="${esc(e)}" aria-label="${esc(e)}">${esc(e)}</button>`).join('')}</div>
      <h3>About you</h3>
      <label for="p_name" style="margin-top:0">Name</label><input id="p_name" maxlength="40" value="${esc(me.name)}">
      <label for="p_dob">Date of birth</label><input id="p_dob" type="date" value="${esc(me.dob)}" ${me.kyc?'disabled':''}>
      <label for="p_gender">Gender identity</label><select id="p_gender" ${me.kyc?'disabled':''}>${GENDERS.map(g=>`<option ${g===me.gender?'selected':''}>${g}</option>`).join('')}</select>
      <p class="small mute" style="margin-top:6px">${me.kyc?`Confirmed by your ID check. To change these, email ${esc(CFG.CONTACT_EMAIL||'the beta team')}.`:'Decides which audience-limited plans you can see.'}</p>
      <label for="p_hood">Neighbourhood <span class="mute" style="font-weight:400">(Chandigarh)</span></label><select id="p_hood">${HOODS.map(g=>`<option ${g===me.hood?'selected':''}>${g}</option>`).join('')}</select>
      <label for="p_job">Profession</label><input id="p_job" maxlength="40" value="${esc(me.job||'')}" placeholder="e.g. Designer">
      <label for="p_bio">Bio</label><textarea id="p_bio" maxlength="300" placeholder="A line or two so hosts know who you are">${esc(me.bio||'')}</textarea>
      <label>What would you want to do with company?</label>${opts('p_int',INTERESTS,me.ints)}
      <label>When are you usually free?</label>${opts('p_avail',TIMES,me.avail)}
      <h3 id="ep_safety">Safety</h3>
      <p class="small mute" style="margin-top:0">Trusted contact: someone you can send your plans to, or alert with SOS. Leave both empty to remove.</p>
      <div class="row"><input id="t_name" placeholder="Name" aria-label="Trusted contact name" value="${esc(me.trusted?.name||'')}"><input id="t_phone" type="tel" placeholder="Phone" aria-label="Trusted contact phone" value="${esc(me.trusted?.phone||'')}"></div>
      <div style="height:18px"></div><button class="btn" data-a="saveprofile">Save changes</button>
      <div style="height:8px"></div><button class="btn ghost" data-a="close">Cancel</button></div>`,'full wide');
  }
  if(m.type==='emoji'){
    const cur=S.me.photo?'':(S.me.emo||defEmo(S.me.gender));
    return sheet('Choose your emoji',`<div class="sb"><p class="small mute" style="margin-top:0">This is what other people see next to your name.</p>
      <div class="emogrid" role="radiogroup" aria-label="Emoji">${EMOJIS.map(e=>`<button role="radio" aria-checked="${e===cur}" class="${e===cur?'on':''}" data-a="setemo" data-e="${esc(e)}" aria-label="${esc(e)}">${esc(e)}</button>`).join('')}</div></div>`);
  }
  if(m.type==='chat'){
    const a=actOf(m.id);if(!a)return '';
    const muted=!!S.muted[a.id],msgs=(S.chats[a.id]||[]).map((x,i)=>msgHtml(a,x,i)).join('');
    const tips=S.tips[a.id]?'':`<div class="tips"><b>${I('shield-check',15)} Meeting new people? A few tips</b><ul><li>Meet in a busy public place and make your own way there.</li><li>Tell someone you trust where you'll be. <button class="lnk" data-a="share" data-k="trust" data-id="${a.id}">Share plan</button></li><li>Leave whenever you like. Tap SOS if you ever feel unsafe.</li><li>Tap ${I('flag',11)} next to a name to report a message.</li></ul><button class="btn sm sec" data-a="tipsok" data-id="${a.id}">Got it</button></div>`;
    return `<div class="ov"><div class="sheet full chat"><div class="sh"><h2 style="font-size:15px">${esc(a.desc.slice(0,34))}</h2>
      <button class="ib" data-a="members" data-id="${a.id}" title="Members" aria-label="Members">${I('users',17)}</button>
      <button class="ib" data-a="mute" data-id="${a.id}" title="${muted?'Unmute':'Mute'} chat notifications" aria-label="${muted?'Unmute':'Mute'} chat notifications" aria-pressed="${muted}">${I(muted?'bell-off':'bell',17)}</button>
      <button class="sosb" data-a="sos" data-id="${a.id}" aria-label="SOS: get help now">SOS</button>
      <button class="ib" data-a="close" title="Close">${I('x',18)}</button></div>
      <p class="small mute" style="padding:8px 18px;margin:0">Members: ${esc([a.host,...a.members].map(uname).join(', '))} · full history visible to everyone${muted?' · notifications muted':''}</p>
      <div class="msgs" id="msgs">${tips}${msgs}</div><div class="cin"><button class="ib" data-a="newpoll" data-id="${a.id}" title="Create a poll" aria-label="Create a poll">${I('bar-chart',18)}</button><input id="c_in" placeholder="Message the group" autocomplete="off" aria-label="Message the group"><button class="btn sm" data-a="send" data-id="${a.id}" aria-label="Send">${I('send',15)}</button></div></div></div>`;
  }
  if(m.type==='members'){
    const a=actOf(m.id);if(!a)return '';
    const host=a.host==='me',past=isPast(a);
    const row=(u,right)=>`<div class="panel row" style="padding:12px 16px"><div class="hn">${av(u,'sm')}<button class="hlink" data-a="user" data-id="${u}">${esc(u==='me'?'You':uname(u))}</button></div><div style="text-align:right">${right}</div></div>`;
    return sheet(backB(m)+`Members (${a.members.length+1})`,`<div class="sb">
      ${row(a.host,'<span class="chip acc">Host</span>')}
      ${a.members.map(u=>row(u,host&&!past&&u!=='?'?`<button class="btn sm bad" data-a="rmmember" data-id="${a.id}" data-u="${u}">Remove</button>`:'')).join('')}
      ${!host&&!past&&a.members.includes('me')?`<div style="height:10px"></div><button class="btn bad" data-a="leave" data-id="${a.id}">${I('log-out',16)} Leave chat</button>`:''}</div>`);
  }
  if(m.type==='rmmember'){
    const a=actOf(m.id);if(!a)return '';
    return sheet(backB(m)+'Remove member?',`<div class="sb"><div class="warnbox" style="margin-top:0">${I('alert-triangle',16)}<span><b>${esc(uname(m.u))}</b> will be taken out of <b>"${esc(short(a.desc))}"</b> and its group chat, and told about it. Their spot goes to the next person on the waitlist, and they can't request this one again.</span></div>
      <button class="btn bad" data-a="doremove" data-id="${a.id}" data-u="${m.u}">Yes, remove</button><div style="height:8px"></div><button class="btn ghost" data-a="close">Keep them</button></div>`);
  }
  if(m.type==='poll'){
    return sheet(backB(m)+'New poll',`<div class="sb"><label for="pl_q" style="margin-top:0">Question</label><input id="pl_q" maxlength="80" placeholder="e.g. Which time works best?">
      <label>Options <span class="mute" style="font-weight:400">(at least 2)</span></label>${[0,1,2,3].map(i=>`<input id="pl_o${i}" maxlength="40" placeholder="Option ${i+1}${i>1?' (optional)':''}" aria-label="Option ${i+1}" style="margin-bottom:8px">`).join('')}
      <div style="height:8px"></div><button class="btn" data-a="dopoll" data-id="${m.id}">Post poll</button></div>`);
  }
  if(m.type==='msgrep'){
    const x=S.chats[m.id]?.[m.m];if(!x)return '';
    return sheet(backB(m)+'Report message',`<div class="sb"><div class="dn" style="margin-top:0"><b>${esc(uname(x.from))}:</b> ${esc(x.text)}</div>
      <label>What's wrong with it?</label>${CHAT_REASONS.map(r=>`<label class="chk"><input type="radio" name="mr_r" value="${esc(r)}"> ${esc(r)}</label>`).join('')}
      ${isBlocked(x.from)?'':`<label class="chk"><input type="checkbox" id="mr_block"> Also block ${esc(uname(x.from))}</label>`}
      <p class="small mute">Reports are confidential. Our safety team reviews them within 24 hours.</p>
      <button class="btn bad" data-a="domsgrep" data-id="${m.id}" data-m="${m.m}">Send report</button></div>`);
  }
  if(m.type==='sos'){
    const a=actOf(m.id),t=S.me.trusted,loc=m.loc;
    const where=loc?`https://maps.google.com/?q=${loc.lat.toFixed(5)},${loc.lng.toFixed(5)}`:'';
    const text=`SOS from Overhere: I need help.${a?` I'm at "${a.desc}" (${a.venue}).`:''}${where?' My location: '+where:''} Please call me now.`;
    const enc=encodeURIComponent(text),ph=t?t.phone.replace(/[^\d+]/g,''):'';
    const st=m.locState==='wait'?'Finding your location…':loc?`${I('map-pin',13)} Location found (within about ${Math.max(5,Math.round(loc.acc))} m)`:`${I('alert-triangle',13)} Couldn't get your location, so the message names the venue instead. <button class="lnk" data-a="sosloc">Try again</button>`;
    return sheet(backB(m)+'Get help',`<div class="sb">
      <a class="btn" style="background:var(--bad);color:#fff" href="tel:112">${I('phone',16)} Call emergency services (112)</a>
      <h3>Alert your trusted contact</h3>
      ${t?`<p class="small" style="margin-top:0">${st}</p>
        <a class="btn" href="sms:${esc(ph)}?&amp;body=${enc}">${I('message-circle',16)} Text ${esc(t.name)}${loc?' my location':''}</a><div style="height:8px"></div>
        <a class="btn sec" href="https://wa.me/${esc(ph.replace('+',''))}?text=${enc}" target="_blank" rel="noopener">WhatsApp ${esc(t.name)}</a><div style="height:8px"></div>
        <a class="btn ghost" href="tel:${esc(ph)}">${I('phone',16)} Call ${esc(t.name)}</a>`
      :`<p class="small mute" style="margin-top:0">Add someone now so you can alert them in one tap.</p><label>Name</label><input id="t_name" placeholder="e.g. Mum, Riya"><label>Phone</label><input id="t_phone" type="tel" placeholder="+91 98765 43210"><div style="height:12px"></div><button class="btn" data-a="savetrusted">Save contact</button>`}
      <p class="small mute" style="margin-top:14px">Demo: nothing is sent until you press send in your own SMS or WhatsApp app.</p></div>`);
  }
  if(m.type==='safe'){
    const a=actOf(m.id);if(!a)return '';
    return sheet('Arrived safely?',`<div class="sb"><p style="margin-top:0">"${esc(a.desc)}" at ${esc(a.venue)} started ${ago(a.when)}. Let us know you're OK.</p>
      <button class="btn" data-a="safeok" data-id="${a.id}">${I('circle-check',16)} Yes, I'm OK</button><div style="height:8px"></div>
      <button class="btn bad" data-a="sos" data-id="${a.id}">${I('alert-triangle',16)} I need help</button>
      <p class="small mute" style="margin-top:12px">No answer within 30 minutes? We'll remind you and offer to alert ${S.me.trusted?esc(S.me.trusted.name):'your trusted contact'}.</p></div>`);
  }
  return '';
}

/* ---------- render: sign-in and onboarding ---------- */
const LOGO='<div class="logo" style="font-size:22px;margin-bottom:14px"><span class="dots"><i></i><i></i></span>Overhere</div>';
const GOOGLE_G='<svg class="i" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
/* Sign-in fields: an icon in front and a message line under each. Password boxes also get a show/hide button and a Caps Lock warning. */
const emailField=()=>`<label for="a_email">Email</label><div class="fi">${I('mail',18)}<input id="a_email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" maxlength="120" placeholder="you@example.com" value="${esc(ui.auth.email||'')}" aria-describedby="a_email_err a_email_hint"></div>
  <p class="ferr" id="a_email_err" aria-live="polite"></p><p class="fhint" id="a_email_hint" aria-live="polite" hidden></p>`;
const pwField=(id,label,ac,side='')=>`<div class="lrow"><label for="${id}">${label}</label>${side}</div><div class="fi">${I('lock',18)}<input id="${id}" class="pwi" type="password" autocomplete="${ac}" maxlength="72" autocapitalize="off" spellcheck="false" aria-describedby="${id}_err ${id}_caps"><button type="button" class="pwt" data-a="pwshow" data-id="${id}" aria-label="Show password" aria-pressed="false">${I('eye',18)}</button></div>
  <p class="caps" id="${id}_caps" hidden>${I('alert-triangle',14)} Caps Lock is on</p><p class="ferr" id="${id}_err" aria-live="polite"></p>`;
const pwMeter=()=>`<div class="pws" id="a_pws" data-s="0"><div class="pwbar"><i></i><i></i><i></i><i></i></div>
  <p class="pwl"><span>Password strength</span><b id="a_pwl" aria-live="polite"></b></p>
  <ul class="pwr">${PW_RULES.map(([t])=>`<li>${I('circle',13)}${I('check',13)}${t}</li>`).join('')}</ul></div>`;
const ERRBOX='<p class="fbad" id="a_formerr" role="alert" hidden></p>';
const goBtn=t=>`<button class="btn" id="a_go" type="submit"><span class="spin" aria-hidden="true"></span>${t}</button>`;
/* "Open Gmail" and the like on the check-your-email screen, for the big providers. */
const INBOX=[[/^(gmail|googlemail)\.com$/,'Gmail','https://mail.google.com/'],[/^(outlook|hotmail|live|msn)\.[a-z.]+$/,'Outlook','https://outlook.live.com/mail/'],
  [/^(yahoo|ymail)\.[a-z.]+$/,'Yahoo Mail','https://mail.yahoo.com/'],[/^(icloud|me|mac)\.com$/,'iCloud Mail','https://www.icloud.com/mail'],
  [/^rediffmail\.com$/,'Rediffmail','https://mail.rediff.com/'],[/^(proton\.me|protonmail\.com)$/,'Proton Mail','https://mail.proton.me/']];
const inboxOf=email=>{const d=(email.split('@')[1]||'').toLowerCase(),m=INBOX.find(([re])=>re.test(d));return m?[m[1],m[2]]:null};
function authHtml(){
  if(!ONLINE)return `<div class="ob">${LOGO}<h1 class="pt">Open the live site</h1><p class="sub">Overhere keeps plans, requests and chats in its online database, so it only works from the published site (an https:// address), not from a file on your computer.</p></div>`;
  if(ME&&!loaded)return `<div class="ob">${LOGO}<p class="mute">${ui.err?esc(ui.err)+' <button class="lnk" data-a="retry">Try again</button> · <button class="lnk" data-a="signout">Sign out</button>':'Loading…'}</p></div>`;
  const md=ui.auth.mode;
  if(md==='check'){
    const email=ui.auth.email||'',reset=ui.auth.kind==='reset',left=Math.ceil(((ui.auth.sent||0)+RESEND_MS-Date.now())/1000),box=inboxOf(email);
    return `<div class="ob">${LOGO}<div class="mailic">${I('mail',30)}</div><h1 class="pt">Check your email</h1><p class="sub">We sent a link to <b>${esc(email)}</b>. Open it on this device to ${reset?'choose a new password':'confirm your account, then sign in'}. It can take a minute, and sometimes lands in spam.</p>
    ${box?`<a class="btn" href="${box[1]}" target="_blank" rel="noopener">${I('mail',16)} Open ${box[0]}</a><div style="height:8px"></div>`:''}
    <button class="btn ${box?'ghost':'sec'}" data-a="authmode" data-k="in">Back to sign in</button>
    <p class="small" style="text-align:center;margin-top:14px">Didn't get it? <button class="lnk" id="a_resend" data-a="resendmail"${left>0?' disabled':''}>${left>0?`Resend email in ${left}s`:'Resend email'}</button>${reset?'':' · <button class="lnk" data-a="authmode" data-k="up">Use a different email</button>'}</p></div>`;
  }
  if(md==='reset')return `<div class="ob">${LOGO}<h1 class="pt">Reset your password</h1><p class="sub">We'll email you a link to choose a new one.</p>
    <form id="a_form" data-submit="forgot" novalidate>${emailField()}<div style="height:16px"></div>${ERRBOX}${goBtn('Send reset link')}</form>
    <div style="height:8px"></div><button class="btn ghost" data-a="authmode" data-k="in">Back</button></div>`;
  if(md==='newpw')return `<div class="ob">${LOGO}<h1 class="pt">Choose a new password</h1><p class="sub">Pick one you don't use anywhere else.</p>
    <form id="a_form" data-submit="setpw" novalidate>${pwField('a_pw','New password','new-password')}${pwMeter()}${pwField('a_pw2','Confirm new password','new-password')}
    <div style="height:16px"></div>${ERRBOX}${goBtn('Save password')}</form></div>`;
  /* Phone: one flow for new and returning people. The code signs you in, and makes the account the first time. */
  if(md==='phone'){
    const up=ui.auth.was==='up';
    return `<div class="ob">${LOGO}<div class="mailic">${I('phone',28)}</div><h1 class="pt">${up?'Sign up with phone':'Continue with phone'}</h1><p class="sub">We'll text you a 6-digit code to confirm it's you. ${up?'No password needed.':'New here? This creates your account.'}</p>
    <form id="a_form" data-submit="sendcode" novalidate><label for="a_phone">Mobile number</label>
    <div class="fi tel"><span class="cc">${I('phone',16)}+91</span><input id="a_phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="16" placeholder="98765 43210" value="${esc(ui.auth.phone?fmtPhone(ui.auth.phone.slice(3)):'')}" aria-describedby="a_phone_err a_phone_note"></div>
    <p class="ferr" id="a_phone_err" aria-live="polite"></p><p class="fhint" id="a_phone_note">Indian mobile numbers only.</p>
    <div style="height:18px"></div>${ERRBOX}${goBtn('Send code')}</form>
    <div style="height:8px"></div><button class="btn ghost" data-a="authmode" data-k="${up?'up':'in'}">Back</button>
    <p class="small mute" style="text-align:center;margin-top:12px">By continuing you agree to our <a href="privacy.html" target="_blank" rel="noopener" style="color:inherit">Privacy policy</a>. Standard SMS rates may apply.</p></div>`;
  }
  if(md==='code'){
    const left=Math.ceil((ui.auth.sent+RESEND_MS-Date.now())/1000);
    return `<div class="ob">${LOGO}<div class="mailic">${I('message-circle',28)}</div><h1 class="pt">Enter the code</h1><p class="sub">We sent a 6-digit code to <b>+91 ${esc(fmtPhone(ui.auth.phone.slice(3)))}</b>. <button class="lnk" style="padding:0" data-a="authmode" data-k="phone">Edit</button></p>
    <form id="a_form" data-submit="checkcode" novalidate><label for="a_code">Verification code</label>
    <div class="otp"><input id="a_code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" spellcheck="false" aria-describedby="a_code_err"><div class="otpc" aria-hidden="true">${'<span></span>'.repeat(6)}</div></div>
    <p class="ferr" id="a_code_err" aria-live="polite"></p>
    <div style="height:18px"></div>${ERRBOX}${goBtn('Verify')}</form>
    <p class="small" style="text-align:center;margin-top:14px">Didn't get it? <button class="lnk" id="a_resend" data-a="sendcode" data-k="again"${left>0?' disabled':''}>${left>0?`Resend code in ${left}s`:'Resend code'}</button> · <button class="lnk" data-a="authmode" data-k="phone">Change number</button></p></div>`;
  }
  const up=md==='up';
  return `<div class="ob">${LOGO}<p class="mute">Do things in your city with company. Post a plan you are already making, pick who joins. Not a dating app.</p>
    <div class="seg atab"><button type="button" class="${up?'':'on'}" aria-pressed="${!up}" data-a="authmode" data-k="in">Sign in</button><button type="button" class="${up?'on':''}" aria-pressed="${up}" data-a="authmode" data-k="up">Create account</button></div>
    <h1 class="pt">${up?'Create your account':'Welcome back'}</h1><p class="sub">${up?'Free, and it takes under a minute.':'Sign in to see plans near you.'}</p>
    <button class="btn out" data-a="google">${GOOGLE_G} Continue with Google</button>
    ${CFG.PHONE_LOGIN?`<div style="height:8px"></div><button class="btn out" data-a="authmode" data-k="phone">${I('phone',16)} Continue with phone</button>`:''}
    <div class="or">or with email</div>
    <form id="a_form" data-submit="${up?'signup':'signin'}" novalidate>${emailField()}
    ${pwField('a_pw','Password',up?'new-password':'current-password',up?'':'<button type="button" class="lnk" data-a="authmode" data-k="reset">Forgot password?</button>')}
    ${up?pwMeter()+pwField('a_pw2','Confirm password','new-password'):''}
    <div style="height:18px"></div>${ERRBOX}${goBtn(up?'Create account':'Sign in')}</form>
    ${up?'<p class="small mute" style="text-align:center;margin-top:12px">By creating an account you agree to our <a href="privacy.html" target="_blank" rel="noopener" style="color:inherit">Privacy policy</a>.</p>':''}
    <p class="small" style="text-align:center;margin-top:14px">${up?'Already have an account? <button class="lnk" data-a="authmode" data-k="in">Sign in</button>'
      :'New here? <button class="lnk" data-a="authmode" data-k="up">Create an account</button>'}</p>
    <p class="small mute" style="text-align:center;margin-top:10px"><a href="privacy.html" target="_blank" rel="noopener" style="color:inherit">Privacy policy</a> · <a href="credits.html" target="_blank" rel="noopener" style="color:inherit">Credits</a></p></div>`;
}
function onboardHtml(){
  let body;
  if(!S.me){
    const d=DRAFT||{};
    body=`<div class="logo" style="margin-bottom:18px"><span class="dots"><i></i><i></i></span>Overhere</div><h1 class="pt">Create your profile</h1><p class="sub">${DRAFT?'We filled this in from your beta sign-up. Check it and continue.':'A few details so hosts know who is asking to join.'}</p>
    <label for="o_name">Name</label><input id="o_name" maxlength="40" autocomplete="given-name" value="${esc(d.name||'')}">
    <label for="o_dob">Date of birth</label><input id="o_dob" type="date" value="${esc(d.dob||'')}">
    <label for="o_gender">Gender identity (required)</label><select id="o_gender"><option value="">Select…</option>${GENDERS.map(g=>`<option ${g===d.gender?'selected':''}>${g}</option>`).join('')}</select>
    <p class="small mute" style="margin-top:6px">Used only for the safety-oriented audience filter on posts.</p>
    <label>City</label><input value="Chandigarh" disabled>
    <label for="o_hood">Neighborhood (launch areas)</label><select id="o_hood">${HOODS.map(g=>`<option ${g===d.hood?'selected':''}>${g}</option>`).join('')}</select>
    <label>What would you want to do with company?</label>${opts('o_int',INTERESTS,d.ints)}
    <label>When are you usually free?</label>${opts('o_avail',TIMES,d.avail)}
    <label class="chk top" style="margin-top:18px"><input type="checkbox" id="o_ok"> <span>I agree that Overhere may store these details to run the beta and contact me about it. I am 18 or older. I can ask for my data to be deleted at any time by emailing ${esc(CFG.CONTACT_EMAIL||'the beta team')}. <a href="privacy.html" target="_blank" rel="noopener" style="color:inherit">Privacy policy</a></span></label>
    <div style="height:18px"></div><button class="btn" data-a="ob2">Continue</button>
    <p class="small" style="text-align:center;margin-top:14px"><button class="lnk" data-a="signout">Sign out</button></p>`;
  }else if(!S.me.face&&!ui.faceSkip)body=`<h1 class="pt">Quick face check</h1><p class="sub">Confirms your account belongs to a real person. You can browse without it, but you need it to post a plan or ask to join one.</p><div class="scan">${I('scan-face',56)}</div><button class="btn" data-a="obface">Start face check</button>
    <div style="height:8px"></div><button class="btn sec" data-a="obfaceskip">Skip for now</button>
    <p class="small" style="text-align:center;margin-top:14px"><button class="lnk" data-a="signout">Sign out</button></p>`;
  else body=`<h1 class="pt">Tell us more (optional)</h1><p class="sub">You can skip this and add it later.</p>
    <label for="o_job">Profession</label><input id="o_job" maxlength="40"><label for="o_bio">Bio</label><textarea id="o_bio" maxlength="300"></textarea>
    <div style="height:16px"></div><button class="btn" data-a="obdone" data-save="1">Save and start browsing</button><div style="height:8px"></div><button class="btn sec" data-a="obdone">Skip for now</button>`;
  return `<div class="ob">${body}</div>`;
}

/* ---------- profile photo: pick -> crop -> resize + compress -> stored on this device only ---------- */
const PHOTO_OUT=400,PHOTO_MAX_BYTES=60*1024,PHOTO_MAX_FILE=20*1024*1024,PHOTO_MIN_SIDE=200,PHOTO_MAX_ZOOM=4,PHOTO_WORK=3000;
const PHOTO_RE=/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/;
let crop=null,cropRaf=0;

async function decodeImage(file){
  // createImageBitmap applies the EXIF orientation, so phone photos come out upright
  if(window.createImageBitmap){try{return await createImageBitmap(file,{imageOrientation:'from-image'})}catch(e){}}
  return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{URL.revokeObjectURL(u);ok(im)};im.onerror=()=>{URL.revokeObjectURL(u);no(new Error('decode'))};im.src=u});
}
/* Copy src to a canvas no longer than max px on its long edge, optionally turned a quarter clockwise. */
function toCanvas(src,max,quarter=false){
  const w=src.naturalWidth||src.width,h=src.naturalHeight||src.height,k=Math.min(1,max/Math.max(w,h));
  const cw=Math.round(w*k),ch=Math.round(h*k),c=document.createElement('canvas'),x=c.getContext('2d');
  c.width=quarter?ch:cw;c.height=quarter?cw:ch;
  if(quarter){x.translate(ch,0);x.rotate(Math.PI/2)}
  x.imageSmoothingQuality='high';x.drawImage(src,0,0,cw,ch);
  return c;
}
/* Keep zoom in range and the image always covering the square. */
function clampCrop(){
  const c=crop,W=c.img.width,H=c.img.height;
  c.z=Math.min(PHOTO_MAX_ZOOM,Math.max(1,c.z));
  const half=Math.min(W,H)/(2*c.z);
  c.cx=Math.min(W-half,Math.max(half,c.cx));c.cy=Math.min(H-half,Math.max(half,c.cy));
}
function drawCrop(ctx,D){
  const {img,z,cx,cy}=crop,s=D/Math.min(img.width,img.height)*z;
  ctx.fillStyle='#fff';ctx.fillRect(0,0,D,D); // flatten transparent PNGs
  ctx.imageSmoothingQuality='high';
  ctx.drawImage(img,D/2-cx*s,D/2-cy*s,img.width*s,img.height*s);
}
function paintCrop(){
  cancelAnimationFrame(cropRaf);
  cropRaf=requestAnimationFrame(()=>{
    const cv=document.getElementById('cr_cv');if(!cv||!crop)return;
    const D=Math.round(cv.clientWidth*(window.devicePixelRatio||1));
    if(cv.width!==D)cv.width=cv.height=D;
    clampCrop();drawCrop(cv.getContext('2d'),D);
    document.getElementById('cr_z').value=crop.z;
  });
}
async function compressPhoto(canvas){
  const enc=(t,q)=>new Promise(r=>canvas.toBlob(r,t,q));
  let type='image/webp',q=.85,b=await enc(type,q);
  if(!b||b.type!==type){type='image/jpeg';b=await enc(type,q)} // older Safari cannot encode WebP
  while(b.size>PHOTO_MAX_BYTES&&q>.5){q-=.1;b=await enc(type,q)}
  return b;
}
async function openCropper(file){
  if(!file)return;
  if(file.type&&!file.type.startsWith('image/'))return toast('Pick an image file (JPG, PNG or WebP)');
  if(file.size>PHOTO_MAX_FILE)return toast('That photo is over 20 MB. Pick a smaller one.');
  let src;
  try{src=await decodeImage(file)}catch(e){return toast("Couldn't open that image. Try a JPG, PNG or WebP.")}
  const w=src.naturalWidth||src.width,h=src.naturalHeight||src.height;
  if(Math.min(w,h)<PHOTO_MIN_SIDE){src.close?.();return toast(`That photo is too small. Use one at least ${PHOTO_MIN_SIDE}×${PHOTO_MIN_SIDE} px.`)}
  const img=toCanvas(src,PHOTO_WORK);src.close?.();
  crop={img,z:1,cx:img.width/2,cy:img.height/2,ptrs:new Map(),pinch:null};
  showCropper();
}
function closeCropper(){crop=null;document.getElementById('cr_ov')?.remove()}
function showCropper(){
  document.getElementById('cr_ov')?.remove();
  const ov=document.createElement('div');ov.className='ov';ov.id='cr_ov';
  ov.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="cr_t"><div class="sh"><h2 id="cr_t">Crop your photo</h2><button class="ib" id="cr_x" title="Close">${I('x',18)}</button></div>
  <div class="sb"><div class="crop" id="cr_box" tabindex="0" aria-label="Crop area. Drag or use arrow keys to move, plus and minus to zoom."><canvas id="cr_cv"></canvas></div>
  <p class="small mute" style="text-align:center;margin:0">Drag to reposition. Pinch, scroll or use the slider to zoom.</p>
  <div class="cz">${I('zoom-out',16)}<input type="range" id="cr_z" min="1" max="${PHOTO_MAX_ZOOM}" step="0.01" value="1" aria-label="Zoom">${I('zoom-in',16)}<button class="ib" id="cr_rot" title="Rotate">${I('rotate-cw',18)}</button></div>
  <div class="row"><button class="btn ghost" id="cr_pick">Choose another</button><button class="btn" id="cr_ok">Use photo</button></div>
  <p class="small mute" style="text-align:center;margin:12px 0 0">Saved at ${PHOTO_OUT}×${PHOTO_OUT}, compressed, and kept only in this browser. Other people see your emoji.</p></div></div>`;
  document.getElementById('shell').appendChild(ov);
  const box=document.getElementById('cr_box'),$$=id=>document.getElementById(id);
  const scale=()=>box.clientWidth/Math.min(crop.img.width,crop.img.height)*crop.z; // CSS px per image px
  box.onpointerdown=e=>{box.setPointerCapture(e.pointerId);crop.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});crop.pinch=null};
  box.onpointermove=e=>{
    const p=crop?.ptrs.get(e.pointerId);if(!p)return;
    if(crop.ptrs.size===1){const k=scale();crop.cx-=(e.clientX-p.x)/k;crop.cy-=(e.clientY-p.y)/k}
    p.x=e.clientX;p.y=e.clientY;
    if(crop.ptrs.size===2){const [a,b]=[...crop.ptrs.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(crop.pinch)crop.z*=d/crop.pinch;crop.pinch=d}
    paintCrop();
  };
  box.onpointerup=box.onpointercancel=e=>{crop?.ptrs.delete(e.pointerId);if(crop)crop.pinch=null};
  box.addEventListener('wheel',e=>{e.preventDefault();crop.z*=Math.exp(-e.deltaY*.0015);paintCrop()},{passive:false});
  box.onkeydown=e=>{
    const k=scale(),mv={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(mv){crop.cx+=mv[0]*10/k;crop.cy+=mv[1]*10/k}
    else if(e.key==='+'||e.key==='=')crop.z*=1.1;
    else if(e.key==='-')crop.z/=1.1;
    else return;
    e.preventDefault();paintCrop();
  };
  $$('cr_z').oninput=e=>{crop.z=+e.target.value;paintCrop()};
  $$('cr_rot').onclick=()=>{const img=toCanvas(crop.img,PHOTO_WORK,true);Object.assign(crop,{img,z:1,cx:img.width/2,cy:img.height/2});paintCrop()};
  $$('cr_pick').onclick=()=>$$('p_photo')?.click();
  $$('cr_x').onclick=closeCropper;
  $$('cr_ok').onclick=commitCrop;
  ov.onclick=e=>{if(e.target===ov)closeCropper()};
  ov.onkeydown=e=>{e.stopPropagation();if(e.key==='Escape')closeCropper()};
  paintCrop();box.focus();
}
async function commitCrop(){
  const btn=document.getElementById('cr_ok');btn.disabled=true;btn.textContent='Saving…';
  const c=document.createElement('canvas');c.width=c.height=PHOTO_OUT;
  clampCrop();drawCrop(c.getContext('2d'),PHOTO_OUT);
  const blob=await compressPhoto(c);
  const url=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(blob)});
  if(!savePhoto(url)){btn.disabled=false;btn.textContent='Use photo';return toast('This browser is out of storage space, so the photo could not be saved')}
  S.me.photo=url;
  closeCropper();refreshMyPhoto();
  const pv=document.getElementById('ep_av');if(pv){pv.innerHTML=av('me','lg');if(ui.modal)delete ui.modal.emo;document.querySelectorAll('[data-a=pickemo]').forEach(b=>{b.classList.remove('on');b.setAttribute('aria-checked','false')})}
  toast(`Photo updated (${Math.max(1,Math.round(blob.size/1024))} KB)`);
}
/* Swap my avatars in place so unsaved edits in the profile form are kept. */
function refreshMyPhoto(){
  document.querySelectorAll('.av[data-me]').forEach(el=>{el.outerHTML=av('me',[...el.classList].filter(c=>c!=='av'&&c!=='emo').join(' '))});
}
/* The file input lives on the Profile tab; make one when uploading from elsewhere (the edit sheet). */
function photoInput(){const i=document.createElement('input');i.type='file';i.id='p_photo';i.accept='image/jpeg,image/png,image/webp,image/*';i.hidden=true;document.getElementById('screen').appendChild(i);return i}
function photoMenu(open){
  const mn=document.getElementById('p_menu'),pe=document.getElementById('p_pe');if(!mn)return;
  if(open)mn.innerHTML=`<button role="menuitem" data-a="emojipick">${I('user',15)} Choose emoji</button><button role="menuitem" data-a="pickphoto">${I('camera',15)} Upload a photo</button>${S.me.photo?`<button role="menuitem" class="bad" data-a="rmphoto">${I('trash',15)} Remove photo</button>`:''}`;
  mn.hidden=!open;pe?.setAttribute('aria-expanded',String(open));
  if(open)mn.querySelector('button')?.focus();
}

/* ---------- main render ---------- */
/* Re-rendering replaces the page, so remember where the list (and an open sheet) was scrolled and put it back.
   A different tab starts at the top; a different sheet starts at its top. */
function keepScroll(){
  const m=document.querySelector('main'),sb=document.querySelector('.sheet .sb'),mk=ui.modal?ui.modal.type+':'+(ui.modal.id||''):'';
  const top=m&&keepScroll.tab===ui.tab?m.scrollTop:0,sbTop=sb&&keepScroll.modal===mk?sb.scrollTop:0;
  return ()=>{
    keepScroll.tab=ui.tab;keepScroll.modal=mk;
    const m2=document.querySelector('main'),sb2=document.querySelector('.sheet .sb');
    if(m2)m2.scrollTop=top;if(sb2&&sbTop)sb2.scrollTop=sbTop;
  };
}
function render(){
  const scr=document.getElementById('screen'),restore=keepScroll();
  if(!ONLINE||!ME||!loaded){scr.innerHTML=authHtml();restore();return}
  if(!S.me||!S.me.obDone){scr.innerHTML=onboardHtml()+modalHtml();restore();afterRender();return}
  const unread=S.notes.filter(n=>!n.read).length;
  const view={swipe:tabSwipe,discover:tabDiscover,acts:tabActs,reqs:tabReqs,profile:tabProfile,notes:tabNotes}[ui.tab]();
  const pend=S.reqs.filter(r=>r.status==='pending'&&actOf(r.act)?.host==='me').length;
  const TT=(k,l)=>`<button class="tt ${ui.tab===k?'on':''}" data-a="tab" data-t="${k}">${l}</button>`;
  const T=(k,ic,l)=>`<button class="${ui.tab===k?'on':''}" data-a="tab" data-t="${k}">${I(ic,20)}${l}</button>`;
  scr.innerHTML=`<header><div class="hb"><div class="logo"><span class="dots"><i></i><i></i></span>Overhere</div>
  <div class="tnav">${TT('swipe','Swipe')}${TT('discover','Discover')}<button class="btn sm" data-a="newpost">${I('plus',15)} Create Activity</button>${TT('acts','Activities'+(pend?` (${pend})`:''))}${TT('reqs','Requests')}</div>
  <div class="hr"><button class="ib${ui.tab==='notes'?' on':''}" data-a="bell" title="Notifications" aria-label="Notifications" aria-pressed="${ui.tab==='notes'}">${I('bell',19)}${unread?'<span class="dot"></span>':''}</button><button class="ib" data-a="fb" title="Leave feedback" aria-label="Leave feedback">${I('message-circle',19)}</button><button class="ib${ui.tab==='profile'?' on':''}" data-a="tab" data-t="profile" title="Your profile" aria-label="Your profile">${av('me')}</button></div></div></header>
  <main><div class="${ui.tab==='discover'?'wrap':'narrow'}">${view}</div></main>
  <nav>${T('swipe','flame','Swipe')}${T('discover','compass','Discover')}${T('acts','calendar-check','Activities'+(pend?` (${pend})`:''))}${T('reqs','mail','Requests')}</nav>${microHtml()}${modalHtml()}`;
  restore();afterRender();
}
/* Redraw after new data arrived: keep what you were typing (and the cursor) in fields that are still on screen.
   A live face check in progress is never redrawn, because that would stop the camera. */
function redraw(){
  if(ui.modal?.type==='verify'&&ui.modal.state==='scanning')return;
  const key=el=>el.id||((el.name||el.className)+'='+el.value);
  const box=document.getElementById('screen'),a=document.activeElement,vals=new Map();
  box.querySelectorAll('input,textarea,select').forEach(el=>{if(el.type==='file'||el.disabled)return;vals.set(key(el),el.type==='checkbox'||el.type==='radio'?el.checked:el.value)});
  const foc=a&&box.contains(a)&&a.id?{id:a.id,s:a.selectionStart,e:a.selectionEnd}:null;
  const scene=()=>[ui.tab,ui.auth?.mode,!!ME,loaded,!!S.me,S.me?.face,S.me?.obDone,ui.faceSkip,ui.modal?[ui.modal.type,ui.modal.id,ui.modal.tpl,ui.modal.k,ui.modal.state,ui.modal.edit,ui.modal.m].join(':'):''].join('|');
  const before=scene();
  render();
  if(scene()!==before)return;
  box.querySelectorAll('input,textarea,select').forEach(el=>{const v=vals.get(key(el));if(v===undefined||el.type==='file')return;if(typeof v==='boolean')el.checked=v;else el.value=v});
  if(foc){const el=document.getElementById(foc.id);if(el){el.focus();try{if(foc.s!=null)el.setSelectionRange(foc.s,foc.e)}catch(e){}}}
}
function afterRender(){
  bindDrag();
  drawMap();
  const ms=document.getElementById('msgs');if(ms)ms.scrollTop=ms.scrollHeight;
}

/* ---------- actions ---------- */
const val=id=>document.getElementById(id)?.value?.trim()||'';
const pw=()=>document.getElementById('a_pw')?.value||'';
const here=()=>location.origin+location.pathname;
/* Supabase lets a number or an email address ask for a new code or link once a minute; the button counts down to match. */
const RESEND_MS=60000;let resendT=0;
function resendTimer(){
  clearInterval(resendT);
  resendT=setInterval(()=>{
    const b=document.getElementById('a_resend'),left=Math.ceil((ui.auth.sent+RESEND_MS-Date.now())/1000),what=ui.auth.mode==='code'?'code':'email';
    if(!b||!['code','check'].includes(ui.auth.mode)){clearInterval(resendT);return}
    b.disabled=left>0;b.textContent=left>0?`Resend ${what} in ${left}s`:`Resend ${what}`;
    if(left<=0)clearInterval(resendT);
  },1000);
}

/* ---------- sign-in form checks ---------- */
const EMAIL_RE=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PW_RULES=[['8+ characters',p=>p.length>=8],['Upper and lowercase',p=>/[a-z]/.test(p)&&/[A-Z]/.test(p)],['A number',p=>/\d/.test(p)],['A symbol',p=>/[^A-Za-z0-9]/.test(p)]];
const COMMON_PW=new Set(['password','password1','password12','password123','passw0rd','12345678','123456789','1234567890','87654321','11111111','00000000',
  'qwerty12','qwerty123','qwertyuiop','asdfghjkl','1q2w3e4r','zaq12wsx','abc12345','abcd1234','iloveyou','letmein1','welcome1','welcome123','admin123',
  'sunshine','princess','football','baseball','superman','monkey123','india123','india@123','overhere','overhere1']);
/* 0 to 4. Length counts most; mixing kinds of characters helps. Common passwords score 0, and one built from your email stays weak. */
function pwScore(p,email){
  const lo=p.toLowerCase(),user=(email.split('@')[0]||'').toLowerCase();
  if(COMMON_PW.has(lo)||/^(.)\1+$/.test(p))return 0;
  const kinds=PW_RULES.slice(1).filter(([,ok])=>ok(p)).length+(/[a-z]/i.test(p)?1:0);
  let s=(p.length>=8)+(p.length>=12)+(p.length>=16)+(kinds>=2)+(kinds>=3);
  if(user.length>=3&&lo.includes(user))s=Math.min(s,1);
  return Math.min(s,4);
}
function pwProblem(p,email){
  if(p.length<8)return 'Use at least 8 characters';
  const s=pwScore(p,email),user=(email.split('@')[0]||'').toLowerCase();
  if(s===0)return 'That password is too common. Pick something harder to guess';
  if(user.length>=3&&p.toLowerCase().includes(user))return "Don't use your email in your password";
  if(s<2)return 'Too weak. Mix letters with numbers or symbols, or make it longer';
  return '';
}
/* Typos in the big email providers ("gmial.com") get a "Did you mean" under the field. Short domains only match one letter off. */
const MAIL_DOMAINS=['gmail.com','googlemail.com','yahoo.com','yahoo.co.in','ymail.com','rediffmail.com','outlook.com','outlook.in','hotmail.com','live.com','msn.com','icloud.com','me.com','mail.com','aol.com','proton.me','protonmail.com','zoho.com'];
function editDist(a,b){
  const r=Array.from({length:b.length+1},(_,j)=>j);
  for(let i=1;i<=a.length;i++){let d=r[0];r[0]=i;for(let j=1;j<=b.length;j++){const t=r[j];r[j]=Math.min(r[j]+1,r[j-1]+1,d+(a[i-1]===b[j-1]?0:1));d=t}}
  return r[b.length];
}
function mailFix(email){
  const m=email.toLowerCase().match(/^([^@\s]+)@([^@\s]+)$/);if(!m||MAIL_DOMAINS.includes(m[2]))return '';
  let best='',bd=9;for(const d of MAIL_DOMAINS){const k=editDist(m[2],d);if(k<bd&&k<=(d.length>=9?2:1)){bd=k;best=d}}
  if(!best&&/\.(con|cmo|ocm|vom|xom|comm)$/.test(m[2]))best=m[2].replace(/\.[a-z]+$/,'.com');
  return best?m[1]+'@'+best:'';
}
function mailHint(){
  const h=document.getElementById('a_email_hint');if(!h)return;
  const fix=mailFix(val('a_email'));
  h.hidden=!fix;h.innerHTML=fix?`Did you mean <button type="button" class="lnk" data-a="emailfix" data-v="${esc(fix)}">${esc(fix)}</button>?`:'';
}
/* The line under a field: an error (red, and the field is marked invalid), a good sign (green), or nothing. */
function fieldMsg(id,msg,ok){
  const i=document.getElementById(id),m=document.getElementById(id+'_err');if(!i||!m)return;
  if(msg&&!ok)i.setAttribute('aria-invalid','true');else i.removeAttribute('aria-invalid');
  m.className='ferr'+(ok?' ok':'');m.innerHTML=msg?I(ok?'circle-check':'alert-triangle',14)+esc(msg):'';
}
/* A problem with the whole form (wrong password, account already exists...), shown above its button. */
function formErr(msg,more=''){
  const b=document.getElementById('a_formerr');if(!b){if(msg)toast(msg);return}
  b.hidden=!msg;b.innerHTML=msg?I('alert-triangle',16)+`<span>${esc(msg)}${more}</span>`:'';
}
/* Check every field on submit, mark what's wrong, and put the cursor in the first one. up: a new password, so it must be strong enough. */
function authCheck(up){
  const email=val('a_email'),p=pw(),p2=document.getElementById('a_pw2')?.value||'';
  const errs=[['a_email',!email?'Enter your email':!EMAIL_RE.test(email)?'Enter a valid email, like name@example.com':''],
    ['a_pw',!p?(up?'Choose a password':'Enter your password'):up?pwProblem(p,email):''],
    ['a_pw2',!p2?'Type your password again':p2!==p?"Passwords don't match":'']].filter(([id])=>document.getElementById(id));
  errs.forEach(([id,m])=>id==='a_pw2'&&!m?fieldMsg(id,'Passwords match',true):fieldMsg(id,m));
  const bad=errs.find(([,m])=>m);
  if(bad)document.getElementById(bad[0]).focus();
  return !bad;
}
/* As you type: the strength meter, and whether the two passwords match. Errors only clear here; they appear when you leave a field or submit. */
function pwLive(){
  const p=pw(),email=val('a_email'),box=document.getElementById('a_pws'),up=ui.auth.mode!=='in';
  if(box){
    const s=pwScore(p,email);
    box.dataset.s=!p?0:p.length<8?1:Math.max(s,1);
    document.getElementById('a_pwl').textContent=!p?'':p.length<8?'Too short':s===0?'Too common':['','Weak','Fair','Good','Strong'][s];
    box.querySelectorAll('li').forEach((li,k)=>li.classList.toggle('y',PW_RULES[k][1](p)));
  }
  if(p&&document.getElementById('a_pw')?.getAttribute('aria-invalid')&&!(up&&pwProblem(p,email)))fieldMsg('a_pw','');
  const c=document.getElementById('a_pw2');if(!c)return;
  const v=c.value;
  if(v&&v===p)fieldMsg('a_pw2','Passwords match',true);
  else if(v&&(c.dataset.left||v.length>=p.length))fieldMsg('a_pw2',"Passwords don't match");
  else if(v||document.getElementById('a_pw2_err')?.classList.contains('ok'))fieldMsg('a_pw2','');
}
/* Leaving a field checks it, except when you only went to its show/hide button. */
function authBlur(e){
  const el=e.target;if(e.relatedTarget?.classList?.contains('pwt'))return;
  if(el.id==='a_email'&&el.value.trim()){fieldMsg('a_email',EMAIL_RE.test(el.value.trim())?'':'Enter a valid email, like name@example.com');mailHint()}
  if(el.id==='a_pw'&&el.value&&ui.auth.mode!=='in')fieldMsg('a_pw',pwProblem(el.value,val('a_email')));
  if(el.id==='a_pw2'&&el.value){el.dataset.left=1;pwLive()}
  if(el.classList.contains('pwi'))document.getElementById(el.id+'_caps')?.setAttribute('hidden','');
}
function capsWarn(e){const w=document.getElementById(e.target.id+'_caps');if(w&&e.getModifierState)w.hidden=!e.getModifierState('CapsLock')}
/* Phone numbers: 10 digits after +91, shown as "98765 43210". A pasted "+91 98765 43210" or "098765 43210" loses its prefix. */
const phoneDigits=s=>{const d=s.replace(/\D/g,'');return (d.length>10?d.replace(/^(91|0)(?=\d{10}$)/,''):d).slice(0,10)};
const fmtPhone=d=>d.length>5?d.slice(0,5)+' '+d.slice(5):d;
function phoneProblem(n){return !n?'Enter your mobile number':n.length<10?'Enter all 10 digits':!/^[6-9]/.test(n)?'Indian mobile numbers start with 6, 7, 8 or 9':''}
async function sendCode(again){
  const n=again?ui.auth.phone.slice(3):phoneDigits(val('a_phone'));
  if(!again){const m=phoneProblem(n);fieldMsg('a_phone',m);if(m){document.getElementById('a_phone')?.focus();return}}
  const wait=again?Math.ceil((ui.auth.sent+RESEND_MS-Date.now())/1000):0;
  if(wait>0)return toast(`Please wait ${wait}s before asking for a new code`);
  const {error}=await SB.auth.signInWithOtp({phone:'+91'+n});
  if(error)return again?toast(friendly(error)):formErr(friendly(error));
  track('phone_code_sent',{again,signup:ui.auth.was==='up'});
  ui.auth={mode:'code',phone:'+91'+n,sent:Date.now(),was:ui.auth.was};render();resendTimer();
  if(again)toast('New code sent');
  document.getElementById('a_code')?.focus();webOtp();
  return true;
}
/* The code field is one real input (so paste and the phone's autofill work) drawn as six boxes. */
function otpDraw(){
  const i=document.getElementById('a_code'),cs=document.querySelectorAll('.otpc span');if(!i)return;
  cs.forEach((c,k)=>{c.textContent=i.value[k]||'';c.classList.toggle('on',k===Math.min(i.value.length,5))});
}
function codeWrong(msg){
  const i=document.getElementById('a_code'),box=i?.closest('.otp');if(!i)return;
  fieldMsg('a_code',msg);i.value='';otpDraw();i.focus();
  box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake');
}
/* Android Chrome reads the code straight from the SMS when the message ends with "@overhere.social #123456"
   (needs that SMS template: twilio.md). Elsewhere, and with other templates, this does nothing. */
let otpAbort=null;
function webOtp(){
  otpAbort?.abort();otpAbort=null;if(!('OTPCredential' in window))return;
  const ac=otpAbort=new AbortController();
  navigator.credentials.get({otp:{transport:['sms']},signal:ac.signal}).then(o=>{
    const i=document.getElementById('a_code');
    if(o?.code&&i&&ui.auth.mode==='code'){i.value=o.code.replace(/\D/g,'').slice(0,6);otpDraw();A.checkcode()}
  }).catch(()=>{});
}
/* The form's main button spins while its request is out, so it can't be sent twice. The action returns true when it
   worked and the screen is about to change, so the spinner stays until then. */
async function working(fn){
  const b=document.getElementById('a_go');if(b?.disabled)return;
  formErr('');if(b){b.disabled=true;b.classList.add('busy');b.setAttribute('aria-busy','true')}
  let done=false;
  try{done=await fn()===true}catch(e){formErr(friendly(e))}
  finally{if(b&&!done){b.disabled=false;b.classList.remove('busy');b.removeAttribute('aria-busy')}}
}
const A={
  tab:d=>{if(ui.tab!==d.t)track('tab_view',{tab:d.t});ui.tab=d.t;ui.seen=null;ui.modal=null;render()},
  swipe:d=>swipe(d.d),
  detail:d=>{ui.modal={type:'detail',id:d.id};render()},
  detailback:d=>{ui.modal={type:'detail',id:d.id,back:ui.modal};render()},   // from a profile: closing goes back to it
  hostview:d=>{ui.modal={type:'host',id:d.id};render()},
  chat:d=>{ui.modal={type:'chat',id:d.id};render()},
  close:()=>{ui.modal=ui.modal?.back||null;render()},
  closebg:(d,e)=>{if(e.target.classList.contains('ov')&&ui.modal?.type!=='verify'&&ui.modal?.type!=='chat'){ui.modal=ui.modal?.back||null;render()}},
  user:d=>{ui.modal={type:'user',id:d.id,back:ui.modal};render()},
  /* The bell toggles the notifications tab. Opening it marks everything read (the dot goes), but what was new stays highlighted until you leave. */
  bell:()=>{
    if(ui.tab==='notes'&&!ui.modal){ui.tab=ui.prevTab||'swipe';ui.seen=null;render();return}
    if(ui.tab!=='notes')ui.prevTab=ui.tab;
    const un=S.notes.filter(n=>!n.read);ui.seen=new Set([...(ui.seen||[]),...un.map(n=>n.id)]);
    if(un.length){un.forEach(n=>n.read=true);call('read_notifications',{p_ids:null},true).catch(()=>{})}
    ui.tab='notes';ui.modal=null;render();
  },
  /* Inside the landing page, it switches that page to its feedback form; in full screen, it opens the form (which links back here). */
  fb:()=>{if(window.parent!==window){try{window.parent.postMessage('overhere-feedback',location.origin)}catch(e){}}else location.href='index.html#feedback'},
  scan:()=>scan(),
  retry:()=>{ui.err='';render();refresh()},
  /* sign in */
  /* the email you typed carries over between sign in, create account and reset */
  /* was: the tab you came from (Sign in or Create account), so the phone screens can word things and go back to it */
  authmode:d=>{
    otpAbort?.abort();
    ui.auth={mode:d.k,phone:ui.auth.phone,email:val('a_email')||ui.auth.email,was:['in','up'].includes(ui.auth.mode)?ui.auth.mode:ui.auth.was};render();
    if(d.k==='phone')document.getElementById('a_phone')?.focus();
  },
  pwshow:d=>{
    const i=document.getElementById(d.id),b=i?.parentNode.querySelector('.pwt');if(!i)return;
    const show=i.type==='password';i.type=show?'text':'password';
    b.setAttribute('aria-pressed',show);b.setAttribute('aria-label',show?'Hide password':'Show password');b.innerHTML=I(show?'eye-off':'eye',18);
  },
  emailfix:d=>{const i=document.getElementById('a_email');i.value=d.v;fieldMsg('a_email','');mailHint();pwLive();document.getElementById('a_pw')?.focus()},
  signin:()=>working(async()=>{
    if(!authCheck(false))return;
    const {error}=await SB.auth.signInWithPassword({email:val('a_email'),password:pw()});
    if(error)return formErr(/confirm/i.test(error.message)?'Please confirm your email first: open the link we sent you.':/invalid/i.test(error.message)?'Wrong email or password.':friendly(error));
    return true;   // signed in: onAuthStateChange takes it from here
  }),
  signup:()=>working(async()=>{
    if(!authCheck(true))return;
    const email=val('a_email'),{data,error}=await SB.auth.signUp({email,password:pw(),options:{emailRedirectTo:here()}});
    const exists=['You already have an account with this email.',' <button type="button" class="lnk" data-a="authmode" data-k="in">Sign in instead</button>'];
    if(error)return /already (registered|exists)/i.test(error.message)?formErr(...exists):formErr(friendly(error));
    /* With email confirmation on, Supabase answers an address that already has an account with a user that has no identities, not an error. */
    if(data.user&&!data.user.identities?.length)return formErr(...exists);
    track('account_created');
    if(data.session)return true;
    ui.auth={mode:'check',email,kind:'signup',sent:Date.now()};render();resendTimer();return true;
  }),
  resendmail:async()=>{
    const {email,kind,sent}=ui.auth,wait=Math.ceil(((sent||0)+RESEND_MS-Date.now())/1000);
    if(!email)return;if(wait>0)return toast(`Please wait ${wait}s before asking again`);
    const {error}=kind==='reset'?await SB.auth.resetPasswordForEmail(email,{redirectTo:here()})
      :await SB.auth.resend({type:'signup',email,options:{emailRedirectTo:here()}});
    if(error)return toast(friendly(error));
    track('email_resent',{kind:kind||'signup'});
    ui.auth.sent=Date.now();render();resendTimer();toast('Sent again. Check your inbox.');
  },
  /* The first code comes from the form (its button spins); "Resend code" sends another to the same number. */
  sendcode:d=>d.k==='again'?sendCode(true):working(()=>sendCode(false)),
  checkcode:()=>working(async()=>{
    const i=document.getElementById('a_code'),token=(i?.value||'').replace(/\D/g,'');
    if(token.length!==6){fieldMsg('a_code',token?'Enter all 6 digits':'Enter the code from the SMS');i?.focus();return}
    const {error}=await SB.auth.verifyOtp({phone:ui.auth.phone,token,type:'sms'});
    if(error)return codeWrong(friendly(error));
    otpAbort?.abort();track('phone_signed_in');
    return true;   // signed in: onAuthStateChange takes it from here
  }),
  google:async()=>{
    const {data,error}=await SB.auth.signInWithOAuth({provider:'google',options:{redirectTo:here(),skipBrowserRedirect:true}});
    if(error)return toast(friendly(error));
    /* Google can't be shown inside the beta page's frame, so the whole tab goes there */
    try{(window.top||window).location.href=data.url}catch(e){window.open(data.url,'_blank','noopener')}
  },
  forgot:()=>working(async()=>{
    if(!authCheck(false))return;
    const email=val('a_email'),{error}=await SB.auth.resetPasswordForEmail(email,{redirectTo:here()});
    if(error)return formErr(friendly(error));
    ui.auth={mode:'check',email,kind:'reset',sent:Date.now()};render();resendTimer();return true;
  }),
  setpw:()=>working(async()=>{
    if(!authCheck(true))return;
    const {error}=await SB.auth.updateUser({password:pw()});
    if(error)return formErr(/different from the old/i.test(error.message)?'Choose a password different from your old one.':friendly(error));
    toast('Password saved');ui.auth={mode:'in'};history.replaceState(null,'',here());start();return true;
  }),
  signout:async()=>{track('signed_out');try{await SB.auth.signOut()}catch(e){}location.reload()},
  /* browsing */
  fcat:d=>{ui.f.cat=d.k;track('filter',{type:'category'});render()},
  ftod:d=>{ui.f.tod=d.k;track('filter',{type:'time'});render()},
  fdate:d=>{const p=d.k&&datePresets()[d.k];ui.f.dfrom=p?p[1]:'';ui.f.dto=p?p[2]:'';if(p)track('filter',{type:'date',preset:d.k});render()},
  freset:()=>{ui.f={...freshF(),sort:ui.f.sort,view:ui.f.view};render()},
  filters:()=>{track('filters_opened');ui.modal={type:'filters'};render()},
  fclear:d=>{const f=ui.f,base=freshF();if(d.k==='date'){f.dfrom=f.dto=''}else f[d.k]=base[d.k];render()},
  sortmenu:()=>{ui.modal={type:'sort'};render()},
  fsort:d=>{ui.f.sort=d.k;ui.modal=null;track('sort',{by:d.k});render()},
  fdist:d=>{ui.f.dist=+d.k;track('filter',{type:'distance'});render()},
  fview:d=>{ui.f.view=d.k;if(d.k==='map')track('map_view');render()},
  saveal:()=>{const f=ui.f,al={id:'al'+Date.now().toString(36),cat:f.cat,tod:f.tod,dist:f.dist,label:alertLabel(f)};S.alerts.push(al);save();track('alert_saved');toast(`Alert saved: we'll tell you about new "${al.label}" plans.`);render()},
  rmalert:d=>{S.alerts=S.alerts.filter(x=>x.id!==d.id);save();toast('Alert removed');render()},
  readall:()=>{S.notes.forEach(n=>n.read=true);render();call('read_notifications',{p_ids:null},true).catch(()=>{})},
  opennote:d=>{
    const n=S.notes.find(x=>x.id===d.id);if(!n)return;
    if(!n.read){n.read=true;if(!n.id.startsWith('tmp'))call('read_notifications',{p_ids:[n.id]},true).catch(()=>{})}
    const a=n.act&&actOf(n.act);
    if(a)ui.modal=n.safe&&a.arrive==='asked'?{type:'safe',id:a.id}:n.chat&&S.chats[a.id]?{type:'chat',id:a.id}:n.check&&!S.ratings[a.id]?{type:'rate',id:a.id}:{type:a.host==='me'?'host':'detail',id:a.id};
    render();
  },
  viewact:d=>{
    const a=actOf(d.id);if(!a)return toast('That activity is no longer available');
    ui.modal={type:a.host==='me'?'host':'detail',id:a.id};render();
  },
  venueother:()=>askArea(),
  pickvenue:d=>{const i=document.getElementById('f_venue');if(i){i.value=d.v;i.focus()}venueList(false);track('venue_picked')},
  /* hosting */
  newpost:()=>gate(()=>{ui.modal={type:'post'};render()}),
  unlock:()=>gate(()=>{toast('Face check passed. Plans for your group now show too.');render()}),
  submitpost:async(d,e)=>{
    const desc=val('f_desc'),venue=val('f_venue'),when=new Date(document.getElementById('f_when').value).getTime();
    const gs=[...document.querySelectorAll('.f_g:checked')].map(x=>x.value),all=document.getElementById('f_all').checked||gs.length===GENDERS.length;
    const ed=ui.modal?.id&&actOf(ui.modal.id),cap=+val('f_cap'),rep=val('f_rep');
    if(!desc||!venue)return toast('Add a description and a venue');
    if(!PLACE_AT[venue.toLowerCase()]&&!spotOf(venue)){askArea();return toast('Pick which area the venue is in, so it shows on the map')}
    if(!(when>now()))return toast('Pick a future date and time');
    if(!all&&!gs.length)return toast('Choose Everyone or at least one identity');
    const tot=Math.max(0,Math.min(1e6,Math.round(+val('f_total')||0)));
    const p={cat:val('f_cat'),desc,cap,when,aud:all?null:gs,venue,cost:val('f_cost'),total:tot,repeat:rep};
    e.target.closest('button').disabled=true;
    if(ed){
      if(await run('edit_activity',{p_act:ed.id,p})===undefined){e.target.closest('button').disabled=false;return}
      track('activity_edited');ui.modal={type:'host',id:ed.id};toast('Changes saved'+(ed.members.length?'. Members see a note in the chat.':''));render();return;
    }
    const id=await run('post_activity',{p});
    if(id===undefined){e.target.closest('button').disabled=false;return}
    track('post_created',{cat:p.cat,repeat:!!rep,audience:all?'everyone':'limited',cost:p.cost,template:!!ui.modal?.tpl});askMicro('post');
    ui.modal=null;ui.tab='acts';toast('Posted. Now visible to eligible people.');render();
  },
  editact:d=>{ui.modal={type:'post',id:d.id};render()},
  postagain:d=>{ui.modal={type:'post',tpl:d.id};render()},
  acc:async d=>{if(await run('decide_request',{p_req:d.id,p_accept:true})!==undefined)toast('Accepted')},
  rej:async d=>{if(await run('decide_request',{p_req:d.id,p_accept:false})!==undefined)toast('Declined')},
  cancelact:d=>{ui.modal={type:'cancelconfirm',id:d.id};render()},
  docancel:async d=>{if(await run('cancel_activity',{p_act:d.id})!==undefined){track('activity_cancelled');ui.modal=null;render()}},
  /* joining */
  request:d=>{
    const note=val('r_note');
    gate(async()=>{
      const a=actOf(d.id);
      const st=await run('request_join',{p_act:d.id,p_note:note});
      if(st===undefined)return;
      track('request_sent',{waitlist:st==='waitlist',note:!!note});askMicro('request');
      toast(st==='waitlist'?`You're on the waitlist. Your request goes to ${uname(a?.host)} if a spot opens.`:st==='accepted'?`${uname(a?.host)} said yes! Say hi in the group chat.`:'Request sent to '+uname(a?.host)+'. Follow it in Requests.');
      ui.modal=null;
      if(ui.tab==='swipe'&&!deck().length){ui.tab='discover';toast("Request sent. You've seen everything nearby, here's Discover.")}
      render();
    });
  },
  askreq:d=>{ui.modal={type:'confirm',id:d.id};render()},
  withdraw:async d=>{if(await run('withdraw_request',{p_act:d.id})!==undefined){track('request_withdrawn');toast('Request withdrawn')}},
  leave:d=>{ui.modal={type:'leave',id:d.id,back:ui.modal};render()},
  members:d=>{ui.modal={type:'members',id:d.id,back:ui.modal};render()},
  rmmember:d=>{ui.modal={type:'rmmember',id:d.id,u:d.u,back:ui.modal};render()},
  doremove:async d=>{const name=uname(d.u);if(await run('remove_member',{p_act:d.id,p_user:sid(d.u)})===undefined)return;track('member_removed');toast(`${name} was removed and has been told.`);ui.modal=ui.modal?.back||null;render()},
  doleave:async d=>{const a=actOf(d.id);if(await run('leave_activity',{p_act:d.id})===undefined)return;track('left_activity');toast(`You left "${short(a.desc)}". ${uname(a.host)} has been told.`);ui.modal={type:'detail',id:d.id};render()},
  rate:d=>{ui.modal={type:'rate',id:d.id,back:ui.modal};render()},
  dorate:async d=>{
    const a=actOf(d.id);if(!a)return;
    const st=document.querySelector('input[name=rt_star]:checked');if(!st)return toast('Tap the stars to say how much you enjoyed it');
    const ok=document.querySelector('input[name=rt_ok]:checked')?.value||'yes',people={};
    [a.host,...a.members].filter(x=>x!=='me'&&x!=='?').forEach(u=>{people[u]=document.querySelector(`input[name="rt_${u}"]:checked`)?.value||'show'});
    if(await run('rate_activity',{p_act:a.id,p_ok:ok,p_stars:+st.value,p_people:people})===undefined)return;
    track('rating_submitted',{stars:+st.value,ok});askMicro('rating');
    ui.modal=null;toast(ok==='no'?'Thanks for telling us. Our safety team will follow up with you.':'Thanks! Your feedback helps keep meetups good and reliable.');render();
  },
  /* safety */
  report:d=>{ui.modal={type:'report',id:d.id,back:ui.modal};render()},
  dorep:async d=>{
    const r=document.querySelector('input[name=rp_r]:checked');if(!r)return toast('Pick what happened');
    const bl=!!document.getElementById('rp_block')?.checked;
    if(await run('report',{p_target:d.id,p_act:null,p_msg:null,p_reason:r.value,p_note:document.getElementById('rp_note').value.trim()})===undefined)return;
    if(bl)await run('block_user',{p_user:d.id});
    track('report_sent',{kind:'user',reason:r.value,block:bl});
    ui.modal=ui.modal?.back||null;toast('Report sent. Our safety team reviews reports within 24 hours.'+(bl?` ${uname(d.id)} is blocked.`:''));render();
  },
  block:async d=>{if(await run('block_user',{p_user:d.id})===undefined)return;track('block');toast(`Blocked ${uname(d.id)}. You won't see their activities and they can't request yours.`);render()},
  unblock:async d=>{if(await run('unblock_user',{p_user:d.id})!==undefined)toast(`Unblocked ${uname(d.id)}`)},
  share:d=>{track('share_opened',{kind:d.k});ui.modal={type:'share',id:d.id,k:d.k,back:ui.modal};render()},
  follow:d=>{const on=S.following.includes(d.id);S.following=on?S.following.filter(x=>x!==d.id):[...S.following,d.id];save();track(on?'unfollow':'follow');toast(on?`Unfollowed ${uname(d.id)}`:`Following ${uname(d.id)}. You'll hear when they post.`);render()},
  mute:d=>{S.muted[d.id]=!S.muted[d.id];save();track('chat_mute',{on:S.muted[d.id]});toast(S.muted[d.id]?'Chat muted. You can still open it any time.':'Chat notifications on');render()},
  tipsok:d=>{S.tips[d.id]=true;save();render()},
  /* chat */
  newpoll:d=>{ui.modal={type:'poll',id:d.id,back:ui.modal};render()},
  dopoll:async d=>{
    const q=val('pl_q'),opts=[0,1,2,3].map(i=>val('pl_o'+i)).filter(Boolean);
    if(!q||opts.length<2)return toast('Add a question and at least 2 options');
    if(await run('send_message',{p_act:d.id,p_body:null,p_poll:{q,opts}})===undefined)return;
    track('poll_created',{options:opts.length});ui.modal=ui.modal?.back||{type:'chat',id:d.id};render();
  },
  vote:d=>{const x=S.chats[d.id]?.[+d.m];if(!x?.poll)return;track('poll_vote');run('vote',{p_msg:x.id,p_opt:+d.o})},
  msgrep:d=>{ui.modal={type:'msgrep',id:d.id,m:+d.m,back:ui.modal};render()},
  domsgrep:async d=>{
    const x=S.chats[d.id]?.[+d.m],r=document.querySelector('input[name=mr_r]:checked');if(!x)return;if(!r)return toast('Pick what is wrong with it');
    const bl=!!document.getElementById('mr_block')?.checked;
    if(await run('report',{p_target:sid(x.from),p_act:d.id,p_msg:x.id,p_reason:r.value,p_note:''})===undefined)return;
    if(bl)await run('block_user',{p_user:sid(x.from)});
    track('report_sent',{kind:'message',reason:r.value,block:bl});ui.modal=ui.modal?.back||null;toast('Message reported. Our safety team reviews reports within 24 hours.');render();
  },
  send:async d=>{
    const inp=document.getElementById('c_in'),t=(inp?.value||'').trim();if(!t)return;
    inp.value='';
    if(await run('send_message',{p_act:d.id,p_body:t,p_poll:null})===undefined){const i2=document.getElementById('c_in');if(i2&&!i2.value)i2.value=t;return}
    track('chat_message');document.getElementById('c_in')?.focus();
  },
  sos:d=>{track('sos_opened');ui.modal={type:'sos',id:d.id,back:ui.modal?.type==='safe'?null:ui.modal,locState:'wait'};render();getLoc()},
  sosloc:()=>{ui.modal.locState='wait';render();getLoc()},
  safeok:d=>{const a=actOf(d.id);if(a){a.arrive='ok'}save();track('safe_checkin',{answer:'ok'});ui.modal=null;toast("Great, have fun! We'll check in again afterwards.");render()},
  microans:d=>{const k=ui.micro;if(!k)return;track('micro_feedback',{moment:k,score:+d.n});S.asked[k]=true;ui.micro=null;save();toast('Thanks! That helps us improve.');render()},
  microx:()=>{const k=ui.micro;if(k){track('micro_dismissed',{moment:k});S.asked[k]=true}ui.micro=null;save();render()},
  theme:d=>{try{localStorage.setItem('overhere_theme',d.k)}catch(e){}applyTheme(d.k);track('theme',{mode:d.k});render()},
  install:()=>{if(!installEvt)return;installEvt.prompt();installEvt.userChoice.then(c=>{track('pwa_install',{outcome:c.outcome});installEvt=null;render()}).catch(()=>{})},
  edittrusted:()=>{ui.modal.edit=true;render()},
  savetrusted:()=>{
    const name=val('t_name'),phone=val('t_phone');
    if(!name||phone.replace(/\D/g,'').length<7)return toast('Add a name and a valid phone number');
    if(ownPhone(phone))return toast("That's the number you signed in with. Add someone else's number");
    S.me.trusted={name:name.slice(0,40),phone:phone.slice(0,20)};save();toast('Trusted contact saved');
    if(ui.modal?.type==='share')ui.modal.edit=false;
    render();
  },
  copyshare:()=>{
    const t=document.getElementById('sh_txt');if(!t)return;
    const done=()=>toast('Copied');
    (navigator.clipboard?navigator.clipboard.writeText(t.value):Promise.reject()).then(done).catch(()=>{t.select();try{document.execCommand('copy');done()}catch(e){toast('Select the text and copy it')}});
  },
  nshare:()=>{const t=document.getElementById('sh_txt');if(t&&navigator.share)navigator.share({text:t.value}).catch(()=>{})},
  /* profile */
  saveprofile:async()=>{
    const name=val('p_name'),dob=val('p_dob'),tn=val('t_name'),tp=val('t_phone');
    if(!name)return toast('Add your name');
    if(!dob||!(ageOf(dob)>=18))return toast('Check your date of birth: you must be 18 or over');
    if((tn||tp)&&(!tn||tp.replace(/\D/g,'').length<7))return toast('Add a name and a valid phone for your trusted contact, or leave both empty');
    if(tp&&ownPhone(tp))return toast("Your trusted contact can't be the number you signed in with");
    const p={name,dob,gender:val('p_gender'),hood:val('p_hood'),job:val('p_job'),bio:document.getElementById('p_bio').value.trim(),ints:many('p_int'),avail:many('p_avail')};
    if(ui.modal?.emo)p.emo=ui.modal.emo;
    S.me.trusted=tn?{name:tn.slice(0,40),phone:tp.slice(0,20)}:null;save();
    if(await run('save_profile',{p})===undefined)return;
    if(p.emo){savePhoto('');S.me.photo=''}
    track('profile_saved');ui.modal=null;toast('Profile saved');render();
  },
  editprofile:d=>{ui.modal={type:'editprofile'};render();if(d.k==='safety')document.getElementById('ep_safety')?.scrollIntoView({block:'start'})},
  /* In the edit sheet the emoji is applied on Save; update the preview without losing typed changes. */
  pickemo:d=>{
    ui.modal.emo=d.e;
    document.querySelectorAll('[data-a=pickemo]').forEach(b=>{const on=b.dataset.e===d.e;b.classList.toggle('on',on);b.setAttribute('aria-checked',on)});
    const pv=document.getElementById('ep_av');if(pv)pv.innerHTML=`<span class="av emo lg" style="background:${PASTEL[0]}" aria-hidden="true">${esc(d.e)}</span>`;
  },
  emojipick:()=>{photoMenu(false);ui.modal={type:'emoji'};render()},
  setemo:async d=>{if(await run('save_profile',{p:{emo:d.e}})===undefined)return;savePhoto('');S.me.photo='';track('avatar_emoji');ui.modal=null;toast('Emoji updated');render()},
  /* No photo yet: go straight to the picker. Otherwise offer change/remove. */
  photo:()=>{photoMenu(document.getElementById('p_menu')?.hidden)},
  pickphoto:()=>{photoMenu(false);(document.getElementById('p_photo')||photoInput()).click()},
  rmphoto:()=>{photoMenu(false);savePhoto('');S.me.photo='';toast('Photo removed. Showing your emoji.');if(ui.modal?.type==='editprofile')render();else refreshMyPhoto()},
  /* onboarding */
  ob2:async(d,e)=>{
    const p={name:val('o_name'),dob:val('o_dob'),gender:val('o_gender'),hood:val('o_hood'),ints:many('o_int'),avail:many('o_avail')};
    if(!p.name||!p.dob||!p.gender)return toast('Name, date of birth and gender identity are required');
    if(!(ageOf(p.dob)>=18))return toast('You must be 18 or over');
    if(!document.getElementById('o_ok')?.checked)return toast('Please tick the consent box to continue');
    p.emo=defEmo(p.gender);p.consent=true;
    e.target.closest('button').disabled=true;
    if(await run('save_profile',{p})===undefined){e.target.closest('button').disabled=false;return}
    track('profile_created');
  },
  obface:()=>openVerify('face',()=>render()),
  obfaceskip:()=>{ui.faceSkip=true;track('face_skipped');render()},
  doface:()=>openVerify('face',()=>render()),
  obdone:async d=>{
    const p={onboarded:true,...(d.save?{job:val('o_job'),bio:val('o_bio')}:{})};
    if(await run('save_profile',{p})===undefined)return;
    track('onboarding_done',{details:!!d.save});ui.tab='swipe';render();
  }
};
document.addEventListener('click',e=>{
  if(!e.target.closest('.phw'))photoMenu(false);
  if(!e.target.closest('.vbox'))venueList(false);
  if(e.target.matches('input[type=checkbox]')&&e.target.id!=='d_fail'){
    if(e.target.id==='f_all'&&e.target.checked)document.querySelectorAll('.f_g').forEach(x=>x.checked=false);
    else if(e.target.classList.contains('f_g')&&e.target.checked){
      /* every identity ticked is the same as Everyone */
      const gs=document.querySelectorAll('.f_g'),on=[...gs].every(x=>x.checked);
      if(on)gs.forEach(x=>x.checked=false);
      document.getElementById('f_all').checked=on;
    }
  }
  const el=e.target.closest('[data-a]');if(!el)return;
  if(el.dataset.a==='closebg'){A.closebg(el.dataset,e);return}
  const fn=A[el.dataset.a];if(fn){e.stopPropagation();fn(el.dataset,e)}
});
document.addEventListener('input',e=>{
  if(e.target.id==='r_note'){const c=document.getElementById('r_cnt');if(c)c.textContent=e.target.value.length}
  if(e.target.id==='a_code'){
    const i=e.target,v=i.value.replace(/\D/g,'').slice(0,6);if(i.value!==v)i.value=v;
    if(v&&i.getAttribute('aria-invalid'))fieldMsg('a_code','');
    otpDraw();if(v.length===6)A.checkcode();  // typed, pasted, or filled in from the SMS
  }
  if(e.target.id==='a_phone'){
    const i=e.target,atEnd=i.selectionStart===i.value.length,n=phoneDigits(i.value);
    if(atEnd)i.value=fmtPhone(n);   // reformat only when typing at the end, so the cursor doesn't jump
    if(i.getAttribute('aria-invalid')&&!phoneProblem(n))fieldMsg('a_phone','');
  }
  if(e.target.id==='f_venue')venueList(true);
  if(e.target.id==='a_email'){
    document.getElementById('a_email_hint')?.setAttribute('hidden','');
    if(e.target.getAttribute('aria-invalid')&&EMAIL_RE.test(e.target.value.trim()))fieldMsg('a_email','');
  }
  if(/^a_(email|pw2?)$/.test(e.target.id))pwLive();
});
/* Sign-in forms: Enter, or the main button, runs the form's action. */
document.addEventListener('submit',e=>{const f=e.target.closest?.('form[data-submit]');if(!f)return;e.preventDefault();A[f.dataset.submit]?.(f.dataset,e)});
document.addEventListener('focusout',e=>{
  if(/^a_(email|pw2?)$/.test(e.target.id))authBlur(e);
  if(e.target.id==='a_phone'&&e.target.value.trim())fieldMsg('a_phone',phoneProblem(phoneDigits(e.target.value)));
});
/* the six code boxes: typing always goes on the end */
document.addEventListener('focusin',e=>{if(e.target.id==='a_code'){const i=e.target;setTimeout(()=>i.setSelectionRange(i.value.length,i.value.length),0)}});
document.addEventListener('keyup',e=>{if(e.target.classList?.contains('pwi'))capsWarn(e)});
/* Suggestions stay open while focus is in the venue box or its list; clicking one keeps the focus in the box. */
document.addEventListener('mousedown',e=>{if(e.target.closest('.vopt'))e.preventDefault()});
document.addEventListener('focusout',e=>{if(e.target.closest?.('.vbox'))setTimeout(()=>{if(!document.activeElement?.closest?.('.vbox'))venueList(false)},200)});
document.addEventListener('change',e=>{
  if(e.target.id==='d_from'||e.target.id==='d_to'){
    const f=ui.f;f[e.target.id==='d_from'?'dfrom':'dto']=e.target.value;
    if(f.dfrom&&f.dto&&f.dfrom>f.dto)[f.dfrom,f.dto]=[f.dto,f.dfrom];
    track('filter',{type:'date'});render()}
  if(e.target.id==='f_tpl'&&ui.modal?.type==='post'){ui.modal.tpl=e.target.value||null;render()}
  if(e.target.id==='p_photo'){const f=e.target.files[0];e.target.value='';openCropper(f)}
  if(e.target.id==='f_area'&&e.target.value){const i=document.getElementById('f_venue');if(i){const nm=i.value.replace(AREA_TAIL,'').trim();i.value=((nm?nm+', ':'')+e.target.value).slice(0,120)}}
});
document.addEventListener('keydown',e=>{
  if(e.target.classList?.contains('pwi'))capsWarn(e);
  if(e.target.id==='f_venue'&&venueKey(e))return;
  const pm=document.getElementById('p_menu');
  if(e.key==='Escape'&&pm&&!pm.hidden){photoMenu(false);document.getElementById('p_pe')?.focus();return}
  if(e.key==='Enter'&&e.target.matches('[role=button][data-a]')){e.target.click();return}
  if(e.key==='Enter'&&e.target.id==='c_in'){const b=document.querySelector('[data-a=send]');if(b)b.click();return}
  if(e.key==='Escape'&&ui.modal&&ui.modal.type!=='verify'){ui.modal=ui.modal.back||null;render();return}
  if(ui.modal||ui.tab!=='swipe'||!S.me?.obDone||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  if(e.key==='ArrowLeft')swipe('left');
  else if(e.key==='ArrowRight')swipe('right');
});

/* ---------- start ---------- */
let starting=null;
async function start(){
  if(starting)return starting;
  starting=(async()=>{
    const {data}=await SB.auth.getUser();
    if(!data?.user){ME=null;starting=null;render();return}
    ME=data.user.id;MYPHONE=(data.user.phone||'').replace(/\D/g,'').slice(-10);loaded=false;render();
    await refresh();
    loadPlaces();
    listen();
    track('app_open',{standalone:isStandalone(),embedded:window.parent!==window});
    /* Invite links open straight to the activity. */
    const mm=location.hash.match(/^#act=([0-9a-f-]{36})$/i),a=mm&&S.me?.obDone&&actOf(mm[1]);
    if(a){ui.modal={type:a.host==='me'?'host':'detail',id:a.id};render()}
    else if(mm&&S.me?.obDone)toast('That activity is no longer available');
  })();
  return starting;
}
applyTheme(themePref());
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>applyTheme(themePref()));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;if(ui.tab==='profile'&&!ui.modal)render()});
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});
if(!ONLINE)render();
else{
  /* Opened from a password-reset email: ask for the new password before anything else. */
  if(/type=recovery/.test(location.hash))ui.auth={mode:'newpw'};
  /* "Join the beta" on the landing page opens here with ?join: start on "Create your account". */
  else if(/[?&]join(&|$)/.test(location.search)){ui.auth={mode:'up'};history.replaceState(null,'',here()+location.hash)}
  SB.auth.onAuthStateChange((ev,session)=>{
    /* don't call Supabase from inside this callback: do it just after */
    setTimeout(()=>{
      if(ev==='PASSWORD_RECOVERY'){ui.auth={mode:'newpw'};ME=null;render();return}
      if(ev==='SIGNED_OUT'){ME=null;MYPHONE='';S=blank();USERS={};loaded=false;ui=freshUi();render();return}
      if(session&&session.user.id!==ME&&ui.auth.mode!=='newpw')start();
      else if(!session&&ev==='INITIAL_SESSION')render();
    },0);
  });
  setInterval(()=>{if(ME&&loaded&&document.visibilityState==='visible')refresh()},60000);
  setInterval(()=>{if(S.me&&loaded&&tick()&&!ui.modal)render()},30000);
  document.addEventListener('visibilitychange',()=>{if(ME&&loaded&&document.visibilityState==='visible')refresh()});
}

"use strict";
/* ---------- icons (Lucide, ISC licence) ---------- */
const IC={
  dumbbell:'<path d="M17.6 12.8a2 2 0 1 0 2.8-2.9l-1.7-1.7a2 2 0 0 0 2.8-2.8l-2.8-2.8a2 2 0 0 0-2.9 2.8l-1.7-1.8a2 2 0 1 0-2.9 2.9z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.3 21.5a2 2 0 1 0 2.9-2.9l1.7 1.8a2 2 0 1 0 2.9-2.9l-6.4-6.3a2 2 0 1 0-2.8 2.8l1.7 1.8a2 2 0 0 0-2.8 2.8z"/><path d="m9.6 14.4 4.8-4.8"/>',
  drama:'<path d="M10 11h.01"/><path d="M14 6h.01"/><path d="M18 6h.01"/><path d="M6.5 13.1h.01"/><path d="M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3"/><path d="M17.4 9.9c-.8.8-2 .8-2.8 0"/><path d="M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7"/><path d="M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4"/>',
  mic:'<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
  mountain:'<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  trees:'<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
  'shopping-bag':'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  'book-open':'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  'arrow-up-down':'<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  'log-out':'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  calendar:'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  'calendar-check':'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  'locate':'<line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/>',
  'chevron-down':'<path d="m6 9 6 6 6-6"/>',
  'map-pin':'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'user-check':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  'bell-off':'<path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/><path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="m2 2 20 20"/>',
  'settings-2':'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  'message-circle':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  'messages-square':'<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
  'message-heart':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7"/>',
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
  lightbulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  bookmark:'<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  'rotate-cw':'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  'zoom-in':'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/>',
  'zoom-out':'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/>'
};
const I=(n,s=16)=>`<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;

/* ---------- constants ---------- */
const GENDERS=['Woman','Man','Non-binary'];
/* The 13 categories of the 7 Nov 2026 spec, in its order (keys and checks in schema-app.sql). movies, cafe and concerts
   keep their old keys and interest names, so existing plans and profiles stay as they are. */
/* Interests, in groups. Each counts as liking one plan category (for "You like ..." on plans); the first in a group
   are the categories' own names from before, so older profiles still match. Same list in app/src/lib/model.ts and in
   profiles_ints_check (schema-app.sql). At least MIN_INTS, checked here, in the app and by save_profile. */
const INT_GROUPS=[
  ['Staying active',[['Fitness','fitness'],['Gym','fitness'],['Running','fitness'],['Yoga','fitness'],['Cycling','fitness'],['Sports','fitness']]],
  ['Out and about',[['Adventure','adventure'],['Trekking','adventure'],['Road trips','adventure'],['Camping','adventure'],['Outdoor leisure','outdoor'],['Picnics','outdoor'],['Walks','outdoor'],['Photography','outdoor']]],
  ['Food and drink',[['Cafe / Food','cafe'],['Street food','cafe'],['New restaurants','cafe'],['Coffee','cafe'],['Brunch','cafe'],['Cooking','cafe']]],
  ['Shows and nights out',[['Movies','movies'],['Theatre','theatre'],['Stand-up comedy','comedy'],['Concerts','concerts'],['Live music','concerts'],['Karaoke','nightlife'],['Dancing','nightlife'],['Nightlife','nightlife']]],
  ['Games and hobbies',[['Hangout','hangout'],['Board games','hangout'],['Video games','hangout'],['Art and craft','hangout'],['Books','hangout'],['Volunteering','hangout']]],
  ['Everyday',[['Work and study','work'],['Co-working','work'],['Language exchange','work'],['Chores and errands','errands'],['Shopping','errands'],['Self care','selfcare'],['Meditation','selfcare']]],
];
const INT_CAT=Object.fromEntries(INT_GROUPS.flatMap(([,l])=>l)),INTERESTS=Object.keys(INT_CAT),MIN_INTS=3;
const intCount=n=>n>=MIN_INTS?`${n} picked`:`Pick at least ${MIN_INTS}${n?` · ${n} picked`:''}`;
/* the interest chips, grouped, with a count that updates as you tick them (the change listener) */
const intOpts=(name,sel)=>`<p class="icount${(sel||[]).length>=MIN_INTS?' ok':''}" id="${name}_n" aria-live="polite">${intCount((sel||[]).length)}</p>`
  +INT_GROUPS.map(([g,l])=>`<h4 class="igrp">${g}</h4>${opts(name,l.map(x=>x[0]),sel)}`).join('');
const TIMES=['Weekday evenings','Weekend days','Weekend evenings','Late nights'];
const CATS={
  fitness:{label:'Fitness and sport',icon:'dumbbell',fg:'#B45309',bg:'#FEF3C7',g:'radial-gradient(80% 60% at 70% 20%,rgba(251,191,36,.6),transparent 60%),linear-gradient(160deg,#92400e,#2a1606)'},
  movies:{label:'Movie',icon:'film',fg:'#7C3AED',bg:'#EDE9FE',g:'radial-gradient(120% 70% at 50% 115%,rgba(234,88,12,.55),transparent 60%),radial-gradient(60% 40% at 50% 35%,rgba(148,163,255,.22),transparent 70%),linear-gradient(180deg,#0f0d1a,#1c1530 60%,#120e0b)'},
  theatre:{label:'Theatre',icon:'drama',fg:'#9F1239',bg:'#FFE4E6',g:'radial-gradient(80% 60% at 70% 20%,rgba(251,113,133,.55),transparent 60%),linear-gradient(160deg,#4c0519,#1a0509)'},
  comedy:{label:'Stand-up comedy',icon:'mic',fg:'#C2410C',bg:'#FFEDD5',g:'radial-gradient(80% 60% at 70% 20%,rgba(253,186,116,.6),transparent 60%),linear-gradient(160deg,#7c2d12,#1c0a04)'},
  concerts:{label:'Concert',icon:'music',fg:'#DB2777',bg:'#FCE7F3',g:'radial-gradient(70% 55% at 30% 25%,rgba(244,114,182,.6),transparent 60%),radial-gradient(60% 50% at 80% 80%,rgba(250,204,21,.35),transparent 60%),linear-gradient(160deg,#4a0d2e,#1a0a1f)'},
  hangout:{label:'Hangout',icon:'users',fg:'#0E7490',bg:'#CFFAFE',g:'radial-gradient(80% 60% at 70% 20%,rgba(103,232,249,.5),transparent 60%),linear-gradient(160deg,#155e75,#06222b)'},
  cafe:{label:'Food',icon:'coffee',fg:'#15803D',bg:'#DCFCE7',g:'radial-gradient(80% 60% at 70% 20%,rgba(253,186,116,.85),transparent 60%),linear-gradient(160deg,#b45309,#7c2d12 55%,#2a1206)'},
  adventure:{label:'Adventure',icon:'mountain',fg:'#4D7C0F',bg:'#ECFCCB',g:'radial-gradient(80% 60% at 70% 20%,rgba(190,242,100,.45),transparent 60%),linear-gradient(160deg,#365314,#0f1a05)'},
  outdoor:{label:'Outdoor leisure',icon:'trees',fg:'#047857',bg:'#D1FAE5',g:'radial-gradient(80% 60% at 70% 20%,rgba(110,231,183,.5),transparent 60%),linear-gradient(160deg,#065f46,#03231a)'},
  errands:{label:'Chores and errands',icon:'shopping-bag',fg:'#475569',bg:'#E2E8F0',g:'radial-gradient(80% 60% at 70% 20%,rgba(203,213,225,.5),transparent 60%),linear-gradient(160deg,#334155,#0f172a)'},
  work:{label:'Work and study',icon:'book-open',fg:'#1D4ED8',bg:'#DBEAFE',g:'radial-gradient(80% 60% at 70% 20%,rgba(147,197,253,.5),transparent 60%),linear-gradient(160deg,#1e3a8a,#0b1330)'},
  selfcare:{label:'Self care',icon:'leaf',fg:'#0F766E',bg:'#CCFBF1',g:'radial-gradient(80% 60% at 70% 20%,rgba(153,246,228,.5),transparent 60%),linear-gradient(160deg,#115e59,#04201e)'},
  nightlife:{label:'Nightlife',icon:'moon',fg:'#6D28D9',bg:'#EDE9FE',g:'radial-gradient(80% 60% at 70% 20%,rgba(196,181,253,.45),transparent 60%),linear-gradient(160deg,#3b0764,#0d0418)'}
};
const COST={split:'Split equally',own:'Everyone pays their own way',host:'Host is covering everyone'};
const COST_S={split:'Equal Split',own:'Go Dutch',host:'Host Pays'};
/* Swipe shows plans starting in the next 7 days (today and the 6 days after). Discover shows every upcoming plan,
   Swipe's included. SWIPE_DAYS here and in app/src/lib/model.ts. */
const SWIPE_DAYS=7;
const dayStart=()=>{const d=new Date(now());d.setHours(0,0,0,0);return d};
const swipeEnd=()=>{const d=dayStart();d.setDate(d.getDate()+SWIPE_DAYS);return d.getTime()};
/* Upcoming plans can be saved for later: Discover's cards have the button, Swipe's cards have Share instead. */
const canSave=a=>a.when>now()&&a.status!=='past'&&a.host!=='me',isSaved=id=>S.saved.includes(id);
const saveBtn=(a,cls='svb')=>canSave(a)?`<button class="${cls}${isSaved(a.id)?' on':''}" data-a="save" data-id="${a.id}" aria-pressed="${isSaved(a.id)}" title="${isSaved(a.id)?'Saved':'Save for later'}" aria-label="${isSaved(a.id)?'Saved. Tap to remove':'Save for later'}">${I('bookmark',16)}</button>`:'';

/* ---------- plan photos ---------- */
/* Each category has a bank of freely licensed photos (img/plans/bank.json, from Wikimedia Commons: CC0, CC BY or CC BY-SA,
   no identifiable people). A plan gets the photo from its category's bank whose tags best match its description and venue,
   else the category's default photo. The host never uploads or picks it, and the activity view says it's illustrative and
   credits it (photoCredit). photoFor in app/src/lib/photos.ts does the same. */
/* PHOTO_BANK start: generated by tools/plan-photos.py from img/plans/bank.json */
const PHOTO_BANK=[["outdoorfilm",["movies","outdoor"],["outdoor movie","movie on the lawn","open air screening","drive in"],[],"Drive-in cinema","Michael Kilgore","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Skyline_Drive-In_Theater,_Barstow,_California_(47073564334).jpg"],["jazz",["concerts","nightlife"],["jazz","blues"],[],"Jazz club stage","Pelajanela","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:The_stage_of_Blues_Alley_%26_Jazz_in_Georgetown_(Washington,_D.C.).jpg"],["karaoke",["concerts","nightlife","comedy"],["karaoke","sing","singing","mic"],[],"Microphone","Derek Gavey from Medicine Hat, Canada","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Karaoke_Star!_(4917447111).jpg"],["sufi",["concerts"],["sufi","qawwali","ghazal"],[],"Harmonium","David Estes","CC BY-SA 3.0","https://creativecommons.org/licenses/by-sa/3.0","https://commons.wikimedia.org/wiki/File:Pakistani_Qawwali_Harmonium.jpg"],["classical",["concerts"],["carnatic","classical","sitar","recital","raga","veena"],[],"Sitar","The Metropolitan Museum of Art","CC0","https://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Sitar_MET_C10563_1994.63.jpg"],["dhol",["concerts","nightlife"],["dhol","bhangra","folk","garba"],[],"Dhol","Suyash Dwivedi","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Dhol_Rathaava_Community_Gujrat.jpg"],["openmic",["concerts","comedy"],["open mic","openmic","songwriting","poetry","standup","stand up","comedy","comic","jokes","roast","spoken word"],["comedy"],"Open mic","Carsten Stiller","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:2013-09-28_Jena_Waiting_2_(10001985445).jpg"],["club",["nightlife","concerts"],["techno","nightclub","dj","edm","rave","house music"],[],"DJ booth","Arnold Jaeger Werner","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:DJ_booth_with_DJ-Mixer,_two_turntables_and_two_CDJ-players_in_former_Bob_Beaman_nightclub_in_Munich.jpg"],["vinyl",["concerts","hangout","errands"],["vinyl","record store","records","thrift"],[],"Record store","Mr Cup / Fabien Barral iammrcup","CC0","https://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Vinyl_collection_at_a_record_store_(Unsplash).jpg"],["ramen",["cafe"],["ramen","noodles","japanese"],[],"Ramen","Shisma","CC BY 4.0","https://creativecommons.org/licenses/by/4.0","https://commons.wikimedia.org/wiki/File:Ramen_Bowl_2.jpg"],["momos",["cafe"],["momo","momos","dumpling"],[],"Momos","Andy Li","CC0","https://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Vegetable_Momos_-_Yak_Yeti_Yak_2025-07-23.jpg"],["parantha",["cafe"],["paratha","parantha","parathe"],[],"Aloo paratha","AjayDas","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Aloo_paratha_served_with_daal,_curd_and_achar.jpg"],["cholebhature",["cafe"],["chole","bhature","chhole"],[],"Chole bhature","Sutapa Pal","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Chole_Bhature-Noida-UP-SP002.jpg"],["dessert",["cafe"],["dessert","sweets","mithai","cake","ice cream"],[],"Indian sweets","Laura","CC BY-SA 2.0","https://creativecommons.org/licenses/by-sa/2.0","https://commons.wikimedia.org/wiki/File:Sweets_Mithai_for_Diwali_and_other_Festivals_of_India.jpg"],["cooking",["cafe","hangout"],["cook along","cooking","cook","potluck","dinner"],[],"Butter chicken","Amar Nath Adak","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:CreamyButterChicken.jpg"],["tea",["cafe","selfcare"],["tea tasting","tea room","tea flight","green tea"],[],"Tea tasting","Difference engine","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Two_small_tasting_cups_of_Lapsang_Souchong.jpg"],["boardgames",["hangout","cafe"],["board game","boardgame","pictionary","catan","ludo","chess","cards","games night"],[],"Board game","Tetzemann","CC0","https://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Brettspiel_Mensch_%C3%A4rger_dich_nicht.jpg"],["books",["hangout","work"],["book swap","book club","book exchange","books","novel"],[],"Book swap","Elitre","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Wikimania_2016_-_Book_swapping_05.jpg"],["dhaba",["cafe"],["maggi","dhaba","thali","rajma","lunch","biryani","street food","food walk","vada pav","pav bhaji","pizza"],[],"Dal and roti","Billjones94","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Roti,_tadka,_and_onion.jpg"],["coffee",["cafe","hangout","work"],["crossword","filter coffee","coffee","cafe","latte","cappuccino"],["cafe"],"Filter coffee","K.Sreeram 2603","CC0","https://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Memorable_Coffee.jpg"],["brunch",["cafe"],["brunch","pancake","pancakes","breakfast","waffles"],[],"Pancakes","Bernard DUPONT","CC BY-SA 2.0","https://creativecommons.org/licenses/by-sa/2.0","https://commons.wikimedia.org/wiki/File:Pancakes_for_Breakfast_-_Oxkutzkab_Yucatan.jpg"],["chai",["cafe","hangout"],["chai","samosa","pakora","snacks"],[],"Chai and samosa","Sarkar Sayantan","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Samosa_with_cutting_chai_-_1.jpg"],["picnic",["cafe","outdoor","hangout"],["picnic"],[],"Picnic","Personal Creations","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Wine_glasses_on_a_box_cutting_board_with_cheese_fruit_and_bread_chalkboard_and_personalized_pillows_on_a_picnic_blanket_(19924590745).jpg"],["liveband",["concerts","nightlife"],["band","gig","live music","acoustic","rock","indie","jam"],[],"Band gear on stage","Kuba Bożanowski from Warsaw, Poland","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Tonys_amp_(2941807248).jpg"],["concert",["concerts"],["concert","show","festival","tour"],["concerts"],"Concert stage","Kinglevel","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Meshuggah_Stage_Design_2022,_Ancienne_Belgique,_Belgium._06.jpg"],["classicfilm",["movies"],["classic","rerun","re run","re release","rerelease","90s","matinee","satyajit","retro"],[],"Classic cinema","Rob Chandler","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Piccadilly_Cinema_screen,_Perth.jpg"],["cinema",["movies"],["movie","film","cinema","pvr","inox","screening","premiere","imax"],["movies"],"Cinema hall","Mojmir Churavy","CC0","https://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Kino_Atlas_Interier_J.jpg"],["sukhna",["outdoor","fitness","hangout","adventure"],["sukhna"],[],"Sukhna Lake","Unpetitprole","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Sunrise_over_Sukhna.jpg"],["rockgarden",["outdoor","hangout"],["rock garden"],[],"Rock Garden","Anilsahu84","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Men_at_rock_garden_chandigarh.jpg"],["rosegarden",["outdoor","hangout","selfcare"],["rose garden"],[],"Zakir Hussain Rose Garden","Vengolis","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Zakir_Hussain_Rose_Garden_20180907_154724.jpg"],["plaza17",["hangout","cafe","outdoor","nightlife","errands"],["sector 17 plaza","sector 17 architecture","plaza fountain"],[],"Musical fountain, Sector 17","Rhythm Kataria","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Musical_Fountain,_Sector_17,_Chandigarh.jpg"],["capitol",["outdoor","hangout"],["capitol","le corbusier"],[],"Capitol Complex","Nicholas.iyadurai","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Chandigarh_Capitol_Complex_-_Le_Corbusier_-_Hall_of_Shadows_ramp.jpg"],["leisure",["outdoor","fitness","hangout"],["leisure valley"],[],"Leisure Valley","RIDH-1","CC0","https://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Leisurevalleymarch2026.jpg"],["museum",["hangout","outdoor","work"],["museum","art gallery","exhibition"],[],"Government Museum and Art Gallery","UnpetitproleX","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Chandigarh_Museum_and_Art_Gallery.jpg"],["pu",["work","hangout","fitness"],["panjab university"],[],"Gandhi Bhawan, Panjab University","UnpetitproleX","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Gandhi_Bhawan,_Chandigarh.jpg"],["elante",["errands","hangout","movies","cafe"],["elante"],[],"Elante Mall","Barthateslisa","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Elante_Mall,_Chandigarh.jpg"],["gym",["fitness","selfcare"],["gym","workout","weights","lifting","strength","dumbbell","training","crossfit"],["fitness"],"Dumbbells in a gym","Shixart1985","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Fitness_dumbbell_marked_with_a_green_logo_resting_on_a_gym_rack.jpg"],["badminton",["fitness"],["badminton","shuttle","racket","racquet"],[],"Badminton racket and shuttlecock","Vladimir Maftei, http://www.enciclopedie.info/","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Rachet%C4%83_de_badminton_%C5%9Fi_flutura%C5%9F.jpg"],["cricket",["fitness","outdoor"],["cricket","nets","wicket","match"],[],"Cricket pitch","Acabashi","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Church_Times_Cricket_Cup_final_2019,_Wicket_3.jpg"],["running",["fitness"],["run","running","jog","jogging","marathon","sprint","track","5k","10k"],[],"Running track","Petewarrior","CC BY 4.0","https://creativecommons.org/licenses/by/4.0","https://commons.wikimedia.org/wiki/File:Brillia_Running_Stadium_track.jpg"],["swim",["fitness","selfcare"],["swim","swimming","pool","laps"],[],"Swimming pool lanes","Xander from Yellowknife, NT, Canada","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Swimming_pool_with_lane_ropes_in_place_cropped.jpg"],["theatre",["theatre"],["play","drama","theatre","theater","musical","opera","natak"],["theatre"],"Theatre auditorium and curtain","OlenaMuzychenko (WMUA)","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:The_auditorium_of_the_Odessa_Opera_House_02.jpg"],["stage",["theatre"],["shakespeare","classic","rehearsal","workshop","acting","improv"],[],"Empty theatre stage","Didier Descouens","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Interior_of_Teatro_Olimpico_(Vicenza)_scena_.jpg"],["lounge",["hangout","cafe"],["hang","chill","chat","lounge","catch up","meet new people"],["hangout"],"Café lounge chairs","Andy Li","CC0","http://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Seats_in_Cafe_%26_Laundrette,_East_Reach,_Taunton_2025-07-26.jpg"],["terrace",["hangout","nightlife","cafe"],["rooftop","terrace","fairy lights","balcony"],[],"Terrace seating with lights","PattayaPatrol","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:DZ6_2632_A_cozy_outdoor_corner_at_night_a_wicker_chair_beside_a_small_table_potted_plants_a_glowing_candle_and_twinkling_string_lights_welcoming_passersby.jpg"],["trek",["adventure","outdoor"],["trek","trekking","hike","hiking","mountain","himalaya","trail","triund","kasauli"],["adventure"],"Himalayan valley trail","Жанна Сорокина","CC0","http://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:%D0%9D%D0%B5%D0%BF%D0%B0%D0%BB_%D0%93%D0%B8%D0%BC%D0%B0%D0%BB%D0%B0%D0%B8_(211503667).jpeg"],["climbing",["adventure","fitness"],["climb","climbing","bouldering","wall"],[],"Climbing wall","Ka23 13","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:ClimbingHolds_20211103_145113.jpg"],["camping",["adventure","outdoor"],["camp","camping","tent","overnight","bonfire","stargazing"],[],"Tents in a pine forest","Ditsakul","CC BY-SA 3.0","https://creativecommons.org/licenses/by-sa/3.0","https://commons.wikimedia.org/wiki/File:Camping_Tent_at_Doi_Angkhang_Mountain,_Chiangmai,_Thailand.jpg"],["rafting",["adventure"],["raft","rafting","kayak","river","rishikesh"],[],"River rafting","Sumita Roy Dutta","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:River_rafting_at_Rishikesh_Photographed_By_Sumita_Roy.jpg"],["parkwalk",["outdoor","hangout","fitness","cafe"],["park","walk","stroll","bench","evening walk","morning walk","sunrise walk","heritage walk","lake walk"],["outdoor"],"Park path and bench","Humoyun Mehridinov","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Tashkent_Botanical_Garden_trees_and_a_path_03.jpg"],["boating",["outdoor","hangout"],["boat","boating","lake","paddle","pedal"],[],"Swan pedal boats on a lake","Paul Harrop","CC BY-SA 2.0","https://creativecommons.org/licenses/by-sa/2.0","https://commons.wikimedia.org/wiki/File:Pedal_boats,_East_Park,_Hull_-_geograph.org.uk_-_5889388.jpg"],["fountain",["outdoor"],["fountain","garden","botanical","flowers"],[],"Garden fountain","Ruth Sharville","CC BY-SA 2.0","https://creativecommons.org/licenses/by-sa/2.0","https://commons.wikimedia.org/wiki/File:Fountain_at_path_junction,_Cambridge_University_Botanical_Garden_-_geograph.org.uk_-_6691018.jpg"],["market",["errands","cafe"],["market","sabzi","vegetables","veggies","groceries","mandi","bazaar"],["errands"],"Vegetable market","Timothy A. Gonsalves","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Onions_Veg_Stall_Ooty_Market_Nilgiris_Aug25_A7CR_07102.jpg"],["supermarket",["errands"],["supermarket","grocery","shopping","store","mall","dmart"],[],"Supermarket aisle","Wilfredor","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Aisle_in_L_Intermarche_supermarket_in_Quebec_City.jpg"],["laundry",["errands"],["laundry","laundromat","washing","clothes","dry clean"],[],"Laundromat","ArtOfHappiness","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Laundromat_Washing_Machines_%26_Laundry_Equipment.jpg"],["laptop",["work"],["work","laptop","cowork","coworking","coding","freelance","wfh","startup","hackathon"],["work"],"Laptop and coffee on a desk","Lauren Mancke","CC0","http://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Laptop_and_coffee_on_a_desk.jpg"],["library",["work"],["study","library","exam","reading","revision","upsc","notes","assignment"],[],"Library study tables","MB-one","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Reading_room,_Ground_floor,_VW_Library,_Berlin.jpg"],["bar",["nightlife"],["bar","lounge","club","clubbing","night out","party","dance","dancing"],["nightlife"],"Bar with neon lights","PattayaPatrol","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:DSC_7093_A_cozy_dimly_lit_cocktail_bar_with_purple_and_blue_mood_lighting_a_glassware-studded_ceiling_and_a_row_of_plush_bar_stools_lining_a_glossy_counter.jpg"],["cocktail",["nightlife"],["cocktail","cocktails","drinks","mixology","happy hour","wine"],[],"Cocktails","Shixart1985","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Refreshing_cocktail_served_in_a_glass_with_a_slice_of_citrus_and_ice_on_a_vibrant_bar_background.jpg"],["pub",["nightlife"],["pub","beer","brewery","brewpub","craft","pint","tap"],[],"Beer taps in a pub","JIP","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Beer_taps_at_restaurant_P%C3%B5rgu,_Tallinn.jpg"],["spa",["selfcare"],["spa","pamper","relax","facial","salon","self care","selfcare"],["selfcare"],"Towels and orchids","Tim Reckmann from Hamm, Deutschland","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Handt%C3%BCcher_im_Spa_(53404561087).jpg"],["yoga",["selfcare","fitness"],["yoga","stretch","stretching","pilates","mat"],[],"Rolled yoga mats","Sha89sha","CC0","http://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Cotton_Yoga_Mats.png"],["aroma",["selfcare"],["aroma","aromatherapy","oils","massage","wellness","meditation","meditate"],[],"Essential oils and flowers","Alek866215","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Aromatherapie.jpg"]].map(([k,cats,tags,def,title,by,lic,licUrl,src])=>({k,cats,tags,def,title,by,lic,licUrl,src}));
/* PHOTO_BANK end */
const photoWords=s=>' '+String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim()+' ';
function photoFor(a){
  const d=photoWords(a.desc),v=photoWords(a.venue),has=(t,w)=>t.includes(' '+w+' ')||t.includes(' '+w+'s ')||t.includes(' '+w+'es ');
  let best=null,bs=0;
  for(const p of PHOTO_BANK){
    if(!p.cats.includes(a.cat))continue;
    /* whole words or phrases, plurals too ("momo" matches "momos", but "bar" doesn't match "barbecue"). The description
       decides first; the venue's name (which often just says "café") only breaks ties, then the more specific match wins
       ("board games" over "coffee"). */
    let n=0,m=0,l=0;for(const g of new Set(p.tags.map(g=>photoWords(g).trim()))){const hd=has(d,g),hv=has(v,g);n+=hd;m+=hv;if(hd||hv)l+=g.length}
    const sc=n*1e6+m*1e3+l;if(sc>bs){bs=sc;best=p}
  }
  return best||PHOTO_BANK.find(p=>p.def.includes(a.cat))||PHOTO_BANK.find(p=>p.def.includes('cafe'));
}
function photoOf(a){return 'img/plans/'+photoFor(a).k+'.webp'}
const photoCredit=a=>{const p=photoFor(a);return `<p class="small mute" style="margin:6px 2px 0">${I('camera',12)} Illustrative photo, not the actual venue · <a href="${esc(p.src)}" target="_blank" rel="noopener" style="color:inherit">${esc(p.title)}</a> by ${esc(p.by)}, <a href="${esc(p.licUrl)}" target="_blank" rel="license noopener" style="color:inherit">${esc(p.lic)}</a></p>`};
/* The photo over the category's colours (shown while it loads), and the category icon only when there's no photo. */
const planBg=a=>{const c=CATS[a.cat]||CATS.cafe,p=photoOf(a);return p?`url('${p}') center/cover no-repeat,${c.g}`:c.g};
const planThumb=a=>`<div class="thumb" style="background:${planBg(a)}"></div>`;
/* The venue line under a plan's title, without the place's name when the title already says it: "Indie band live at
   Hard Rock Café" shows "St Marks Road", not "Hard Rock Café, St Marks Road". Whole words only, so "Bar, ..." stays
   under "Barbecue night". */
const wordsOf=s=>' '+String(s||'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ')+' ';
const placeLine=a=>{const [name,...rest]=(a.venue||'').split(/\s*,\s*/);
  return rest.length&&wordsOf(name).trim()&&wordsOf(a.desc).includes(wordsOf(name))?rest.join(', '):a.venue};
/* Dummy portraits for the demo; if one fails to load the initial shows instead. */
/* Everyone gets an emoji avatar; your own can be an uploaded photo instead. */
const defEmo=g=>g==='Woman'?'👩':g==='Man'?'👨':'🧑';
const EMOJIS=['👩🏻','👩🏽','👩🏿','👨🏻','👨🏽','👨🏿','🧑🏼','🧑🏾','👩🏽‍🦱','👨🏻‍🦱','👩🏾‍🦳','🧔🏽','👱🏻‍♀️','👳🏽‍♂️','🧕🏽','👩🏽‍💻','👨🏾‍💻','👩🏻‍🎨','👨🏽‍🍳','🧑🏽‍🎤','👩🏾‍🏫','👨🏻‍🎓','👩🏽‍🔬','🧑🏻‍🚀','😀','😎','🤓','🥳','🦊','🐼','🐯','🐨','🦉','🌻','🎧','🎬','☕','🎸'];
/* Other people, filled in from the database: name, gender, age, job, bio, emoji, verified, show-up record, past plans, likes. */
let USERS={};
const CHAT_REASONS=['Harassment or threats','Sexual or unwanted messages','Spam or scam','Hate speech','Copyright infringement','Something else'];
const MICRO={swipe:'Was swiping an easy way to find plans?',request:'How easy was it to ask to join?',post:'How easy was posting your plan?',rating:'Was rating the meetup quick enough?'};
/* The feedback sheet: the consent wording version (same as the landing page's form) and its five faces. */
const FEEDBACK_V='v1';
const FACES=[['😞','Bad'],['😕','Meh'],['😐','OK'],['🙂','Good'],['😍','Love it']];
const REPORT_REASONS=['Made me feel unsafe','Inappropriate messages or behaviour','Fake profile or scam',"Didn't show up",'Copyright infringement','Something else'];
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
let DUE=[],ME=null,MYPHONE='',AUTHU={},MODE={face:'simulated',kyc:'simulated'},VER={face:{fails:0,attempts:0,max:5,review:false},kyc:{fails:0,attempts:0,max:5,review:false}},skew=0,loaded=false,LOCKED=0,CITIES=[],VIEW={city:null,auto:false};
const isUuid=x=>typeof x==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x);
/* Your private settings, saved to your account. ACT_FLAGS remember which reminders an activity already gave you. */
const PRIV=['dismissed','following','alerts','muted','tips','asked','actf','seenPost','savedF','city','saved','taste'];
/* The consent version that includes the Terms and community guidelines (terms.html). The database says which one is
   current (app_state's terms_v), so the app only asks once the database can record the answer. */
let TERMS_V=null,GONE18=false;
const ACT_FLAGS=['arrive','arriveAt','arriveNag','reminded','remind24','checkin'];
const blank=()=>({me:null,acts:[],reqs:[],chats:{},notes:[],ratings:{},blocked:[],reported:{},dismissed:[],following:[],alerts:[],muted:{},tips:{},asked:{},actf:{},seenPost:0,city:null,saved:[]});
let S=blank();
const freshF=()=>({cat:'all',dfrom:'',dto:'',tod:'any',dist:0,sort:'for',view:'list'});
const SORTS={for:['sparkles','My interests','Plans that match what you like come first'],soon:['clock','Time','Soonest first'],near:['map-pin','Distance','Closest to you first']};
const DISTS=[2,5,10,25];
const freshUi=()=>({tab:'swipe',modal:null,f:freshF(),auth:{mode:'in'}});
let ui=freshUi();
const sid=id=>id==='me'?ME:id;   // back to a database id

/* Turn the database's answer into the shapes the screens use. */
function applyState(st){
  ME=st.me;MODE=st.mode||MODE;VER=st.verify||VER;skew=(st.now||Date.now())-Date.now();
  LOCKED=st.locked||0;TERMS_V=st.terms_v||null;DUE=Array.isArray(st.due)?st.due:[];
  CITIES=Array.isArray(st.cities)?st.cities:[];VIEW={city:st.city||null,auto:!!st.city_auto};
  const mid=id=>id===ME?'me':id,p=st.profile,first=!loaded,known=new Set(S.notes.map(n=>n.id));
  const keepLocal=dirty?Object.fromEntries(PRIV.map(k=>[k,S[k]])):null,keepTrusted=dirty?S.me?.trusted:undefined;
  loaded=true;
  if(!p){S=blank();USERS={};return}
  const priv=p.state||{};
  USERS={};let mine={};
  (st.people||[]).forEach(x=>{
    const u={name:x.name,gender:x.gender,age:x.age,job:x.job||'',bio:x.bio||'',emo:x.emo||defEmo(x.gender),photo:avatarUrl(x.photo),photo2:avatarUrl(x.photo2),verified:!!x.face,trust:[x.met||0,x.shows||0,x.noshows??Math.max(0,(x.met||0)-(x.shows||0))],hist:x.hist||[],ints:x.ints||[],avail:x.avail||[],sample:!!x.sample};
    if(x.id===ME)mine=u;else USERS[x.id]=u;
  });
  S=blank();
  PRIV.forEach(k=>{if(priv[k]!=null)S[k]=priv[k]});
  if(keepLocal)Object.assign(S,keepLocal);   // settings you changed a moment ago and are still being saved
  S.following=(Array.isArray(S.following)?S.following:[]).filter(isUuid);S.dismissed=(Array.isArray(S.dismissed)?S.dismissed:[]).filter(isUuid);S.saved=(Array.isArray(S.saved)?S.saved:[]).filter(isUuid).slice(-100);
  if(typeof S.city!=='string'||S.city.length>8)S.city=null;
  ['muted','tips','asked','actf','taste'].forEach(k=>{if(!S[k]||typeof S[k]!=='object'||Array.isArray(S[k]))S[k]={}});if(typeof S.seenPost!=='number')S.seenPost=0;
  S.savedF=(Array.isArray(S.savedF)?S.savedF:[]).filter(x=>x&&/^sf[0-9a-z]+$/.test(x.id)&&typeof x.label==='string'&&x.f&&typeof x.f==='object').slice(0,10);
  S.alerts=(Array.isArray(S.alerts)?S.alerts:[]).filter(x=>x&&/^al[0-9a-z]+$/.test(x.id)&&typeof x.label==='string');
  S.me={name:p.name,last:p.last_name||'',dob:p.dob,gender:p.gender,hood:p.hood,ll:p.lat!=null?[p.lat,p.lng]:null,job:p.job||'',bio:p.bio||'',ints:p.ints||[],avail:p.avail||[],emo:p.emo||defEmo(p.gender),
    usageOk:!!p.usage_ok,face:!!p.face,kyc:!!p.kyc,obDone:!!p.onboarded,terms:!TERMS_V||p.consent_version===TERMS_V,trusted:keepTrusted!==undefined?keepTrusted:(priv.trusted||null),trustv:mine.trust||[0,0],hist:mine.hist||[],photoPath:AVATAR_RE.test(p.photo||'')?p.photo:'',photo:avatarUrl(p.photo),photo2Path:AVATAR_RE.test(p.photo2||'')?p.photo2:'',photo2:avatarUrl(p.photo2)};
  if(first)dropOldPhoto();
  const t=now();
  S.acts=(st.acts||[]).map(a=>{
    const mem=(a.members||[]).map(mid);
    return {id:a.id,host:mid(a.host),cat:a.cat,desc:a.desc,cap:a.cap,when:a.when,aud:a.aud&&a.aud.length?a.aud:'everyone',venue:a.venue,cost:a.cost,
      ...(a.total?{total:a.total}:{}),...(a.repeat?{repeat:a.repeat}:{}),...(a.lat!=null?{ll:[a.lat,a.lng]}:{}),hood:a.hood,status:a.when<=t?'past':a.status,created:a.created,
      members:mem.length===a.mcount?mem:Array.from({length:a.mcount},()=>'?'),dur:a.dur||2,relist:a.relist||0,attDone:!!a.att_done,
      myAtt:a.my_att||null,myReply:!!a.my_reply,...flagsOf(a.id)};
  });
  /* your home area and your own venues are known places, so the profile and edit forms accept them as they are */
  if(S.me.ll)PLACE_AT[S.me.hood.toLowerCase()]=S.me.ll;
  S.acts.forEach(a=>{if(a.host==='me'&&a.ll)PLACE_AT[a.venue.toLowerCase()]=a.ll});
  const pastIds=new Set(S.acts.filter(a=>a.status==='past').map(a=>a.id));
  /* A rejection is silent (the 7 Nov spec): your own rejected requests show as Closed, the same as requests closed
     when a plan filled up. Old waitlist entries are closed too. */
  S.reqs=(st.reqs||[]).sort((x,y)=>x.at-y.at).map(r=>({id:r.id,act:r.act,user:mid(r.user),note:r.note||'',
    status:pastIds.has(r.act)&&r.status==='pending'?'no_action':r.status==='waitlist'||(r.status==='rejected'&&r.user===ME)?'closed':r.status}));
  (st.reported||[]).forEach(m=>{S.reported[m]=true});
  (st.msgs||[]).forEach(m=>{(S.chats[m.act]=S.chats[m.act]||[]).push({id:m.id,from:m.sys?'sys':m.from?mid(m.from):'?',text:m.text,at:m.at,reported:!!S.reported[m.id],
    ...(m.poll?{poll:{q:m.poll.q,opts:m.poll.opts.map((o,j)=>({t:o,v:(m.votes||[]).filter(v=>v.o===j).map(v=>mid(v.u))}))}}:{})})});
  S.notes=(st.notes||[]).map(n=>({id:n.id,at:n.at,kind:n.kind,title:n.title,tag:n.tag,tone:n.tone,act:n.act,text:n.text,read:n.read,key:n.key||'',
    check:n.flags.includes('check'),safe:n.flags.includes('safe'),chat:n.flags.includes('chat')}));
  (st.ratings||[]).forEach(r=>{S.ratings[r.act]={at:r.at,ok:r.ok,stars:r.stars,people:Object.fromEntries(Object.entries(r.people||{}).map(([k,v])=>[mid(k),v]))}});
  S.blocked=(st.blocked||[]).map(mid);
  if(!first){const fresh=S.notes.filter(n=>!n.read&&!known.has(n.id));if(fresh.length)toast(fresh[0].title+' · '+fresh[0].text)}
  checkNewPlans();countOpen();
  try{localStorage.setItem('overhere_participant',JSON.stringify({id:ME,name:S.me.name}))}catch(e){}
}
/* Reminder flags saved for one activity: only the known keys, with plain values. */
function flagsOf(id){const f=S.actf&&S.actf[id],o={};if(f&&typeof f==='object')ACT_FLAGS.forEach(k=>{const v=f[k];if(typeof v==='boolean'||typeof v==='number'||v==='asked'||v==='ok')o[k]=v});return o}
/* Profile photos are kept in Supabase Storage (bucket "avatars", readable by link), up to two files per person at
   <user id>/<16 random characters>.jpg, so everyone sees them: the profile picture and a second photo. The face
   check needs both and compares the live face with each.
   Photos used to stay in this browser only (overhere_photo:<id>): those copies are cleared, not uploaded. */
const AVATAR_URL=SB_URL?SB_URL+'/storage/v1/object/public/avatars/':'';
const AVATAR_RE=/^[0-9a-f-]{36}\/[0-9a-z]{16}\.jpg$/;
const avatarUrl=p=>AVATAR_URL&&AVATAR_RE.test(p||'')?AVATAR_URL+p:'';
const dropOldPhoto=()=>{try{localStorage.removeItem('overhere_photo:'+ME)}catch(e){}};
/* Set (or clear, with null) photo 1 or 2 on the server, then delete the files it replaces. Clearing photo 1 clears
   both. Any change clears a passed face check, because that check matched the old photos (set_photo in schema-app.sql). */
async function setPhoto(path,slot=1){
  const r=await run('set_photo',{p_path:path,p_slot:slot});if(r===undefined)return false;
  const gone=[r?.old,r?.old2].filter(x=>x&&x!==path);
  if(gone.length)SB.storage.from('avatars').remove(gone).catch(()=>{});
  if(slot===2){S.me.photo2Path=path||'';S.me.photo2=avatarUrl(path)}
  else{S.me.photoPath=path||'';S.me.photo=avatarUrl(path);if(!path){S.me.photo2Path='';S.me.photo2=''}}
  if(r?.face_reset){S.me.face=false;toast('Photo changed. Please do the face check again, so it matches your new photo.')}
  return true;
}
const twoPhotos=()=>!!(S.me?.photo&&S.me?.photo2);
/* The two photo slots, with what makes a photo pass. Tapping a slot picks a photo for it (photo 2 only after photo 1). */
function photoPair(){
  const slot=n=>{const ph=n===1?S.me.photo:S.me.photo2,off=n===2&&!S.me.photo;
    return `<button class="pslot${ph?' on':''}" data-a="pickphoto" data-k="${n}" ${off?'disabled':''} aria-label="${ph?'Change':'Add'} photo ${n}">${ph?`<img src="${esc(ph)}" alt="">`:I('camera',26)}<span>${ph?'Change':n===1?'Add photo 1':'Add photo 2'}</span></button>`};
  return `<div class="ppair">${slot(1)}${slot(2)}</div>
  <ul class="ptips"><li>${I('scan-face',15)}<span><b>Your face must be clearly visible:</b> just you, facing the camera, nothing covering it</span></li><li>${I('sun',15)}Good light. No filters, sunglasses, masks or mirror selfies</li><li>${I('layers',15)}Two different, recent photos, like one close-up and one from another day</li></ul>`;
}

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
/* A group chat is read-only from 3 hours after its plan starts (_chat_closed in schema-app.sql decides). */
/* A plan ends its duration after it starts (the host picks 1 to 24 hours); the chat closes CHAT_OPEN_H after that. */
const durTxt=h=>h+' hour'+(h===1?'':'s'),endOf=a=>a.when+(a.dur||2)*3600e3,hasEnded=a=>endOf(a)<=now();
const CHAT_OPEN_H=3,chatClosed=a=>endOf(a)+CHAT_OPEN_H*3600e3<now();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uname=id=>id==='me'?'You':(USERS[id]?.name||'Someone');
/* Host name + age; opens their profile unless it's you. */
const hostName=id=>{const p=profileOf(id),t=`<span><span class="hname">${esc(id==='me'?'You':p.name)}</span>${id==='me'?'':', '+p.age}</span>`;
  return id==='me'?t:`<button class="hlink" data-a="user" data-id="${id}" title="View ${esc(p.name)}'s profile">${t}</button>`};
const short=s=>s.length>40?s.slice(0,40)+'…':s;
/* Times and dates typed into a poll ("8am", "20:30", "5 nov", "5/11") written the way the app shows them ("8:00 AM",
   "Thu, 5 Nov"). Anything else is left as typed. The same as tidyWhen in app/src/lib/when.ts: dates and times are each
   found in one pass, so nothing already rewritten is read again, and a weekday before a date is replaced by the right one. */
const MONTHS=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const WHEN_DATE=(()=>{const mon='(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?',ord='(?:st|nd|rd|th)?',wd='(?:\\b(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\\.?,?\\s+)?';
  return new RegExp(`${wd}\\b(\\d{1,2})${ord}\\s+(${mon})(?:,?\\s+(\\d{4}))?\\b|${wd}\\b(${mon})\\s+(\\d{1,2})${ord}\\b(?:,?\\s+(\\d{4}))?|${wd}\\b(\\d{1,2})[/-](\\d{1,2})(?:[/-](\\d{4}|\\d{2}))?\\b`,'gi')})();
const WHEN_TIME=/\b(\d{1,2})(?:[:.](\d{2}))?\s*([ap])\.?m\b\.?|\b([01]?\d|2[0-3]):([0-5]\d)\b/gi;
function tidyWhen(s){
  const n=new Date(now()),tm=(h,m)=>new Date(2000,0,1,h,m).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}),mi=m=>MONTHS.indexOf(m.slice(0,3).toLowerCase());
  /* a day without a year is the next one from today */
  const dt=(day,mo,year)=>{let y=year??n.getFullYear();if(y<100)y+=2000;let d=new Date(y,mo,day);if(mo<0||d.getMonth()!==mo||d.getDate()!==day)return null;
    if(year==null&&d<new Date(n.getFullYear(),n.getMonth(),n.getDate()))d=new Date(y+1,mo,day);
    return d.toLocaleDateString([], {weekday:'short',day:'numeric',month:'short',...(d.getFullYear()!==n.getFullYear()?{year:'numeric'}:{})})};
  return s.replace(WHEN_DATE,(all,d1,m1,y1,m2,d2,y2,d3,m3,y3)=>(d1?dt(+d1,mi(m1),y1?+y1:null):m2?dt(+d2,mi(m2),y2?+y2:null):dt(+d3,+m3-1,y3?+y3:null))??all)
    .replace(WHEN_TIME,(all,h,m,ap,h24,m24)=>{if(h24!==undefined)return tm(+h24,+m24);h=+h;m=+(m||0);return h<1||h>12||m>59?all:tm(h%12+(ap.toLowerCase()==='p'?12:0),m)});
}
const fmt=t=>new Date(t).toLocaleString([], {weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
/* [day, time], e.g. ['Tomorrow','4:30 pm'] */
function whenParts(t){
  const d=new Date(t),n=new Date(now()),day=x=>new Date(x.getFullYear(),x.getMonth(),x.getDate()).getTime();
  const diff=Math.round((day(d)-day(n))/864e5),tm=d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  return [diff===0?'Today':diff===1?'Tomorrow':d.toLocaleDateString([], {weekday:'short',day:'numeric',month:'short'}),tm];
}
function whenStr(t){const [d,tm]=whenParts(t);return d==='Today'||d==='Tomorrow'?d+' '+tm:d+' · '+tm}
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
/* What's left to do after a plan, if anything: 'host' (rate it and record attendance), 'member' (the host marked you
   as there: rate the plan and the host) or 'noshow' (marked as not there: say what happened). */
function needRate(a){
  if(!a)return null;
  if(a.host==='me')return a.members.length&&hasEnded(a)&&!a.attDone?'host':null;
  if(a.myAtt==='show'&&!S.ratings[a.id])return 'member';
  if(a.myAtt==='noshow'&&!a.myReply)return 'noshow';
  return null;
}
/* Reasons for leaving a plan and for removing someone (the 7 Nov spec). "Other" asks for the person's own words. */
const OPT_OUT=['Plans changed',"Running late and can't make it",'Travel or transport problem','Work or study commitment','Personal or family reason',
  'Cost is more than expected',"The plan isn't what I expected",'Feel uncomfortable with the group','Feel unsafe','Other'];
/* Words a plan's description can't contain. The database decides (blocked_terms and _bad_word in schema-app.sql, where
   the team can add more); this copy of the starting list warns while you type. Same list and matching in
   app/src/lib/words.ts. A trailing * also matches longer words. Matching ignores case, look-alike characters, letters
   stretched out or spaced out, and only matches whole words (so "Sussex" and "cocktail" are fine). */
const BAD_TERMS=['fuck*','motherfuck*','fck','fuk','shit','shitty','bullshit','bitch*','bastard*','asshole*','ass','arse','dick','dickhead*','cock','cunt*','pussy','wank*','slut*','whore*','boobs','tits','titties','cum','sex','sexy','horny','nudes','porn*','xxx','nsfw','onlyfans','sexting','rape','rapist','escort','escorts','hooker','hookers','prostitute*','nigger*','nigga','niggas','faggot*','retard','retarded','kys','hookup','hookups','fwb','cocaine','heroin','mdma','lsd','meth','ganja','charas','chutiya','chutiye','chutia','chut','bhenchod','behenchod','bhanchod','benchod','madarchod','maderchod','madarjaat','bsdk','bhosdi*','bhosda','gandu','gaand','lund','lauda','lavda','loda','lodu','jhatu','jhaant','chodu','randi','randwa','harami','haramkhor','kutiya','escort service','call girl','call girls','hook up','one night stand','friends with benefits','no strings attached','sugar daddy','sugar baby','sugar mommy','casual sex','looking for girlfriend','looking for a girlfriend','looking for boyfriend','looking for a boyfriend','body massage','kill yourself','ecstasy pills'];
const LOOK={'@':'a','4':'a','0':'o','1':'i','3':'e','5':'s','$':'s','7':'t','!':'i','|':'l'};
const normWords=t=>' '+String(t||'').toLowerCase().replace(/[@40135$7!|]/g,c=>LOOK[c]).replace(/[^a-z]+/g,' ').replace(/([a-z])\1{2,}/g,'$1')
  .replace(/\b([a-z]) (?=[a-z]\b)/g,'$1').trim()+' ';
function badWord(t){
  const n=normWords(t);
  for(const term of BAD_TERMS){const w=normWords(term.replace(/\*$/,'')).trim();if(w&&n.includes(term.endsWith('*')?' '+w:' '+w+' '))return w}
  return '';
}
function descWarn(){const w=badWord(val('f_desc'));fieldMsg('f_desc',w?`"${w}" isn't allowed in a plan. Please reword it so it's friendly for everyone.`:'')}
const RM_REASONS=['They asked to be removed','Harassment or unwelcome messages','Unsafe or inappropriate conduct','Repeatedly late','Spam or promotion','Other'];
const reasonList=(k,list)=>list.map(r=>`<label class="chk"><input type="radio" name="${k}_r" value="${esc(r)}"> ${esc(r)}</label>`).join('')
  +`<input id="${k}_other" maxlength="150" placeholder="If Other: say why in your own words" aria-label="Other reason" style="margin-top:6px">`;
function pickedReason(k){
  const r=document.querySelector(`input[name=${k}_r]:checked`)?.value;if(!r){toast('Pick a reason');return ''}
  if(r!=='Other')return r;
  const t=val(k+'_other');if(!t){toast('Say why in your own words');document.getElementById(k+'_other')?.focus();return ''}
  return t;
}
/* The host's form after a plan: was it OK, a rating, and everyone marked as there or a no-show. */
function attendForm(a){
  const prev=S.ratings[a.id];
  return `<div class="sum">${planThumb(a)}<div style="min-width:0"><div class="t">${esc(a.desc)}</div><div class="meta2"><span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(placeLine(a))}</span></div></div></div>
    <label>Did everything go OK?</label><div class="opts"><label class="opt"><input type="radio" name="rt_ok" value="yes" ${prev?.ok!=='no'?'checked':''}>Yes, all good</label><label class="opt"><input type="radio" name="rt_ok" value="no" ${prev?.ok==='no'?'checked':''}>Something went wrong</label></div>
    <div class="wrongbox" id="rt_wrong"${prev?.ok==='no'?'':' hidden'}><b>Are you still in a bad situation?</b><button class="btn bad" data-a="sos" data-id="${a.id}">${I('alert-triangle',16)} Yes, I need help now</button>
      <p class="small" style="margin:10px 0 6px">It already happened? Tap a name below to report someone, or email us. A person on our team reads every report.</p></div>
    <label>How did the plan go overall?</label><div class="rstars" role="radiogroup" aria-label="How the plan went">${[5,4,3,2,1].map(n=>`<label title="${n} star${n>1?'s':''}"><input type="radio" name="at_star" value="${n}" aria-label="${n} star${n>1?'s':''}" ${prev?.stars===n?'checked':''}><span>★</span></label>`).join('')}</div>
    <label>Who came?</label>
    ${a.members.filter(u=>u!=='?').map(u=>{const v=prev?.people?.[sid(u)];return `<div class="rp">${av(u,'sm')}<button class="hlink" data-a="user" data-id="${u}">${esc(uname(u))}</button><span class="rpo"><label class="opt"><input type="radio" name="at_${u}" value="show" ${v==='show'?'checked':''}>Showed up</label><label class="opt"><input type="radio" name="at_${u}" value="noshow" ${v==='noshow'?'checked':''}>No-show</label></span></div>`}).join('')}
    <p class="small mute">This updates each person's reliability record. People you mark as a no-show are asked what happened, and can tell us if it's wrong.</p>
    <div style="height:6px"></div><button class="btn" data-a="doattend" data-id="${a.id}">Save</button>`;
}
/* the trusted contact has to be someone else, not the number this account signed in with */
const ownPhone=p=>!!MYPHONE&&p.replace(/\D/g,'').slice(-10)===MYPHONE;
const audOK=a=>a.aud==='everyone'||a.aud.includes(S.me.gender);
const isBlocked=id=>S.blocked.includes(id);
/* Badges tell other people something, so they only show once the face check is real (not simulated). */
const isVer=id=>MODE.face==='live'&&(id==='me'?!!S.me.face:!!USERS[id]?.verified);
/* Sample hosts keep the app from looking empty; they are always labelled so nobody mistakes them for real people. */
const sampleTag=id=>USERS[id]?.sample?'<span class="smp" title="A sample host that shows how Overhere works. Nobody will actually be there.">Sample</span>':'';
const vf=(id,long)=>isVer(id)?`<span class="vf">${long?I('badge-check',14)+' Verified':'✓'}</span>`:'';
/* There's no waitlist any more (the 7 Nov spec): a full plan leaves discovery and its waiting requests close. */
const waitlist=()=>[];
const isPast=a=>a.status==='past'||a.when<=now();
const attended=a=>a.host==='me'||a.members.includes('me');
const actLink=a=>location.href.split('#')[0].split('?')[0]+'#act='+a.id;
/* Reliability, counted by the database: meetups (plans that have ended), and how often the host marked them there
   or a no-show. No formula: hosts see the counts. rate is only for the warning chip, from the marked ones. */
function trust(id){
  const [met,shows,noshows]=(id==='me'?S.me.trustv:USERS[id]?.trust)||[0,0,0];
  const marked=shows+(noshows||0);
  return {met,shows,noshows:noshows||0,rate:marked?Math.round(shows/marked*100):null};
}
const trustTxt=id=>{const t=trust(id);return t.met?`${t.met} meetup${t.met===1?'':'s'} · Showed up ${t.shows} · No-show ${t.noshows}`:'New to meetups'};
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
    const nr=a&&needRate(a),rate=nr?`<button class="btn xs" data-a="rate" data-id="${a.id}">${nr==='noshow'?'Reply':'Rate'}</button>`:'';
    return `<div class="pi"><div class="pth" style="background:${planBg(a||{id:x.t,cat:x.cat,venue:'',desc:x.t})}"></div><div class="pm"><div class="t">${esc(x.t)}</div><div class="small mute">${esc(x.role)} · ${ago(x.at)}</div></div>${rate}</div>`}).join('')}</div>`;
}
/* ---- recommendations, distance, cost, host signals ---- */
function slotOf(t){const d=new Date(t),h=d.getHours(),we=d.getDay()===0||d.getDay()===6;if(h>=23||h<5)return 'Late nights';if(we)return h<17?'Weekend days':'Weekend evenings';return h>=17?'Weekday evenings':null}
function reasons(a){
  const r=[],s=slotOf(a.when);
  if(S.following.includes(a.host))r.push(['You follow '+uname(a.host),3]);
  const li=(S.me.ints||[]).find(i=>INT_CAT[i]===a.cat);if(li)r.push(['You like '+li,2]);
  if(s&&(S.me.avail||[]).includes(s))r.push(['Fits your '+s.toLowerCase(),1]);
  return r;
}
/* taste: per category, +1 for a right swipe or a request, +0.5 for a save, -0.5 for a skip; kept between -3 and 6 and
   stored with your private settings (profiles.state), so it follows you to the app. Worth half a point each. */
const tasteOf=c=>Math.max(-3,Math.min(6,+(S.taste?.[c])||0));
function learn(c,d){if(!CATS[c])return;S.taste=S.taste&&typeof S.taste==='object'?S.taste:{};S.taste[c]=Math.max(-3,Math.min(6,tasteOf(c)+d));save()}
const score=a=>reasons(a).reduce((n,x)=>n+x[1],0)+tasteOf(a.cat)*0.5;
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
/* Your home area: anywhere in India, saved with its centre. Profiles from the Chandigarh-only beta may lack the centre. */
const homeLL=()=>S.me?.ll||hoodLL(S.me?.hood);
const homeName=()=>(S.me?.hood||'').split(',')[0];
const NEAR_KM=50;   // the server sends plans within this distance of your home area (_near in schema-app.sql)
const nearChd=()=>kmBetween(homeLL(),SECTOR_LL[17])<40;
/* Cities with sample plans (CITIES, from app_state: [key, name, lat, lng]). Besides plans near your home area you see
   one city's: the one you picked, or the nearest one when none is near home (VIEW.auto). */
const viewCity=()=>VIEW.city&&CITIES.find(c=>c[0]===VIEW.city);
const viewLL=()=>{const c=viewCity();return c?[c[2],c[3]]:homeLL()};
const viewName=()=>viewCity()?.[1]||homeName();
const whereTxt=()=>!viewCity()?`within ${NEAR_KM} km of ${homeName()}`:VIEW.auto?`in ${viewName()} and near ${homeName()}`:`in ${viewName()}`;
/* A city you picked shows only that city; the automatic one comes with whatever is posted near home. */
const inView=a=>!viewCity()||VIEW.auto||kmBetween(viewLL(),geo(a))<=NEAR_KM;
/* A Chandigarh venue's spot, for plans posted before venues had coordinates: a landmark it names, else the sector it
   names, else the area it names. */
const spotOf=t=>{t=(t||'').toLowerCase();const p=PLACE_LL.find(([re])=>re.test(t));if(p)return p[1];
  const s=/sector[\s-]*(\d{1,2})\b/.exec(t);if(s&&SECTOR_LL[+s[1]])return SECTOR_LL[+s[1]];
  const l=Object.keys(LOCALITY_LL).find(n=>t.includes(n.toLowerCase()));return l&&LOCALITY_LL[l]};
function geo(a){
  const exact=a.ll||PLACE_AT[(a.venue||'').trim().toLowerCase()],base=exact||spotOf(a.venue)||spotOf(a.desc)||hoodLL(a.hood);
  /* plans at the same spot are spread out a little (up to about 270 m, or 45 m at a known place) so their pins don't hide each other */
  let h=2166136261;for(const c of a.id){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}h>>>=0;
  const ang=(h%360)*Math.PI/180,r=(0.25+((h>>>9)%75)/100)*(exact?0.0004:0.0025);
  return [base[0]+r*Math.sin(ang),base[1]+r*Math.cos(ang)];
}
function kmBetween([a1,o1],[a2,o2]){const r=Math.PI/180,x=Math.sin((a2-a1)*r/2)**2+Math.cos(a1*r)*Math.cos(a2*r)*Math.sin((o2-o1)*r/2)**2;return 12742*Math.asin(Math.sqrt(x))}
/* distance from the centre of your home area (your live location is only read when you tap "Use my current location") */
const kmAway=a=>{const g=geo(a),h=kmBetween(homeLL(),g);return h<=NEAR_KM||!viewCity()?h:kmBetween(viewLL(),g)};   // from the city you browse, for its plans
const distKm=a=>kmAway(a).toFixed(1);

/* ---------- place search: venues, their areas, and your home area ---------- */
/* Two sources. places.json: Chandigarh's named meetup places from OpenStreetMap (tools/update-places.py rebuilds it),
   searched in the browser. And Photon (CFG.GEO_URL), a search over OpenStreetMap for all of India: what you type is
   sent there a moment after you stop typing. PLACE_AT remembers the spot of every name offered, so a form knows where
   a typed name is once it matches one. */
let PLACES=null,placesP=null,PLACE_AT={},vPick=-1;
Object.entries(SECTOR_LL).forEach(([n,ll])=>{PLACE_AT[`sector ${n}, chandigarh`]=ll});
Object.entries(LOCALITY_LL).forEach(([n,ll])=>{PLACE_AT[n.toLowerCase()+', chandigarh']=ll});
const GEO_URL=(CFG.GEO_URL||'https://photon.komoot.io').replace(/\/+$/,'');
const inIndia=([la,lo])=>la>=6&&la<=37.5&&lo>=68&&lo<=97.5;   // the same bounds the database checks
const normTxt=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
function loadPlaces(){
  return placesP||(placesP=fetch('places.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>{
    PLACES=d.places.map(([label,kind,lat,lon])=>({label,kind,ll:[lat,lon],key:' '+normTxt(label+' '+kind)}));
    PLACES.forEach(p=>{PLACE_AT[p.label.toLowerCase()]=p.ll});
    if(loaded)redraw();   // pins and distances for picked venues become exact
  }).catch(()=>{placesP=null}));
}
/* Chandigarh's list, for people based there: every word typed must start a word of the place's name, sector or kind
   ("cafe sector 17" works). Names that start with what was typed come first, then the nearest to your home area. */
function findPlaces(q){
  const whole=normTxt(q),w=whole.split(' ').filter(Boolean),home=homeLL();
  if(!w.length||!PLACES||!nearChd())return [];
  return PLACES.filter(p=>w.every(x=>p.key.includes(' '+x)))
    .map(p=>[normTxt(p.label).startsWith(whole)?0:1,kmBetween(home,p.ll),p]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).slice(0,6).map(x=>x[2]);
}
/* A Photon result as {label, kind, ll}. A venue reads "Name, Locality, City"; an area "Area, City". */
const kindOf=v=>(v||'place').replace(/_/g,' ').replace(/^./,c=>c.toUpperCase());
function geoItem(f,mode){
  const p=f.properties||{},[lo,la]=f.geometry?.coordinates||[],town=p.city||p.county,areaT=['locality','district','city','county','state'].includes(p.type);
  const parts=mode==='venue'?[p.name||p.street,p.locality||p.district||(p.name?p.street:''),town||p.state]
    :mode==='here'?[p.locality||p.district||(areaT?p.name:''),town,town?'':p.state]
    :[p.name,town,town?'':p.state];
  /* each comma-separated piece once, so a name that already ends in its city ("Sector 17, Chandigarh") doesn't repeat it */
  const seen=new Set(),label=parts.flatMap(x=>String(x||'').split(/\s*,\s*/)).filter(x=>x&&!seen.has(x.toLowerCase())&&seen.add(x.toLowerCase())).join(', ').slice(0,mode==='venue'?120:80);
  if(!label||la==null||!inIndia([la,lo]))return null;
  PLACE_AT[label.toLowerCase()]=[la,lo];
  return {label,ll:[la,lo],kind:p.osm_key==='boundary'?'Area':kindOf(p.osm_value),state:p.state||''};
}
function geoFetch(path,params,mode){
  const u=new URL(GEO_URL+path);Object.entries(params).forEach(([k,v])=>[].concat(v).forEach(x=>u.searchParams.append(k,x)));
  return fetch(u,{referrerPolicy:'no-referrer'}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()})
    .then(d=>(d.features||[]).filter(f=>f.properties?.countrycode==='IN').map(f=>geoItem(f,mode)).filter(Boolean));
}
/* Search results by query: a list once back, null while waiting, 'fail' when the search couldn't be reached. */
const GEO_HITS=new Map();let geoT=null;
const geoKey=(q,area)=>(area?'a|':'v|')+normTxt(q);
function geoSearch(q,area){
  const k=geoKey(q,area),h=S.me?homeLL():null;
  GEO_HITS.set(k,null);
  const par={q,limit:8,lang:'en',bbox:'68,6,97.5,37.5',...(h?{lat:h[0].toFixed(3),lon:h[1].toFixed(3)}:{}),...(area?{osm_tag:['place','boundary:administrative']}:{})};
  return geoFetch('/api/',par,area?'area':'venue').then(list=>{
    const seen=new Set();GEO_HITS.set(k,list.filter(p=>!seen.has(p.label)&&seen.add(p.label)));
  },()=>GEO_HITS.set(k,'fail'));
}
/* The search boxes: a plan's venue, the venue's area when it isn't listed, and your home area. */
const PF={f_venue:{area:false},f_area:{area:true},o_hood:{area:true},p_hood:{area:true}};
const placeBox=(id,ph,v,aria)=>`<div class="vbox"><input id="${id}" maxlength="${PF[id].area?80:120}" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}_l" placeholder="${ph}" value="${esc(v||'')}"><div id="${id}_l" class="vlist" role="listbox" aria-label="${aria}" hidden></div></div>`;
const locBtn=(id,t)=>`<button type="button" class="locbtn" data-a="myloc" data-f="${id}">${I('locate',15)}<span>${t}</span></button>`;
function placeList(id,show){
  const inp=document.getElementById(id),box=document.getElementById(id+'_l');if(!inp||!box)return;
  const area=PF[id].area,q=inp.value.trim();
  if(!show||q.length<2){box.hidden=true;box.innerHTML='';vPick=-1;inp.setAttribute('aria-expanded','false');inp.removeAttribute('aria-activedescendant');return}
  if(!area&&!PLACES)loadPlaces().then(()=>{if(document.activeElement===inp)placeList(id,true)});
  const k=geoKey(q,area),hits=GEO_HITS.get(k);
  if(hits===undefined){clearTimeout(geoT);geoT=setTimeout(()=>geoSearch(q,area).then(()=>{if(document.activeElement===inp&&inp.value.trim()===q)placeList(id,true)}),300)}
  const local=area?[]:findPlaces(q),seen=new Set(local.map(p=>p.label.toLowerCase()));
  const remote=Array.isArray(hits)?hits.filter(p=>!seen.has(p.label.toLowerCase())):[];
  const list=[...local,...remote].slice(0,8),waiting=hits===undefined||hits===null,home=S.me?homeLL():null;
  const sub=p=>area?esc(p.kind+(p.state?' · '+p.state:'')):esc(p.kind)+(home?` · ${kmBetween(home,p.ll).toFixed(1)} km from ${esc(homeName())}`:'');
  /* a venue's last option is the name as typed: used as it is if the map already knows it, otherwise you pick its area */
  const n=list.length,exact=list.some(p=>p.label.toLowerCase()===q.toLowerCase()),known=placeLL(q,id);
  const other=area||exact?'':known
    ?`<button type="button" class="vopt vother" role="option" id="${id}_o${n}" aria-selected="false" data-a="pickplace" data-f="${id}" data-v="${esc(q)}"><b>Use “${esc(q)}”</b><span>As typed. It shows on the map in that area.</span></button>`
    :`<button type="button" class="vopt vother" role="option" id="${id}_o${n}" aria-selected="false" data-a="venueother"><b>Not listed? Use “${esc(q)}”</b><span>Then pick its area, so it shows on the map</span></button>`;
  const note=waiting&&!n?'<div class="vnote">Searching…</div>'
    :hits==='fail'&&!n?`<div class="vnote">Couldn't search places right now. Check your connection${area?', or use your current location':''}.</div>`
    :!n&&area?'<div class="vnote">No places found. Try the city name, or use your current location.</div>':'';
  box.innerHTML=note+list.map((p,i)=>`<button type="button" class="vopt" role="option" id="${id}_o${i}" aria-selected="false" data-a="pickplace" data-f="${id}" data-v="${esc(p.label)}"><b>${esc(p.label)}</b><span>${sub(p)}</span></button>`).join('')+other
    +(remote.length?'<div class="vnote vsrc">Search by Photon · © OpenStreetMap</div>':'');
  vPick=-1;box.hidden=false;inp.setAttribute('aria-expanded','true');inp.removeAttribute('aria-activedescendant');
}
const closePlaceLists=except=>Object.keys(PF).forEach(id=>{if(id!==except)placeList(id,false)});
/* Where a name typed in a search box is: one that was offered or picked, else (for a venue in Chandigarh) a sector,
   landmark or area it names. Home areas must be picked, so "Sector 62" in Noida never lands in Chandigarh. */
const placeLL=(v,id)=>PLACE_AT[(v||'').trim().toLowerCase()]||(id==='f_venue'&&nearChd()&&spotOf(v))||null;
/* The area picker, shown after "Not listed?" (or when a venue can't be placed on the map). */
const areaPicker=()=>`<div class="varea"><label for="f_area">Which area is it in?</label>${placeBox('f_area','Search the area or city, e.g. Indiranagar, Bengaluru','','Areas in India')}
  ${locBtn('f_area',"I'm there now: use my location")}
  <p class="small mute" style="margin-top:6px">The pin goes in the middle of that area, so people can see roughly where it is.</p></div>`;
function askArea(){if(ui.modal?.type!=='post')return;ui.modal.other=true;closePlaceLists();redraw();document.getElementById('f_area')?.focus()}
/* An area picked for an unlisted venue: the venue becomes "Name, Area, City" and is pinned in that area. */
function areaPicked(area){
  const i=document.getElementById('f_venue'),ll=PLACE_AT[area.toLowerCase()],m=ui.modal;if(!i||!ll||!m)return;
  const nm=(m.tail&&i.value.endsWith(m.tail)?i.value.slice(0,-m.tail.length):i.value).trim();
  m.tail=', '+area;i.value=((nm?nm+m.tail:area)).slice(0,120);PLACE_AT[i.value.toLowerCase()]=ll;
}
/* Your current position, once you allow it. Only asked when you tap "Use my current location". */
const myPosition=()=>new Promise((ok,no)=>navigator.geolocation
  ?navigator.geolocation.getCurrentPosition(p=>ok([p.coords.latitude,p.coords.longitude]),no,{enableHighAccuracy:true,timeout:15000,maximumAge:120000})
  :no({code:0}));
/* Arrow keys move through the suggestions, Enter picks one, Escape closes them (and not the whole form). */
function placeKey(e){
  const id=e.target.id,box=document.getElementById(id+'_l'),opts=box&&!box.hidden?[...box.querySelectorAll('.vopt')]:[];
  if(!opts.length||!['ArrowDown','ArrowUp','Enter','Escape'].includes(e.key))return false;
  e.preventDefault();
  if(e.key==='Escape'){placeList(id,false);return true}
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
/* the second line under COST_S in the plan's detail tiles */
function costSub(a){
  const t=a.total,each=t?Math.ceil(t/(a.cap+1)/10)*10:0;
  if(a.cost==='host')return a.host==='me'?'you cover everyone':'free for you';
  return t?`about ${rupees(each)} each`:a.cost==='own'?'pay your own way':'everyone pays a share';
}
const metWith=u=>S.acts.filter(a=>a.status==='past'&&attended(a)&&(a.host===u||a.members.includes(u))).length;
function signals(u){
  const ints=USERS[u]?.ints||[],av=USERS[u]?.avail||[],t=trust(u),met=metWith(u);
  const chips=[...ints.filter(x=>(S.me.ints||[]).includes(x)).map(x=>'Both like '+x),...av.filter(x=>(S.me.avail||[]).includes(x)).map(x=>'Both free '+x.toLowerCase())].map(x=>`<span class="chip acc">${esc(x)}</span>`);
  if(met)chips.push(`<span class="chip ok">${I('users',11)} Met you ${met}× before</span>`);
  if(t.shows+t.noshows>=3&&t.rate<90)chips.push(`<span class="chip warn">${I('alert-triangle',11)} Missed ${t.noshows} of ${t.shows+t.noshows} meetups</span>`);
  return `<div class="sig">${chips.length?chips.join(''):'<span class="small mute">Nothing in common yet</span>'}</div>`;
}
function matchF(a,f){return (f.cat==='all'||a.cat===f.cat)&&(!f.dfrom||dayKey(a.when)>=f.dfrom)&&(!f.dto||dayKey(a.when)<=f.dto)&&(f.tod==='any'||tod(a.when)===f.tod)&&(!f.dist||kmAway(a)<=f.dist)}
function alertLabel(f){const p=[f.cat==='all'?'Any plan':CATS[f.cat].label];if(f.tod!=='any')p.push(f.tod[0].toUpperCase()+f.tod.slice(1));if(f.dist)p.push(`Within ${f.dist} km`);return p.join(' · ')}
/* ---- usage events: sent to Supabase from the published site, kept in this browser when running from a file ---- */
const uuid4=()=>crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16)});
const SESSION=uuid4();
function track(name,props={}){
  try{
    /* opt-in only: nothing is sent before sign-in, or unless "Share usage statistics" is on (log_event checks it too) */
    if(SB&&!S.me?.usageOk)return;
    const row={id:uuid4(),participant_id:ME,session_id:SESSION,name,props};
    if(SB&&location.protocol.startsWith('http')){
      /* log_event takes who you are from your login and limits how many events one session can send */
      SB.rpc('log_event',{p_session:SESSION,p_name:name,p_props:props}).then(()=>{},()=>{});
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
  /* after "Hard" or "OK", one line on why (ui.microWhy holds the score) */
  if(ui.microWhy)return `<div class="micro" role="dialog" aria-label="Quick question"><div class="mq"><span>Thanks! One more thing</span><button class="ib" data-a="microx" aria-label="Skip">${I('x',15)}</button></div>
  <p><label for="mf_t" style="margin:0;font-size:inherit">${ui.microWhy===1?'What made it hard?':'What would have made it easier?'}</label></p>
  <textarea id="mf_t" class="mft" maxlength="1000" placeholder="A few words is plenty"></textarea>
  <label class="chk top"><input type="checkbox" id="mf_ok"> <span><b>Required:</b> I agree this is stored and used to improve Overhere (<a href="privacy.html" target="_blank" rel="noopener">Privacy policy</a>).</span></label>
  <div class="row" style="margin-top:8px"><button class="btn sm ghost" data-a="microx">Skip</button><button class="btn sm" id="mf_go" data-a="microsend" disabled><span class="spin" aria-hidden="true"></span>Send</button></div></div>`;
  return `<div class="micro" role="dialog" aria-label="Quick question"><div class="mq"><span>Quick question</span><button class="ib" data-a="microx" aria-label="Dismiss question">${I('x',15)}</button></div><p>${MICRO[k]}</p>
  <div class="mf">${[['😞','Hard',1],['😐','OK',2],['🙂','Easy',3],['😀','Very easy',4]].map(([e,l,n])=>`<button data-a="microans" data-n="${n}"><span aria-hidden="true">${e}</span>${l}</button>`).join('')}</div></div>`;
}
/* ---- the feedback sheet, and when to ask for it ---- */
/* S.asked also remembers: fbSent (when you last sent feedback from the app), fbFirst and fbOpens (your first visit and
   how many times you've opened the app), fbNo and fbNoAt (how often, and when, you said "not now" to the card). */
const FB_AFTER=2*864e5,FB_AGAIN=7*864e5;
let OPENED=false;
function countOpen(){if(OPENED||!S.me)return;OPENED=true;const a=S.asked;a.fbOpens=(a.fbOpens||0)+1;if(!a.fbFirst)a.fbFirst=now();save()}
/* The card in the feed shows from your 3rd visit or 2nd day, and once more a week after "not now". */
function fbDue(){
  const a=S.asked||{};if(a.fbSent||(a.fbNo||0)>=2)return false;
  if(a.fbNo&&now()-(a.fbNoAt||0)<FB_AGAIN)return false;
  return (a.fbOpens||0)>=3||(!!a.fbFirst&&now()-a.fbFirst>=FB_AFTER);
}
const fbCard=()=>fbDue()?`<div class="fbcard"><span class="fe" aria-hidden="true">💬</span><div class="fx"><b>How's Overhere going so far?</b><span>20 seconds, and it shapes what we build next.</span></div>
  <button class="btn sm" data-a="fb" data-k="card">Tell us</button><button class="ib" data-a="fbnot" title="Not now" aria-label="Not now">${I('x',15)}</button></div>`:'';
/* Send stays off until the required parts are done, and the line under it says what's missing. */
function fbState(){
  const b=document.getElementById('fb_go');if(b&&!b.classList.contains('busy')){
    const r=!!document.querySelector('input[name=fb_r]:checked'),ok=!!document.getElementById('fb_ok')?.checked;
    b.disabled=!(r&&ok);
    const w=document.getElementById('fb_why');if(w)w.textContent=r&&ok?'':!r&&!ok?'Pick a face and tick the required box to send.':!r?'Pick a face to send.':'Tick the required box to send.';
  }
  const m=document.getElementById('mf_go');if(m&&!m.classList.contains('busy'))m.disabled=!(val('mf_t')&&document.getElementById('mf_ok')?.checked);
}
function busyBtn(b,on){if(!b)return;b.disabled=on;b.classList.toggle('busy',on);if(on)b.setAttribute('aria-busy','true');else b.removeAttribute('aria-busy')}
/* send_feedback (schema-app.sql) links it to your login and limits how much can arrive. */
async function sendFeedback(p){await call('send_feedback',{p:{consent_store:true,consent_version:FEEDBACK_V,...p}})}
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
      return `<button class="po ${on?'on':''}" data-a="vote" data-id="${a.id}" data-m="${i}" data-o="${j}"${chatClosed(a)?' disabled':''} aria-pressed="${on}" aria-label="${esc(o.t)}: ${o.v.length} ${o.v.length===1?'vote':'votes'}"><span class="pb" style="width:${pct}%"></span><span class="pt3">${esc(o.t)}</span><span class="pn2">${o.v.length}</span></button>`}).join('')}
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
  const me=id==='me'?' data-me':'',ph=me?S.me?.photo:USERS[id]?.photo;
  if(ph)return `<span class="av ${cls}"${me}><img src="${esc(ph)}" alt="${esc(n)}" loading="lazy" decoding="async"></span>`;
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
/* visible: listed in Discover (open plans only: a full one leaves discovery). eligible: can be requested right now. */
/* the server sends plans within NEAR_KM of your home area and of the city you browse; Distance narrows that down */
function visible(a){return a.status==='open'&&a.host!=='me'&&audOK(a)&&!isBlocked(a.host)&&a.when>now()&&inView(a)}
function eligible(a){return visible(a)&&a.status==='open'&&spots(a)>0&&!S.dismissed.includes(a.id)}
/* Swipe's order (the 7 Nov spec's "algorithm"): real people's plans first, so a new post isn't buried behind the sample
   hosts' ones; then by score(): what your profile says (interests, usual availability, people you follow) plus what
   you do in the app (taste: categories you swipe right on, ask to join or save go up, ones you skip go down); then
   the soonest first. */
const isSample=id=>!!USERS[id]?.sample;
const deck=()=>S.acts.filter(a=>eligible(a)&&!myReq(a.id)&&a.when<swipeEnd()).sort((a,b)=>isSample(a.host)-isSample(b.host)||score(b)-score(a)||a.when-b.when);
/* Discover lists every upcoming plan, including the ones in Swipe.
   Plans that declined you drop out of Discover; they stay in Requests (where you can still share them). */
const feed=()=>S.acts.filter(a=>visible(a)&&!myReq(a.id)).sort((a,b)=>a.when-b.when);

/* ---------- talking to the database ---------- */
/* A plan opened from an invite link is sent even when it's further away than the plans you'd normally see. */
const inviteId=()=>(location.hash.match(/^#act=([0-9a-f-]{36})$/i)||[])[1]||null;
let INVITE=inviteId();
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
  if(/captcha/i.test(m))return "The security check didn't go through. Please try again in a minute.";
  if(/JWT|sign in again|not signed|refresh token/i.test(m))return 'Please sign in again.';
  if(/phone (signups|provider|logins?) .*disabled|unsupported phone provider/i.test(m))return "Phone sign-in isn't switched on yet. Please use email for now.";
  /* sending errors first: Supabase's "Error sending confirmation OTP to provider: Invalid ..." would otherwise read as a wrong code */
  if(/(error|fail).*send.*(sms|otp)|sms.*(fail|error)|invalid phone/i.test(m))return "We couldn't send the SMS. Check the number, or try again in a minute.";
  if(/token has expired|otp.*(expired|invalid)|invalid.*(otp|token)/i.test(m))return 'That code is wrong or has expired. Check it, or tap Resend code.';
  if(/violates|invalid input|syntax|permission denied|does not exist|schema cache/i.test(m))return 'Something there was not accepted. Please check it and try again.';
  return m&&m.length<160?m:'Something went wrong. Please try again.';
}
/* Read everything again. Several calls at once collapse into one extra read. */
let busy=null,again=false;
function refresh(){
  if(busy){again=true;return busy}
  busy=(async()=>{
    try{applyState(await call('app_state',INVITE?{p_act:INVITE}:{},true));ui.err=''}
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
    /* After the plan, the database asks: the host to record attendance when it ends (and reminds them daily), and the
       people the host marked to rate it or say what happened. */
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
    const ses=await edge('face-start',{consent:true,consent_v:2});   // 2: the wording that says a failed scan's frame is kept for review
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
    if(r?.message)m.err=r.message;   // live check: why it failed (not live, or not the same face as the photo)
  }catch(e){m.state='fail';m.err=friendly(e)}
  await refresh();
  if(ui.modal===m){if(VER[m.kind]?.review)m.state='flagged';render()}
}
/* Browsing is open to everyone; posting and asking to join need the face check. The ID check is off for now. */
const gate=fn=>{if(S.me.face)fn();else openVerify('face',fn)};
const safetyOnce=fn=>{if(S.tips.safety1)fn();else{ui.modal={type:'safety1',next:fn};render()}};

/* ---------- swipe ---------- */
function swipe(dir){
  const a=deck()[0];if(!a)return;
  const el=document.querySelector('.card.top');
  /* the first skip asks "are you sure?" once, then never again (a request already has its own sheet) */
  if(dir==='left'&&!S.tips.swipe_left){if(el)el.style.transform='';ui.modal={type:'swipeask',dir,id:a.id};render();return}
  track('swipe',{dir});
  /* the how-to hints under the deck only show until the first swipe */
  if(!S.tips.swiped){S.tips.swiped=true;save()}
  if(dir==='right'){if(el)el.style.transform='';ui.modal={type:'confirm',id:a.id};render();return}
  if(el){el.style.transition='transform .25s';el.style.transform='translateX(-600px) rotate(-25deg)'}
  setTimeout(()=>{
    S.dismissed.push(a.id);learn(a.cat,-0.5);askMicro('swipe');save();
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
  <div class="cp">${catPill(a.cat)}</div>${cls==='top'&&a.host!=='me'?`<button class="shb" data-a="share" data-k="invite" data-id="${a.id}" title="Share" aria-label="Share this plan">${I('share',16)}</button>`:''}
  <div class="body"><div class="who">${a.host==='me'?`${av('me','sm')}You`:`<button class="hlink" data-a="user" data-id="${a.host}" title="View ${esc(h.name)}'s profile">${av(a.host,'sm')}<span><span class="hname">${esc(h.name)}</span>, ${h.age}</span></button>`} ${vf(a.host)}${sampleTag(a.host)}</div>
  <h2>${esc(a.desc)}</h2>
  <div class="meta"><span>${I('calendar',14)}${whenStr(a.when)}</span><span>${I('map-pin',14)}${esc(placeLine(a))}</span><span>${I('users',14)}${spotTxt(a)}</span></div>
  <div class="tags">${tags(a).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></div>`;
}
const REQ_LBL={closed:'Closed',pending:'Requested',accepted:'Accepted',rejected:'Declined',waitlist:'Waitlisted',left:'Left',removed:'Removed',no_action:'No response'};
const REQ_TONE={pending:'acc',accepted:'ok',rejected:'bad',waitlist:'info'};
function acCard(a){
  const rq=myReq(a.id),full=spots(a)<=0;
  return `<div class="ac" data-a="detail" data-id="${a.id}"><div class="media" style="background:${planBg(a)}">${catPill(a.cat)}${sampleTag(a.host)}${saveBtn(a)}</div>
  <div class="bd">${ui.f.sort==='for'&&reasons(a)[0]?`<div class="why">${I('sparkles',12)} ${esc(reasons(a)[0][0])}</div>`:''}<h4>${esc(a.desc)}</h4>
  <div class="meta2"><span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(placeLine(a))} · ${distKm(a)} km</span></div>
  <div class="tg"><span>${I('users',12)}${spotTxt(a)}</span>${tags(a).map(t=>`<span>${esc(t)}</span>`).join('')}</div>
  <div class="ft"><div class="hn">${av(a.host,'sm')}${hostName(a.host)} ${vf(a.host)}</div>
  ${rq?`<span class="chip ${REQ_TONE[rq.status]||''}">${REQ_LBL[rq.status]||esc(rq.status)}</span>`
    :full?'<span class="chip acc">Full</span>'
    :`<button class="btn xs" data-a="askreq" data-id="${a.id}">Request ${I('chevron-right',13)}</button>`}</div></div></div>`;
}
function liHtml(a,act,meta,chips,right){
  return `<div class="panel tap li" data-a="${act}" data-id="${a.id}" role="button" tabindex="0">${planThumb(a)}
  <div style="flex:1;min-width:0"><div class="t">${esc(a.desc)}</div><div class="meta2" style="margin:4px 0 8px">${meta}</div>${chips}</div>${right||`<span class="mute">${I('chevron-right',18)}</span>`}</div>`;
}
// host=true renders from the poster's side (e.g. "Left" instead of "You left")
const statusChip=(s,host)=>({closed:'<span class="chip">Closed</span>',pending:'<span class="chip warn">Pending</span>',accepted:'<span class="chip ok">Accepted</span>',rejected:'<span class="chip bad">Declined</span>',no_action:`<span class="chip">${host?'No response':'No action from poster'}</span>`,waitlist:'<span class="chip info">Waitlisted</span>',left:`<span class="chip">${host?'Left':'You left'}</span>`,removed:`<span class="chip bad">${host?'Removed':'Removed by host'}</span>`}[s]);
const actChip=s=>({open:'<span class="chip ok">Open</span>',full:'<span class="chip acc">Full</span>',past:'<span class="chip">Past</span>'}[s]);
const empty=(ic,t,sub,btn)=>`<div class="empty"><div class="big">${I(ic,30)}</div><h2>${t}</h2><p>${sub}</p>${btn||''}</div>`;

/* ---------- render: tabs ---------- */
/* Audience-limited plans (e.g. women-only) are only sent to people whose ID check passed. */
const lockedNote=()=>LOCKED&&!S.me.face?`<div class="dn" style="margin:0 0 14px;text-align:left">${I('shield-check',14)} ${LOCKED} ${LOCKED===1?'plan near you is':'plans near you are'} only open to certain groups, like women-only plans. <button class="lnk" data-a="unlock">Do the face check to see ${LOCKED===1?'it':'them'}</button></div>`:'';
const whereBar=()=>`<div class="wbar"><button class="where" data-a="citymenu" aria-haspopup="dialog" aria-label="Showing plans ${esc(whereTxt())}. Change city">${I('map-pin',14)}<span>${viewCity()?esc(viewName()):'Near '+esc(homeName())}</span>${I('chevron-down',14)}</button></div>
  ${VIEW.auto&&viewCity()?`<div class="dn" style="margin:0 0 14px;text-align:left">${I('compass',14)} Overhere is new in ${esc(homeName())}, so you're seeing plans in ${esc(viewName())} (${Math.round(kmBetween(homeLL(),viewLL()))} km away) too. Anything posted near you shows here first. <button class="lnk" data-a="citymenu">Pick another city</button></div>`:''}`;
function tabSwipe(){
  const d=deck();
  if(!d.length)return whereBar()+fbCard()+lockedNote()+empty('compass','Nothing new right now',`You have gone through all plans in the next 7 days ${esc(whereTxt())}. Check Discover for plans further out, or pick another city.`,'<button class="btn" data-a="tab" data-t="discover">Go to Discover</button>');
  return `<div class="deck">${whereBar()}${fbCard()}<h1 class="pt">What's happening this week?</h1><p class="sub">Activities in the next 7 days · Tap a card for details</p>${lockedNote()}
  <div class="stack">${d[1]?cardHtml(d[1],'back'):''}${cardHtml(d[0],'top')}</div>
  <div class="acts"><button class="rb" data-a="swipe" data-d="left" title="Skip">${I('x',24)}</button>
  <div class="cnt">1 of ${d.length}${S.tips.swiped?'':'<br>← dismiss · request →'}</div>
  <button class="rb go" data-a="swipe" data-d="right" title="Request to join">${I('heart',24)}</button></div>
  ${S.tips.swiped?'':'<p class="small mute kb" style="margin-top:6px">Use ← → arrow keys to navigate</p>'}</div>`;
}
/* Date range: YYYY-MM-DD strings, either end optional */
const dLbl=k=>new Date(k+'T12:00:00').toLocaleDateString([], {weekday:'short',day:'numeric',month:'short'});
const rangeLbl=f=>f.dfrom&&f.dto?(f.dfrom===f.dto?dLbl(f.dfrom):dLbl(f.dfrom)+' – '+dLbl(f.dto)):f.dfrom?'From '+dLbl(f.dfrom):'Until '+dLbl(f.dto);
function datePresets(){
  /* every preset starts today */
  const t=dayStart(),k=d=>dayKey(d.getTime()),plus=n=>{const d=new Date(t);d.setDate(d.getDate()+n);return d};
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
  return `${whereBar()}<div class="hd"><div><h1 class="pt">All upcoming plans</h1><p class="sub">${all.length} upcoming ${esc(whereTxt())}</p></div><button class="btn sm mobonly" data-a="newpost">${I('plus',15)} Post</button></div>
  ${lockedNote()}${fbCard()}${(()=>{const n=deck().length;return `<div class="alerts"><button class="alchip tn" data-a="tab" data-t="swipe">${I('flame',13)} Swipe this week${n?` · ${n}`:''}</button>${S.savedF.map(sf=>`<span class="alchip sf"><button class="lnk" data-a="applyf" data-id="${sf.id}">${I('filter',12)} ${esc(sf.label)}</button><button data-a="rmf" data-id="${sf.id}" aria-label="Remove saved filters ${esc(sf.label)}">${I('x',12)}</button></span>`).join('')}</div>`})()}${S.alerts.length?`<div class="alerts"><span class="small mute" style="display:inline-flex;align-items:center;gap:4px">${I('bell',13)} Your alerts</span>${S.alerts.map(al=>`<span class="alchip">${esc(al.label)}<button data-a="rmalert" data-id="${al.id}" aria-label="Remove alert ${esc(al.label)}">${I('x',12)}</button></span>`).join('')}</div>`:''}
  <div class="dtools"><button class="fbtn ${act.length?'on':''}" data-a="filters" aria-haspopup="dialog">${I('filter',14)} Filters${act.length?`<b aria-label="${act.length} active">${act.length}</b>`:''}</button>
  <button class="fbtn" data-a="sortmenu" aria-haspopup="dialog" aria-label="Sort by ${SORTS[f.sort][1]}">${I('arrow-up-down',14)} Sort: ${SORTS[f.sort][1]}</button>
  ${SEG('fview',f.view,[['list',I('list',13)+'<span class="tl">List</span>','List view'],['map',I('map',13)+'<span class="tl">Map</span>','Map view']])}</div>
  <div class="small mute fact"><span>Showing <b>${list.length}</b> ${list.length===1?'activity':'activities'}</span>
  ${act.map(([k,l])=>`<span class="alchip">${esc(l)}<button data-a="fclear" data-k="${k}" aria-label="Remove filter ${esc(l)}">${I('x',12)}</button></span>`).join('')}
  ${act.length?`<button class="lnk" data-a="freset">Reset</button>`:''}${act.length&&!S.savedF.some(x=>x.label===activeFilters(f).map(y=>y[1]).join(' · ').slice(0,60))?`<button class="lnk" data-a="savef">${I('filter',13)} Save these filters</button>`:''}${alertable&&!saved?`<button class="lnk" data-a="saveal">${I('bell',13)} Alert me about new matches</button>`:''}</div>
  ${!list.length?empty('calendar',all.length?'No matches':'No plans yet',all.length?'Try different filters.':'Be the first to post one.',act.length&&all.length?'<button class="btn sec" data-a="freset">Reset filters</button>':'')
   :f.view==='map'?mapHtml(list):`<div class="grid">${list.map(a=>acCard(a)).join('')}</div>`}`;
}
/* Discover's map: OpenStreetMap under Leaflet (both loaded only when the map is first opened).
   Pins closer than a finger's width on screen merge into a numbered bubble: tapping it zooms in, or lists the plans
   when they're at the same spot. Tapping a pin shows a preview card on the map instead of leaving it. */
let mapList=[],mapView=null,liveMap=null,leafletP=null,mapPins=null;
function mapHtml(list){
  mapList=list;
  return `<div class="mapw"><div id="lmap" class="map" role="region" aria-label="Map of plans near you"></div>
    <div class="mctl"><button class="mcb" data-a="mapfit" title="Show all plans" aria-label="Show all plans">${I('layers',17)}</button><button class="mcb" data-a="maphome" title="Back to your area" aria-label="Back to your area">${I('locate',17)}</button></div>
    <div class="mprev" id="mprev" hidden></div></div>
  <p class="small mute" style="margin-top:8px">${kmBetween(homeLL(),viewLL())<=NEAR_KM?`The blue dot is the centre of ${esc(S.me.hood)}. `:''}A pin is at the place when the host picked it from the list, otherwise in the middle of the area the venue is in. A number means several plans close together: tap it to zoom in.</p>`;
}
function loadLeaflet(){
  if(window.L)return Promise.resolve();
  return leafletP||(leafletP=new Promise((ok,bad)=>{
    const css=document.createElement('link');css.rel='stylesheet';css.href='vendor/leaflet/leaflet.css';document.head.appendChild(css);
    const s=document.createElement('script');s.src='vendor/leaflet/leaflet.js';s.onload=ok;s.onerror=()=>{leafletP=null;bad()};document.head.appendChild(s);
  }));
}
/* Group the pins by where they land on screen at this zoom, and draw one marker per group. */
function drawPins(){
  const m=liveMap;if(!m||!mapPins)return;
  mapPins.clearLayers();
  const groups=[];
  mapList.forEach(a=>{const p=m.latLngToLayerPoint(geo(a)),g=groups.find(g=>g.p.distanceTo(p)<40);if(g)g.items.push(a);else groups.push({p,items:[a]})});
  groups.forEach(({items})=>{
    if(items.length===1){
      const a=items[0],c=CATS[a.cat],label=`${short(a.desc)} · ${whenStr(a.when)} · ${distKm(a)} km`;
      L.marker(geo(a),{title:label,keyboard:true,riseOnHover:true,icon:L.divIcon({className:'',iconSize:[34,34],iconAnchor:[17,17],html:`<span class="lpin" style="--pc:${c.fg}">${I(c.icon,15)}</span>`})})
        .addTo(mapPins).on('click',()=>mapPreview([a]));
      return;
    }
    const ll=items.map(geo),mid=[ll.reduce((s,x)=>s+x[0],0)/ll.length,ll.reduce((s,x)=>s+x[1],0)/ll.length];
    const size=items.length<10?38:items.length<50?44:50,bounds=L.latLngBounds(ll);
    L.marker(mid,{title:`${items.length} plans here`,keyboard:true,riseOnHover:true,icon:L.divIcon({className:'',iconSize:[size,size],iconAnchor:[size/2,size/2],html:`<span class="lclu" style="width:${size}px;height:${size}px">${items.length}</span>`})})
      .addTo(mapPins).on('click',()=>{
        /* the same spot, or as close as the map goes: list them; otherwise zoom in to pull them apart */
        if(m.getZoom()>=17||bounds.getNorthEast().distanceTo(bounds.getSouthWest())<30)mapPreview(items);
        else m.flyToBounds(bounds.pad(0.4),{maxZoom:17,duration:.5});
      });
  });
}
/* The card on the map: one plan with its photo and buttons, or a short list when several share a spot. */
function mapPreview(items){
  const el=document.getElementById('mprev');if(!el)return;
  if(!items||!items.length){el.hidden=true;el.innerHTML='';return}
  const one=items.length===1,a=items[0];
  el.innerHTML=`<button class="ib mpx" data-a="mapclose" aria-label="Close preview">${I('x',16)}</button>`+(one
    ?`<div class="mp1" data-a="detail" data-id="${a.id}" role="button" tabindex="0">${planThumb(a)}<div style="min-width:0;flex:1">${catPill(a.cat,true)}<div class="t">${esc(a.desc)}</div>
        <div class="meta2"><span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${distKm(a)} km</span><span>${I('users',13)}${spotTxt(a)}</span></div></div></div>
      <div class="row" style="gap:8px;margin-top:10px"><button class="btn sm" data-a="detail" data-id="${a.id}">View plan</button>${canSave(a)?`<button class="btn sm ghost" data-a="save" data-id="${a.id}" aria-pressed="${isSaved(a.id)}">${I('bookmark',14)} ${isSaved(a.id)?'Saved':'Save'}</button>`:''}</div>`
    :`<p class="small" style="margin:0 0 8px;font-weight:600">${items.length} plans at this spot</p><div class="mpl">${items.slice(0,8).map(x=>`<button class="mpr" data-a="detail" data-id="${x.id}">${planThumb(x)}<span><b>${esc(short(x.desc))}</b><small>${whenStr(x.when)}</small></span></button>`).join('')}</div>`);
  el.hidden=false;
}
async function drawMap(){
  const el=document.getElementById('lmap');if(!el)return;
  try{await loadLeaflet()}catch(e){el.innerHTML='<p class="small mute" style="padding:16px">The map could not load. Check your connection, or switch to the list.</p>';return}
  if(!el.isConnected||el.dataset.on)return;
  el.dataset.on='1';
  if(liveMap){liveMap.remove();liveMap=null}   // the previous render's map
  const home=homeLL(),mid=viewLL(),homeIn=kmBetween(home,mid)<=NEAR_KM,m=L.map(el).setView(mapView?.c||mid,mapView?.z||13);
  liveMap=m;
  m.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(m);
  if(homeIn)L.marker(home,{zIndexOffset:1000,keyboard:false,interactive:false,icon:L.divIcon({className:'',iconSize:[18,18],iconAnchor:[9,9],html:'<span class="lyou"></span>'})}).addTo(m);
  mapPins=L.layerGroup().addTo(m);
  m.on('zoomend',drawPins);
  m.on('click',()=>mapPreview(null));
  m.on('moveend',()=>{mapView={c:m.getCenter(),z:m.getZoom()}});
  if(!mapView)mapFit(false);
  drawPins();
}
/* Fit every plan in view (with your area), or go back to your area. */
function mapFit(fly){
  const m=liveMap;if(!m)return;
  const home=homeLL(),mid=viewLL(),pts=[kmBetween(home,mid)<=NEAR_KM?home:mid,...mapList.map(geo)];
  if(pts.length<2){m.setView(pts[0],13);return}
  const b=L.latLngBounds(pts).pad(0.12);
  if(fly)m.flyToBounds(b,{maxZoom:15,duration:.5});else m.fitBounds(b,{maxZoom:15});
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
  /* saved from Discover, until you ask to join, the plan starts or it's gone */
  const saved=S.saved.map(actOf).filter(a=>a&&a.status!=='past'&&!myReq(a.id)).sort((a,b)=>a.when-b.when);
  return `<h1 class="pt">My Requests</h1><p class="sub">Plans you asked to join</p>`
    +(saved.length?`<h3 class="sech">${I('bookmark',15)} Saved for later</h3>`+saved.map(a=>liHtml(a,'detail',`<span>${I('calendar',13)}${whenStr(a.when)}</span><span>by ${esc(uname(a.host))}</span>`,'',
      `<button class="ib" style="flex:0 0 auto" data-a="save" data-id="${a.id}" aria-label="Remove from saved" title="Remove from saved">${I('x',16)}</button>`)).join('')+`<h3 class="sech">${I('mail',15)} Requests</h3>`:'')
    +(mine.length?mine.map(r=>{
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
/* ---------- chats: every group chat you're in (hosting, or accepted), newest message first ---------- */
const chatNote=id=>S.notes.find(n=>n.key==='chat:'+id&&!n.read);
function myChats(){
  return S.acts.filter(a=>(a.host==='me'||myReq(a.id)?.status==='accepted')&&(S.chats[a.id]||[]).length)
    .map(a=>{const ms=S.chats[a.id];return {a,last:ms[ms.length-1]}}).sort((x,y)=>(y.last.at||0)-(x.last.at||0));
}
const chatUnread=()=>myChats().filter(({a})=>chatNote(a.id)).length;
function tabChats(){
  const list=myChats();
  const who=x=>x.from==='sys'?'':(x.from==='me'?'You':uname(x.from))+': ';
  return `<div class="nh"><h1 class="pt" style="font-size:22px;flex:1;margin:0">Chats</h1></div>
  ${list.length?`<div class="chl">${list.map(({a,last})=>{const un=!!chatNote(a.id);return `<button class="chi${un?' un':''}" data-a="chat" data-id="${a.id}">${planThumb(a)}
    <span class="chb"><span class="cht"><b>${esc(short(a.desc))}</b><span class="tm">${ago(last.at)}</span></span>
    <span class="chm">${esc(who(last)+(last.poll?'Poll: '+last.poll.q:last.text))}</span>
    <span class="small mute">${isPast(a)?'Ended':whenStr(a.when)} · ${a.members.length+1} in the group${S.muted[a.id]?' · muted':''}${isSample(a.host)?' · sample plan':''}</span></span>
    ${un?'<span class="udot" aria-label="Unread"></span>':''}</button>`}).join('')}</div>`
  :empty('messages-square','No chats yet','When you host a plan and accept someone, or a host accepts your request, the group chat shows up here.','<button class="btn" data-a="tab" data-t="discover">Find a plan</button>')}`;
}
function tabNotes(){
  const N=S.notes,unread=N.filter(n=>!n.read).length;
  const sec=(title,list,none)=>`<h3 class="nsh">${title}${list.some(n=>!n.read)?` <b>${list.filter(n=>!n.read).length}</b>`:''}</h3>
  ${list.length?`<div class="nl">${list.map(noteHtml).join('')}</div>`:`<p class="small mute nnone">${none}</p>`}`;
  return `<div class="nh"><h1 class="pt" style="font-size:22px;flex:1;margin:0">Notifications</h1>${unread?`<button class="btn sm sec" data-a="readall">${I('circle-check',14)} Mark all as read</button>`:''}</div>
  ${sec('Notifications',N.filter(n=>n.kind!=='req'),'Updates and reminders about your activities will show up here.')}
  ${sec('Requests',N.filter(n=>n.kind==='req'),'Join requests, and replies to yours, will show up here.')}`;
}
function tabProfile(){
  const m=S.me,th=themePref(),ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  const V=[AUTHU.phone?['phone','Phone Verified',true]:['mail','Email Verified',!!AUTHU.email],['scan-face','Face Verified',!!m.face],['id-card','Government ID',false,'soon'],['user','Profile Complete',!!(m.job&&m.bio&&(m.ints||[]).length&&(m.avail||[]).length)]];
  const done=V.filter(v=>v[2]).length;
  /* face check can be done from here; the ID check is greyed out until it's switched on */
  const vi=([ic,l,y,k])=>k==='soon'?`<div class="vi off" aria-disabled="true">${I(ic,14)}${l}<span class="e small">Coming soon</span></div>`
    :!y&&ic==='scan-face'?`<button class="vi act" data-a="doface">${I(ic,14)}Face check<span class="e small">Start</span></button>`
    :`<div class="vi ${y?'y':''}">${I(ic,14)}${l}${y?`<span class="e">${I('circle-check',14)}</span>`:''}</div>`;
  const soft=(arr,none)=>arr&&arr.length?`<div class="soft">${arr.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:`<p class="small mute">${none}</p>`;
  return `<div class="panel"><div class="ph">${I('user',15)} Your profile<button class="btn sm sec" data-a="editprofile">${I('pencil',14)} Edit profile</button></div>
  <div class="pt2"><div class="phw" data-a="photo">${av('me','lg')}<button class="pe" id="p_pe" title="Change profile picture" aria-label="Change profile picture" aria-haspopup="menu" aria-expanded="false">${I('camera',14)}</button>
  <div class="pmenu" id="p_menu" role="menu" hidden></div></div><div><div class="pn">${esc(m.name)} ${isVer('me')?`<span class="vf">${I('badge-check',14)} Verified</span>`:''}</div><div class="small mute">${esc(m.hood)}</div><div class="small" style="margin-top:4px">${trustTxt('me')}</div></div></div>
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
  <div class="panel fbp"><div class="ph">${I('message-heart',15)} Help shape Overhere</div>
  <p class="small mute" style="margin-top:0">Overhere is in beta. Tell us what's working, what's confusing and what you'd like next. It takes about 20 seconds.</p>
  <button class="btn sm" data-a="fb" data-k="profile">${I('message-heart',14)} Send feedback</button>${S.asked.fbSent?`<span class="small mute" style="margin-left:10px">Last sent ${new Date(S.asked.fbSent).toLocaleDateString([], {day:'numeric',month:'short'})}. Thank you!</span>`:''}</div>
  <div class="panel"><div class="ph">${I('sun',15)} App</div>
  <label style="margin-top:0">Appearance</label><span class="seg" role="radiogroup" aria-label="Appearance">${[['system','System'],['light','Light'],['dark','Dark']].map(([k,l])=>`<button role="radio" aria-checked="${th===k}" class="${th===k?'on':''}" data-a="theme" data-k="${k}">${l}</button>`).join('')}</span>
  <label>Install</label>${isStandalone()?'<p class="small mute" style="margin:0">Overhere is installed on this device.</p>':installEvt?`<button class="btn sm sec" data-a="install">${I('download',14)} Install Overhere</button>`:ios?'<p class="small mute" style="margin:0">On iPhone: tap Share, then “Add to Home Screen”.</p>':'<p class="small mute" style="margin:0">Open the published site in Chrome or Edge and use “Install app” in the address bar. Installing is not available from a file or inside the beta page.</p>'}
  <label>Usage statistics</label><label class="chk top" style="margin-top:0"><input type="checkbox" id="p_usage" ${m.usageOk?'checked':''}> <span>Share which features I use (never my messages) to help improve the beta. Turning this off also deletes what was collected.</span></label></div>
  <div class="panel"><div class="ph">${I('shield-check',15)} Safety</div>
  <label style="margin-top:0">Trusted contact</label><p class="small mute" style="margin-top:0">Someone you can send your plans to, or alert with SOS, in one tap. Only you see this.</p>
  ${m.trusted?`<div class="blk">${I('phone',15)}<span><b>${esc(m.trusted.name)}</b> · ${esc(m.trusted.phone)}</span><button class="lnk" data-a="editprofile" data-k="safety">Change</button></div>`:`<button class="btn sm sec" data-a="editprofile" data-k="safety">${I('user-plus',14)} Add a trusted contact</button>`}
  <label>Blocked people</label>${S.blocked.length?S.blocked.map(u=>`<div class="blk">${av(u,'sm')}${esc(uname(u))}<button class="lnk" data-a="unblock" data-id="${u}">Unblock</button></div>`).join(''):'<p class="small mute" style="margin:0">You have not blocked anyone.</p>'}</div>
  <div class="panel"><div class="ph">${I('user',15)} Account</div>
  <p class="small mute" style="margin-top:0"><a href="terms.html" target="_blank" rel="noopener" style="color:inherit">Terms</a> · <a href="privacy.html" target="_blank" rel="noopener" style="color:inherit">Privacy policy</a> · <a href="copyright.html" target="_blank" rel="noopener" style="color:inherit">Copyright</a> · <a href="credits.html" target="_blank" rel="noopener" style="color:inherit">Credits</a></p>
  <div class="row" style="gap:8px"><button class="btn sm ghost" data-a="signout">${I('log-out',14)} Sign out</button><button class="btn sm ghost" style="color:var(--bad)" data-a="delacct">${I('trash',14)} Delete my account</button></div></div>
`;
}

/* ---------- render: modals ---------- */
function modalHtml(){
  const m=ui.modal;if(!m)return '';
  const sheet=(title,body,cls='')=>`<div class="ov" data-a="closebg"><div class="sheet ${cls}" data-stop="1"><div class="sh"><h2>${title}</h2><button class="ib" data-a="close" title="Close">${I('x',18)}</button></div>${body}</div></div>`;
  if(m.type==='feedback'){
    const meet=m.k==='meetup';
    return sheet(meet?'And Overhere itself?':'Send feedback',`<div class="sb">
      <p class="small mute" style="margin-top:0">${meet?'Thanks for rating your meetup. One more quick one, about the app this time.':"Overhere is in beta and we're a small team. We read every message."}</p>
      <label style="margin-top:0" id="fb_rl">How's Overhere working for you?</label>
      <div class="faces" role="radiogroup" aria-labelledby="fb_rl">${FACES.map(([e,l],i)=>`<label><input type="radio" name="fb_r" value="${i+1}"><span aria-hidden="true">${e}</span>${l}</label>`).join('')}</div>
      <label for="fb_t">What's one thing we should change? <span class="mute" style="font-weight:400">(optional)</span></label>
      <textarea id="fb_t" maxlength="1000" placeholder="Something confusing, missing, or that you'd love to see"></textarea>
      <label>Would you use Overhere in your city? <span class="mute" style="font-weight:400">(optional)</span></label><div class="opts">${['Yes','Maybe','No'].map(v=>`<label class="opt"><input type="radio" name="fb_u" value="${v}">${v}</label>`).join('')}</div>
      <div style="height:12px"></div>
      <label class="chk top"><input type="checkbox" id="fb_q"> <span>Optional: you may quote this publicly, without my name.</span></label>
      <label class="chk top"><input type="checkbox" id="fb_c"> <span>Optional: you may contact me with follow-up questions.</span></label>
      <label class="chk top fbreq"><input type="checkbox" id="fb_ok"> <span><b>Required:</b> I agree my feedback is stored and used to improve Overhere (<a href="privacy.html" target="_blank" rel="noopener">Privacy policy</a>).</span></label>
      <div style="height:12px"></div><button class="btn" id="fb_go" data-a="sendfb" disabled><span class="spin" aria-hidden="true"></span>Send feedback</button>
      <p class="small mute" id="fb_why" aria-live="polite" style="text-align:center;margin:8px 0 0">Pick a face and tick the required box to send.</p></div>`);
  }
  if(m.type==='verify'){
    const face=m.kind==='face',v=VER[m.kind]||{fails:0,attempts:0,max:5},left=Math.max(0,(v.max||5)-(v.attempts||0)),ic=face?'scan-face':'id-card',live=MODE[m.kind]==='live';
    let inner;
    if(m.state==='flagged'||v.review)inner=`<div class="scan">${I('shield-check',56)}</div><p style="text-align:center"><strong>Check paused for 24 hours</strong></p><p class="mute" style="text-align:center">You have used all ${v.max||5} tries, so the check is paused${v.until?' until '+esc(new Date(v.until).toLocaleString([], {weekday:'short',hour:'numeric',minute:'2-digit'})):''}. Then you get ${v.max||5} new tries. A person on our team will also look at it, and you will get a notification if they approve it.</p>
      ${reviewMail(m.kind)}`;
    else if(face&&!twoPhotos())inner=`<p style="text-align:center;margin-top:0"><strong>First, add two photos of you</strong></p>
      <p class="mute" style="text-align:center">The face check compares your live face with both, so people know your photos are really you. Photo 1 is your profile picture; both show on your profile.</p>
      ${photoPair()}`;
    else if(m.state==='scanning')inner=(live&&face?'<div id="face_box" class="facebox"></div>':`<div class="scan go">${I(ic,56)}</div>`)+`<p style="text-align:center" class="mute">${face?'Checking liveness…':'Reading your ID…'}</p>`;
    else if(!left)inner=`<div class="scan">${I('shield-check',56)}</div><p style="text-align:center"><strong>No tries left</strong></p><p class="mute" style="text-align:center">You have used all ${v.max||5} tries. The check is now paused for 24 hours, and a person on our team will look at it.</p>
      <button class="btn" data-a="scan">Send for review</button>`;
    else inner=`<div class="scan">${I(ic,56)}</div>
      <p style="text-align:center" class="mute">${face?'A few seconds of video selfie confirm you are a real person, and the person in your two photos. You need it to post a plan or ask to join one.':'Government ID check. Needed once, the first time you post or request. It unlocks both.'}</p>
      ${m.state==='fail'?`<p style="text-align:center;color:var(--bad)"><strong>${esc(m.err||'Verification failed.')}</strong> Please try again.</p>`:''}
      <label class="chk top"><input type="checkbox" id="v_ok"> <span>${face?'I agree to a face scan. The video goes only to our verification provider to check that I am a real person and match my two photos, and is not kept. Overhere stores whether it passed and the provider\'s scores. If a scan fails, one still frame from it is kept privately so our team can compare it with my photos, and deleted once they have reviewed it or I pass.':'I agree to an ID check. Overhere stores only whether it passed, never my ID number or ID photo.'}</span></label>
      ${live?'':'<div class="dn">Demo: this check is simulated. No camera or ID is used.</div>'}
      <button class="btn" data-a="scan">${m.state==='fail'?'Try again':(face?'Start face check':'Start ID check')}</button>`;
    return sheet(face?'Face verification':'Identity verification',`<div class="sb">${inner}</div>`);
  }
  if(m.type==='post'){
    const mn=localInput(now()+3600e3),e=m.id&&actOf(m.id),t=!e&&m.tpl&&actOf(m.tpl),src=e||t,minCap=Math.max(2,e?e.members.length:0),cap0=Math.max(minCap,src?src.cap:2),aud=src?src.aud:'everyone';
    const tplWhen=t?(()=>{let w=t.when;while(w<now()+3600e3)w+=7*864e5;return w})():0;
    const past=[...new Map(S.acts.filter(a=>a.host==='me').sort((a,b)=>b.when-a.when).map(a=>[a.desc,a])).values()].slice(0,8);
    return sheet(e?'Edit activity':'Create Activity',`<div class="sb">
      ${e&&e.members.length?`<div class="dn" style="margin-top:0">${e.members.length} ${e.members.length===1?'person is':'people are'} already going. They'll see a note about your changes in the group chat.</div>`:''}
      ${!e&&past.length?`<label style="margin-top:0" for="f_tpl">Start from a past plan <span class="mute" style="font-weight:400">(optional)</span></label><select id="f_tpl"><option value="">Start fresh</option>${past.map(a=>`<option value="${a.id}" ${t&&t.id===a.id?'selected':''}>${esc(short(a.desc))}</option>`).join('')}</select>`:''}
      <label ${!e&&past.length?'':'style="margin-top:0"'}>Category</label><select id="f_cat">${Object.entries(CATS).map(([k,c])=>`<option value="${k}" ${src&&src.cat===k?'selected':''}>${c.label}</option>`).join('')}</select>
      <label>What is the plan?</label><textarea id="f_desc" maxlength="160" placeholder="Short description of what you are doing">${src?esc(src.desc):''}</textarea>
      <p class="ferr" id="f_desc_err" aria-live="polite"></p>
      <label id="f_capl">How many people can join you?</label><div class="capg" role="radiogroup" aria-labelledby="f_capl">${[2,3,4,5,6,7,8,9,10].filter(n=>n>=minCap).map(n=>`<label><input type="radio" name="f_cap" value="${n}" ${n===cap0?'checked':''}><span>${n}</span></label>`).join('')}</div>
      <p class="small mute capx" id="f_capx">${capNote(cap0)}</p>
      <label>Date and time</label><input id="f_when" type="datetime-local" min="${mn}" value="${localInput(e?e.when:t?tplWhen:now()+26*3600e3)}">
      <label for="f_dur">How long does it usually take?</label><select id="f_dur">${Array.from({length:24},(_,i)=>i+1).map(h=>`<option value="${h}" ${h===(src?.dur||2)?'selected':''}>${durTxt(h)}</option>`).join('')}</select>
      <p class="small mute" style="margin-top:6px">When it's over, we'll ask you who came.</p>
      <label>Repeats</label><select id="f_rep"><option value="">Does not repeat</option>${Object.entries(REPEAT).map(([k,v])=>`<option value="${k}" ${src&&src.repeat===k?'selected':''}>${v}</option>`).join('')}</select>
      <p class="small mute" style="margin-top:6px">The next one is posted automatically when this one ends.</p>
      <label>Who can see and request this?</label>
      <label class="chk"><input type="checkbox" id="f_all" ${aud==='everyone'?'checked':''}> Everyone</label>
      ${GENDERS.map(g=>`<label class="chk"><input type="checkbox" class="f_g" value="${g}" ${aud!=='everyone'&&aud.includes(g)?'checked':''}> ${g}</label>`).join('')}
      <label for="f_venue">Venue</label>${placeBox('f_venue','Search a place, e.g. Blue Tokai, Indiranagar',src?src.venue:'','Places in India')}
      ${locBtn('f_venue',"I'm at the venue: use my location")}
      <p class="small mute" style="margin-top:6px">Search any place in India and pick it from the list. Not listed? Type its name, choose “Not listed”, then pick its area.</p>
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
    const can=open&&a.status==='open'&&spots(a)>0,canWait=false;
    const top=`<div class="sum">${planThumb(a)}<div style="min-width:0">${catPill(a.cat,true)}<div class="t">${esc(a.desc)}</div>
      <div class="meta2"><span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(placeLine(a))}${a.host==='me'?'':` · ${distKm(a)} km`}</span></div>
      <div class="meta2" style="margin-top:3px"><span>${I('users',13)}${a.members.length} going · ${spotTxt(a)}${wl?` · ${wl} on waitlist`:''}</span></div>
      <div class="meta2" style="margin-top:3px"><span>${I('wallet',13)}${costLine(a)}</span></div>
      <div class="tg" style="margin-top:8px"><span>${COST_S[a.cost]}</span><span>${a.aud==='everyone'?'Open to everyone':esc(a.aud.join(' / '))+' only'}</span>${a.repeat?`<span>${REPEAT[a.repeat]}</span>`:''}</div></div></div>`;
    const hostline=`<div class="hostline">Hosted by ${a.host==='me'?`${av('me','sm')}<b style="color:var(--ink);font-weight:600">You</b>`:`<button class="hlink" data-a="user" data-id="${a.host}" title="View ${esc(h.name)}'s profile">${av(a.host,'sm')}<span><b style="color:var(--ink);font-weight:600">${esc(h.name)}</b>, ${h.age}</span></button> ${vf(a.host,true)}${sampleTag(a.host)}`}</div>`;
    /* the detail view: the plan's photo with its title, then when / where / who / cost as four tiles */
    const [day,tm]=whenParts(a.when),n=a.members.length,left=spots(a);
    const tile=(ic,t,sub)=>`<div class="dtile">${I(ic,20)}<div><b>${t}</b>${sub?`<span>${sub}</span>`:''}</div></div>`;
    const extra=[...(a.aud==='everyone'?[]:[esc(a.aud.join(' / '))+' only']),...(a.repeat?[REPEAT[a.repeat]]:[])];
    const hero=`<div class="dhero" style="background:${planBg(a)}"><div class="shade"></div>${catPill(a.cat,true)}<h3>${esc(a.desc)}</h3></div>${photoCredit(a)}
      <div class="dtiles">${tile('calendar',day,tm+' · '+durTxt(a.dur||2))}${tile('map-pin',esc(placeLine(a)),a.host==='me'?'':`${distKm(a)} km away`)}
      ${tile('users',left>0?`${left} of ${a.cap} open`:'Full',(n?`${n} going`:'be the first')+(wl?` · ${wl} on waitlist`:''))}${tile('wallet',COST_S[a.cost],costSub(a))}</div>
      ${extra.length?`<div class="tg" style="margin-top:10px">${extra.map(x=>`<span>${x}</span>`).join('')}</div>`:''}`;
    if(m.type==='confirm'&&(can||canWait))return sheet(can?'Request to Join':'Join the waitlist',`<div class="sb">${top}${hostline}
      ${canWait?`<div class="warnbox" style="background:var(--infobg);border-color:#BFDBFE;color:var(--info)">${I('users',16)}<span>This activity is full. Join the waitlist and your request goes to ${esc(h.name)} automatically if a spot opens${wl?` (${wl} ahead of you)`:''}.</span></div>`:''}
      <label for="r_note" style="font-size:14px;margin-top:18px">Add a note <span class="mute" style="font-weight:400">(optional)</span></label>
      <p class="small mute">Introduce yourself or mention why you want to join.</p>
      <textarea id="r_note" maxlength="100" placeholder="Hey! I'd love to join, happy to be on time and split costs."></textarea><div class="cc"><span id="r_cnt">0</span>/100</div>
      ${isSample(a.host)?`<div class="warnbox">${I('alert-triangle',16)}<span><b>Sample plan.</b> It shows how Overhere works: the host says yes straight away, but nobody will actually be there. Don't go to meet anyone.</span></div>`:''}
      ${S.me.face?'<div style="height:14px"></div>':`<div class="warnbox">${I('alert-triangle',16)}<span>You'll need to do a quick face check before your request is sent. It takes about a minute.</span></div>`}
      <button class="btn" data-a="request" data-id="${a.id}">${I('send',16)} ${canWait?(S.me.face?'Join waitlist':'Verify &amp; join waitlist'):(S.me.face?'Send Request':'Verify &amp; Send Request')}</button>
      <div style="height:8px"></div><button class="btn ghost" data-a="close">Not now</button></div>`);
    const acc=rq?.status==='accepted',pos=rq?.status==='waitlist'?waitlist(a.id).findIndex(r=>r.user==='me')+1:0;
    return sheet(backB(m)+'Activity',`<div class="sb">${hero}${hostline}
      ${rq?`<p style="margin-top:14px">Your request: ${statusChip(rq.status)}${pos?` <span class="small mute">#${pos} in line</span>`:''}</p>${rq.note?`<p class="small mute">Your note: ${esc(rq.note)}</p>`:''}`:''}
      ${can?`<div style="height:16px"></div><button class="btn" data-a="askreq" data-id="${a.id}">Request to join</button>`
      :canWait?`<div style="height:16px"></div><button class="btn sec" data-a="askreq" data-id="${a.id}">${I('users',16)} Full · Join waitlist</button>`
      :(!rq?`<p class="mute" style="margin-top:14px">${a.host==='me'?'This is your activity.':past?'This activity has ended.':a.status==='full'||spots(a)<=0?'This plan is full.':'No request available.'}</p>`:'')}
      ${acc&&!past?`<div style="height:8px"></div><button class="btn sec" data-a="chat" data-id="${a.id}">${I('message-circle',16)} Open group chat</button>
        <div style="height:8px"></div><button class="btn ghost" data-a="share" data-k="trust" data-id="${a.id}">${I('shield-check',16)} Share plan with trusted contact</button>`:''}
      ${needRate(a)?`<div style="height:12px"></div><button class="btn" data-a="rate" data-id="${a.id}">${I('star',16)} ${needRate(a)==='noshow'?'Tell the host what happened':'Rate the meetup'}</button>`:attended(a)&&past&&S.ratings[a.id]?`<p class="small mute" style="margin-top:14px">${I('circle-check',14)} You rated this meetup. Thanks!</p>`:''}
      <div class="dlinks">${canSave(a)?`<button class="lnk" data-a="save" data-id="${a.id}" aria-pressed="${isSaved(a.id)}">${I('bookmark',13)} ${isSaved(a.id)?'Saved':'Save for later'}</button>`:''}${!past&&(a.status==='open'||a.status==='full')?`<button class="lnk" data-a="share" data-k="invite" data-id="${a.id}">${I('share',13)} Share</button>`:''}${rq&&(rq.status==='pending'||rq.status==='waitlist')?`<button class="lnk m" data-a="withdraw" data-id="${a.id}">${I('x',13)} Withdraw request</button>`:''}${acc&&!past?`<button class="lnk m" data-a="leave" data-id="${a.id}">Leave activity</button>`:''}${a.host!=='me'?`<a class="lnk m" href="copyright.html#notice" target="_blank" rel="noopener">Report copyright infringement</a>`:''}</div>
      </div>`);
  }
  if(m.type==='terms')return `<div class="ov"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="tm_t"><div class="sh"><h2 id="tm_t">Our terms and community guidelines</h2></div><div class="sb">
      <p style="margin-top:0">To keep using Overhere, please read and agree to our <a href="terms.html" target="_blank" rel="noopener" style="color:var(--acch)">Terms and community guidelines</a>. In short:</p>
      <ul class="small" style="padding-left:20px;margin:0 0 12px"><li>You're 18 or over, and you are who you say you are.</li><li>Be respectful, show up, and cancel early if you can't.</li><li>Not a dating app: no sexual messages, pressure, selling or spam.</li><li>Overhere introduces people but doesn't check everyone or run the meetups. Meet in public and look after yourself.</li></ul>
      <button class="btn" data-a="acceptterms">I agree</button><div style="height:8px"></div><button class="btn ghost" data-a="signout">Sign out</button></div></div></div>`;
  if(m.type==='safety1')return sheet('Before your first meetup',`<div class="sb">
      <p style="margin-top:0">You'll be meeting people you don't know yet. A few things that keep meetups good:</p>
      <ul style="padding-left:20px;margin:0 0 12px"><li>Meet in a busy public place, and make your own way there and back.</li><li>Tell someone you trust where you'll be. You can send them your plan in one tap.</li><li>Keep your home address and workplace to yourself until you know people.</li><li>Never send money to someone you met here.</li><li>Leave whenever you like. In an emergency call 112, or tap SOS in the group chat.</li></ul>
      <p class="small mute">The face check confirms a real person made each account. It doesn't tell you what they're like. More in the <a href="terms.html#safety" target="_blank" rel="noopener" style="color:inherit">Terms</a>.</p>
      <button class="btn" data-a="safetyok">I understand, continue</button></div>`);
  if(m.type==='swipeask'){
    const a=actOf(m.id);if(!a)return '';
    return sheet('Skip this plan?',`<div class="sb">
      <p style="margin-top:0">Swiping left skips <b>${esc(a.desc)}</b>. You won't see it here again.</p>
      <button class="btn" data-a="swipeok" data-d="left">OK</button><div style="height:8px"></div><button class="btn ghost" data-a="close">Cancel</button></div>`);
  }
  if(m.type==='under18')return sheet('Overhere is for adults',`<div class="sb">
      <p style="margin-top:0">The date of birth you entered means you're under 18. Overhere is only for people aged 18 and over.</p>
      <p class="small mute">If that's right, we won't create your account, and we'll delete the sign-in details you've given us straight away. If you made a mistake, go back and fix it.</p>
      <button class="btn" data-a="close">Fix my date of birth</button><div style="height:8px"></div><button class="btn ghost" data-a="under18">That's right, delete my details</button></div>`);
  if(m.type==='delacct')return sheet('Delete your account',`<div class="sb">
      <p style="margin-top:0">This permanently deletes your account, profile, plans, requests, notifications and ratings. Plans you host are cancelled and their members are told. Your chat messages stay in those groups without your name. This can't be undone.</p>
      <label for="del_ok">Type DELETE to confirm</label><input id="del_ok" autocomplete="off" autocapitalize="characters">
      <div style="height:14px"></div><button class="btn bad" data-a="dodelacct">${I('trash',16)} Delete my account</button>
      <div style="height:8px"></div><button class="btn ghost" data-a="close">Keep my account</button></div>`);
  if(m.type==='user'){
    const p=USERS[m.id];if(!p)return '';
    const ups=S.acts.filter(a=>a.host===m.id&&visible(a)).sort((a,b)=>a.when-b.when),bl=isBlocked(m.id),t=trust(m.id);
    const pics=[p.photo,p.photo2].filter(Boolean);
    return sheet(backB(m)+'Profile',`<div class="sb">
      ${pics.length>1?`<div class="gal" tabindex="0" aria-label="Photos of ${esc(p.name)}. Swipe for more.">${pics.map((ph,i)=>`<img src="${esc(ph)}" alt="Photo ${i+1} of ${esc(p.name)}" loading="lazy" decoding="async">`).join('')}</div>`:''}
      <div class="pt2">${av(m.id,'lg')}<div><div class="pn">${esc(p.name)} ${vf(m.id,true)}${sampleTag(m.id)}</div><div class="small mute">${esc(p.gender)}, ${p.age}${p.job?' · '+esc(p.job):''}</div></div></div>
      ${p.bio?`<p style="margin:16px 0 0">${esc(p.bio)}</p>`:''}
      <div class="tstats"><div><b>${t.met}</b><span>meetups</span></div><div><b>${t.shows}</b><span>showed up</span></div><div><b>${t.noshows}</b><span>no-shows</span></div></div>
      ${signals(m.id)}
      <div style="height:12px"></div><button class="btn ${S.following.includes(m.id)?'ghost':'sec'}" data-a="follow" data-id="${m.id}" aria-pressed="${S.following.includes(m.id)}">${S.following.includes(m.id)?I('circle-check',16)+' Following':I('user-plus',16)+' Follow'}</button>
      <p class="small mute" style="margin:6px 0 0;text-align:center">${S.following.includes(m.id)?`You'll hear when ${esc(p.name)} posts a new plan.`:`Get notified when ${esc(p.name)} posts a new plan.`}</p>
      ${isVer(m.id)?'':`<div class="warnbox">${I('alert-triangle',16)}<span>${esc(p.name)} has not verified their ID yet. Meet in busy public places and share your plan with someone you trust.</span></div>`}
      <h3>Upcoming activities${ups.length?` (${ups.length})`:''}</h3>
      ${ups.length?ups.map(a=>{const rq=myReq(a.id);return liHtml(a,'detailback',`<span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(placeLine(a))} · ${distKm(a)} km</span>`,
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
  if(m.type==='mustrate'){
    const a=actOf(m.id);if(!a)return '';
    /* three reminders went unanswered: the app waits for this before anything else (no close button) */
    return `<div class="ov"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mr_t"><div class="sh"><h2 id="mr_t">Rate your plan to carry on</h2></div><div class="sb">
      <div class="dn" style="margin-top:0">"${esc(short(a.desc))}" ended ${ago(endOf(a))}, and we've sent three reminders. Marking who came keeps everyone's reliability record fair. It takes a minute.</div>${attendForm(a)}</div></div></div>`;
  }
  if(m.type==='rate'&&needRate(actOf(m.id))==='noshow'){
    const a=actOf(m.id);
    return sheet(backB(m)+'We missed you',`<div class="sb"><p style="margin-top:0">${esc(uname(a.host))} marked you as not there at <b>"${esc(short(a.desc))}"</b>. That's OK, plans change. If something came up, let them know. If you were there, say so and our team will look into it.</p>
      <label for="ns_t">What happened? <span class="mute" style="font-weight:400">(${esc(uname(a.host))} sees this)</span></label><textarea id="ns_t" maxlength="300" placeholder="e.g. I got stuck at work and couldn't message in time. Sorry!"></textarea>
      <label class="chk"><input type="checkbox" id="ns_d"> I was there. This mark isn't right.</label>
      <div style="height:12px"></div><button class="btn" data-a="donoshow" data-id="${a.id}">Send</button></div>`);
  }
  if(m.type==='rate'&&actOf(m.id)?.host==='me')return sheet(backB(m)+'Rate and record attendance',`<div class="sb">${attendForm(actOf(m.id))}</div>`);
  if(m.type==='rate'){
    const a=actOf(m.id);if(!a)return '';
    const ppl=[a.host,...a.members].filter(x=>x!=='me'),prev=S.ratings[a.id];
    return sheet(backB(m)+'How did it go?',`<div class="sb">
      <div class="sum">${planThumb(a)}<div style="min-width:0"><div class="t">${esc(a.desc)}</div><div class="meta2"><span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(placeLine(a))}</span></div></div></div>
      <label>Did everything go OK?</label><div class="opts"><label class="opt"><input type="radio" name="rt_ok" value="yes" ${prev?.ok!=='no'?'checked':''}>Yes, all good</label><label class="opt"><input type="radio" name="rt_ok" value="no" ${prev?.ok==='no'?'checked':''}>Something went wrong</label></div>
      <div class="wrongbox" id="rt_wrong"${prev?.ok==='no'?'':' hidden'}><b>Are you still in a bad situation?</b>
        <button class="btn bad" data-a="sos" data-id="${a.id}">${I('alert-triangle',16)} Yes, I need help now</button>
        <p class="small" style="margin:10px 0 6px">It already happened? Report what happened, and we'll follow up. A person on our team reads every report.</p>
        <div class="row" style="flex-wrap:wrap;gap:6px">${ppl.filter(u=>u!=='?'&&USERS[u]).map(u=>`<button class="btn sm ghost" data-a="report" data-id="${u}">${I('flag',13)} Report ${esc(uname(u))}</button>`).join('')}<a class="btn sm ghost" href="mailto:${esc(CFG.CONTACT_EMAIL||'admin@overhere.social')}?subject=${encodeURIComponent('Something went wrong at a plan')}">${I('mail',13)} Email us</a></div></div>
      <label>How much did you enjoy it?</label><div class="rstars" role="radiogroup" aria-label="How much you enjoyed it">${[5,4,3,2,1].map(n=>`<label title="${n} star${n>1?'s':''}"><input type="radio" name="rt_star" value="${n}" aria-label="${n} star${n>1?'s':''}" ${prev?.stars===n?'checked':''}><span>★</span></label>`).join('')}</div>
      <label>How was ${esc(uname(a.host))} as a host?</label><div class="rstars" role="radiogroup" aria-label="How the host was">${[5,4,3,2,1].map(n=>`<label title="${n} star${n>1?'s':''}"><input type="radio" name="rt_host" value="${n}" aria-label="${n} star${n>1?'s':''}" ${prev?.host_stars===n?'checked':''}><span>★</span></label>`).join('')}</div>
      <p class="small mute">Only our team sees ratings. Tap a name above to report someone.</p>
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
    return sheet(backB(m)+'Leave this plan?',`<div class="sb"><p style="margin-top:0">You'll leave <b>"${esc(short(a.desc))}"</b> and its group chat, and can't ask to join it again. ${esc(uname(a.host))} and the group see your reason.</p>
      <label>Why are you leaving?</label>${reasonList('lv',OPT_OUT)}
      <p class="small mute">"Feel uncomfortable with the group" and "Feel unsafe" stay private: the group only sees that you left, and our team looks at the plan. In danger right now? Call 112.</p>
      <button class="btn bad" data-a="doleave" data-id="${a.id}">Leave the plan</button><div style="height:8px"></div><button class="btn ghost" data-a="close">Stay</button></div>`);
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
    return sheet('Manage activity',`<div class="sb"><div class="sum">${planThumb(a)}<div style="min-width:0"><div class="t">${esc(a.desc)}</div><div class="meta2" style="margin-bottom:6px"><span>${I('calendar',13)}${whenStr(a.when)}</span><span>${I('map-pin',13)}${esc(placeLine(a))}</span></div>${actChip(a.status)} <span class="chip">${a.members.length}/${a.cap} accepted</span></div></div>
      <div style="height:12px"></div>
      ${a.members.length?`<button class="btn sec" data-a="chat" data-id="${a.id}">${I('message-circle',16)} Open group chat</button>`:'<p class="small mute">Chat opens when you accept the first member.</p>'}
      ${past?`<div class="row" style="margin-top:8px"><button class="btn sm ghost" data-a="postagain" data-id="${a.id}">${I('repeat',14)} Post again</button></div>`+(a.members.length?(a.attDone?`<p class="small mute">${I('circle-check',14)} You recorded attendance. Thanks!</p>`:hasEnded(a)?`<div style="height:8px"></div><button class="btn" data-a="rate" data-id="${a.id}">${I('star',16)} Rate and record attendance</button>`:`<p class="small mute">You can record who came once it ends, ${whenStr(endOf(a)).replace(/^(Today|Tomorrow)/,w=>w.toLowerCase())}.</p>`):'')
        :`<div class="row" style="margin-top:8px"><button class="btn sm ghost" data-a="editact" data-id="${a.id}">${I('pencil',14)} Edit details</button><button class="btn sm ghost" data-a="share" data-k="invite" data-id="${a.id}">${I('send',14)} Invite a friend</button></div>`}
      ${a.relist&&!past?`<div class="panel" style="background:var(--infobg);box-shadow:none;margin-top:12px"><b>A spot opened up</b><p class="small" style="margin:4px 0 10px">Someone left while the plan was full. Put the spot back up so others can ask to join, or keep the group as it is?</p>
        <div class="row"><button class="btn sm ghost" data-a="relist" data-id="${a.id}" data-k="no">Keep the group</button><button class="btn sm ok" data-a="relist" data-id="${a.id}" data-k="yes">Relist the spot</button></div></div>`:''}
      <h3>Pending requests (${pend.length})</h3>
      ${pend.length?pend.map(r=>person(r)+`<div class="row" style="margin-top:10px"><button class="btn sm bad" data-a="rej" data-id="${r.id}">Decline</button><button class="btn sm ok" data-a="acc" data-id="${r.id}">Accept</button></div></div>`).join(''):'<p class="mute small">No pending requests yet. Invite a friend to get the word out.</p>'}
      ${wl.length?`<h3>Waitlist (${wl.length})</h3><p class="small mute" style="margin-top:0">They move up to requests automatically, in this order, when a spot opens.</p>`+wl.map((r,i)=>`<div class="panel row" style="padding:12px 16px"><div class="hn">${av(r.user,'sm')}${esc(uname(r.user))}</div><div style="text-align:right"><span class="chip info">#${i+1}</span></div></div>`).join(''):''}
      ${done.length?`<h3>Decided</h3>`+done.map(r=>`<div class="panel row" style="padding:12px 16px"><div class="hn">${av(r.user,'sm')}${esc(uname(r.user))}</div><div style="text-align:right">${statusChip(r.status,true)}</div></div>`).join(''):''}
      ${past?'':`<div style="height:10px"></div><button class="btn bad" data-a="cancelact" data-id="${a.id}">Cancel this activity</button>`}</div>`,'full wide');
  }
  if(m.type==='city'){
    const h=homeLL(),cur=VIEW.city||'home',covered=CITIES.some(c=>kmBetween(h,[c[2],c[3]])<=NEAR_KM);
    const opt=(k,ic,t,sub)=>`<button class="sorto ${cur===k?'on':''}" role="radio" aria-checked="${cur===k}" data-a="setcity" data-k="${k}">${I(ic,18)}<span><b>${esc(t)}</b><small>${sub}</small></span>${cur===k?I('check',18):''}</button>`;
    const list=CITIES.map(c=>[c,kmBetween(h,[c[2],c[3]])]).sort((a,b)=>a[1]-b[1]);
    return sheet('Show plans in',`<div class="sb sortl" role="radiogroup" aria-label="Show plans in">
      ${opt('home','locate','Near '+homeName(),covered?`Within ${NEAR_KM} km of your home area`:'Only what people post near you, for now')}
      ${list.map(([c,km])=>opt(c[0],'map-pin',c[1],km<=NEAR_KM?'Your city':`${Math.round(km).toLocaleString('en-IN')} km from ${esc(homeName())}`+(VIEW.auto&&VIEW.city===c[0]?' · nearest to you':''))).join('')}
      <p class="small mute" style="margin:6px 2px 0">Your home area stays ${esc(S.me.hood)}. You can change it in Profile.</p></div>`);
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
      <div class="row drange"><div><label for="d_from">From</label><input type="date" id="d_from" value="${esc(f.dfrom)}" min="${dayKey(now())}" ${f.dto?`max="${f.dto}"`:''}></div><div><label for="d_to">To</label><input type="date" id="d_to" value="${esc(f.dto)}" min="${f.dfrom||dayKey(swipeEnd())}"></div></div>
      <h3>Time of day</h3><div class="fchips">${T('any',I('clock',13)+' Any time')}${T('morning','Morning')}${T('afternoon','Afternoon')}${T('evening','Evening')}${T('night','Night')}</div>
      <h3>Distance</h3><div class="fchips"><button class="fc ${!f.dist?'on':''}" data-a="fdist" data-k="0" aria-pressed="${!f.dist}">${I('map-pin',13)} Any distance</button>${DISTS.map(k=>`<button class="fc ${f.dist===k?'on':''}" data-a="fdist" data-k="${k}" aria-pressed="${f.dist===k}">Within ${k} km</button>`).join('')}</div>
      </div>
      <div class="sfoot">${any?'<button class="btn ghost" data-a="freset">Reset</button>':''}<button class="btn" data-a="close">Show ${n} ${n===1?'activity':'activities'}</button></div></div></div>`;
  }
  if(m.type==='editprofile'){
    const me=S.me,cur=m.emo||me.emo||defEmo(me.gender),photo=!!me.photo&&!m.emo;
    return sheet('Edit profile',`<div class="sb">
      <h3 style="margin-top:0">Your photos</h3>
      <p class="small mute" style="margin:0 0 10px">Photo 1 is your profile picture. The face check needs both and matches your live face against each.</p>
      <div id="ep_photos">${photoPair()}</div>
      ${photo?`<button class="btn sm bad" data-a="rmphoto">${I('trash',14)} Remove photos</button>`:''}
      <h3>Or an emoji</h3>
      <div class="epav"><span id="ep_av">${photo?av('me','lg'):`<span class="av emo lg" style="background:${PASTEL[0]}" aria-hidden="true">${esc(cur)}</span>`}</span>
        <p class="small mute" style="margin:0">${photo?`Picking an emoji removes your photos${me.face?' and means redoing your face check':''}.`:'Other people see this next to your name until you add photos.'}</p></div>
      <div class="emogrid" role="radiogroup" aria-label="Emoji">${EMOJIS.map(e=>`<button role="radio" aria-checked="${!photo&&e===cur}" class="${!photo&&e===cur?'on':''}" data-a="pickemo" data-e="${esc(e)}" aria-label="${esc(e)}">${esc(e)}</button>`).join('')}</div>
      <h3>About you</h3>
      <label for="p_name" style="margin-top:0">First name</label><input id="p_name" maxlength="40" autocomplete="given-name" value="${esc(me.name)}">
      <label for="p_last">Last name</label><input id="p_last" maxlength="40" autocomplete="family-name" value="${esc(me.last||'')}">
      <label for="p_dob">Date of birth</label><input id="p_dob" type="date" value="${esc(me.dob)}" ${me.kyc?'disabled':''}>
      <label for="p_gender">Gender identity</label><select id="p_gender" ${me.kyc?'disabled':''}>${GENDERS.map(g=>`<option ${g===me.gender?'selected':''}>${g}</option>`).join('')}</select>
      <p class="small mute" style="margin-top:6px">${me.kyc?`Confirmed by your ID check. To change these, email ${esc(CFG.CONTACT_EMAIL||'the beta team')}.`:'Decides which audience-limited plans you can see.'}</p>
      <label for="p_hood">Home area</label>${placeBox('p_hood','Search your area or city',me.hood,'Areas in India')}
      ${locBtn('p_hood','Use my current location')}
      <p class="small mute" style="margin-top:6px">Anywhere in India. You see plans within ${NEAR_KM} km of here, and distances are measured from it. With your current location, only the area is saved (to about 1 km), never your exact spot.</p>
      <label for="p_job">Profession</label><input id="p_job" maxlength="40" value="${esc(me.job||'')}" placeholder="e.g. Designer">
      <label for="p_bio">Bio</label><textarea id="p_bio" maxlength="300" placeholder="A line or two so hosts know who you are">${esc(me.bio||'')}</textarea>
      <label>What do you like doing?</label>${intOpts('p_int',me.ints)}
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
    const muted=!!S.muted[a.id],closed=chatClosed(a),msgs=(S.chats[a.id]||[]).map((x,i)=>msgHtml(a,x,i)).join('');
    const tips=S.tips[a.id]?'':`<div class="tips"><b>${I('shield-check',15)} Meeting new people? A few tips</b><ul><li>Meet in a busy public place and make your own way there.</li><li>Tell someone you trust where you'll be. <button class="lnk" data-a="share" data-k="trust" data-id="${a.id}">Share plan</button></li><li>Leave whenever you like. Tap SOS if you ever feel unsafe.</li><li>Tap ${I('flag',11)} next to a name to report a message.</li></ul><button class="btn sm sec" data-a="tipsok" data-id="${a.id}">Got it</button></div>`;
    return `<div class="ov"><div class="sheet full chat"><div class="sh"><h2 style="font-size:15px">${esc(a.desc.slice(0,34))}</h2>
      <button class="ib" data-a="members" data-id="${a.id}" title="Members" aria-label="Members">${I('users',17)}</button>
      <button class="ib" data-a="mute" data-id="${a.id}" title="${muted?'Unmute':'Mute'} chat notifications" aria-label="${muted?'Unmute':'Mute'} chat notifications" aria-pressed="${muted}">${I(muted?'bell-off':'bell',17)}</button>
      <button class="sosb" data-a="sos" data-id="${a.id}" aria-label="SOS: get help now">SOS</button>
      <button class="ib" data-a="close" title="Close">${I('x',18)}</button></div>
      <p class="small mute" style="padding:8px 18px;margin:0">Members: ${esc([a.host,...a.members].map(uname).join(', '))} · full history visible to everyone${muted?' · notifications muted':''}${isSample(a.host)?' · <b>Sample plan: the host\'s messages are pre-written and nobody will be there</b>':''}</p>
      <div class="msgs" id="msgs">${closed?'':tips}${msgs}</div>${closed?`<div class="cin closed" role="status">${I('lock',15)}<span>This chat closed ${CHAT_OPEN_H} hours after the plan ended. You can still read it.</span></div>`:`<div class="cin"><button class="ib" data-a="newpoll" data-id="${a.id}" title="Create a poll" aria-label="Create a poll">${I('bar-chart',18)}</button><input id="c_in" placeholder="Message the group" autocomplete="off" aria-label="Message the group"><button class="btn sm" data-a="send" data-id="${a.id}" aria-label="Send">${I('send',15)}</button></div>`}</div></div>`;
  }
  if(m.type==='members'){
    const a=actOf(m.id);if(!a)return '';
    const host=a.host==='me',past=isPast(a);
    const row=(u,right)=>`<div class="panel row" style="padding:12px 16px"><div class="hn">${av(u,'sm')}<button class="hlink" data-a="user" data-id="${u}">${esc(u==='me'?'You':uname(u))}</button></div><div style="text-align:right">${right}</div></div>`;
    return sheet(backB(m)+`Members (${a.members.length+1})`,`<div class="sb">
      ${row(a.host,'<span class="chip acc">Host</span>')}
      ${a.members.map(u=>row(u,host&&!past&&u!=='?'?`<button class="btn sm bad" data-a="rmmember" data-id="${a.id}" data-u="${u}">Remove</button>`:'')).join('')}
      ${!host&&!past&&a.members.includes('me')?`<div style="height:10px"></div><button class="btn bad" data-a="leave" data-id="${a.id}">${I('log-out',16)} Leave the plan</button>`:''}</div>`);
  }
  if(m.type==='rmmember'){
    const a=actOf(m.id);if(!a)return '';
    return sheet(backB(m)+'Remove member?',`<div class="sb"><p style="margin-top:0"><b>${esc(uname(m.u))}</b> will be taken out of <b>"${esc(short(a.desc))}"</b> and its group chat, and can't ask to join it again. They and the group see your reason.</p>
      <label>Why?</label>${reasonList('rm',RM_REASONS)}
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

/* After the last try: email the team to get the check done by hand (CONTACT_EMAIL in config.js). The account id goes
   in the email so the team can find it in /addmin; it's not secret. */
function reviewMail(kind){
  const to=CFG.CONTACT_EMAIL||'admin@overhere.social',what=kind==='face'?'face check':'ID check';
  const href=`mailto:${to}?subject=${encodeURIComponent('Manual '+what+' for '+(S.me?.name||'my account'))}&body=${encodeURIComponent(`Hi Overhere team,\n\nMy ${what} didn't pass after ${VER[kind]?.max||5} tries. Please check it by hand.\n\nAccount: ${ME}\nSigned in with: ${MYPHONE?'+91 '+MYPHONE:'email'}\n`)}`;
  return `<p class="small" style="text-align:center;margin:14px 0 8px">Want it sorted sooner? Email us and we'll verify you by hand.</p>
    <a class="btn sec" href="${esc(href)}">${I('mail',16)} Email ${esc(to)}</a>`;
}

/* ---------- render: sign-in and onboarding ---------- */
const LOGO='<div class="logo" style="font-size:22px;margin-bottom:14px"><span class="dots"><i></i><i></i></span>Overhere</div>';
/* Sign-in fields: an icon in front and a message line under each. Password boxes also get a show/hide button and a Caps Lock warning. */
const emailField=()=>`<label for="a_email">Email</label><div class="fi">${I('mail',18)}<input id="a_email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" maxlength="120" placeholder="you@example.com" value="${esc(ui.auth.email||'')}" aria-describedby="a_email_err a_email_hint"></div>
  <p class="ferr" id="a_email_err" aria-live="polite"></p><p class="fhint" id="a_email_hint" aria-live="polite" hidden></p>`;
const pwField=(id,label,ac,side='')=>`<div class="lrow"><label for="${id}">${label}</label>${side}</div><div class="fi">${I('lock',18)}<input id="${id}" class="pwi" type="password" autocomplete="${ac}" maxlength="72" autocapitalize="off" spellcheck="false" aria-describedby="${id}_err ${id}_caps"><button type="button" class="pwt" data-a="pwshow" data-id="${id}" aria-label="Show password" aria-pressed="false">${I('eye',18)}</button></div>
  <p class="caps" id="${id}_caps" hidden>${I('alert-triangle',14)} Caps Lock is on</p><p class="ferr" id="${id}_err" aria-live="polite"></p>`;
const pwMeter=()=>`<div class="pws" id="a_pws" data-s="0">
  <p class="pwl"><span>Password strength</span><b id="a_pwl" aria-live="polite"></b></p><div class="pwbar"><i></i><i></i><i></i><i></i></div>
  <p class="pwtip" id="a_pwtip" aria-live="polite" hidden></p>
  <ul class="pwr">${PW_RULES.map(([t])=>`<li><span class="pwc">${I('check',11)}</span>${t}</li>`).join('')}</ul></div>`;
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
    return `<div class="ob">${LOGO}<div class="mailic">${I('phone',28)}</div><h1 class="pt">${up?'Sign up with phone':'Continue with phone'}</h1><p class="sub">We'll text you a 6-digit code to confirm it's you. ${up?"Next you'll add your email and a password.":'New here? This creates your account.'}</p>
    <form id="a_form" data-submit="sendcode" novalidate><label for="a_phone">Mobile number</label>
    <div class="fi tel"><span class="cc">${I('phone',16)}+91</span><input id="a_phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="16" placeholder="98765 43210" value="${esc(ui.auth.phone?fmtPhone(ui.auth.phone.slice(3)):'')}" aria-describedby="a_phone_err a_phone_note"></div>
    <p class="ferr" id="a_phone_err" aria-live="polite"></p><p class="fhint" id="a_phone_note">Indian mobile numbers only.</p>
    ${AGEBOX}<div style="height:18px"></div>${ERRBOX}${goBtn('Send code')}</form>
    <div style="height:8px"></div><button class="btn ghost" data-a="authmode" data-k="${up?'up':'in'}">Back</button>
    <p class="small mute" style="text-align:center;margin-top:12px">By continuing you agree to our <a href="terms.html" target="_blank" rel="noopener" style="color:inherit">Terms</a> and <a href="privacy.html" target="_blank" rel="noopener" style="color:inherit">Privacy policy</a>. Standard SMS rates may apply.</p></div>`;
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
  /* anim: the tab you just left. The pill starts there and authmode slides it across. */
  const up=md==='up',was=ui.auth.anim;
  return `<div class="ob">${LOGO}<p class="mute">Do things in your city with company. Post a plan you are already making, pick who joins. Not a dating app.</p>
    <div class="seg atab${(was?was==='up':up)?' up':''}"><button type="button" class="${up?'':'on'}" aria-pressed="${!up}" data-a="authmode" data-k="in">Sign in</button><button type="button" class="${up?'on':''}" aria-pressed="${up}" data-a="authmode" data-k="up">Create account</button></div>
    <div class="aswap${was?' in':''}"><h1 class="pt" style="margin-bottom:18px">${up?'Create your account':'Welcome back'}</h1>
    ${up?AGEBOX.replace('margin-top:14px','margin:0 0 14px'):''}${CFG.PHONE_LOGIN?`<button class="btn out" data-a="authmode" data-k="phone">${I('phone',16)} Continue with phone</button>
    <div class="or">or with email</div>`:''}
    <form id="a_form" data-submit="${up?'signup':'signin'}" novalidate>${emailField()}
    ${pwField('a_pw','Password',up?'new-password':'current-password',up?'':'<button type="button" class="lnk" data-a="authmode" data-k="reset">Forgot password?</button>')}
    ${up?pwMeter()+pwField('a_pw2','Confirm password','new-password'):''}
    <div style="height:18px"></div>${ERRBOX}${goBtn(up?'Create account':'Sign in')}</form>
    ${up?'<p class="small mute" style="text-align:center;margin-top:12px">By creating an account you agree to our <a href="terms.html" target="_blank" rel="noopener" style="color:inherit">Terms</a> and <a href="privacy.html" target="_blank" rel="noopener" style="color:inherit">Privacy policy</a>.</p>':''}
    <p class="small" style="text-align:center;margin-top:14px">${up?'Already have an account? <button class="lnk" data-a="authmode" data-k="in">Sign in</button>'
      :'New here? <button class="lnk" data-a="authmode" data-k="up">Create an account</button>'}</p>
    <p class="small mute" style="text-align:center;margin-top:10px"><a href="terms.html" target="_blank" rel="noopener" style="color:inherit">Terms</a> · <a href="privacy.html" target="_blank" rel="noopener" style="color:inherit">Privacy policy</a> · <a href="copyright.html" target="_blank" rel="noopener" style="color:inherit">Copyright</a> · <a href="credits.html" target="_blank" rel="noopener" style="color:inherit">Credits</a></p></div></div>`;
}
/* Phone accounts also need a confirmed email: add it, then type the code Supabase emails ("Change email address"
   template, supabase/templates/change-email.html). Comes before onboarding, and once for older phone accounts. */
function emailStepHtml(){
  if(ui.auth.mode==='ecode'){
    const left=Math.ceil(((ui.auth.sent||0)+RESEND_MS-Date.now())/1000),box=inboxOf(ui.auth.email||'');
    return `<div class="ob">${LOGO}<div class="mailic">${I('mail',30)}</div><h1 class="pt">Enter the code</h1><p class="sub">We sent a 6-digit code to <b>${esc(ui.auth.email)}</b>. <button class="lnk" style="padding:0" data-a="emailstep">Edit</button> It can take a minute, and sometimes lands in spam.</p>
    <form id="a_form" data-submit="checkecode" novalidate><label for="a_code">Code from the email</label>
    <div class="otp"><input id="a_code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" spellcheck="false" aria-describedby="a_code_err"><div class="otpc" aria-hidden="true">${'<span></span>'.repeat(6)}</div></div>
    <p class="ferr" id="a_code_err" aria-live="polite"></p>
    <div style="height:18px"></div>${ERRBOX}${goBtn('Confirm email')}</form>
    ${box?`<div style="height:8px"></div><a class="btn ghost" href="${box[1]}" target="_blank" rel="noopener">${I('mail',16)} Open ${box[0]}</a>`:''}
    <p class="small" style="text-align:center;margin-top:14px">Didn't get it? <button class="lnk" id="a_resend" data-a="resendecode"${left>0?' disabled':''}>${left>0?`Resend code in ${left}s`:'Resend code'}</button> · <button class="lnk" data-a="emailstep">Use a different email</button></p></div>`;
  }
  return `<div class="ob">${LOGO}<div class="mailic">${I('mail',30)}</div><h1 class="pt">Add your email</h1><p class="sub">Your phone number is confirmed. Now add your email and confirm it with a code. It's for account emails only, and nobody else sees it.</p>
    <form id="a_form" data-submit="addemail" novalidate>${emailField()}<div style="height:16px"></div>${ERRBOX}${goBtn('Send code')}</form>
    <p class="small mute" style="text-align:center;margin-top:14px"><button class="lnk" data-a="signout">Sign out</button></p></div>`;
}
/* Phone sign-ups, after the email: choose a password. Then they can also sign in with that email and password.
   Older phone accounts see this once too. */
function pwStepHtml(){
  return `<div class="ob">${LOGO}<div class="mailic">${I('lock',30)}</div><h1 class="pt">Create a password</h1><p class="sub">Your email is confirmed. Now choose a password, so you can also sign in with <b>${esc(AUTHU.mail)}</b> and this password.</p>
    <form id="a_form" data-submit="phonepw" novalidate><input type="email" name="username" autocomplete="username" value="${esc(AUTHU.mail)}" readonly hidden>
    ${pwField('a_pw','Password','new-password')}${pwMeter()}${pwField('a_pw2','Confirm password','new-password')}
    <div style="height:16px"></div>${ERRBOX}${goBtn('Save password')}</form>
    <p class="small mute" style="text-align:center;margin-top:14px"><button class="lnk" data-a="signout">Sign out</button></p></div>`;
}
/* "Create your profile" in three short pages (who you are, where you're based, what you like), as in the app.
   OBF keeps the answers between pages, starting empty; nothing is saved until the last page. */
const OB_STEPS=3;let OBF={};
function obKeep(){
  const d=OBF;
  if(document.getElementById('o_name')){d.name=val('o_name');d.last=val('o_last');d.dob=val('o_dob');d.gender=val('o_gender')}
  if(document.getElementById('o_hood'))d.hood=val('o_hood');
  if(document.getElementById('o_ok')){d.ints=many('o_int');d.avail=many('o_avail');d.ok=document.getElementById('o_ok').checked;d.usage=!!document.getElementById('o_usage')?.checked}
  return d;
}
function onboardHtml(){
  let body;
  if(!S.me){
    const d=OBF,st=ui.obStep||0,tgt='target="_blank" rel="noopener" style="color:inherit"';
    const back='<div style="height:8px"></div><button class="btn sec" data-a="obback">Back</button>';
    body=`<div class="logo" style="margin-bottom:18px"><span class="dots"><i></i><i></i></span>Overhere</div>
    <div class="obbar" role="img" aria-label="Step ${st+1} of ${OB_STEPS}">${Array.from({length:OB_STEPS},(_,k)=>`<i class="${k<=st?'on':''}"></i>`).join('')}</div>`+(st===0?`<h1 class="pt">About you</h1>
    <label for="o_name">First name</label><input id="o_name" maxlength="40" autocomplete="given-name" value="${esc(d.name||'')}">
    <label for="o_last">Last name</label><input id="o_last" maxlength="40" autocomplete="family-name" value="${esc(d.last||'')}">
    <label for="o_dob">Date of birth</label><input id="o_dob" type="date" value="${esc(d.dob||'')}">
    <label for="o_gender">Gender</label><select id="o_gender"><option value="">Select…</option>${GENDERS.map(g=>`<option ${g===d.gender?'selected':''}>${g}</option>`).join('')}</select>
    <div style="height:18px"></div><button class="btn" data-a="obnext">Next</button>
    <p class="small" style="text-align:center;margin-top:14px"><button class="lnk" data-a="signout">Sign out</button></p>`
    :st===1?`<h1 class="pt">Where are you based?</h1>
    <label for="o_hood">Home area</label>${placeBox('o_hood','Search your area or city, e.g. Indiranagar, Bengaluru',d.hood,'Areas in India')}
    ${locBtn('o_hood','Use my current location')}
    <div style="height:18px"></div><button class="btn" data-a="obnext">Next</button>${back}`
    :`<h1 class="pt">What do you like doing?</h1>${intOpts('o_int',d.ints)}
    <label>When are you usually free?</label>${opts('o_avail',TIMES,d.avail)}
    <label class="chk top" style="margin-top:18px"><input type="checkbox" id="o_ok" ${d.ok?'checked':''}> <span>I agree to the <a href="terms.html" ${tgt}>Terms</a> and <a href="privacy.html" ${tgt}>Privacy policy</a></span></label>
    <label class="chk top" style="margin-top:10px"><input type="checkbox" id="o_usage" ${d.usage?'checked':''}> <span>Share usage statistics to help improve Overhere (optional)</span></label>
    <div style="height:18px"></div><button class="btn" data-a="ob2">Continue</button>${back}`);
  }else if(!S.me.face&&!ui.faceSkip&&!twoPhotos())body=`<h1 class="pt">Add two photos of you</h1><p class="sub">Photo 1 is your profile picture, and both show on your profile. The face check matches your live face against both.</p>${photoPair()}
    <div style="height:8px"></div><button class="btn sec" data-a="obfaceskip">Skip for now</button>
    <p class="small mute" style="text-align:center;margin-top:10px">Without photos you can browse, and other people see your emoji. Posting and joining plans need both photos and the face check.</p>
    <p class="small" style="text-align:center;margin-top:14px"><button class="lnk" data-a="signout">Sign out</button></p>`;
  else if(!S.me.face&&!ui.faceSkip)body=`<h1 class="pt">Quick face check</h1><p class="sub">Confirms you're a real person, and the person in your two photos. You can browse without it, but you need it to post a plan or ask to join one.</p><div class="ob-av">${av('me','lg')}</div><button class="btn" data-a="obface">Start face check</button>
    <div style="height:8px"></div><button class="btn sec" data-a="obfaceskip">Skip for now</button>
    <p class="small" style="text-align:center;margin-top:14px"><button class="lnk" data-a="signout">Sign out</button></p>`;
  else body=`<h1 class="pt">Tell us more (optional)</h1><p class="sub">You can skip this and add it later.</p>
    <label for="o_job">Profession</label><input id="o_job" maxlength="40"><label for="o_bio">Bio</label><textarea id="o_bio" maxlength="300"></textarea>
    <div style="height:16px"></div><button class="btn" data-a="obdone" data-save="1">Save and start browsing</button><div style="height:8px"></div><button class="btn sec" data-a="obdone">Skip for now</button>`;
  return `<div class="ob">${body}</div>`;
}

/* Under 18: the server has deleted the login (save_profile). Clear this device too and say what happened. */
async function gone18(){GONE18=true;ui.modal=null;try{localStorage.removeItem(photoKey())}catch(e){}try{await SB.auth.signOut({scope:'local'})}catch(e){}render()}
/* ---------- profile photo: pick -> crop -> resize + compress -> stored on this device only ---------- */
const PHOTO_OUT=400,PHOTO_MAX_BYTES=60*1024,PHOTO_MAX_FILE=20*1024*1024,PHOTO_MIN_SIDE=200,PHOTO_MAX_ZOOM=4,PHOTO_WORK=3000;
let crop=null,cropRaf=0,cropSlot=1;   // which photo (1 or 2) the cropper is for

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
/* JPEG, not WebP: the face check compares the live face with this photo, and AWS only reads JPEG and PNG. */
async function compressPhoto(canvas){
  const enc=q=>new Promise(r=>canvas.toBlob(r,'image/jpeg',q));
  let q=.85,b=await enc(q);
  while(b.size>PHOTO_MAX_BYTES&&q>.5){q-=.1;b=await enc(q)}
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
  ov.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="cr_t"><div class="sh"><h2 id="cr_t">Crop photo ${cropSlot} of 2</h2><button class="ib" id="cr_x" title="Close">${I('x',18)}</button></div>
  <div class="sb"><div class="crop" id="cr_box" tabindex="0" aria-label="Crop area. Drag or use arrow keys to move, plus and minus to zoom."><canvas id="cr_cv"></canvas></div>
  <p class="small mute" style="text-align:center;margin:0">Drag to reposition. Pinch, scroll or use the slider to zoom.</p>
  <div class="cz">${I('zoom-out',16)}<input type="range" id="cr_z" min="1" max="${PHOTO_MAX_ZOOM}" step="0.01" value="1" aria-label="Zoom">${I('zoom-in',16)}<button class="ib" id="cr_rot" title="Rotate">${I('rotate-cw',18)}</button></div>
  <div class="row"><button class="btn ghost" id="cr_pick">Choose another</button><button class="btn" id="cr_ok">Use photo</button></div>
  <p class="small mute" style="text-align:center;margin:12px 0 0">Your face must be clearly visible: just you, facing the camera, in good light. No filters, sunglasses or mirror selfies. Your face check is matched against it. Saved small (${PHOTO_OUT}×${PHOTO_OUT}) and shown on your profile.</p>
  ${S.me.face?'<p class="small" style="text-align:center;margin:8px 0 0;color:var(--warn)">You\'re verified. A new photo means doing the face check again, so it matches.</p>':''}</div></div>`;
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
  $$('cr_pick').onclick=()=>(document.getElementById('p_photo')||photoInput()).click();
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
  const rnd=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>'0123456789abcdefghijklmnopqrstuvwxyz'[b%36]).join('');
  const path=`${ME}/${rnd}.jpg`;
  const {error}=await SB.storage.from('avatars').upload(path,blob,{contentType:'image/jpeg',upsert:false,cacheControl:'31536000'});
  if(error){btn.disabled=false;btn.textContent='Use photo';return toast(friendly(error))}
  if(!await setPhoto(path,cropSlot)){SB.storage.from('avatars').remove([path]).catch(()=>{});btn.disabled=false;btn.textContent='Use photo';return}
  track('avatar_photo');
  closeCropper();
  /* the edit sheet is swapped in place so typed changes are kept; anywhere else (sign-up steps, the face check
     sheet, Profile) re-renders, which moves on to the face check once both photos are there */
  if(ui.modal?.type==='editprofile'){
    refreshMyPhoto();
    const pp=document.getElementById('ep_photos');if(pp)pp.innerHTML=photoPair();
    const pv=document.getElementById('ep_av');if(pv){pv.innerHTML=av('me','lg');delete ui.modal.emo;document.querySelectorAll('[data-a=pickemo]').forEach(b=>{b.classList.remove('on');b.setAttribute('aria-checked','false')})}
  }else render();
  toast(cropSlot===1&&!S.me.photo2?'Photo 1 saved. Now add photo 2.':`Photo ${cropSlot} saved (${Math.max(1,Math.round(blob.size/1024))} KB)`);
}
/* Swap my avatars in place so unsaved edits in the profile form are kept. */
function refreshMyPhoto(){
  document.querySelectorAll('.av[data-me]').forEach(el=>{el.outerHTML=av('me',[...el.classList].filter(c=>c!=='av'&&c!=='emo').join(' '))});
}
/* The file input lives on the Profile tab; make one when uploading from elsewhere (the edit sheet). */
function photoInput(){const i=document.createElement('input');i.type='file';i.id='p_photo';i.accept='image/jpeg,image/png,image/webp,image/*';i.hidden=true;document.getElementById('screen').appendChild(i);return i}
function photoMenu(open){
  const mn=document.getElementById('p_menu'),pe=document.getElementById('p_pe');if(!mn)return;
  if(open)mn.innerHTML=`<button role="menuitem" data-a="emojipick">${I('user',15)} Choose emoji</button><button role="menuitem" data-a="pickphoto" data-k="1">${I('camera',15)} ${S.me.photo?'Change photo 1':'Add photo 1'}</button>${S.me.photo?`<button role="menuitem" data-a="pickphoto" data-k="2">${I('camera',15)} ${S.me.photo2?'Change photo 2':'Add photo 2'}</button><button role="menuitem" class="bad" data-a="rmphoto">${I('trash',15)} Remove photos</button>`:''}`;
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
  if(GONE18){scr.innerHTML=`<div class="ob">${LOGO}<h1 class="pt">Sorry, Overhere is for adults</h1><p class="sub">Overhere is only for people aged 18 and over, so we didn't create your account. We've deleted the sign-in details you gave us and kept nothing.</p><p class="small mute">If you entered your date of birth by mistake, you can sign up again.</p><button class="btn sec" data-a="gone18">Back to the start</button></div>`;return}
  if(!ONLINE||!ME||!loaded){scr.innerHTML=authHtml();restore();return}
  if(AUTHU.phone&&!AUTHU.email){scr.innerHTML=emailStepHtml();restore();return}
  if(!AUTHU.pw){if(ui.auth.mode!=='pwstep')ui.auth={mode:'pwstep'};scr.innerHTML=pwStepHtml();restore();return}
  if(!S.me||!S.me.obDone){scr.innerHTML=onboardHtml()+modalHtml();restore();afterRender();return}
  if(!S.me.terms&&ui.modal?.type!=='terms')ui.modal={type:'terms'};   // accounts made before the terms: agree once
  /* a hosted plan whose three attendance reminders went unanswered comes before anything else */
  else{const due=DUE.find(x=>x.overdue&&actOf(x.act)&&!actOf(x.act).attDone);if(due&&ui.modal?.type!=='verify'&&!(ui.modal?.type==='mustrate'&&ui.modal.id===due.act))ui.modal={type:'mustrate',id:due.act}}
  const unread=S.notes.filter(n=>!n.read).length;
  const view={swipe:tabSwipe,discover:tabDiscover,acts:tabActs,reqs:tabReqs,profile:tabProfile,notes:tabNotes,chats:tabChats}[ui.tab]();
  const pend=S.reqs.filter(r=>r.status==='pending'&&actOf(r.act)?.host==='me').length;
  const TT=(k,l)=>`<button class="tt ${ui.tab===k?'on':''}" data-a="tab" data-t="${k}">${l}</button>`;
  const T=(k,ic,l)=>`<button class="${ui.tab===k?'on':''}" data-a="tab" data-t="${k}">${I(ic,20)}${l}</button>`;
  scr.innerHTML=`<header><div class="hb"><div class="logo"><button class="logob" data-a="tab" data-t="swipe" title="Home" aria-label="Overhere: go to Swipe"><span class="dots"><i></i><i></i></span>Overhere</button><button class="beta" data-a="fb" data-k="beta" title="Overhere is in beta. Tell us what you think">Beta</button></div>
  <div class="tnav">${TT('swipe','Swipe')}${TT('discover','Discover')}<button class="btn sm" data-a="newpost">${I('plus',15)} Create Activity</button>${TT('acts','Activities'+(pend?` (${pend})`:''))}${TT('reqs','Requests')}</div>
  <div class="hr"><button class="ib${ui.tab==='chats'?' on':''}" data-a="chats" title="Chats" aria-label="Chats" aria-pressed="${ui.tab==='chats'}">${I('messages-square',19)}${chatUnread()?'<span class="dot"></span>':''}</button><button class="ib${ui.tab==='notes'?' on':''}" data-a="bell" title="Notifications" aria-label="Notifications" aria-pressed="${ui.tab==='notes'}">${I('bell',19)}${unread?'<span class="dot"></span>':''}</button><button class="fbb" data-a="fb" data-k="header" title="Tell us what you think of Overhere">${I('message-heart',16)}<span>Feedback</span></button><button class="ib${ui.tab==='profile'?' on':''}" data-a="tab" data-t="profile" title="Your profile" aria-label="Your profile">${av('me')}</button></div></div></header>
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
  fbState();   // the values put back may have completed (or not) the feedback form
}
function afterRender(){
  bindDrag();
  drawMap();
  const ms=document.getElementById('msgs');if(ms)ms.scrollTop=ms.scrollHeight;
}

/* ---------- actions ---------- */
const capNote=n=>`You + <b>${n}</b> = a group of <b>${n+1}</b>. Your card shows ${n} spots open.`;
const val=id=>document.getElementById(id)?.value?.trim()||'';
const pw=()=>document.getElementById('a_pw')?.value||'';
/* the email a new password mustn't contain: the one being typed, or the account's (the phone sign-up password step has no email field) */
const pwMail=()=>val('a_email')||AUTHU.mail||'';
const here=()=>location.origin+location.pathname;
/* Supabase lets a number or an email address ask for a new code or link once a minute; the button counts down to match. */
const RESEND_MS=60000;let resendT=0;
function resendTimer(){
  clearInterval(resendT);
  resendT=setInterval(()=>{
    const b=document.getElementById('a_resend'),left=Math.ceil((ui.auth.sent+RESEND_MS-Date.now())/1000),what=['code','ecode'].includes(ui.auth.mode)?'code':'email';
    if(!b||!['code','check','ecode'].includes(ui.auth.mode)){clearInterval(resendT);return}
    b.disabled=left>0;b.textContent=left>0?`Resend ${what} in ${left}s`:`Resend ${what}`;
    if(left<=0)clearInterval(resendT);
  },1000);
}

/* ---------- sign-in form checks ---------- */
const EMAIL_RE=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PW_RULES=[['8+ characters',p=>p.length>=8],['A letter',p=>/[a-z]/i.test(p)],['A number',p=>/\d/.test(p)],['A symbol (stronger)',p=>/[^A-Za-z0-9]/.test(p)]];
const COMMON_PW=new Set(['password','password1','password12','password123','passw0rd','12345678','123456789','1234567890','87654321','11111111','00000000',
  'qwerty12','qwerty123','qwertyuiop','asdfghjkl','1q2w3e4r','zaq12wsx','abc12345','abcd1234','iloveyou','letmein1','welcome1','welcome123','admin123',
  'sunshine','princess','football','baseball','superman','monkey123','india123','india@123','overhere','overhere1']);
/* Words people build passwords around. Matched anywhere, after undoing look-alike swaps, so "P@ssw0rd" is still "password". */
const WEAK_WORDS=['password','passwd','pass','welcome','qwerty','admin','india','bharat','love','letmein','hello','secret','monkey','dragon',
  'cricket','football','baseball','soccer','sunshine','princess','master','login','user','test','overhere','tagalong','angel','shadow','super',
  'batman','killer','computer','internet','google','facebook','summer','winter','flower','freedom','whatever','trustno','starwars','pokemon',
  'naruto','cheese','chocolate','money','family','friend','happy','lucky','apple','orange','banana','mother','father','baby','delhi','mumbai',
  'punjab','chandigarh','krishna','ganesh','sairam','hunter','charlie','michael','jordan','iloveyou','pakistan']
  .sort((a,b)=>b.length-a.length);
const LEET={'@':'a','4':'a','0':'o','1':'i','!':'i','|':'l','3':'e','5':'s','$':'s','7':'t'};
const KEYS=['qwertyuiop','asdfghjkl','zxcvbnm','1qaz2wsx3edc4rfv'];
/* 0 to 4, from a rough count of how many guesses the password would take. Each character you'd have to guess adds a lot;
   a common word, a year, a run like 123 or qwerty, or a repeat adds only a little, however it's dressed up with capitals
   and symbols. Also says what made it weak (why, and the part it found), for the hint under the field. */
function pwScore(p,email){
  const lo=p.toLowerCase(),n=[...lo].map(c=>LEET[c]||c).join(''),user=(email.split('@')[0]||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  if(COMMON_PW.has(lo)||COMMON_PW.has(n)||/^(.)\1+$/.test(p))return {s:0,why:'common'};
  const used=Array(p.length).fill(false),found=[];let bits=0;
  /* claim p[i..j) for a weak part, if none of it is claimed yet */
  const take=(i,j,cost,why)=>{for(let k=i;k<j;k++)if(used[k])return;for(let k=i;k<j;k++)used[k]=true;bits+=cost;found.push({why,hit:p.slice(i,j)})};
  const each=(s,w,fn)=>{for(let i=s.indexOf(w);i>=0;i=s.indexOf(w,i+1))fn(i)};
  if(user.length>=3)each(n,user,i=>take(i,i+user.length,6,'email'));
  WEAK_WORDS.forEach(w=>each(n,w,i=>take(i,i+w.length,10+(/[A-Z]/.test(p.slice(i,i+w.length)))+(lo.slice(i,i+w.length)!==w),'word')));
  KEYS.forEach(r=>{for(let len=r.length;len>=4;len--)for(let a=0;a+len<=r.length;a++){const w=r.slice(a,a+len);each(lo,w,i=>take(i,i+len,5,'keys'));each(lo,[...w].reverse().join(''),i=>take(i,i+len,5,'keys'))}});
  for(const m of p.matchAll(/(19|20)\d\d/g))take(m.index,m.index+4,5,'year');
  /* runs like abc, 123, 987: each step one letter or digit up, or down */
  for(let i=0;i<lo.length-2;){
    const d=lo.charCodeAt(i+1)-lo.charCodeAt(i);let j=i+1;
    if(Math.abs(d)===1&&/[a-z0-9]/.test(lo[i]))while(j<lo.length&&lo.charCodeAt(j)-lo.charCodeAt(j-1)===d&&/[a-z0-9]/.test(lo[j]))j++;
    if(j-i>=3){take(i,j,4,'run');i=j}else i++;
  }
  for(const m of p.matchAll(/(.)\1{2,}/g))take(m.index,m.index+m[0].length,6,'repeat');
  for(const m of p.matchAll(/(.{2,}?)\1+/g))take(m.index+m[1].length,m.index+m[0].length,2,'repeat');
  const pool=(/[a-z]/.test(p)?26:0)+(/[A-Z]/.test(p)?26:0)+(/\d/.test(p)?10:0)+(/[^A-Za-z0-9]/.test(p)?33:0);
  bits+=used.filter(u=>!u).length*Math.log2(pool||1);
  return {s:bits<30?1:bits<40?2:bits<55?3:4,...(found[0]||{})};
}
/* What to say about a weak password: names the part that gives it away. */
function pwHint({why,hit}){
  return why==='common'?'This is one of the first passwords attackers try. Pick something less common'
    :why==='email'?"Leave your email name out of your password"
    :why==='word'?`Common words like "${hit}" are easy to guess, even with symbols swapped in`
    :why==='keys'?`Keyboard patterns like "${hit}" are easy to guess`
    :why==='run'?`Runs like "${hit}" are easy to guess`
    :why==='year'?`Years like ${hit} are easy to guess`
    :why==='repeat'?'Repeated characters add little. Mix it up'
    :'Longer is stronger: try three or four random words together';
}
/* The hard rules (the spec's): 8+ characters, a letter and a number, no part of your email, not a common password.
   On top of those, anything the strength score calls weak gets a hint and has to change. Same rules in app/src/lib/password.ts. */
function pwProblem(p,email){
  if(p.length<8)return 'Use at least 8 characters';
  if(!/[a-z]/i.test(p)||!/\d/.test(p))return 'Use at least one letter and one number';
  const lo=p.toLowerCase(),n=[...lo].map(c=>LEET[c]||c).join(''),user=(email.split('@')[0]||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  if(email&&(lo.includes(email.toLowerCase())||user.length>=3&&(lo.replace(/[^a-z0-9]/g,'').includes(user)||n.includes(user))))return 'Leave your email out of your password';
  const r=pwScore(p,email);
  return r.s<2?pwHint(r):'';
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
const AGEBOX='<label class="chk top" style="margin-top:14px"><input type="checkbox" id="a_age"> <span>I\'m 18 or older. Overhere is for adults only.</span></label>';
function ageOk(inForm){
  const c=document.getElementById('a_age');if(!c||c.checked)return true;
  const m="Please confirm you're 18 or older to continue.";if(inForm)formErr(m);else toast(m);c.focus();return false;
}
function formErr(msg,more=''){
  const b=document.getElementById('a_formerr');if(!b){if(msg)toast(msg);return}
  b.hidden=!msg;b.innerHTML=msg?I('alert-triangle',16)+`<span>${esc(msg)}${more}</span>`:'';
}
/* Check every field on submit, mark what's wrong, and put the cursor in the first one. up: a new password, so it must be strong enough. */
function authCheck(up){
  const email=val('a_email'),p=pw(),p2=document.getElementById('a_pw2')?.value||'';
  const errs=[['a_email',!email?'Enter your email':!EMAIL_RE.test(email)?'Enter a valid email, like name@example.com':''],
    ['a_pw',!p?(up?'Choose a password':'Enter your password'):up?pwProblem(p,pwMail()):''],
    ['a_pw2',!p2?'Type your password again':p2!==p?"Passwords don't match":'']].filter(([id])=>document.getElementById(id));
  errs.forEach(([id,m])=>id==='a_pw2'&&!m?fieldMsg(id,'Passwords match',true):fieldMsg(id,m));
  const bad=errs.find(([,m])=>m);
  if(bad)document.getElementById(bad[0]).focus();
  return !bad;
}
/* As you type: the strength meter, and whether the two passwords match. Errors only clear here; they appear when you leave a field or submit. */
function pwLive(){
  const p=pw(),email=pwMail(),box=document.getElementById('a_pws'),up=ui.auth.mode!=='in';
  if(box){
    const r=pwScore(p,email),s=r.s,tip=document.getElementById('a_pwtip');
    box.dataset.s=!p?0:p.length<8?1:Math.max(s,1);
    document.getElementById('a_pwl').textContent=!p?'':p.length<8?'Too short':s===0?'Too common':['','Weak','Fair','Good','Strong'][s];
    /* a tip while you type: what gives it away, or a nod once it's strong */
    const t=!p||p.length<8||s===3?'':s===4?"Nice, that's hard to guess":pwHint(r);
    tip.hidden=!t;tip.className='pwtip'+(s===4?' ok':'');tip.innerHTML=t?I(s===4?'shield-check':'lightbulb',14)+`<span>${esc(t)}</span>`:'';
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
  if(el.id==='a_pw'&&el.value&&ui.auth.mode!=='in')fieldMsg('a_pw',pwProblem(el.value,pwMail()));
  if(el.id==='a_pw2'&&el.value){el.dataset.left=1;pwLive()}
  if(el.classList.contains('pwi'))document.getElementById(el.id+'_caps')?.setAttribute('hidden','');
}
function capsWarn(e){const w=document.getElementById(e.target.id+'_caps');if(w&&e.getModifierState)w.hidden=!e.getModifierState('CapsLock')}
/* Phone numbers: 10 digits after +91, shown as "98765 43210". A pasted "+91 98765 43210" or "098765 43210" loses its prefix. */
/* ---------- CAPTCHA (Cloudflare Turnstile) ----------
   Off until config.js has TURNSTILE_SITE_KEY. Switch it on in Supabase (Authentication -> Attack Protection) at the same
   time, because then Supabase refuses sign-ins that don't carry a token. Each token works once, so every send asks again.
   It stays invisible unless Cloudflare wants a tap. */
let tsP=null,tsId=null;
function tsLoad(){
  if(window.turnstile)return Promise.resolve();
  return tsP||(tsP=new Promise((ok,bad)=>{const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;
    s.onload=()=>ok();s.onerror=()=>{tsP=null;bad(new Error("The security check couldn't load. Check your connection and try again."))};document.head.appendChild(s)}));
}
async function captcha(){
  if(!CFG.TURNSTILE_SITE_KEY)return undefined;
  await tsLoad();
  let box=document.getElementById('cf_box');
  if(!box){box=document.createElement('div');box.id='cf_box';document.body.appendChild(box)}
  return new Promise((ok,bad)=>{
    if(tsId!==null){try{window.turnstile.remove(tsId)}catch(e){}}
    const done=()=>box.classList.remove('show');
    tsId=window.turnstile.render(box,{sitekey:CFG.TURNSTILE_SITE_KEY,appearance:'interaction-only',
      'before-interactive-callback':()=>box.classList.add('show'),
      callback:t=>{done();ok(t)},'error-callback':()=>{done();bad(new Error('The security check failed. Please try again.'))},
      'timeout-callback':()=>{done();bad(new Error('The security check timed out. Please try again.'))}});
  });
}
/* runs an auth call with a fresh token; a failed check comes back as an error instead of throwing */
async function withCaptcha(fn){
  let t;try{t=await captcha()}catch(e){return {error:e}}
  return fn(t);
}
const phoneDigits=s=>{const d=s.replace(/\D/g,'');return (d.length>10?d.replace(/^(91|0)(?=\d{10}$)/,''):d).slice(0,10)};
const fmtPhone=d=>d.length>5?d.slice(0,5)+' '+d.slice(5):d;
/* OTP_GUARD: phone codes go through the otp-verify Edge Function (5 wrong codes pause the number for an hour and
   email the team). Off until that function is deployed on live: then codes go straight to Supabase, as before. */
const OTP_GUARD=false;
const otpPaused=until=>`Too many wrong codes for this number, so phone sign-in is paused until ${new Date(until).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}. Please try again then, or use email.`;
function phoneProblem(n){return !n?'Enter your mobile number':n.length<10?'Enter all 10 digits':!/^[6-9]/.test(n)?'Indian mobile numbers start with 6, 7, 8 or 9':''}
async function sendCode(again){
  const n=again?ui.auth.phone.slice(3):phoneDigits(val('a_phone'));
  if(!again){const m=phoneProblem(n);fieldMsg('a_phone',m);if(m){document.getElementById('a_phone')?.focus();return}if(!ageOk(true))return}
  const wait=again?Math.ceil((ui.auth.sent+RESEND_MS-Date.now())/1000):0;
  if(wait>0)return toast(`Please wait ${wait}s before asking for a new code`);
  /* paused after 5 wrong codes (otp-verify): don't send a code that can't be used. If the check fails, send anyway. */
  const p=OTP_GUARD?await edge('otp-verify',{phone:'+91'+n,check:true}).catch(()=>({})):{};
  if(p?.until)return again?toast(otpPaused(p.until)):formErr(otpPaused(p.until));
  const {error}=await withCaptcha(t=>SB.auth.signInWithOtp({phone:'+91'+n,options:{captchaToken:t,data:{age_18:true}}}));
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
  swipeok:d=>{S.tips['swipe_'+d.d]=true;save();ui.modal=null;render();swipe(d.d)},
  detail:d=>{ui.modal={type:'detail',id:d.id};render()},
  detailback:d=>{ui.modal={type:'detail',id:d.id,back:ui.modal};render()},   // from a profile: closing goes back to it
  hostview:d=>{ui.modal={type:'host',id:d.id};render()},
  chat:d=>{
    const n=chatNote(d.id);if(n){n.read=true;if(!n.id.startsWith('tmp'))call('read_notifications',{p_ids:[n.id]},true).catch(()=>{})}
    ui.modal={type:'chat',id:d.id};render()},
  /* The chats button toggles the chats tab, like the bell. */
  chats:()=>{if(ui.tab==='chats'&&!ui.modal){ui.tab=ui.prevTab||'swipe';render();return}if(ui.tab!=='chats'&&ui.tab!=='notes')ui.prevTab=ui.tab;ui.tab='chats';ui.modal=null;track('chats_opened');render()},
  close:()=>{ui.modal=ui.modal?.back||null;render()},
  closebg:(d,e)=>{if(e.target.classList.contains('ov')&&!['verify','chat','terms','mustrate'].includes(ui.modal?.type)){ui.modal=ui.modal?.back||null;render()}},
  user:d=>{ui.modal={type:'user',id:d.id,back:ui.modal};render()},
  /* The bell opens the notifications, and tapping it again closes them. Opening doesn't mark anything read:
     a notification is read when you open it, or with "Mark all as read". */
  bell:()=>{
    if(ui.tab==='notes'&&!ui.modal){ui.tab=ui.prevTab||'swipe';ui.seen=null;render();return}
    if(ui.tab!=='notes')ui.prevTab=ui.tab;
    ui.tab='notes';ui.modal=null;render();
  },
  /* The feedback sheet opens over whatever you were doing. d.k says where it was opened from (header, beta, profile,
     card, meetup), which is sent with it. Opening it from the card counts as an answer to the card. */
  fb:d=>{
    const k=/^[a-z]{1,12}$/.test(d?.k||'')?d.k:'header';
    if(k==='card'){S.asked.fbNo=(S.asked.fbNo||0)+1;S.asked.fbNoAt=now();save()}
    track('feedback_opened',{from:k});ui.modal={type:'feedback',k};render();
  },
  sendfb:async()=>{
    const b=document.getElementById('fb_go'),r=+(document.querySelector('input[name=fb_r]:checked')?.value||0);
    if(!b||b.disabled||!r||!document.getElementById('fb_ok')?.checked)return fbState();
    const k=ui.modal?.k||'header';
    busyBtn(b,true);
    try{await sendFeedback({rating:r,improve:val('fb_t')||null,would_use:document.querySelector('input[name=fb_u]:checked')?.value||null,
      consent_quote:!!document.getElementById('fb_q')?.checked,consent_contact:!!document.getElementById('fb_c')?.checked,source:'app:'+k})}
    catch(e){busyBtn(b,false);return}
    S.asked.fbSent=now();save();track('feedback_sent',{from:k,rating:r});
    ui.modal=null;toast('Thank you! We read every one of these.');render();
  },
  fbnot:()=>{S.asked.fbNo=(S.asked.fbNo||0)+1;S.asked.fbNoAt=now();save();track('feedback_card_dismissed');render()},
  scan:()=>scan(),
  retry:()=>{ui.err='';render();refresh()},
  /* sign in */
  /* the email you typed carries over between sign in, create account and reset */
  /* was: the tab you came from (Sign in or Create account), so the phone screens can word things and go back to it */
  authmode:d=>{
    otpAbort?.abort();
    const old=ui.auth.mode,swap=old!==d.k&&['in','up'].includes(old)&&['in','up'].includes(d.k);
    ui.auth={mode:d.k,phone:ui.auth.phone,email:val('a_email')||ui.auth.email,was:['in','up'].includes(old)?old:ui.auth.was,anim:swap?old:''};render();
    /* Sign in <-> Create account: the screen is drawn with the pill on the old tab; slide it over once that's on screen */
    if(swap){const t=document.querySelector('.atab');ui.auth.anim='';if(t){void t.offsetWidth;t.classList.toggle('up',d.k==='up');t.querySelector('.on').focus({preventScroll:true})}}
    if(d.k==='phone')document.getElementById('a_phone')?.focus();
  },
  pwshow:d=>{
    const i=document.getElementById(d.id),b=i?.parentNode.querySelector('.pwt');if(!i)return;
    const show=i.type==='password';i.type=show?'text':'password';
    b.setAttribute('aria-pressed',show);b.setAttribute('aria-label',show?'Hide password':'Show password');b.innerHTML=I(show?'eye-off':'eye',18);
  },
  emailfix:d=>{const i=document.getElementById('a_email');i.value=d.v;fieldMsg('a_email','');mailHint();pwLive();document.getElementById('a_pw')?.focus()},
  /* EMAIL: every email Overhere sends is TRANSACTIONAL: sign-up confirmation, password reset and their resends,
     sent by Supabase Auth (templates in Supabase -> Authentication -> Emails). Keep them that way: no launch news,
     promotions or newsletters in these templates. Marketing email needs unsubscribe links, a postal address and a
     suppression list, and none of that exists here. */
  signin:()=>working(async()=>{
    if(!authCheck(false))return;
    const {error}=await withCaptcha(t=>SB.auth.signInWithPassword({email:val('a_email'),password:pw(),options:{captchaToken:t}}));
    if(error)return formErr(/confirm/i.test(error.message)?'Please confirm your email first: open the link we sent you.':/invalid/i.test(error.message)?'Wrong email or password.':friendly(error));
    return true;   // signed in: onAuthStateChange takes it from here
  }),
  signup:()=>working(async()=>{
    if(!authCheck(true)||!ageOk(true))return;
    const email=val('a_email'),{data,error}=await withCaptcha(t=>SB.auth.signUp({email,password:pw(),options:{emailRedirectTo:here(),captchaToken:t,data:{age_18:true,pw_set:true}}}));
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
    const {error}=await withCaptcha(t=>kind==='reset'?SB.auth.resetPasswordForEmail(email,{redirectTo:here(),captchaToken:t})
      :SB.auth.resend({type:'signup',email,options:{emailRedirectTo:here(),captchaToken:t}}));
    if(error)return toast(friendly(error));
    track('email_resent',{kind:kind||'signup'});
    ui.auth.sent=Date.now();render();resendTimer();toast('Sent again. Check your inbox.');
  },
  /* The first code comes from the form (its button spins); "Resend code" sends another to the same number. */
  sendcode:d=>d.k==='again'?sendCode(true):working(()=>sendCode(false)),
  checkcode:()=>working(async()=>{
    const i=document.getElementById('a_code'),token=(i?.value||'').replace(/\D/g,'');
    if(token.length!==6){fieldMsg('a_code',token?'Enter all 6 digits':'Enter the code from the SMS');i?.focus();return}
    /* checked by the otp-verify Edge Function, which pauses a number for an hour after 5 wrong codes and hands back the session */
    let error;
    if(OTP_GUARD){
      let r;try{r=await edge('otp-verify',{phone:ui.auth.phone,token})}catch(e){return codeWrong(friendly(e))}
      ({error}=await SB.auth.setSession(r.session));
    }else ({error}=await SB.auth.verifyOtp({phone:ui.auth.phone,token,type:'sms'}));
    if(error)return codeWrong(friendly(error));
    otpAbort?.abort();track('phone_signed_in');
    return true;   // signed in: onAuthStateChange takes it from here
  }),
  /* the email step for phone accounts (emailStepHtml) */
  emailstep:()=>{ui.auth={mode:'eadd',email:ui.auth.email};render();document.getElementById('a_email')?.focus()},
  addemail:()=>working(async()=>{
    const email=val('a_email');
    if(!email||!EMAIL_RE.test(email)){fieldMsg('a_email',!email?'Enter your email':'Enter a valid email, like name@example.com');document.getElementById('a_email')?.focus();return}
    const {error}=await SB.auth.updateUser({email});
    if(error)throw error;
    track('email_code_sent');
    ui.auth={mode:'ecode',email,sent:Date.now()};render();resendTimer();document.getElementById('a_code')?.focus();return true;
  }),
  resendecode:async()=>{
    const wait=Math.ceil(((ui.auth.sent||0)+RESEND_MS-Date.now())/1000);
    if(wait>0)return toast(`Please wait ${wait}s before asking for a new code`);
    const {error}=await SB.auth.resend({type:'email_change',email:ui.auth.email});
    if(error)return toast(friendly(error));
    ui.auth.sent=Date.now();render();resendTimer();toast('Sent again. Check your inbox.');
  },
  checkecode:()=>working(async()=>{
    const i=document.getElementById('a_code'),token=(i?.value||'').replace(/\D/g,'');
    if(token.length!==6){fieldMsg('a_code',token?'Enter all 6 digits':'Enter the code from the email');i?.focus();return}
    const {error}=await SB.auth.verifyOtp({email:ui.auth.email,token,type:'email_change'});
    if(error)return codeWrong(friendly(error));
    const {data}=await SB.auth.getUser();
    AUTHU.email=!!data?.user?.email_confirmed_at;AUTHU.mail=data?.user?.email||ui.auth.email||'';
    if(!AUTHU.email)return codeWrong('That code didn\'t confirm your email. Ask for a new one.');
    track('email_confirmed');ui.auth={mode:'in'};render();toast('Email confirmed');return true;
  }),
  /* the password step for phone accounts (pwStepHtml) */
  phonepw:()=>working(async()=>{
    if(!authCheck(true))return;
    const {data,error}=await SB.auth.updateUser({password:pw(),data:{pw_set:true}});
    if(error)return formErr(/different from the old/i.test(error.message)?'Choose a password different from your old one.':friendly(error));
    track('password_created');AUTHU.pw=true;ui.auth={mode:'in'};render();toast('Password saved');welcome(data?.user);return true;
  }),
  forgot:()=>working(async()=>{
    if(!authCheck(false))return;
    const email=val('a_email'),{error}=await withCaptcha(t=>SB.auth.resetPasswordForEmail(email,{redirectTo:here(),captchaToken:t}));
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
  readall:()=>{S.notes.forEach(n=>n.read=true);ui.seen=null;toast('All notifications marked as read');render();call('read_notifications',{p_ids:null},true).catch(()=>{})},
  opennote:d=>{
    const n=S.notes.find(x=>x.id===d.id);if(!n)return;
    if(!n.read){n.read=true;if(!n.id.startsWith('tmp'))call('read_notifications',{p_ids:[n.id]},true).catch(()=>{})}
    const a=n.act&&actOf(n.act);
    if(a)ui.modal=n.safe&&a.arrive==='asked'?{type:'safe',id:a.id}:n.chat&&S.chats[a.id]?{type:'chat',id:a.id}:n.check&&needRate(a)?{type:'rate',id:a.id}:{type:a.host==='me'?'host':'detail',id:a.id};
    render();
  },
  viewact:d=>{
    const a=actOf(d.id);if(!a)return toast('That activity is no longer available');
    ui.modal={type:a.host==='me'?'host':'detail',id:a.id};render();
  },
  venueother:()=>askArea(),
  citymenu:()=>{ui.modal={type:'city'};render()},
  /* Saved first, so the server sends that city's plans on the next read. */
  setcity:async d=>{
    ui.modal=null;S.city=d.k;clearTimeout(saveT);await pushState();
    mapView=null;await refresh();track('city_picked',{city:d.k});
    toast(viewCity()?`Showing plans in ${viewName()}`:`Showing plans near ${homeName()}`);
  },
  pickplace:d=>{
    const i=document.getElementById(d.f);if(i){i.value=d.v;i.focus()}placeList(d.f,false);
    if(d.f==='f_area')areaPicked(d.v);track(d.f==='f_venue'?'venue_picked':'area_picked');
  },
  /* "Use my current location": the browser asks first. A home area keeps only about 1 km of precision. */
  myloc:async(d,e)=>{
    const id=d.f,b=e.target.closest('button'),t=b.innerHTML;if(b.disabled)return;
    b.disabled=true;b.innerHTML=`${I('locate',15)}<span>Finding where you are…</span>`;
    try{
      const ll=await myPosition();
      if(!inIndia(ll))return toast('That location is outside India. Overhere is only in India for now.');
      const home=id==='o_hood'||id==='p_hood',spot=home?ll.map(x=>Math.round(x*100)/100):ll;
      const r=await geoFetch('/reverse',{lat:ll[0].toFixed(5),lon:ll[1].toFixed(5),lang:'en',limit:1},id==='f_venue'?'venue':'here').catch(()=>[]);
      const label=r[0]?.label||`Near ${spot[0].toFixed(2)}, ${spot[1].toFixed(2)}`;
      PLACE_AT[label.toLowerCase()]=spot;
      const i=document.getElementById(id);if(i){i.value=label;placeList(id,false)}
      if(id==='f_area')areaPicked(label);
      track('location_used',{field:id});
    }catch(err){toast(err?.code===1?'Location is blocked for this site. Allow it in your browser settings, or search instead.':"Couldn't get your location. Search for the place instead.")}
    finally{if(b.isConnected){b.disabled=false;b.innerHTML=t}}
  },
  /* hosting */
  newpost:()=>safetyOnce(()=>gate(()=>{ui.modal={type:'post'};render()})),
  unlock:()=>gate(()=>{toast('Face check passed. Plans for your group now show too.');render()}),
  submitpost:async(d,e)=>{
    const desc=val('f_desc'),venue=val('f_venue'),when=new Date(document.getElementById('f_when').value).getTime();
    const gs=[...document.querySelectorAll('.f_g:checked')].map(x=>x.value),all=document.getElementById('f_all').checked||gs.length===GENDERS.length;
    const ed=ui.modal?.id&&actOf(ui.modal.id),cap=+(document.querySelector('[name=f_cap]:checked')?.value||2),rep=val('f_rep');
    if(!desc||!venue)return toast('Add a description and a venue');
    const bw=badWord(desc);if(bw){descWarn();document.getElementById('f_desc')?.focus();return toast(`"${bw}" isn't allowed in a plan. Please reword it.`)}
    const vll=placeLL(venue,'f_venue');
    if(!vll){askArea();return toast('Pick which area the venue is in, so it shows on the map')}
    if(!(when>now()))return toast('Pick a future date and time');
    if(!all&&!gs.length)return toast('Choose Everyone or at least one identity');
    const tot=Math.max(0,Math.min(1e6,Math.round(+val('f_total')||0)));
    const p={cat:val('f_cat'),desc,cap,when,dur:+val('f_dur')||2,aud:all?null:gs,venue,lat:vll[0],lng:vll[1],cost:val('f_cost'),total:tot,repeat:rep};
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
    safetyOnce(()=>gate(async()=>{
      const a=actOf(d.id);
      const st=await run('request_join',{p_act:d.id,p_note:note});
      if(st===undefined)return;
      if(a)learn(a.cat,1);
      track('request_sent',{waitlist:st==='waitlist',note:!!note});askMicro('request');
      toast(st==='waitlist'?`You're on the waitlist. Your request goes to ${uname(a?.host)} if a spot opens.`:st==='accepted'?`${uname(a?.host)} said yes! Say hi in the group chat.`:'Request sent to '+uname(a?.host)+'. Follow it in Requests.');
      ui.modal=null;
      if(ui.tab==='swipe'&&!deck().length){ui.tab='discover';toast("Request sent. You've seen everything nearby, here's Discover.")}
      render();
    }));
  },
  askreq:d=>{ui.modal={type:'confirm',id:d.id};render()},
  withdraw:async d=>{if(await run('withdraw_request',{p_act:d.id})!==undefined){track('request_withdrawn');toast('Request withdrawn')}},
  leave:d=>{ui.modal={type:'leave',id:d.id,back:ui.modal};render()},
  members:d=>{ui.modal={type:'members',id:d.id,back:ui.modal};render()},
  rmmember:d=>{ui.modal={type:'rmmember',id:d.id,u:d.u,back:ui.modal};render()},
  doremove:async d=>{const name=uname(d.u),why=pickedReason('rm');if(!why)return;if(await run('remove_member',{p_act:d.id,p_user:sid(d.u),p_reason:why})===undefined)return;track('member_removed');toast(`${name} was removed and has been told.`);ui.modal=ui.modal?.back||null;render()},
  doleave:async d=>{const a=actOf(d.id),why=pickedReason('lv');if(!why)return;if(await run('leave_activity',{p_act:d.id,p_reason:why})===undefined)return;track('left_activity');toast(`You left "${short(a.desc)}". ${uname(a.host)} has been told.`);ui.modal={type:'detail',id:d.id};render()},
  rate:d=>{ui.modal={type:'rate',id:d.id,back:ui.modal};render()},
  doattend:async d=>{
    const a=actOf(d.id);if(!a)return;
    const st=document.querySelector('input[name=at_star]:checked');if(!st)return toast('Tap the stars to rate the plan');
    const ok=document.querySelector('input[name=rt_ok]:checked')?.value||'yes',people={};
    for(const u of a.members.filter(x=>x!=='?')){const v=document.querySelector(`input[name="at_${u}"]:checked`)?.value;if(!v)return toast(`Mark whether ${uname(u)} came`);people[sid(u)]=v}
    if(await run('record_attendance',{p_act:a.id,p_ok:ok,p_stars:+st.value,p_people:people})===undefined)return;
    track('attendance_recorded',{stars:+st.value,ok,noshows:Object.values(people).filter(v=>v==='noshow').length});
    ui.modal=null;toast(ok==='no'?'Thanks for telling us. Our safety team will follow up with you.':'Thanks! Everyone you marked as there can now rate the plan.');render();
  },
  donoshow:async d=>{
    const t=val('ns_t'),dis=!!document.getElementById('ns_d')?.checked;
    if(!t&&!dis)return toast('Say what happened, or tick that you were there');
    if(await run('noshow_reply',{p_act:d.id,p_reply:t,p_dispute:dis})===undefined)return;
    track('noshow_replied',{dispute:dis});ui.modal=null;toast(dis?'Thanks. Our team will look into it.':'Thanks, the host has been told.');render();
  },
  relist:async d=>{
    const yes=d.k==='yes';if(await run('relist_spot',{p_act:d.id,p_relist:yes})===undefined)return;
    track('relist_answered',{relist:yes});toast(yes?'The spot is back up for others to request.':'Got it. The plan stays full with the people going.');
  },
  dorate:async d=>{
    const a=actOf(d.id);if(!a)return;
    const st=document.querySelector('input[name=rt_star]:checked');if(!st)return toast('Tap the stars to say how much you enjoyed it');
    const ok=document.querySelector('input[name=rt_ok]:checked')?.value||'yes',people={};
    const hs=document.querySelector('input[name=rt_host]:checked');if(!hs)return toast('Tap the stars to rate the host too');
    if(await run('rate_activity',{p_act:a.id,p_ok:ok,p_stars:+st.value,p_people:people,p_host_stars:+hs.value})===undefined)return;
    track('rating_submitted',{stars:+st.value,ok});
    /* the first time, ask about the app as well; after that, just the quick question */
    if(ok!=='no'&&!S.asked.fbSent&&!S.asked.fbMeet){S.asked.fbMeet=true;save();ui.modal={type:'feedback',k:'meetup'};track('feedback_opened',{from:'meetup'});render();return}
    askMicro('rating');
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
  mapfit:()=>{mapPreview(null);mapFit(true)},
  maphome:()=>{mapPreview(null);liveMap?.flyTo(kmBetween(homeLL(),viewLL())<=NEAR_KM?homeLL():viewLL(),14,{duration:.5})},
  mapclose:()=>mapPreview(null),
  save:d=>{const on=isSaved(d.id);if(!on)learn(actOf(d.id)?.cat,0.5);S.saved=on?S.saved.filter(x=>x!==d.id):[...S.saved,d.id].slice(-100);save();track(on?'unsave':'save_plan');toast(on?'Removed from saved':'Saved. Find it under Requests.');render()},
  follow:d=>{const on=S.following.includes(d.id);S.following=on?S.following.filter(x=>x!==d.id):[...S.following,d.id];save();track(on?'unfollow':'follow');toast(on?`Unfollowed ${uname(d.id)}`:`Following ${uname(d.id)}. You'll hear when they post.`);render()},
  acceptterms:async(d,e)=>{e.target.closest('button').disabled=true;if(await run('accept_terms')===undefined){e.target.closest('button').disabled=false;return}track('terms_accepted');ui.modal=null;render()},
  safetyok:()=>{const nx=ui.modal?.next;S.tips.safety1=true;save();track('safety_seen');ui.modal=null;if(nx)nx();else render()},
  /* saved filters: the current Discover filters under a name, one tap to apply again */
  savef:()=>{
    const f=ui.f,dk=Object.entries(datePresets()).find(([k,[l,a,b]])=>f.dfrom===a&&f.dto===b)?.[0]||'';
    const sf={id:'sf'+Date.now().toString(36),label:activeFilters(f).map(x=>x[1]).join(' · ').slice(0,60)||'All plans',f:{cat:f.cat,tod:f.tod,dist:f.dist,sort:f.sort,datep:dk}};
    if(S.savedF.some(x=>x.label===sf.label))return toast('Already saved');
    S.savedF.unshift(sf);S.savedF=S.savedF.slice(0,10);save();track('filters_saved');toast('Filters saved. Tap them above to use them again.');render()},
  applyf:d=>{const sf=S.savedF.find(x=>x.id===d.id);if(!sf)return;const base=freshF(),p=sf.f.datep&&datePresets()[sf.f.datep];
    ui.f={...base,view:ui.f.view,cat:sf.f.cat||'all',tod:sf.f.tod||'any',dist:+sf.f.dist||0,sort:sf.f.sort||base.sort,dfrom:p?p[1]:'',dto:p?p[2]:''};track('filters_applied');render()},
  rmf:d=>{S.savedF=S.savedF.filter(x=>x.id!==d.id);save();render()},
  delacct:()=>{ui.modal={type:'delacct'};render()},
  dodelacct:async(d,e)=>{
    if(val('del_ok').toUpperCase()!=='DELETE')return toast('Type DELETE to confirm');
    e.target.closest('button').disabled=true;
    try{await call('delete_my_account')}catch(err){e.target.closest('button').disabled=false;return}
    /* the database can't remove files: delete the photos with this login's token, which works until it expires */
    const mine=[S.me.photoPath,S.me.photo2Path].filter(Boolean);
    if(mine.length)await SB.storage.from('avatars').remove(mine).catch(()=>{});
    track('account_deleted');
    /* the login no longer exists, so only clear this device */
    try{await SB.auth.signOut({scope:'local'})}catch(err){}
    ME=null;S=blank();USERS={};loaded=false;ui=freshUi();toast('Your account has been deleted.');render();
  },
  mute:d=>{S.muted[d.id]=!S.muted[d.id];save();track('chat_mute',{on:S.muted[d.id]});toast(S.muted[d.id]?'Chat muted. You can still open it any time.':'Chat notifications on');render()},
  tipsok:d=>{S.tips[d.id]=true;save();render()},
  /* chat */
  newpoll:d=>{ui.modal={type:'poll',id:d.id,back:ui.modal};render()},
  dopoll:async d=>{
    const q=tidyWhen(val('pl_q')).slice(0,80),opts=[0,1,2,3].map(i=>tidyWhen(val('pl_o'+i)).slice(0,40)).filter(Boolean);
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
  /* "Hard" or "OK" asks why in one line; "Easy" and "Very easy" are done. */
  microans:d=>{const k=ui.micro;if(!k)return;track('micro_feedback',{moment:k,score:+d.n});S.asked[k]=true;save();
    if(+d.n<=2){ui.microWhy=+d.n;render();document.getElementById('mf_t')?.focus();return}
    ui.micro=null;toast('Thanks! That helps us improve.');render()},
  microx:()=>{const k=ui.micro;if(k&&!ui.microWhy){track('micro_dismissed',{moment:k});S.asked[k]=true}ui.micro=null;ui.microWhy=null;save();render()},
  microsend:async()=>{
    const k=ui.micro,b=document.getElementById('mf_go'),t=val('mf_t');
    if(!k||!b||b.disabled||!t||!document.getElementById('mf_ok')?.checked)return fbState();
    busyBtn(b,true);
    try{await sendFeedback({improve:t,source:'micro:'+k})}catch(e){busyBtn(b,false);return}
    track('micro_why_sent',{moment:k});ui.micro=null;ui.microWhy=null;toast('Thank you! That really helps.');render();
  },
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
    const name=val('p_name'),last=val('p_last'),dob=val('p_dob'),tn=val('t_name'),tp=val('t_phone');
    if(!name)return toast('Add your first name');
    if(!last)return toast('Add your last name');
    if(!dob||!(ageOf(dob)>=18))return toast('Check your date of birth: you must be 18 or over');
    if((tn||tp)&&(!tn||tp.replace(/\D/g,'').length<7))return toast('Add a name and a valid phone for your trusted contact, or leave both empty');
    if(tp&&ownPhone(tp))return toast("Your trusted contact can't be the number you signed in with");
    const hood=val('p_hood'),hll=placeLL(hood,'p_hood');
    if(!hll)return toast('Pick your home area from the list, or use your current location');
    const p={name,dob,gender:val('p_gender'),hood,lat:hll[0],lng:hll[1],job:val('p_job'),bio:document.getElementById('p_bio').value.trim(),ints:many('p_int'),avail:many('p_avail'),last_name:last};
    if(p.ints.length<MIN_INTS)return toast(`Pick at least ${MIN_INTS} things you like doing`);
    if(!p.avail.length)return toast("Pick when you're usually free");
    if(ui.modal?.emo)p.emo=ui.modal.emo;
    S.me.trusted=tn?{name:tn.slice(0,40),phone:tp.slice(0,20)}:null;save();
    if(await run('save_profile',{p})===undefined)return;
    if(p.emo&&S.me.photoPath&&!await setPhoto(null))return;   // picking an emoji replaces the photos
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
  setemo:async d=>{if(await run('save_profile',{p:{emo:d.e}})===undefined)return;if(S.me.photoPath&&!await setPhoto(null))return;track('avatar_emoji');ui.modal=null;toast('Emoji updated');render()},
  /* No photo yet: go straight to the picker. Otherwise offer change/remove. */
  photo:()=>{photoMenu(document.getElementById('p_menu')?.hidden)},
  pickphoto:d=>{photoMenu(false);cropSlot=d.k==='2'&&S.me.photo?2:1;(document.getElementById('p_photo')||photoInput()).click()},
  rmphoto:async()=>{photoMenu(false);if(!await setPhoto(null))return;if(!S.me.face)toast('Photos removed. Showing your emoji.');if(ui.modal?.type==='editprofile')render();else refreshMyPhoto()},
  /* onboarding */
  obnext:()=>{
    const d=obKeep(),st=ui.obStep||0;
    if(st===0){
      if(!d.name)return toast('Add your first name');
      if(!d.last)return toast('Add your last name');
      if(!d.dob)return toast('Add your date of birth');
      if(!d.gender)return toast('Pick your gender');
      if(!(ageOf(d.dob)>=18)){ui.modal={type:'under18',dob:d.dob};render();return}
    }else if(!placeLL(d.hood,'o_hood'))return toast('Pick your home area from the list, or use your current location');
    ui.obStep=st+1;render();scrollTo(0,0);
  },
  obback:()=>{obKeep();ui.obStep=Math.max(0,(ui.obStep||0)-1);render();scrollTo(0,0)},
  ob2:async(d,e)=>{
    const f=obKeep(),hll=placeLL(f.hood,'o_hood');
    if(!f.name||!f.last||!f.dob||!f.gender){ui.obStep=0;render();return toast('Add your name, date of birth and gender')}
    if(!hll){ui.obStep=1;render();return toast('Pick your home area from the list, or use your current location')}
    if(f.ints.length<MIN_INTS)return toast(`Pick at least ${MIN_INTS} things you like doing`);
    if(!f.avail.length)return toast("Pick when you're usually free");
    if(!f.ok)return toast('Please agree to the Terms to continue');
    const p={name:f.name,last_name:f.last,dob:f.dob,gender:f.gender,hood:f.hood,lat:hll[0],lng:hll[1],ints:f.ints,avail:f.avail,
      emo:defEmo(f.gender),consent:true,terms:true,usage_ok:f.usage};
    e.target.closest('button').disabled=true;
    let r;try{r=await call('save_profile',{p})}catch(err){e.target.closest('button').disabled=false;return}
    if(r?.error==='under18')return gone18();
    OBF={};ui.obStep=0;
    await refresh();
    track('profile_created');
  },
  under18:async(d,e)=>{
    e.target.closest('button').disabled=true;
    try{await call('save_profile',{p:{dob:ui.modal.dob}})}catch(err){e.target.closest('button').disabled=false;return}
    gone18();
  },
  gone18:()=>{GONE18=false;render()},
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
  if(!e.target.closest('.vbox'))closePlaceLists();
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
  if(e.target.name==='f_cap'){const c=document.getElementById('f_capx');if(c)c.innerHTML=capNote(+e.target.value)}
  if(e.target.id==='r_note'){const c=document.getElementById('r_cnt');if(c)c.textContent=e.target.value.length}
  if(e.target.id==='mf_t')fbState();
  if(e.target.id==='a_code'){
    const i=e.target,v=i.value.replace(/\D/g,'').slice(0,6);if(i.value!==v)i.value=v;
    if(v&&i.getAttribute('aria-invalid'))fieldMsg('a_code','');
    otpDraw();if(v.length===6)(ui.auth.mode==='ecode'?A.checkecode:A.checkcode)();  // typed, pasted, or filled in from the SMS
  }
  if(e.target.id==='a_phone'){
    const i=e.target,atEnd=i.selectionStart===i.value.length,n=phoneDigits(i.value);
    if(atEnd)i.value=fmtPhone(n);   // reformat only when typing at the end, so the cursor doesn't jump
    if(i.getAttribute('aria-invalid')&&!phoneProblem(n))fieldMsg('a_phone','');
  }
  if(PF[e.target.id])placeList(e.target.id,true);
  if(e.target.id==='a_email'){
    document.getElementById('a_email_hint')?.setAttribute('hidden','');
    if(e.target.getAttribute('aria-invalid')&&EMAIL_RE.test(e.target.value.trim()))fieldMsg('a_email','');
  }
  if(/^a_(email|pw2?)$/.test(e.target.id))pwLive();
  if(e.target.id==='f_desc')descWarn();
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
/* Suggestions stay open while focus is in a search box or its list; clicking one keeps the focus in the box. */
document.addEventListener('mousedown',e=>{if(e.target.closest('.vopt'))e.preventDefault()});
document.addEventListener('focusout',e=>{const id=e.target.id,box=PF[id]&&e.target.closest('.vbox');if(box)setTimeout(()=>{if(!box.contains(document.activeElement))placeList(id,false)},200)});
document.addEventListener('change',e=>{
  if(e.target.name==='o_int'||e.target.name==='p_int'){const el=document.getElementById(e.target.name+'_n'),n=many(e.target.name).length;if(el){el.textContent=intCount(n);el.classList.toggle('ok',n>=MIN_INTS)}}
  if(e.target.name==='rt_ok'){const w=document.getElementById('rt_wrong');if(w)w.hidden=e.target.value!=='no'}   // "Something went wrong": still in danger, or report it
  if(e.target.id==='d_from'||e.target.id==='d_to'){
    const f=ui.f;f[e.target.id==='d_from'?'dfrom':'dto']=e.target.value;
    if(f.dfrom&&f.dto&&f.dfrom>f.dto)[f.dfrom,f.dto]=[f.dto,f.dfrom];
    track('filter',{type:'date'});render()}
  if(e.target.id==='p_usage'){const on=e.target.checked;run('save_profile',{p:{usage_ok:on}}).then(r=>{if(r===undefined){e.target.checked=!on;return}toast(on?'Thanks! Usage statistics are on.':'Usage statistics are off, and what was collected is deleted.')})}
  if(e.target.id==='f_tpl'&&ui.modal?.type==='post'){ui.modal.tpl=e.target.value||null;render()}
  if(e.target.name==='fb_r'||e.target.id==='fb_ok'||e.target.id==='mf_ok')fbState();
  if(e.target.id==='p_photo'){const f=e.target.files[0];e.target.value='';openCropper(f)}
});
document.addEventListener('keydown',e=>{
  if(e.target.classList?.contains('pwi'))capsWarn(e);
  if(PF[e.target.id]&&placeKey(e))return;
  const pm=document.getElementById('p_menu');
  if(e.key==='Escape'&&pm&&!pm.hidden){photoMenu(false);document.getElementById('p_pe')?.focus();return}
  if(e.key==='Enter'&&e.target.matches('[role=button][data-a]')){e.target.click();return}
  if(e.key==='Enter'&&e.target.id==='c_in'){const b=document.querySelector('[data-a=send]');if(b)b.click();return}
  if(e.key==='Escape'&&ui.modal&&ui.modal.type!=='verify'&&ui.modal.type!=='mustrate'){ui.modal=ui.modal.back||null;render();return}
  if(ui.modal||ui.tab!=='swipe'||!S.me?.obDone||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  if(e.key==='ArrowLeft')swipe('left');
  else if(e.key==='ArrowRight')swipe('right');
});

/* ---------- start ---------- */
let starting=null;
/* Invite links open straight to the activity. When it isn't in your list, the server says why, so the message is right. */
const INVITE_MISS={past:'That activity has already happened.',audience:"That activity is for a different group, so it isn't open to you.",
  verify:'That activity is for a limited group. Do the face check (Profile) to see it.'};
async function openInvite(){
  const id=INVITE;if(!id||!S.me?.obDone)return;
  const a=actOf(id);
  if(a){ui.modal={type:a.host==='me'?'host':'detail',id:a.id};render();return}
  const why=await call('invite_info',{p_act:id},true).catch(()=>'gone');
  toast(INVITE_MISS[why]||'That activity is no longer available.');
}
/* A link tapped while the app is already open only changes the address, so load that plan too. */
window.addEventListener('hashchange',async()=>{
  const id=inviteId();if(!id||id===INVITE||!ME||!loaded)return;
  INVITE=id;await refresh();openInvite();
});
/* What sign-up still needs. Phone sign-ups add and confirm an email (emailStepHtml), then create a password
   (pwStepHtml): user_metadata.pw_set records that. Email sign-ups chose their password when they signed up. */
function authOf(u){
  const phone=!!(u.phone&&u.phone_confirmed_at);
  return {phone,email:!!u.email_confirmed_at,mail:u.email||'',pw:!phone||u.user_metadata?.pw_set===true};
}
/* WELCOME_FN: the address of the welcome-email Edge Function (supabase/functions/welcome-email), which sends "Welcome
   to Overhere" once a new account is complete; false turns it off. On live it was deployed from the dashboard, which
   gave it the address "smart-service" (the dashboard shows it as welcome-email). If it's redeployed with the CLI as
   welcome-email, change this and WELCOME_FN in app/src/app/_layout.tsx. It sends once per account (it checks), so
   calling it on every start is fine. */
const WELCOME_FN='smart-service';
function welcome(u){
  if(!WELCOME_FN||u?.app_metadata?.welcomed_at||!AUTHU.email||!AUTHU.pw)return;
  edge(WELCOME_FN,{}).catch(e=>console.warn('welcome email',e));
}
async function start(){
  if(starting)return starting;
  starting=(async()=>{
    const {data}=await SB.auth.getUser();
    if(!data?.user){ME=null;starting=null;render();return}
    ME=data.user.id;MYPHONE=(data.user.phone||'').replace(/\D/g,'').slice(-10);
    AUTHU=authOf(data.user);loaded=false;render();
    welcome(data.user);
    await refresh();
    loadPlaces();
    listen();
    track('app_open',{standalone:isStandalone(),embedded:window.parent!==window});
    openInvite();
  })();
  return starting;
}
applyTheme(themePref());
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>applyTheme(themePref()));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;if(ui.tab==='profile'&&!ui.modal)render()});
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});
/* An installed app can stay open for days, running the code it started with. When you come back to it, check whether
   app.js changed (a new deploy) and reload, unless a form or sheet is open: then it checks again next time. */
const appTag=()=>fetch('app.js',{method:'HEAD',cache:'no-store'}).then(r=>r.ok&&(r.headers.get('etag')||r.headers.get('last-modified'))||null,()=>null);
let appTag0=null;appTag().then(t=>{appTag0=t});
document.addEventListener('visibilitychange',async()=>{
  if(document.visibilityState!=='visible'||!appTag0||ui.modal)return;
  const t=await appTag();
  if(t&&t!==appTag0&&!ui.modal&&!saveT)location.reload();
});
/* What the welcome page's sign-up box passed on (site.js): read once, and only if it's from the last 10 minutes. */
function handoff(){
  let h=null;
  try{h=JSON.parse(sessionStorage.getItem('overhere_handoff'));sessionStorage.removeItem('overhere_handoff')}catch(e){}
  if(!h||!['up','in'].includes(h.mode)||!(Date.now()-h.at<6e5))return null;
  if(h.via==='phone'&&CFG.PHONE_LOGIN&&/^\+91[6-9]\d{9}$/.test(h.phone||''))return {mode:'phone',was:h.mode,phone:h.phone};
  if(h.via==='email'&&typeof h.email==='string'&&h.email.length<=120)return {mode:h.mode,email:h.email};
  return null;
}
/* You've been here: from now on the landing page sends you straight to the app (head.js). */
try{localStorage.setItem('overhere_seen','1')}catch(e){}
if(!ONLINE)render();
else{
  /* Opened from a password-reset email: ask for the new password before anything else. */
  if(/type=recovery/.test(location.hash))ui.auth={mode:'newpw'};
  /* The welcome page's sign-up box opens here with ?join or ?signin, and leaves the phone number or email it
     checked in sessionStorage: start on that step with it filled in. */
  else if(/[?&](join|signin)(&|$)/.test(location.search)){ui.auth=handoff()||{mode:/[?&]join(&|$)/.test(location.search)?'up':'in'};history.replaceState(null,'',here()+location.hash)}
  SB.auth.onAuthStateChange((ev,session)=>{
    /* don't call Supabase from inside this callback: do it just after */
    setTimeout(()=>{
      if(ev==='PASSWORD_RECOVERY'){ui.auth={mode:'newpw'};ME=null;render();return}
      if(ev==='SIGNED_OUT'){ME=null;MYPHONE='';AUTHU={};S=blank();USERS={};loaded=false;ui=freshUi();render();return}
      /* phone accounts start on the "Add your email" step (emailStepHtml) */
      if(session&&session.user.id!==ME&&ui.auth.mode==='code')ui.auth={mode:'eadd'};
      if(session&&session.user.id!==ME&&ui.auth.mode!=='newpw')start();
      else if(!session&&ev==='INITIAL_SESSION')render();
    },0);
  });
  setInterval(()=>{if(ME&&loaded&&document.visibilityState==='visible')refresh()},60000);
  setInterval(()=>{if(S.me&&loaded&&tick()&&!ui.modal)render()},30000);
  document.addEventListener('visibilitychange',()=>{if(ME&&loaded&&document.visibilityState==='visible')refresh()});
}

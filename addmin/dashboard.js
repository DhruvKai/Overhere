"use strict";
const CFG=window.APP_CONFIG||{};
const REMOTE=!!(CFG.SUPABASE_URL&&CFG.SUPABASE_ANON_KEY);
const LKEY='overhere_local_data';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=n=>Number(n||0).toLocaleString('en-IN');
const sum=o=>Object.values(o||{}).reduce((a,b)=>a+Number(b||0),0);
const pct=(a,b)=>b?Math.round(a/b*100):0;
/* Friendly names for app events and quick questions. Unknown names show as-is. */
const EV={app_open:'Opened the app',tab_view:'Switched tab',swipe:'Swiped a card',request_sent:'Sent a join request',request_withdrawn:'Withdrew a request',left_activity:'Left an activity',
  post_created:'Posted a plan',activity_edited:'Edited a plan',rating_submitted:'Rated a meetup',report_sent:'Sent a report',block:'Blocked someone',share_opened:'Opened share / invite',
  follow:'Followed a host',unfollow:'Unfollowed a host',filter:'Used a filter',sort:'Changed sort',map_view:'Opened the map',alert_saved:'Saved an alert',chat_message:'Sent a chat message',
  chat_mute:'Muted a chat',poll_created:'Created a poll',poll_vote:'Voted in a poll',sos_opened:'Opened SOS',safe_checkin:'Confirmed arrived safely',micro_feedback:'Answered a quick question',
  micro_dismissed:'Skipped a quick question',onboarding_done:'Finished sign-up in the app',theme:'Changed appearance',pwa_install:'Install prompt answered',
  account_created:'Created an account',profile_created:'Created a profile',verify_passed:'Passed a face or ID check',signed_out:'Signed out',activity_cancelled:'Cancelled a plan'};
const MICRO={swipe:'Swiping to find plans',request:'Asking to join',post:'Posting a plan',rating:'Rating a meetup'};
let PASS='',last=null;

async function fetchStats(){
  if(!REMOTE)return localStats();
  const h={apikey:CFG.SUPABASE_ANON_KEY,'Content-Type':'application/json'};
  if(CFG.SUPABASE_ANON_KEY.startsWith('eyJ'))h.Authorization='Bearer '+CFG.SUPABASE_ANON_KEY;
  let r;
  try{r=await fetch(CFG.SUPABASE_URL.replace(/\/+$/,'').replace(/\/rest\/v1$/,'')+'/rest/v1/rpc/admin_stats',{method:'POST',headers:h,body:JSON.stringify({pass:PASS})})}
  catch(e){throw new Error("Couldn't reach Supabase. Check your internet connection and try again.")}
  if(r.ok)return r.json();
  const t=await r.text();
  if(/wrong password/i.test(t))throw new Error('Wrong password.');
  if(r.status===404||/admin_stats|could not find/i.test(t))throw new Error('The dashboard is not set up in Supabase yet. Run the "Added later" part of schema.sql in the SQL editor, then set your password (see the comments in that file).');
  throw new Error('Could not load ('+r.status+'). Try again.');
}
/* Human review: people whose face or ID check failed 5 times. Returns null if schema-app.sql has not been run yet. */
const BASE=(CFG.SUPABASE_URL||'').replace(/\/+$/,'').replace(/\/rest\/v1$/,'');
async function rpc(fn,body){
  const h={apikey:CFG.SUPABASE_ANON_KEY,'Content-Type':'application/json'};
  if(CFG.SUPABASE_ANON_KEY.startsWith('eyJ'))h.Authorization='Bearer '+CFG.SUPABASE_ANON_KEY;
  const r=await fetch(BASE+'/rest/v1/rpc/'+fn,{method:'POST',headers:h,body:JSON.stringify(body)});
  const t=await r.text();
  if(!r.ok)throw new Error(/"message":"([^"]+)"/.exec(t)?.[1]||'Could not load ('+r.status+')');
  return t?JSON.parse(t):null;
}
async function fetchReviews(){if(!REMOTE)return null;try{return await rpc('admin_reviews',{pass:PASS})}catch(e){return null}}
function reviewPanel(rv){
  if(!rv)return '';
  const KIND={face:'Face check',kyc:'ID check'};
  return panel('Needs human review',rv.length?rv.length+' waiting':'nobody waiting',rv.length?`<p class="small mute">These people failed a check 5 times in a row. Approve if you are sure it is a real person (for example after a video call), or ask them to try again.</p>`
    +rv.map(x=>`<div class="rv"><span class="who"><b>${esc(x.name)}</b> · ${esc(KIND[x.kind]||x.kind)} · since ${esc(new Date(x.since).toLocaleString([], {day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}))}</span>
      <button class="btn sec" data-rv="${esc(x.user)}" data-k="${esc(x.kind)}" data-ok="0">Ask to try again</button><button class="btn" data-rv="${esc(x.user)}" data-k="${esc(x.kind)}" data-ok="1">Approve</button></div>`).join('')
    :'<p class="empty">No one is waiting for review.</p>')+'<div style="height:16px"></div>';
}

/* Same totals, worked out from data saved in this browser when Supabase is not connected. */
function localStats(){
  let all={};try{all=JSON.parse(localStorage.getItem(LKEY)||'{}')}catch(e){}
  const P=all.participants||[],F=all.feedback||[],E=all.events||[];
  const cnt=(arr,f)=>arr.reduce((o,x)=>{[].concat(f(x)).forEach(k=>{if(k!=null&&k!=='')o[k]=(o[k]||0)+1});return o},{});
  const micro={};E.filter(e=>e.name==='micro_feedback'&&/^[1-4]$/.test(String(e.props?.score))).forEach(e=>{const m=micro[e.props.moment]=micro[e.props.moment]||{s:0,n:0};m.s+=+e.props.score;m.n++});
  return {participants:P.length,by_gender:cnt(P,p=>p.gender),by_hood:cnt(P,p=>p.neighborhood),by_interest:cnt(P,p=>p.interests||[]),signups_by_day:{},
    feedback:F.length,avg_rating:F.length?F.reduce((a,f)=>a+f.rating,0)/F.length:null,rating_dist:cnt(F,f=>f.rating),would_use:cnt(F,f=>f.would_use||'No answer'),
    quotes:F.filter(f=>f.consent_quote&&(f.liked||f.improve)).slice(-30).reverse(),events:cnt(E,e=>e.name),
    micro:Object.fromEntries(Object.entries(micro).map(([k,v])=>[k,{avg:v.s/v.n,n:v.n}])),tried:new Set(E.map(e=>e.participant_id).filter(Boolean)).size,sessions_30d:new Set(E.map(e=>e.session_id)).size};
}

/* ---------- chart pieces (single series each, so no legend; the title names it) ---------- */
function bars(entries,{fmt=v=>num(v),tip=(l,v)=>`${l}: ${fmt(v)}`,max}={}){
  if(!entries.length)return '<p class="empty">No data yet.</p>';
  const m=max||Math.max(...entries.map(e=>e[1]),1);
  return `<div class="rows">${entries.map(([l,v])=>`<div class="row"><span class="lab" title="${esc(l)}">${esc(l)}</span><span class="track"><span class="fill${v>0?'':' zero'}" tabindex="0" data-tip="${esc(tip(l,v))}" style="width:calc(${Math.max(0,v)/m*100}% - 60px)"></span><span class="val">${fmt(v)}</span></span></div>`).join('')}</div>`;
}
const table=(head,rows)=>`<details><summary>Show as table</summary><table><thead><tr>${head.map((h,i)=>`<th class="${i?'n':''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i?'n':''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></details>`;
const panel=(title,sub,body)=>`<section class="panel"><div class="ph"><h2>${title}</h2>${sub?`<span class="mute">${sub}</span>`:''}</div>${body}</section>`;
const sorted=o=>Object.entries(o||{}).map(([k,v])=>[k,Number(v)]).sort((a,b)=>b[1]-a[1]);
function niceMax(v){if(v<=4)return 4;const p=Math.pow(10,Math.floor(Math.log10(v))),n=v/p;return (n<=2?2:n<=5?5:10)*p}
function dayChart(byDay){
  const days=[];for(let i=29;i>=0;i--){const d=new Date(Date.now()-i*864e5);days.push(d.toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}))}
  const vals=days.map(d=>Number(byDay?.[d]||0)),top=niceMax(Math.max(...vals,1)),lab=d=>new Date(d+'T12:00:00').toLocaleDateString([], {day:'numeric',month:'short'});
  if(!sum(byDay))return '<p class="empty">No sign-ups in the last 30 days'+(REMOTE?'':' (sign-up dates are not kept in local mode)')+'.</p>';
  return `<div class="cols"><span class="gl" style="top:0"></span><span class="gl" style="top:50%"></span><span class="yt" style="top:0">${num(top)}</span><span class="yt" style="top:50%">${num(top/2)}</span><span class="yt" style="top:100%">0</span>
    ${days.map((d,i)=>`<span class="col" tabindex="0" data-tip="${esc(lab(d))}: ${vals[i]} sign-up${vals[i]===1?'':'s'}"><i style="height:${vals[i]/top*100}%"></i></span>`).join('')}</div>
    <div class="xt"><span>${lab(days[0])}</span><span>${lab(days[15])}</span><span>Today</span></div>`
    +table(['Day','Sign-ups'],days.map((d,i)=>[lab(d),vals[i]]).filter(r=>r[1]));
}

function view(st,rv){
  last=new Date();
  const P=Number(st.participants||0),T=Number(st.tried||0),F=Number(st.feedback||0),wu=st.would_use||{},wuN=sum(wu);
  const avg=st.avg_rating==null?null:Number(st.avg_rating);
  const EVs=sorted(st.events).map(([k,v])=>[EV[k]||k,v]);
  const micro=Object.entries(st.micro||{}).map(([k,v])=>[MICRO[k]||k,Number(v.avg),Number(v.n)]).sort((a,b)=>b[1]-a[1]);
  const funnel=[['Signed up',P],['Tried the app',T],['Gave feedback',F]];
  const rating=[5,4,3,2,1].map(n=>[`${n} star${n>1?'s':''}`,Number(st.rating_dist?.[n]||0)]);
  const would=['Yes','Maybe','No','No answer'].filter(k=>wu[k]!=null).map(k=>[k,Number(wu[k])]);
  $('#main').innerHTML=`${REMOTE?'':'<div class="note">Supabase is not connected, so this shows data saved in this browser only.</div>'}
  <div class="top"><div><h1>How the beta is going</h1><p class="small mute" style="margin:0">Totals only: no names or emails. Feedback text appears only where people agreed to be quoted. Updated ${last.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}.</p></div>
    <div style="display:flex;gap:8px"><button class="btn sec" id="refresh">Refresh</button>${REMOTE?'<button class="btn sec" id="lock">Lock</button>':''}</div></div>
  ${reviewPanel(rv)}
  <div class="kpis">
    <div class="panel kpi hero"><div class="l">Sign-ups</div><div class="v">${num(P)}</div><div class="s">${num(st.sessions_30d||0)} app sessions in the last 30 days</div></div>
    <div class="panel kpi"><div class="l">Tried the app</div><div class="v">${num(T)}</div><div class="s">${P?pct(T,P)+'% of sign-ups':'–'}</div></div>
    <div class="panel kpi"><div class="l">Feedback responses</div><div class="v">${num(F)}</div><div class="s">${P?pct(F,P)+'% of sign-ups':'–'}</div></div>
    <div class="panel kpi"><div class="l">Average rating</div><div class="v">${avg==null?'–':avg.toFixed(1)+' / 5'}</div><div class="s">${F?'from '+num(F)+' responses':'no ratings yet'}</div></div>
    <div class="panel kpi"><div class="l">Would use it</div><div class="v">${wuN?pct(wu.Yes||0,wuN)+'%':'–'}</div><div class="s">${wuN?`said Yes (${num(wu.Maybe||0)} maybe)`:'no answers yet'}</div></div>
  </div>
  <div class="grid two">
    ${panel('From sign-up to feedback','people',bars(funnel,{max:Math.max(P,1),tip:(l,v)=>`${l}: ${num(v)}${P?' ('+pct(v,P)+'% of sign-ups)':''}`})+table(['Step','People'],funnel))}
    ${panel('Sign-ups per day','last 30 days',dayChart(st.signups_by_day))}
  </div>
  <div class="grid">
    ${panel('Gender','sign-ups',bars(sorted(st.by_gender))+table(['Gender','Sign-ups'],sorted(st.by_gender)))}
    ${panel('Neighbourhood','sign-ups',bars(sorted(st.by_hood))+table(['Neighbourhood','Sign-ups'],sorted(st.by_hood)))}
    ${panel('Interests','people who picked each',bars(sorted(st.by_interest))+table(['Interest','People'],sorted(st.by_interest)))}
    ${panel('Ratings','feedback responses',bars(rating)+table(['Rating','Responses'],rating))}
    ${panel('Would you use this in your city?','responses',bars(would)+table(['Answer','Responses'],would))}
    ${panel('Quick questions in the app','average ease, 1 to 4',micro.length?bars(micro.map(([l,a])=>[l,a]),{max:4,fmt:v=>v.toFixed(1),tip:(l,v)=>`${l}: ${v.toFixed(1)} of 4 (${micro.find(m=>m[0]===l)[2]} answers)`})+table(['Moment','Average (1-4)','Answers'],micro.map(([l,a,n])=>[l,a.toFixed(2),n])):'<p class="empty">No answers yet.</p>')}
  </div>
  ${panel('What testers do in the app','times each action happened',bars(EVs.slice(0,20))+(EVs.length>20?`<p class="small mute" style="margin-top:8px">Showing the top 20 of ${EVs.length} actions. The table has all of them.</p>`:'')+table(['Action','Times'],EVs))}
  <div style="height:16px"></div>
  ${panel('What people said','only people who agreed to be quoted',(st.quotes||[]).length?`<div class="quotes">${st.quotes.map(q=>`<div class="q"><div class="st">${'★'.repeat(q.rating)}${'☆'.repeat(5-q.rating)} · ${q.at?new Date(q.at).toLocaleDateString([], {day:'numeric',month:'short'}):''}</div>${q.liked?`<p><b>Liked:</b> ${esc(q.liked)}</p>`:''}${q.improve?`<p style="margin:0"><b>Missing or confusing:</b> ${esc(q.improve)}</p>`:''}</div>`).join('')}</div>`:'<p class="empty">No quotable feedback yet.</p>')}`;
  $('#refresh').onclick=load;
  document.querySelectorAll('[data-rv]').forEach(b=>b.onclick=async()=>{
    b.disabled=true;
    try{await rpc('admin_decide_review',{pass:PASS,p_user:b.dataset.rv,p_kind:b.dataset.k,p_approve:b.dataset.ok==='1'});load()}
    catch(e){b.disabled=false;alert(e.message)}
  });
  const lk=$('#lock');if(lk)lk.onclick=()=>{PASS='';login()};
}
function login(err){
  $('#main').innerHTML=`<div class="panel login"><h1 style="font-size:22px">Beta dashboard</h1><p class="small mute">Enter the dashboard password you set in Supabase (see schema.sql). It is checked by the database, not stored in this page.</p>
  <form id="f"><label for="pw">Password</label><input type="password" id="pw" autocomplete="current-password" required>
  ${err?`<div class="err">${esc(err)}</div>`:''}<p style="margin-top:16px"><button class="btn" type="submit" style="width:100%">Open dashboard</button></p></form></div>`;
  $('#pw').focus();
  $('#f').onsubmit=e=>{e.preventDefault();PASS=$('#pw').value;load()};
}
async function load(){
  const b=document.querySelector('#f button,#refresh');if(b){b.disabled=true;b.textContent='Loading…'}
  try{const st=await fetchStats();view(st,await fetchReviews())}catch(e){REMOTE?login(e.message):($('#main').innerHTML=`<div class="err">${esc(e.message)}</div>`)}
}
/* One tooltip for every bar and column: follows the pointer, or sits above the focused mark. */
const tip=$('#tip');
function showTip(el,x,y){tip.textContent=el.dataset.tip;tip.classList.add('on');const r=tip.getBoundingClientRect();tip.style.left=Math.min(innerWidth-r.width-8,Math.max(8,x-r.width/2))+'px';tip.style.top=Math.max(8,y-r.height-12)+'px'}
document.addEventListener('pointermove',e=>{const el=e.target.closest?.('[data-tip]');if(el)showTip(el,e.clientX,e.clientY);else tip.classList.remove('on')});
document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-tip]');if(el){const r=el.getBoundingClientRect();showTip(el,r.left+r.width/2,r.top)}else tip.classList.remove('on')});
document.addEventListener('focusout',()=>tip.classList.remove('on'));
REMOTE?login():load();

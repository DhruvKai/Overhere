"use strict";
const CFG=window.APP_CONFIG||{};
const REMOTE=!!(CFG.SUPABASE_URL&&CFG.SUPABASE_ANON_KEY);
const CONSENT_VERSION='v1';
const PKEY='overhere_participant',LKEY='overhere_local_data';
/* One-time move of browser data saved under the app's old name (Tagalong). */
try{[['tagalong_participant',PKEY],['tagalong_local_data',LKEY]].forEach(([o,n])=>{const v=localStorage.getItem(o);if(v===null)return;if(localStorage.getItem(n)===null)localStorage.setItem(n,v);localStorage.removeItem(o)})}catch(e){}
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uuid=()=>crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16)});
const getP=()=>{try{return JSON.parse(localStorage.getItem(PKEY))}catch(e){return null}};

/* ---------- storage ---------- */
async function store(table,row){
  if(REMOTE){
    const headers={apikey:CFG.SUPABASE_ANON_KEY,'Content-Type':'application/json',Prefer:'return=minimal'};
    if(CFG.SUPABASE_ANON_KEY.startsWith('eyJ'))headers.Authorization='Bearer '+CFG.SUPABASE_ANON_KEY; // legacy JWT-style anon key only
    const r=await fetch(CFG.SUPABASE_URL.replace(/\/+$/,'').replace(/\/rest\/v1$/,'')+'/rest/v1/'+table,{method:'POST',headers,body:JSON.stringify(row)});
    if(r.status===409)return 'duplicate';
    if(!r.ok)throw new Error('Could not save ('+r.status+'). Please try again.');
    return 'ok';
  }
  const all=JSON.parse(localStorage.getItem(LKEY)||'{"participants":[],"feedback":[]}');
  all[table].push(row);localStorage.setItem(LKEY,JSON.stringify(all));return 'ok';
}
/* Feedback goes through a database function that limits how much can arrive; if you're signed in to the app in
   this browser, your login goes with it so the feedback is linked to your account (by the server, not this page). */
function sessionToken(){
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^sb-.+-auth-token$/.test(k)){const v=JSON.parse(localStorage.getItem(k));if(v?.access_token&&(!v.expires_at||v.expires_at*1000>Date.now()))return v.access_token}}}catch(e){}
  return null;
}
async function sendFeedback(row){
  const headers={apikey:CFG.SUPABASE_ANON_KEY,'Content-Type':'application/json'};
  const tok=sessionToken()||(CFG.SUPABASE_ANON_KEY.startsWith('eyJ')?CFG.SUPABASE_ANON_KEY:null);
  if(tok)headers.Authorization='Bearer '+tok;
  const r=await fetch(CFG.SUPABASE_URL.replace(/\/+$/,'').replace(/\/rest\/v1$/,'')+'/rest/v1/rpc/send_feedback',{method:'POST',headers,body:JSON.stringify({p:row})});
  if(!r.ok){const t=await r.text();throw new Error(/"message":"([^"]+)"/.exec(t)?.[1]||'Could not save ('+r.status+'). Please try again.')}
}
function download(){
  const blob=new Blob([localStorage.getItem(LKEY)||'{}'],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='overhere-local-data.json';a.click();
}
const localBanner=()=>REMOTE?'':'<div class="note">Backend not connected yet: submissions are saved in this browser only. See GO-LIVE-GUIDE.md to connect Supabase. <a href="#" id="dl">Download saved data</a></div>';

/* ---------- views ---------- */
let view='home';
const fromApp=location.hash==='#feedback';   // opened from the full-screen app's feedback button
function nav(v){
  /* The app always opens full page; "Join the beta" opens it on "Create your account". */
  if(v==='try'||v==='join'){location.href=v==='join'?'app.html?join':'app.html';return}
  view=v;
  $('#t_fb').classList.toggle('on',v==='feedback');
  $('#main').innerHTML=({home,feedback,thanks,admin})[v]();
  bind();window.scrollTo(0,0);
}
function home(){
  const p=getP();
  return `<h1>Find people to do things with.</h1>
  <p class="mute">Overhere helps you turn a plan you are already making, like a movie, a coffee or a concert, into an outing with company. You post it, people ask to join, you choose who comes.</p>
  <div class="steps"><div><b>1</b>Make an account and a short profile</div><div><b>2</b>Post plans and join other people's</div><div><b>3</b>Tell us what you think</div></div>
  <p class="small mute">Launching first in Chandigarh. This is an early test. We are collecting a little information to learn who would use this and what should be built first. Not a dating app.</p>
  ${p?`<div class="ok">Welcome back, ${esc(p.name)}.</div><button class="btn" data-go="try">Try the platform</button>`
     :`<button class="btn" data-go="join">Join the beta</button>`} <button class="btn sec" data-go="feedback">Leave feedback</button>
  <p class="small mute" style="margin-top:14px">Other beta testers are real people: what you post, they can see and join. Some plans come from sample hosts so it's never empty; those say yes straight away.</p>`;
}
/* Demo accounts are real accounts now: made once in Supabase (see SETUP-APP.md), signed in to inside the app. */
function admin(){
  return `<div class="panel" style="max-width:460px;margin:0 auto"><h2>Demo accounts</h2><p class="mute small">Sign in inside the app with one of these, using the password you gave it in Supabase (Authentication, Users).</p>
  <p class="small">Their email addresses are in SETUP-APP.md on your computer (not listed here, so nobody can target them).</p>
  <p style="margin-top:16px"><button class="btn" data-go="try" style="width:100%">Open the app</button></p>
  <p class="small mute" style="margin:18px 0 0;text-align:center">Looking for results? <a href="addmin/" style="color:var(--acch);font-weight:600">Open the beta dashboard</a></p></div>`;
}
/* The same short form as the app's feedback sheet: a rating, one thing to change, and the consent box right above
   Send, which stays off until the rating and the required box are done. */
function feedback(){
  return localBanner()+`${fromApp?'<p class="small"><a href="app.html" style="color:var(--acch);font-weight:600">← Back to the app</a></p>':''}<div class="panel"><h2>Tell us what you think</h2><p class="mute small">Overhere is in beta and we're a small team. We read every message. It takes about 20 seconds.</p>
  <form id="f">
  <label id="stars_l">How's Overhere working for you?</label><div class="stars" id="stars" role="group" aria-labelledby="stars_l">${[1,2,3,4,5].map(n=>`<button type="button" data-n="${n}" aria-label="${n} stars" aria-pressed="false">★</button>`).join('')}</div>
  <label for="improve">What's one thing we should change? <span class="mute" style="font-weight:400">(optional)</span></label><textarea id="improve" maxlength="1000" placeholder="Something confusing, missing, or that you'd love to see"></textarea>
  <label>Would you use this in your city? <span class="mute" style="font-weight:400">(optional)</span></label><div class="opts">${['Yes','Maybe','No'].map(v=>`<label class="opt"><input type="radio" name="use" value="${v}">${v}</label>`).join('')}</div>
  <div class="consent">
   <label style="margin-top:0"><input type="checkbox" id="c_quote"> <span>Optional: you may quote my feedback publicly, without my name or email.</span></label>
   <label><input type="checkbox" id="c_contact"> <span>Optional: you may contact me with follow-up questions.</span></label>
   <label class="req"><input type="checkbox" id="c_store"> <span><b>Required:</b> I agree that my feedback may be stored and used to improve Overhere (<a href="privacy.html">Privacy policy</a>).</span></label>
  </div>
  <div id="err"></div>
  <p style="margin-top:16px"><button class="btn" id="go" type="submit" disabled>Send feedback</button></p>
  <p class="small mute" id="why" aria-live="polite" style="margin:-4px 0 0">Pick a rating and tick the required box to send.</p></form></div>`;
}
function thanks(){
  return `<div class="panel" style="text-align:center"><div style="font-size:48px">🙏</div><h2>Thank you!</h2><p class="mute">Your response has been saved. You can keep trying the platform any time.</p>
  <a class="btn" href="app.html" style="display:inline-block;text-decoration:none">Back to the app</a></div>`;
}

/* ---------- behavior ---------- */
function showErr(m){$('#err').innerHTML=`<div class="err">${esc(m)}</div>`}
function bind(){
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>nav(b.dataset.go));
  const dl=$('#dl');if(dl)dl.onclick=e=>{e.preventDefault();download()};
  if(view==='feedback'){
    let rating=0;
    const ready=()=>{const ok=$('#c_store').checked;$('#go').disabled=!(rating&&ok);
      $('#why').textContent=rating&&ok?'':!rating&&!ok?'Pick a rating and tick the required box to send.':!rating?'Pick a rating to send.':'Tick the required box to send.'};
    document.querySelectorAll('#stars button').forEach(b=>b.onclick=()=>{rating=+b.dataset.n;document.querySelectorAll('#stars button').forEach(x=>{x.classList.toggle('on',+x.dataset.n<=rating);x.setAttribute('aria-pressed',+x.dataset.n===rating)});ready()});
    $('#c_store').onchange=ready;
    $('#f').onsubmit=e=>submitFeedback(e,()=>rating);
  }
}
async function submitFeedback(e,getRating){
  e.preventDefault();
  if(!$('#c_store').checked)return showErr('Please tick the required consent box to send feedback.');
  const rating=getRating();if(!rating)return showErr('Please pick a star rating.');
  const use=document.querySelector('input[name=use]:checked');
  const p=getP();
  const row={id:uuid(),participant_id:/^[0-9a-f-]{36}$/i.test(p?.id||'')?p.id:null,rating,liked:null,improve:$('#improve').value.trim()||null,would_use:use?use.value:null,consent_store:true,consent_quote:$('#c_quote').checked,consent_contact:$('#c_contact').checked,consent_version:CONSENT_VERSION,source:'landing'};
  $('#go').disabled=true;
  try{if(REMOTE)await sendFeedback(row);else await store('feedback',row);nav('thanks')}catch(err){showErr(err.message);$('#go').disabled=false}
}
$('#logo').onclick=()=>nav('home');
$('#t_try').onclick=()=>nav('try');
$('#t_fb').onclick=()=>nav('feedback');
nav(location.hash==='#admin'?'admin':fromApp?'feedback':'home');   // demo accounts: no tab, opened from /addmin
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});

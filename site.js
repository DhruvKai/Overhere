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
function download(){
  const blob=new Blob([localStorage.getItem(LKEY)||'{}'],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='overhere-local-data.json';a.click();
}
const localBanner=()=>REMOTE?'':'<div class="note">Backend not connected yet: submissions are saved in this browser only. See GO-LIVE-GUIDE.md to connect Supabase. <a href="#" id="dl">Download saved data</a></div>';

/* ---------- views ---------- */
let view='home';
const fromApp=location.hash==='#feedback';   // opened from the full-screen app's feedback button
function nav(v){
  view=v;
  $('#t_try').classList.toggle('on',v==='try');$('#t_fb').classList.toggle('on',v==='feedback');
  $('#main').innerHTML=({home,try_:tryView,feedback,thanks,admin})[v==='try'?'try_':v]();
  bind();window.scrollTo(0,0);
}
function home(){
  const p=getP();
  return `<h1>Find people to do things with.</h1>
  <p class="mute">Overhere helps you turn a plan you are already making, like a movie, a coffee or a concert, into an outing with company. You post it, people ask to join, you choose who comes.</p>
  <div class="steps"><div><b>1</b>Make an account and a short profile</div><div><b>2</b>Post plans and join other people's</div><div><b>3</b>Tell us what you think</div></div>
  <p class="small mute">Launching first in Chandigarh. This is an early test. We are collecting a little information to learn who would use this and what should be built first. Not a dating app.</p>
  ${p?`<div class="ok">Welcome back, ${esc(p.name)}.</div><button class="btn" data-go="try">Try the platform</button> <button class="btn sec" data-go="feedback">Leave feedback</button>`
     :`<button class="btn" data-go="try">Join the beta</button>`}`;
}
/* Demo accounts are real accounts now: made once in Supabase (see SETUP-APP.md), signed in to inside the app. */
function admin(){
  return `<div class="panel" style="max-width:460px;margin:0 auto"><h2>Demo accounts</h2><p class="mute small">Sign in inside the app with one of these, using the password you gave it in Supabase (Authentication, Users).</p>
  <p class="small"><b>kajal@overhere.test</b> · woman, ID verified<br><b>arjun@overhere.test</b> · man, ID verified<br><b>neha@overhere.test</b> · woman, new, ID not verified yet</p>
  <p style="margin-top:16px"><button class="btn" data-go="try" style="width:100%">Open the app</button></p>
  <p class="small mute" style="margin:18px 0 0;text-align:center">Looking for results? <a href="addmin/" style="color:var(--acch);font-weight:600">Open the beta dashboard</a></p></div>`;
}
function tryView(){
  return `<h2>Try the platform</h2><p class="mute small">Create an account (or sign in) inside the app below. Other beta testers are real people: what you post, they can see and join. Some plans come from sample hosts so it's never empty; those say yes straight away.</p>
  <p class="small" style="text-align:center"><a href="demo.html" target="_blank" rel="noopener" style="color:var(--acch);font-weight:600">Open full screen ↗</a></p>
  <div class="frame"><iframe src="demo.html?embed=1" title="Overhere demo"></iframe></div>
  <p style="text-align:center;margin-top:16px"><button class="btn" data-go="feedback">I have tried it, leave feedback</button></p>`;
}
function feedback(){
  return localBanner()+`${fromApp?'<p class="small"><a href="demo.html" style="color:var(--acch);font-weight:600">← Back to the app</a></p>':''}<div class="panel"><h2>Tell us what you think</h2><p class="mute small">Honest is best. Nothing here is required except the consent box.</p>
  <form id="f">
  <label>Overall, how was it?</label><div class="stars" id="stars">${[1,2,3,4,5].map(n=>`<button type="button" data-n="${n}" aria-label="${n} stars">★</button>`).join('')}</div>
  <label for="liked">What did you like?</label><textarea id="liked" maxlength="1000"></textarea>
  <label for="improve">What was confusing or missing?</label><textarea id="improve" maxlength="1000"></textarea>
  <label>Would you use this in your city?</label><div class="opts">${['Yes','Maybe','No'].map(v=>`<label class="opt"><input type="radio" name="use" value="${v}">${v}</label>`).join('')}</div>
  <div class="consent"><strong>Your consent</strong>
   <label><input type="checkbox" id="c_store"> <span><b>Required:</b> I agree that my feedback may be stored and used to improve Overhere.</span></label>
   <label><input type="checkbox" id="c_quote"> <span>Optional: you may quote my feedback publicly, without my name or email.</span></label>
   <label><input type="checkbox" id="c_contact"> <span>Optional: you may contact me with follow-up questions.</span></label>
  </div>
  <div id="err"></div>
  <p style="margin-top:16px"><button class="btn" id="go" type="submit">Send feedback</button></p></form></div>`;
}
function thanks(){
  return `<div class="panel" style="text-align:center"><div style="font-size:48px">🙏</div><h2>Thank you!</h2><p class="mute">Your response has been saved. You can keep trying the platform any time.</p>
  ${fromApp?'<a class="btn" href="demo.html" style="display:inline-block;text-decoration:none">Back to the app</a>':'<button class="btn" data-go="try">Back to the platform</button>'}</div>`;
}

/* ---------- behavior ---------- */
function showErr(m){$('#err').innerHTML=`<div class="err">${esc(m)}</div>`}
function bind(){
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>nav(b.dataset.go));
  const dl=$('#dl');if(dl)dl.onclick=e=>{e.preventDefault();download()};
  if(view==='feedback'){
    let rating=0;
    document.querySelectorAll('#stars button').forEach(b=>b.onclick=()=>{rating=+b.dataset.n;document.querySelectorAll('#stars button').forEach(x=>x.classList.toggle('on',+x.dataset.n<=rating))});
    $('#f').onsubmit=e=>submitFeedback(e,()=>rating);
  }
}
async function submitFeedback(e,getRating){
  e.preventDefault();
  if(!$('#c_store').checked)return showErr('Please tick the required consent box to send feedback.');
  const rating=getRating();if(!rating)return showErr('Please pick a star rating.');
  const use=document.querySelector('input[name=use]:checked');
  const p=getP();
  const row={id:uuid(),participant_id:/^[0-9a-f-]{36}$/i.test(p?.id||'')?p.id:null,rating,liked:$('#liked').value.trim()||null,improve:$('#improve').value.trim()||null,would_use:use?use.value:null,consent_store:true,consent_quote:$('#c_quote').checked,consent_contact:$('#c_contact').checked,consent_version:CONSENT_VERSION};
  $('#go').disabled=true;
  try{await store('feedback',row);nav('thanks')}catch(err){showErr(err.message);$('#go').disabled=false}
}
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data==='overhere-feedback'&&e.source===document.querySelector('iframe')?.contentWindow)nav('feedback')});
$('#logo').onclick=()=>nav('home');
$('#t_try').onclick=()=>nav('try');
$('#t_fb').onclick=()=>nav('feedback');
nav(location.hash==='#admin'?'admin':fromApp?'feedback':'home');   // demo accounts: no tab, opened from /addmin
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});

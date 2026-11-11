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
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;

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
/* The welcome page is in index.html. Feedback, its thank-you and the demo-account note replace it in #main. */
let view='home';
const fromApp=location.hash==='#feedback';   // opened from the full-screen app's feedback button
function nav(v){
  view=v;
  const home=v==='home';
  $('#welcome').hidden=!home;$('#main').hidden=home;
  $('#hd').classList.toggle('solid',!home);   // no hero photo behind the header on these views
  if(!home){$('#main').innerHTML=({feedback,thanks,admin})[v]();bind()}
  window.scrollTo(0,0);
}
/* Demo accounts are real accounts now: made once in Supabase (see SETUP-APP.md), signed in to inside the app. */
function admin(){
  return `<div class="panel" style="max-width:460px;margin:0 auto"><h2>Demo accounts</h2><p class="mute small">Sign in inside the app with one of these, using the password you gave it in Supabase (Authentication, Users).</p>
  <p class="small">Their email addresses are in SETUP-APP.md on your computer (not listed here, so nobody can target them).</p>
  <p style="margin-top:16px"><a class="btn wide" href="app.html">Open the app</a></p>
  <p class="small mute" style="margin:18px 0 0;text-align:center">Looking for results? <a href="addmin/" style="color:var(--acch);font-weight:600">Open the beta dashboard</a></p></div>`;
}
/* The same short form as the app's feedback sheet: a rating, one thing to change, and the consent box right above
   Send, which stays off until the rating and the required box are done. */
function feedback(){
  return localBanner()+`${fromApp?'<p class="small"><a href="app.html" style="color:var(--acch);font-weight:600">← Back to the app</a></p>':'<p class="small"><a href="./?home" style="color:var(--acch);font-weight:600">← Back</a></p>'}<div class="panel"><h2>Tell us what you think</h2><p class="mute small">Overhere is in beta and we're a small team. We read every message. It takes about 20 seconds.</p>
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
  <a class="btn" href="app.html">Back to the app</a></div>`;
}

/* ---------- feedback behavior ---------- */
function showErr(m){$('#err').innerHTML=`<div class="err">${esc(m)}</div>`}
function bind(){
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

/* ---------- welcome page: header line and scroll reveals ---------- */
if('IntersectionObserver' in window){
  /* The header is white on the hero photo and turns cream once the page has moved: watch the top of the page instead
     of every scroll event. */
  const top=document.createElement('div');top.style.cssText='position:absolute;top:0;height:8px;width:1px';document.body.prepend(top);
  new IntersectionObserver(([e])=>$('#hd').classList.toggle('sc',!e.isIntersecting)).observe(top);
  if(!calm){
    document.documentElement.classList.add('anim');
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
    document.querySelectorAll('.rv').forEach(el=>io.observe(el));
  }
}

/* ---------- welcome page: the swipe demo ---------- */
/* The same gesture as the app's Swipe tab, on example cards: drag (or the buttons, or ← →) sends the top card
   away, and it goes to the back of the pile so the demo never runs out. */
(function deck(){
  const stack=$('#stack');if(!stack)return;
  const cap=$('#dcap'),cards=()=>[...stack.querySelectorAll('.card')];
  let order=cards(),busy=false,drag=null;
  const place=()=>order.forEach((c,i)=>{c.dataset.pos=i<3?String(i):'h';c.style.transform='';untilt(c);c.setAttribute('aria-hidden',String(i>0))});
  /* 3D: the top card leans towards the mouse, and a glare follows the mouse or your finger (CSS in index.html) */
  const tilt=(c,e)=>{
    const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    c.style.setProperty('--ty',((x-.5)*14).toFixed(2)+'deg');c.style.setProperty('--tx',((.5-y)*12).toFixed(2)+'deg');
    c.style.setProperty('--gx',(x*100).toFixed(1)+'%');c.style.setProperty('--gy',(y*100).toFixed(1)+'%');c.style.setProperty('--go','1');
  };
  function untilt(c){['--tx','--ty','--go'].forEach(k=>c.style.removeProperty(k));c.classList.remove('tilt')}
  const stamp=(c,dx)=>{c.querySelector('.stamp.yes').style.opacity=Math.max(0,Math.min(1,dx/90));c.querySelector('.stamp.no').style.opacity=Math.max(0,Math.min(1,-dx/90))};
  function fling(dir){
    if(busy)return;busy=true;
    const c=order[0],host=c.dataset.host;
    stamp(c,dir*120);
    c.style.transition=calm?'none':'transform .42s cubic-bezier(.4,0,.2,1),opacity .42s';
    c.style.transform=`translateX(${dir*130}%) rotate(${dir*18}deg)`;c.style.opacity='0';
    cap.innerHTML=dir>0?`Asked to join. <b>${esc(host)}</b> decides who comes.`:'Skipped. Plans you skip don\'t come back.';
    setTimeout(()=>{
      order.push(order.shift());
      c.style.transition='none';c.style.opacity='';stamp(c,0);place();
      void c.offsetWidth;c.style.transition='';busy=false;
    },calm?0:430);
  }
  stack.addEventListener('pointerdown',e=>{
    const c=order[0];if(busy||!c.contains(e.target))return;
    untilt(c);
    drag={x:e.clientX,y:e.clientY,dx:0,id:e.pointerId};c.classList.add('drag');c.setPointerCapture(e.pointerId);
  });
  stack.addEventListener('pointermove',e=>{
    if(!drag){if(!calm&&e.pointerType==='mouse'&&!busy&&order[0].contains(e.target)){order[0].classList.add('tilt');tilt(order[0],e)}return}
    if(e.pointerId!==drag.id)return;
    drag.dx=e.clientX-drag.x;const dy=(e.clientY-drag.y)*.15;
    order[0].style.transform=`translate(${drag.dx}px,${dy}px) rotate(${drag.dx/18}deg)${calm?'':` rotateY(${(drag.dx/14).toFixed(1)}deg)`}`;stamp(order[0],drag.dx);
    if(!calm)tilt(order[0],e);
  });
  stack.addEventListener('pointerleave',()=>{if(!drag)untilt(order[0])});
  const end=e=>{
    if(!drag||e.pointerId!==drag.id)return;
    const c=order[0],dx=drag.dx;drag=null;c.classList.remove('drag');
    if(Math.abs(dx)>90)fling(dx>0?1:-1);else{c.style.transform='';stamp(c,0)}
  };
  stack.addEventListener('pointerup',end);stack.addEventListener('pointercancel',end);
  stack.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();fling(1)}else if(e.key==='ArrowLeft'){e.preventDefault();fling(-1)}});
  $('#d_yes').onclick=()=>fling(1);$('#d_no').onclick=()=>fling(-1);
  place();
})();

/* ---------- welcome page: the activity cards ---------- */
/* A trackpad or a finger scrolls the row sideways by itself; a mouse gets the arrows, and can drag the row. */
(function rail(){
  const rail=$('#rail'),prev=$('#r_prev'),next=$('#r_next');if(!rail)return;
  const step=()=>{const t=rail.querySelector('.tile');return t?t.offsetWidth+10:300};   // a card and the 10px gap
  const ends=()=>{prev.disabled=rail.scrollLeft<4;next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-4};
  const by=dir=>rail.scrollBy({left:dir*Math.max(step(),rail.clientWidth-step()),behavior:calm?'auto':'smooth'});
  prev.onclick=()=>by(-1);next.onclick=()=>by(1);
  rail.addEventListener('scroll',ends,{passive:true});addEventListener('resize',ends);ends();
  /* dragging turns the snap off; letting go glides to the nearest card, as the snap would, then turns it back on */
  let d=null,snapT;
  rail.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0)d={x:e.clientX,left:rail.scrollLeft,moved:false}});
  addEventListener('pointermove',e=>{
    if(!d)return;
    const dx=e.clientX-d.x;if(!d.moved&&Math.abs(dx)<5)return;
    if(!d.moved){d.moved=true;clearTimeout(snapT);rail.classList.add('drag')}
    rail.scrollLeft=d.left-dx;
  });
  addEventListener('pointerup',()=>{
    if(!d)return;const moved=d.moved;d=null;if(!moved)return;
    rail.scrollTo({left:Math.round(rail.scrollLeft/step())*step(),behavior:calm?'auto':'smooth'});
    snapT=setTimeout(()=>rail.classList.remove('drag'),calm?0:450);
  });
  /* 3D: cards turn to face the middle as they slide past it (CSS in index.html) */
  if(calm)return;
  const tiles=[...rail.querySelectorAll('.tile')];let raf=0;
  const turn=()=>{
    raf=0;const r=rail.getBoundingClientRect(),mid=r.left+r.width/2;
    tiles.forEach(t=>{
      const b=t.getBoundingClientRect(),o=Math.max(-1.4,Math.min(1.4,(b.left+b.width/2-mid)/(r.width/2)));   // turning keeps the centre where it is
      t.style.setProperty('--ry',(o*-14).toFixed(2)+'deg');t.style.setProperty('--s',(1-Math.abs(o)*.05).toFixed(3));
    });
  };
  const kick=()=>{if(!raf)raf=requestAnimationFrame(turn)};
  rail.addEventListener('scroll',kick,{passive:true});addEventListener('resize',kick);turn();
})();

/* ---------- welcome page: the hero in 3D ---------- */
/* The photos sit at different depths: they lean towards the mouse, and tip back and shrink a little as you scroll
   (CSS in index.html). Phones get only the scroll part. Eased, and only drawn while something changes. */
(function hero3d(){
  const hero=document.querySelector('.hero');if(!hero||calm)return;
  let mx=0,my=0,tx=0,ty=0,raf=0;
  const frame=()=>{
    raf=0;mx+=(tx-mx)*.08;my+=(ty-my)*.08;
    const sp=Math.min(1,Math.max(0,scrollY/(hero.offsetHeight||1)));
    hero.style.setProperty('--mx',mx.toFixed(3));hero.style.setProperty('--my',my.toFixed(3));hero.style.setProperty('--sp',sp.toFixed(3));
    if(Math.abs(tx-mx)>.002||Math.abs(ty-my)>.002)raf=requestAnimationFrame(frame);
  };
  const kick=()=>{if(!raf)raf=requestAnimationFrame(frame)};
  hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;kick()});
  hero.addEventListener('pointerleave',()=>{tx=ty=0;kick()});
  addEventListener('scroll',()=>{if(scrollY<hero.offsetHeight*1.5)kick()},{passive:true});
  kick();
})();

/* ---------- welcome page: sign-up and sign-in ---------- */
/* The page checks the phone number or email, then hands over to the app (app.html), which does the real sign-in:
   the security check, the SMS or email code and the password all stay there. What you typed goes along in
   sessionStorage (this tab only, cleared by the app as soon as it reads it), never in the address. */
const HANDOFF='overhere_handoff';
let mode='up';
const phoneDigits=s=>{const d=s.replace(/\D/g,'');return (d.length>10?d.replace(/^(91|0)(?=\d{10}$)/,''):d).slice(0,10)};
const phoneProblem=n=>!n?'Enter your mobile number':n.length<10?'Enter all 10 digits':!/^[6-9]/.test(n)?'Indian mobile numbers start with 6, 7, 8 or 9':'';
const emailProblem=v=>!v?'Enter your email':!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(v)?'That doesn\'t look like an email address. Check for typos.':'';
const via=()=>document.querySelector('input[name=via]:checked')?.value||'email';
function authDraw(){
  const up=mode==='up',ph=via()==='phone';
  $('#tab_up').setAttribute('aria-selected',String(up));$('#tab_in').setAttribute('aria-selected',String(!up));
  $('#au_t').textContent=up?'Create your account':'Welcome back';
  $('#au_s').textContent=up?'Start with your phone number or email.':'Sign in to see plans near you.';
  $('#f_phone').classList.toggle('hide',!ph);$('#f_email').classList.toggle('hide',ph);
  $('#au_phone_hint').textContent=up?'We\'ll text you a 6-digit code. Then you\'ll add your email and confirm it with a code too.':'We\'ll text you a 6-digit code to sign in.';
  $('#au_email_hint').textContent=up?'Next, you\'ll choose a password and confirm your email.':'Next, you\'ll enter your password.';
  $('#au_agree').classList.toggle('hide',!up);$('#au_legal').classList.toggle('hide',up);
}
function setMode(m,focus){
  mode=m;authDraw();
  if(focus)setTimeout(()=>(via()==='phone'?$('#au_phone'):$('#au_email')).focus({preventScroll:true}),calm?0:450);
}
function fieldErr(id,msg){
  const i=$('#'+id);$('#'+id+'_err').textContent=msg;i.setAttribute('aria-invalid',String(!!msg));
  if(msg)i.focus();
  return !msg;
}
if(!CFG.PHONE_LOGIN){   // no SMS yet: email only
  $('#au_via').classList.add('hide');document.querySelector('input[name=via][value=email]').checked=true;
}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode,b.tagName==='A')));
document.querySelectorAll('input[name=via]').forEach(r=>r.onchange=authDraw);
$('#au_ok').addEventListener('change',e=>{if(e.target.checked)fieldErr('au_ok','')});
$('#au_phone').addEventListener('input',e=>{if(e.target.getAttribute('aria-invalid')==='true'&&!phoneProblem(phoneDigits(e.target.value)))fieldErr('au_phone','')});
/* A pasted "+91 98765 43210" or "098765 43210" loses its prefix and shows as "98765 43210", like in the app. */
$('#au_phone').addEventListener('blur',e=>{const n=phoneDigits(e.target.value);if(n.length===10)e.target.value=n.slice(0,5)+' '+n.slice(5)});
$('#au_email').addEventListener('input',e=>{if(e.target.getAttribute('aria-invalid')==='true'&&!emailProblem(e.target.value.trim()))fieldErr('au_email','')});
$('#au_f').onsubmit=e=>{
  e.preventDefault();
  const h={mode,via:via(),at:Date.now()};
  if(h.via==='phone'){const n=phoneDigits($('#au_phone').value);if(!fieldErr('au_phone',phoneProblem(n)))return;h.phone='+91'+n}
  else{const v=$('#au_email').value.trim();if(!fieldErr('au_email',emailProblem(v)))return;h.email=v}
  /* new accounts tick the 18+ box here, so the app can send the code straight away */
  if(mode==='up'){if(!fieldErr('au_ok',$('#au_ok').checked?'':"Tick the box to confirm you're 18 or older and agree to the Terms."))return;h.ok=true}
  try{sessionStorage.setItem(HANDOFF,JSON.stringify(h))}catch(err){}
  location.href='app.html?'+(mode==='up'?'join':'signin');
};
authDraw();
/* Signed in to the app in this browser: the page stays (it's the home page for everyone), but its sign-up buttons
   open the app instead. A saved login counts even if its short-lived token has expired, since the app renews it. */
const signedIn=(()=>{try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^sb-.+-auth-token$/.test(k)&&JSON.parse(localStorage.getItem(k))?.refresh_token)return true}}catch(e){}return false})();
if(signedIn){
  document.querySelectorAll('a[href="#join"]').forEach(a=>{a.href='app.html';a.removeAttribute('data-mode');a.textContent='Go to site'});
  $('#au_box').classList.add('hide');$('#au_in').classList.remove('hide');
}

$('#logo').onclick=()=>{if(view!=='home')nav('home');window.scrollTo({top:0,behavior:calm?'auto':'smooth'})};
$('#t_fb').onclick=()=>nav('feedback');
if(location.hash==='#admin')nav('admin');else if(fromApp)nav('feedback');   // demo accounts: no tab, opened from /addmin
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});

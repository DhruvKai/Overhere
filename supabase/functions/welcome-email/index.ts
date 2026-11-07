// Sends the one-time "Welcome to Overhere" email through Resend, once a new account is complete: the email is
// confirmed and, for phone sign-ups, the password is set. The website and the app call this with the person's login
// (no body needed); it works out the rest, so calling it again is harmless.
//   -> {sent: true} or {sent: false, why}   (why: 'not-ready', 'already', 'not-new', 'no-key', 'refused')
// The account's app_metadata.welcomed_at records the send. Only the service role can write app_metadata, so a
// person can't reset it to get the email again. Accounts older than NEW_FOR_DAYS never get one, so turning this on
// doesn't email everyone who signed up before.
// Needs RESEND_API_KEY (the same "Sending access" key for mail.overhere.social as the team alerts in _shared/alert.ts).
// Like every Overhere email, this is transactional: no promotions, news or links to anything but the app.
import { admin, caller, corsHeaders, guard, json } from '../_shared/common.ts';

const FROM = Deno.env.get('WELCOME_FROM') ?? 'Overhere <hello@mail.overhere.social>';
const NEW_FOR_DAYS = 7;
const APP_URL = 'https://overhere.social/app.html';
const FONT = "'Plus Jakarta Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif";

const SUBJECT = 'Welcome to Overhere';
const TEXT = `Welcome to Overhere!

Your account is ready. Overhere is for the plans you're already making, like a movie, a coffee or a concert, with a few more people along.

How it works:
- Post a plan and say how many people can join.
- Browse plans near you and ask to join the ones you like.
- The host decides who joins. Everyone who's in gets a group chat.

Next: finish your profile and the quick face check. That unlocks posting and asking to join.

Open Overhere: ${APP_URL}

Meet in public places, and tell someone you trust where you're going. The safety screen in the app is there if you need help.

You're getting this because you created an Overhere account. It's a one-time account email, not a newsletter.
Questions? Write to admin@overhere.social.`;

const step = (n: number, s: string) =>
  `<tr><td style="padding:0 0 12px;vertical-align:top;width:36px"><div style="width:26px;height:26px;border-radius:50%;background:#E7F0E1;color:#336842;font-weight:700;font-size:14px;line-height:26px;text-align:center">${n}</div></td>`
  + `<td style="padding:3px 0 12px;font-size:16px;line-height:1.5;color:#3F3F3F">${s}</td></tr>`;

// Same layout and colours as the Supabase templates in supabase/templates.
const HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${SUBJECT}</title>
<style>body{margin:0;padding:0;background:#F5F0E6}a{color:#336842}@media (max-width:600px){.card{border-radius:0!important;border-left:0!important;border-right:0!important}.pad{padding-left:24px!important;padding-right:24px!important}.h1{font-size:24px!important}}</style>
</head>
<body style="margin:0;padding:0;background:#F5F0E6;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F5F0E6">Your account is ready. Here's how Overhere works.&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F5F0E6">
<tr><td align="center" style="padding:32px 12px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px">
    <tr><td style="padding:0 8px 20px;font-family:${FONT}">
      <a href="https://overhere.social" style="text-decoration:none;color:#1A1A1A;font-size:20px;font-weight:700;letter-spacing:-.3px">
        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#1A1A1A;border:3px solid #3F7D4E;vertical-align:-2px"></span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#1A1A1A;border:3px solid #3F7D4E;vertical-align:-2px;margin-left:2px"></span>&nbsp;&nbsp;Overhere</a>
    </td></tr>
    <tr><td class="card" style="background:#FFFDF8;border:1px solid #E7DFCF;border-top:6px solid #3F7D4E;border-radius:20px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr><td class="pad" style="padding:36px 40px 8px;font-family:${FONT};color:#1A1A1A">
          <h1 class="h1" style="margin:0 0 14px;font-size:28px;line-height:1.2;font-weight:700;letter-spacing:-.5px">Welcome to Overhere</h1>
          <p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:#3F3F3F">Your account is ready. Overhere is for the plans you're already making, like a movie, a coffee or a concert, with a few more people along.</p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="font-family:${FONT}">
            ${step(1, 'Post a plan and say how many people can join.')}
            ${step(2, 'Browse plans near you and ask to join the ones you like.')}
            ${step(3, "The host decides who joins. Everyone who's in gets a group chat.")}
          </table>
          <p style="margin:10px 0 24px;font-size:16px;line-height:1.6;color:#3F3F3F"><b>Next:</b> finish your profile and the quick face check. That unlocks posting and asking to join.</p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="background:#336842;border-radius:12px">
            <a href="${APP_URL}" style="display:inline-block;padding:14px 26px;font-family:${FONT};font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none">Open Overhere</a>
          </td></tr></table>
        </td></tr>
        <tr><td class="pad" style="padding:24px 40px 32px;font-family:${FONT};font-size:13px;line-height:1.6;color:#6B6B6B">
          Meet in public places, and tell someone you trust where you're going. The safety screen in the app is there if you need help.
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:24px 16px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:#8A8270;text-align:center">
      You're getting this because you created an Overhere account.<br>
      This is a one-time account email, not a newsletter, so there's nothing to unsubscribe from.<br><br>
      <a href="https://overhere.social/privacy.html" style="color:#6B6B6B">Privacy</a> &nbsp;&middot;&nbsp; <a href="https://overhere.social/terms.html" style="color:#6B6B6B">Terms</a> &nbsp;&middot;&nbsp; <a href="mailto:admin@overhere.social" style="color:#6B6B6B">admin@overhere.social</a><br>
      &copy; Overhere &middot; Made in India
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

Deno.serve(async (req) => {
  const early = guard(req);
  if (early) return early;
  const h = corsHeaders(req);
  try {
    // getUser reads the account from the server, so app_metadata is current (not what the login token remembers)
    const user = await caller(req);
    if (!user) return json({ error: 'Sign in first' }, 401, h);
    const ready = !!user.email && !!user.email_confirmed_at && (!user.phone_confirmed_at || user.user_metadata?.pw_set === true);
    if (!ready) return json({ sent: false, why: 'not-ready' }, 200, h);
    if (user.app_metadata?.welcomed_at) return json({ sent: false, why: 'already' }, 200, h);
    if (Date.now() - Date.parse(user.created_at) > NEW_FOR_DAYS * 864e5) return json({ sent: false, why: 'not-new' }, 200, h);
    const key = Deno.env.get('RESEND_API_KEY');
    if (!key) { console.warn('welcome skipped: no RESEND_API_KEY'); return json({ sent: false, why: 'no-key' }, 200, h); }

    // mark it first, so the website and the app calling at the same moment don't both send
    const db = admin();
    const mark = (v: string | null) => db.auth.admin.updateUserById(user.id, { app_metadata: { ...user.app_metadata, welcomed_at: v } });
    const { error: markErr } = await mark(new Date().toISOString());
    if (markErr) throw markErr;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [user.email], subject: SUBJECT, text: TEXT, html: HTML }),
      signal: AbortSignal.timeout(8000),
    }).catch((e) => { console.error('welcome failed', (e as Error).message); return null; });
    if (!r?.ok) {
      if (r) console.error('welcome refused', r.status, (await r.text()).slice(0, 300));
      await mark(null);   // try again next time the app opens
      return json({ sent: false, why: 'refused' }, 200, h);
    }
    return json({ sent: true }, 200, h);
  } catch (e) {
    console.error('welcome error', (e as Error).message);
    return json({ error: 'Could not send the welcome email' }, 500, h);
  }
});

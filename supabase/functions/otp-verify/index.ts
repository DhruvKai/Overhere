// Checks a phone sign-in code, with a lockout: 5 wrong codes within an hour pause that number for an hour, and the
// team gets an email. The website and the app call this instead of supabase.auth.verifyOtp, then use the session
// it returns (supabase.auth.setSession).
//   {phone: '+91XXXXXXXXXX', check: true}             is the number paused? -> {until} (ms) or {}; asked before
//                                                     sending a code, so a paused number doesn't get one
//   {phone: '+91XXXXXXXXXX', token: '123456'}         -> {session: {access_token, refresh_token}}, or an error with
//                                                     {until} when paused, or {left} wrong codes before a pause
// Numbers are kept only as a keyed hash (HMAC with the service key), so the counter table holds no phone numbers.
// Twilio Verify still limits guesses per code and codes per number on its own; this adds the pause and the alert.
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { admin, corsHeaders, env, guard, json, smallJson } from '../_shared/common.ts';
import { alertTeam } from '../_shared/alert.ts';

const PHONE = /^\+91[6-9]\d{9}$/;

async function phoneHash(phone: string): Promise<string> {
  // any server-only secret works; if it changes, the counters simply start again
  const secret = Deno.env.get('OTP_HASH_SECRET') || Deno.env.get('SUPABASE_SECRET_KEYS') || env('SUPABASE_SERVICE_ROLE_KEY');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(phone));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const pausedMsg = (until: number) => {
  const t = new Date(until).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  return `Too many wrong codes for this number, so phone sign-in is paused until ${t}. Please try again then.`;
};

// The anon (publishable) key, as the app would use it: verifying a code needs no special rights.
const anonKey = () => {
  try {
    const k = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') ?? '{}')?.default;
    if (typeof k === 'string' && k) return k;
  } catch { /* use the legacy key */ }
  return env('SUPABASE_ANON_KEY');
};

Deno.serve(async (req) => {
  const early = guard(req);
  if (early) return early;
  const h = corsHeaders(req);
  try {
    const body = await smallJson(req);
    const phone = typeof body.phone === 'string' ? body.phone : '';
    if (!PHONE.test(phone)) return json({ error: 'Enter a valid Indian mobile number' }, 400, h);
    const hash = await phoneHash(phone);
    const db = admin();

    const { data: until, error: chkErr } = await db.rpc('otp_guard_check_service', { p_hash: hash });
    if (chkErr) throw chkErr;
    if (body.check === true) return json(until ? { until } : {}, 200, h);
    if (until) return json({ error: pausedMsg(until), until }, 429, h);

    const token = typeof body.token === 'string' ? body.token : '';
    if (!/^\d{6}$/.test(token)) return json({ error: 'Enter the 6-digit code' }, 400, h);

    const sb = createClient(env('SUPABASE_URL'), anonKey(), { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await sb.auth.verifyOtp({ phone, token, type: 'sms' });
    if (error) {
      // only a wrong or expired code counts; rate limits and outages don't
      const wrong = (error as { code?: string }).code === 'otp_expired' || /expired|invalid/i.test(error.message);
      if (!wrong) return json({ error: error.message }, error.status && error.status >= 400 && error.status < 500 ? error.status : 502, h);
      const { data: f, error: fErr } = await db.rpc('otp_guard_fail_service', { p_hash: hash });
      if (fErr) throw fErr;
      if (f?.fresh) {
        await alertTeam(`Phone sign-in paused: ${phone}`, [
          `Someone typed 5 wrong sign-in codes for ${phone} within an hour, so phone sign-in for that number is paused for an hour.`,
          "It may be the owner mistyping, or someone trying to get into another person's account. If the owner contacts you, they can sign in again after the pause, or with their email.",
        ]);
      }
      if (f?.blocked) return json({ error: pausedMsg(f.until), until: f.until }, 429, h);
      return json({ error: 'That code is wrong or has expired. Check it, or tap Resend code.', left: f?.left ?? null }, 400, h);
    }
    if (!data.session) return json({ error: 'Something went wrong. Please try again.' }, 502, h);
    await db.rpc('otp_guard_ok_service', { p_hash: hash });
    return json({ session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token } }, 200, h);
  } catch (e) {
    console.error('otp-verify', e);
    return json({ error: 'Something went wrong. Please try again.' }, 500, h);
  }
});

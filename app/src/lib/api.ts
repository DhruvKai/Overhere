import { supabase } from './supabase';
import type { AppStateResponse, Cat, Cost, Gender } from './types';

/* One wrapper per database function in web/schema-app.sql. The app never touches a table directly. */
async function call<T = unknown>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw error;
  return data as T;
}

export type NewPlan = {
  cat: Cat; desc: string; cap: number; when: number; aud: Gender[] | null; venue: string;
  cost: Cost; total?: number | null; lat?: number | null; lng?: number | null; repeat?: string | null;
};

export type ProfileInput = {
  name?: string; dob?: string; gender?: Gender; hood?: string; lat?: number; lng?: number; job?: string;
  bio?: string; ints?: string[]; avail?: string[]; emo?: string; usage_ok?: boolean; onboarded?: boolean; consent?: boolean;
};

export const api = {
  appState: (act?: string | null) => call<AppStateResponse>('app_state', act ? { p_act: act } : {}),
  inviteInfo: (act: string) => call<'gone' | 'past' | 'audience' | 'verify' | 'ok'>('invite_info', { p_act: act }),
  saveProfile: (p: ProfileInput) => call<{ error?: 'under18' } | null>('save_profile', { p }),
  acceptTerms: () => call('accept_terms'),
  saveState: (s: Record<string, unknown>) => call('save_state', { s }),
  postActivity: (p: NewPlan) => call<string>('post_activity', { p }),
  editActivity: (act: string, p: NewPlan) => call('edit_activity', { p_act: act, p }),
  cancelActivity: (act: string) => call('cancel_activity', { p_act: act }),
  requestJoin: (act: string, note: string) => call<'pending' | 'waitlist' | 'accepted'>('request_join', { p_act: act, p_note: note }),
  withdrawRequest: (act: string) => call('withdraw_request', { p_act: act }),
  decideRequest: (req: string, accept: boolean) => call('decide_request', { p_req: req, p_accept: accept }),
  leaveActivity: (act: string) => call('leave_activity', { p_act: act }),
  removeMember: (act: string, user: string) => call('remove_member', { p_act: act, p_user: user }),
  sendMessage: (act: string, body: string, poll?: { q: string; opts: string[] }) =>
    call('send_message', { p_act: act, p_body: body, p_poll: poll ?? null }),
  vote: (msg: number, opt: number) => call('vote', { p_msg: msg, p_opt: opt }),
  rateActivity: (act: string, ok: 'yes' | 'no', stars: number, people: Record<string, 'show' | 'noshow'>) =>
    call('rate_activity', { p_act: act, p_ok: ok, p_stars: stars, p_people: people }),
  report: (o: { target?: string | null; act?: string | null; msg?: number | null; reason: string; note?: string }) =>
    call('report', { p_target: o.target ?? null, p_act: o.act ?? null, p_msg: o.msg ?? null, p_reason: o.reason, p_note: o.note ?? '' }),
  blockUser: (user: string) => call('block_user', { p_user: user }),
  unblockUser: (user: string) => call('unblock_user', { p_user: user }),
  readNotifications: (ids: string[] | null) => call('read_notifications', { p_ids: ids }),
  verifySimulated: (kind: 'face' | 'kyc') => call('verify_simulated', { p_kind: kind, p_pass: true, p_consent: true }),
  deleteMyAccount: () => call('delete_my_account'),
};

/* Plain-language errors, the same wording as friendly() in web/app.js. */
export function friendly(e: unknown): string {
  const m = String((e as { message?: string })?.message ?? e ?? '');
  if (/Failed to fetch|NetworkError|Load failed|Network request failed/i.test(m)) return "Can't reach Overhere. Check your connection and try again.";
  if (/captcha/i.test(m)) return "The security check didn't go through. Please try again in a minute.";
  if (/JWT|sign in again|not signed|refresh token/i.test(m)) return 'Please sign in again.';
  if (/phone (signups|provider|logins?) .*disabled|unsupported phone provider/i.test(m)) return "Phone sign-in isn't switched on yet. Please use email for now.";
  if (/(error|fail).*send.*(sms|otp)|sms.*(fail|error)|invalid phone/i.test(m)) return "We couldn't send the SMS. Check the number, or try again in a minute.";
  if (/token has expired|otp.*(expired|invalid)|invalid.*(otp|token)/i.test(m)) return 'That code is wrong or has expired. Check it, or tap Resend code.';
  if (/violates|invalid input|syntax|permission denied|does not exist|schema cache/i.test(m)) return 'Something there was not accepted. Please check it and try again.';
  return m && m.length < 160 ? m : 'Something went wrong. Please try again.';
}

// Frames from failed face scans, kept in the private "face-review" bucket so the team can compare them by eye with
// the person's two photos in /addmin. Only for scans started after the person agreed to the wording that says so
// (consent_v 2). Each person's frames are deleted when a reviewer decides, when they pass, or (sweepFrames) once
// they are no longer needed, which also covers deleted accounts. Storage files can't be deleted from SQL, so this
// happens here.
import type { SupabaseClient } from 'npm:@supabase/supabase-js@2.117.2';
import { ADMIN_URL, alertTeam } from './alert.ts';

const BUCKET = 'face-review';
const MAX_PER_PERSON = 10;   // the latest ones; older frames are removed when a new one is saved

async function names(db: SupabaseClient, user: string): Promise<string[]> {
  const { data } = await db.storage.from(BUCKET).list(user, { limit: 100, sortBy: { column: 'name', order: 'desc' } });
  return (data ?? []).filter((f) => f.name.endsWith('.jpg')).map((f) => `${user}/${f.name}`);
}

export async function saveFrame(db: SupabaseClient, user: string, jpeg: Uint8Array) {
  const { error } = await db.storage.from(BUCKET).upload(`${user}/${Date.now()}.jpg`, jpeg, { contentType: 'image/jpeg', upsert: false });
  if (error) { console.error('frame save', error.message); return; }
  const old = (await names(db, user)).slice(MAX_PER_PERSON);
  if (old.length) await db.storage.from(BUCKET).remove(old);
}

export async function deleteFrames(db: SupabaseClient, user: string) {
  const all = await names(db, user);
  if (all.length) {
    const { error } = await db.storage.from(BUCKET).remove(all);
    if (error) console.error('frame delete', error.message);
  }
}

/** Signed links (1 hour) to a person's frames, newest first, with when each was taken. */
export async function frameLinks(db: SupabaseClient, user: string): Promise<{ url: string; at: number }[]> {
  const all = await names(db, user);
  if (!all.length) return [];
  const { data } = await db.storage.from(BUCKET).createSignedUrls(all, 3600);
  return (data ?? []).filter((s) => s.signedUrl).map((s) => ({ url: s.signedUrl, at: Number(/\/(\d+)\.jpg$/.exec(s.path ?? '')?.[1] ?? 0) }));
}

/** Delete the frames of everyone who no longer needs them (passed, decided, or account deleted). */
export async function sweepFrames(db: SupabaseClient) {
  const { data: keep, error } = await db.rpc('face_frames_keep_service');
  if (error) { console.error('frame sweep', error.message); return; }
  const k = new Set<string>(keep ?? []);
  const { data: folders } = await db.storage.from(BUCKET).list('', { limit: 1000 });
  for (const f of folders ?? []) {
    if (/^[0-9a-f-]{36}$/.test(f.name) && !k.has(f.name)) await deleteFrames(db, f.name);
  }
}

/** After a check was paused: email the team, once per pause (the database decides who sends it). */
export async function faceAlert(db: SupabaseClient, user: string) {
  const { data, error } = await db.rpc('verify_alert_claim_service', { p_user: user, p_kind: 'face' });
  if (error) { console.error('face alert claim', error.message); return; }
  if (!data?.claim) return;
  const again = data.rounds > 1 ? ` This is the ${data.rounds}${data.rounds === 2 ? 'nd' : data.rounds === 3 ? 'rd' : 'th'} time they've used up their tries.` : '';
  await alertTeam(`Face check paused: ${data.name}`, [
    `${data.name} didn't pass the face check after 5 tries, so it's paused until ${data.until}.${again}`,
    'They are waiting in the review queue. The frames from their failed scans are there to compare with their two photos. Approve them, or ask them to try again.',
    `Review: ${ADMIN_URL}`,
    `Account: ${user}`,
  ]);
}

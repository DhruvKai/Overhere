import * as Crypto from 'expo-crypto';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { api } from './api';
import { SUPABASE_URL, supabase } from './supabase';

/* Profile photos, the same as the website (setPhoto and commitCrop in web/app.js): two, each a 400×400 JPEG of 60 KB
   or less in the Storage bucket "avatars" at <user id>/<16 random characters>.jpg. Photo 1 is the profile picture.
   JPEG because the face check compares the live face with both, and AWS only reads JPEG and PNG. 400 px covers the
   biggest place one is shown on a sharp screen. */
export const AVATAR_RE = /^[0-9a-f-]{36}\/[0-9a-z]{16}\.jpg$/;
const BASE = SUPABASE_URL.replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
export const avatarUrl = (p?: string | null) => (BASE && p && AVATAR_RE.test(p) ? `${BASE}/storage/v1/object/public/avatars/${p}` : '');
const SIZE = 400, MIN_SIDE = 200, MAX_BYTES = 60 * 1024;

/** Pick a photo from the library, cropped square and compressed. Null when cancelled. Returns base64 JPEG. */
export async function pickPhoto(): Promise<string | null> {
  const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 });
  const a = r.canceled ? null : r.assets?.[0];
  if (!a) return null;
  if (Math.min(a.width, a.height) < MIN_SIDE) throw new Error(`That photo is too small. Use one at least ${MIN_SIDE}×${MIN_SIDE} px.`);
  const side = Math.min(a.width, a.height);
  let ctx = ImageManipulator.manipulate(a.uri);
  // the picker's crop is square on iOS; some Android galleries ignore it, so square it here too
  if (a.width !== a.height) ctx = ctx.crop({ originX: Math.floor((a.width - side) / 2), originY: Math.floor((a.height - side) / 2), width: side, height: side });
  const img = await ctx.resize({ width: SIZE, height: SIZE }).renderAsync();
  let q = 0.85, out = await img.saveAsync({ format: SaveFormat.JPEG, compress: q, base64: true });
  while (out.base64 && out.base64.length * 0.75 > MAX_BYTES && q > 0.5) {
    q -= 0.1;
    out = await img.saveAsync({ format: SaveFormat.JPEG, compress: q, base64: true });
  }
  if (!out.base64) throw new Error("Couldn't read that photo. Try another one.");
  return out.base64;
}

/** Upload it as photo 1 or 2; the old file is deleted. True when a passed face check was cleared. */
export async function savePhoto(uid: string, b64: string, slot: 1 | 2 = 1): Promise<boolean> {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const rnd = Array.from(Crypto.getRandomBytes(16), b => '0123456789abcdefghijklmnopqrstuvwxyz'[b % 36]).join('');
  const path = `${uid}/${rnd}.jpg`;
  const up = await supabase.storage.from('avatars').upload(path, bytes, { contentType: 'image/jpeg', upsert: false, cacheControl: '31536000' });
  if (up.error) throw up.error;
  try {
    return await setPhoto(path, slot);
  } catch (e) {
    supabase.storage.from('avatars').remove([path]).catch(() => {});
    throw e;
  }
}

/** Set (or clear, with null) photo 1 or 2 and delete the files it replaces (clearing photo 1 clears both). True when the
    face check was cleared. */
export async function setPhoto(path: string | null, slot: 1 | 2 = 1): Promise<boolean> {
  const r = await api.setPhoto(path, slot);
  const gone = [r?.old, r?.old2].filter((x): x is string => !!x && x !== path);
  if (gone.length) supabase.storage.from('avatars').remove(gone).catch(() => {});
  return !!r?.face_reset;
}

/** On "Delete my account", after the account is gone: the database can't delete files, this login's token still can. */
export async function removePhotoFiles(paths: (string | null | undefined)[]) {
  const mine = paths.filter((p): p is string => !!p && AVATAR_RE.test(p));
  if (mine.length) await supabase.storage.from('avatars').remove(mine).catch(() => {});
}

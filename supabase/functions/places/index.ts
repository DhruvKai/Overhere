// Place search for the venue and home-area boxes, on the website and in the app, through Ola Maps or Google Maps
// Platform. Their keys stay here; the website and the app only ever talk to this function.
//   Ola Maps: the OLA_CLIENT_ID and OLA_CLIENT_SECRET secrets (the OAuth credentials from Krutrim Cloud, OLA-MAPS-SETUP.md).
//   Google:   the GOOGLE_PLACES_KEY secret (GOOGLE-MAPS-SETUP.md). Used only when Ola's aren't set.
//
//   {q: 'elante', mode: 'venue'|'area', near?: [lat, lng], session}   -> {hits: [{id, label, kind, state, km, ll?}]}
//        Autocomplete. Ola's hits come with their spot (ll), so picking one needs no second call. `near` (your home area) puts nearby places first and gives each one's distance (km).
//   {id: '<placeId>', session}                                         -> {ll: [lat, lng]}
//        The exact spot of the suggestion that was picked (Place Details, only the location field).
//   {at: [lat, lng], mode: 'here'|'venue'}                             -> {label: 'Area, City'}
//        "Use my current location": the name of where you are (Geocoding API). '' when Google has no name for it.
//
// `session` is a random id the box makes when you start typing and drops after you pick. Google bills the typing and
// the pick together as one session, and the typing itself is then free: only the pick (Place Details) is counted.
// Only the location field is asked for, which keeps Place Details in Google's cheapest tier (Essentials).
//
// `session` only matters for Google. With neither provider set up, the function answers 503 {off: true}, and the website and the app go back to Photon
// (OpenStreetMap), as they did before. Only signed-in people can search, so the key can't be used by anyone else.
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { corsHeaders, env, guard, json, smallJson } from '../_shared/common.ts';
import { type Found, hereFromAddress, hereLabel, hitOf, isAreaLike, olaHit, rankAreas, tidyVenues, type Hit } from '../_shared/places-format.ts';

const KEY = () => Deno.env.get('GOOGLE_PLACES_KEY') ?? '';
const OLA_ID = () => Deno.env.get('OLA_CLIENT_ID') ?? '', OLA_SECRET = () => Deno.env.get('OLA_CLIENT_SECRET') ?? '';
const provider = (): 'ola' | 'google' | '' => (OLA_ID() && OLA_SECRET() ? 'ola' : KEY() ? 'google' : '');
const SESSION = /^[A-Za-z0-9_-]{8,64}$/;
const PLACE_ID = /^[A-Za-z0-9_:.-]{6,400}$/;   // Ola's look like "ola-platform:5000206829294"
const inIndia = (ll: unknown): ll is [number, number] => Array.isArray(ll) && ll.length === 2
  && typeof ll[0] === 'number' && typeof ll[1] === 'number' && ll[0] >= 6 && ll[0] <= 37.5 && ll[1] >= 68 && ll[1] <= 97.5;

// The publishable key, to check login tokens with (getClaims checks the signature without a round trip when the
// project signs tokens with its new asymmetric keys, and asks Supabase otherwise).
const anonKey = () => {
  try {
    const k = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') ?? '{}')?.default;
    if (typeof k === 'string' && k) return k;
  } catch { /* use the legacy key */ }
  return env('SUPABASE_ANON_KEY');
};
let sb: ReturnType<typeof createClient> | null = null;
async function userId(req: Request): Promise<string | null> {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token || token.split('.').length !== 3) return null;   // the publishable key alone is not a login
  sb ??= createClient(env('SUPABASE_URL'), anonKey(), { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await sb.auth.getClaims(token);
  const c = data?.claims as { sub?: string; role?: string } | undefined;
  return !error && c?.sub && c.role === 'authenticated' ? c.sub : null;
}

// A light brake per person, for this copy of the function: typing sends a request about every 300 ms at most, so
// 90 a minute is far above normal use. Google's own daily quota (set in the Cloud console) is the real limit.
const recent = new Map<string, number[]>();
function tooMany(uid: string): boolean {
  const now = Date.now(), list = (recent.get(uid) ?? []).filter((t) => now - t < 60_000);
  list.push(now);
  recent.set(uid, list);
  if (recent.size > 5000) recent.clear();
  return list.length > 90;
}

async function google(url: string, init: RequestInit, fields?: string) {
  const r = await fetch(url, {
    ...init,
    headers: { 'X-Goog-Api-Key': KEY(), ...(fields ? { 'X-Goog-FieldMask': fields } : {}), ...(init.headers ?? {}) },
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    console.error('google', r.status, JSON.stringify(body).slice(0, 500));
    throw new Error(r.status === 429 ? 'busy' : 'google');
  }
  return body;
}

async function suggest(q: string, mode: 'venue' | 'area', near: [number, number] | null, session: string): Promise<Hit[]> {
  const body: Record<string, unknown> = {
    input: q, sessionToken: session, languageCode: 'en', regionCode: 'in', includedRegionCodes: ['in'],
    ...(mode === 'area' ? { includedPrimaryTypes: ['(regions)'] } : {}),
    ...(near ? {
      origin: { latitude: near[0], longitude: near[1] },
      locationBias: { circle: { center: { latitude: near[0], longitude: near[1] }, radius: 50000 } },
    } : {}),
  };
  const d = await google('https://places.googleapis.com/v1/places:autocomplete',
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const hits = ((d.suggestions ?? []) as { placePrediction?: Record<string, unknown> }[])
    .map((s) => s.placePrediction ? hitOf(s.placePrediction, mode) : null);
  return mode === 'area' ? rankAreas(q, hits.map((hit) => ({ hit, area: true })), near) : tidyVenues(hits);
}

async function spot(id: string, session: string): Promise<[number, number] | null> {
  const u = `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?languageCode=en&regionCode=in`
    + (session ? `&sessionToken=${encodeURIComponent(session)}` : '');
  const d = await google(u, { method: 'GET' }, 'location');
  const lat = d.location?.latitude, lng = d.location?.longitude;
  return typeof lat === 'number' && typeof lng === 'number' ? [lat, lng] : null;
}

async function here(at: [number, number], mode: 'here' | 'venue'): Promise<string> {
  const u = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  u.searchParams.set('latlng', `${at[0].toFixed(5)},${at[1].toFixed(5)}`);
  u.searchParams.set('language', 'en');
  u.searchParams.set('key', KEY());
  const r = await fetch(u);
  const d = await r.json().catch(() => ({}));
  if (!r.ok || (d.status !== 'OK' && d.status !== 'ZERO_RESULTS')) {
    console.error('geocode', r.status, d.status, d.error_message);
    throw new Error('google');
  }
  return hereLabel(d.results ?? [], mode);
}

/* ---------- Ola Maps ----------
   Signs in with the client ID and secret (OAuth client credentials) and keeps the token until shortly before it
   expires. The API key route isn't used: it's for browsers, and the server is better off with the secret. */
let olaTok = { v: '', until: 0 };
async function olaToken(): Promise<string> {
  if (olaTok.v && Date.now() < olaTok.until) return olaTok.v;
  const r = await fetch('https://api.olamaps.io/auth/v1/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', scope: 'openid', client_id: OLA_ID(), client_secret: OLA_SECRET() }),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || typeof d.access_token !== 'string') {
    console.error('ola token', r.status, JSON.stringify(d).slice(0, 300));
    throw new Error('google');
  }
  olaTok = { v: d.access_token, until: Date.now() + Math.max(60, Number(d.expires_in) || 600) * 1000 - 30_000 };
  return olaTok.v;
}
async function ola(path: string, params: Record<string, string>, again = true): Promise<Record<string, unknown>> {
  const u = new URL('https://api.olamaps.io' + path);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u, { headers: { Authorization: 'Bearer ' + await olaToken(), 'X-Request-Id': crypto.randomUUID() } });
  if (r.status === 401 && again) { olaTok = { v: '', until: 0 }; return ola(path, params, false); }   // the token ran out early
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    console.error('ola', path, r.status, JSON.stringify(d).slice(0, 300));
    throw new Error(r.status === 429 ? 'busy' : 'google');
  }
  return d;
}
const olaAsk = (q: string, near: [number, number] | null) =>
  ola('/places/v1/autocomplete', { input: q, ...(near ? { location: `${near[0]},${near[1]}`, origin: `${near[0]},${near[1]}` } : {}) })
    .then((d) => (d.predictions ?? []) as Parameters<typeof olaHit>[0][]);
async function olaSuggest(q: string, mode: 'venue' | 'area', near: [number, number] | null): Promise<Hit[]> {
  if (mode === 'venue') return tidyVenues((await olaAsk(q, near)).map((p) => olaHit(p, mode)));
  /* the home-area box asks twice, without and with the home area: with it alone, Ola fills the list with places
     near home ("Connaught Place" from Chandigarh gives a building in Mohali). (Asking a third time with the home
     city's name added was tried: Ola then makes up local matches, like "Electronic City, Delhi" from Delhi.) */
  const asks = await Promise.allSettled([olaAsk(q, null), ...(near ? [olaAsk(q, near)] : [])]);
  const found: Found[] = [];
  for (const a of asks) {
    if (a.status !== 'fulfilled') continue;
    let preds = a.value;
    /* only areas and cities (with the addresses Ola files areas under), when there are any */
    const areas = preds.some((p) => isAreaLike(p.types));
    if (areas) preds = preds.filter((p) => isAreaLike(p.types));
    preds.forEach((p) => found.push({ hit: olaHit(p, mode), area: areas }));
  }
  const hits = rankAreas(q, found, near);
  const failed = asks.find((a): a is PromiseRejectedResult => a.status === 'rejected');
  if (failed && !hits.length) throw failed.reason;   // Ola is down and no town fits: the apps fall back to Photon
  return hits;
}
async function olaSpot(id: string): Promise<[number, number] | null> {
  const d = await ola('/places/v1/details', { place_id: id });
  const loc = (d.result as { geometry?: { location?: { lat?: number; lng?: number } } } | undefined)?.geometry?.location;
  return typeof loc?.lat === 'number' && typeof loc?.lng === 'number' ? [loc.lat, loc.lng] : null;
}
async function olaHere(at: [number, number], mode: 'here' | 'venue'): Promise<string> {
  const d = await ola('/places/v1/reverse-geocode', { latlng: `${at[0].toFixed(5)},${at[1].toFixed(5)}` });
  const results = (d.results ?? []) as { address_components?: { long_name?: string; types?: string[] }[]; formatted_address?: string }[];
  return hereLabel(results, mode) || hereFromAddress(results[0]?.formatted_address || '', mode);
}

Deno.serve(async (req) => {
  const early = guard(req);
  if (early) return early;
  const h = corsHeaders(req);
  const via = provider();
  if (!via) return json({ error: 'Place search is not set up', off: true }, 503, h);
  try {
    const uid = await userId(req);
    if (!uid) return json({ error: 'Please sign in again.' }, 401, h);
    if (tooMany(uid)) return json({ error: 'Too many searches. Wait a moment and try again.' }, 429, h);
    const b = await smallJson(req);
    const session = typeof b.session === 'string' && SESSION.test(b.session) ? b.session : '';

    if (typeof b.q === 'string') {
      const q = b.q.trim().slice(0, 100), mode = b.mode === 'area' ? 'area' : 'venue';
      if (q.length < 2) return json({ hits: [] }, 200, h);
      const near = inIndia(b.near) ? b.near : null;
      // via: whose results these are, for the line under the list ("Results from Ola Maps")
      return json({ hits: via === 'ola' ? await olaSuggest(q, mode, near) : await suggest(q, mode, near, session), via }, 200, h);
    }
    if (typeof b.id === 'string') {
      if (!PLACE_ID.test(b.id)) return json({ error: 'Bad place' }, 400, h);
      const ll = via === 'ola' ? await olaSpot(b.id) : await spot(b.id, session);
      return ll && inIndia(ll) ? json({ ll }, 200, h) : json({ error: 'That place has no position on the map' }, 404, h);
    }
    if (b.at !== undefined) {
      if (!inIndia(b.at)) return json({ error: 'That location is outside India. Overhere is only in India for now.' }, 400, h);
      const m = b.mode === 'venue' ? 'venue' : 'here';
      return json({ label: via === 'ola' ? await olaHere(b.at, m) : await here(b.at, m) }, 200, h);
    }
    return json({ error: 'Bad request' }, 400, h);
  } catch (e) {
    const m = e instanceof Error ? e.message : '';
    if (m === 'busy') return json({ error: 'Place search is busy. Try again in a moment.' }, 429, h);
    if (m === 'Request too large' || m === 'Bad request' || e instanceof SyntaxError) return json({ error: 'Bad request' }, 400, h);
    console.error('places', e);
    return json({ error: "Couldn't search places right now." }, 502, h);
  }
});

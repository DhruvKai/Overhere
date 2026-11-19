import * as Crypto from 'expo-crypto';
import { GEO_URL, supabase } from './supabase';

/* Place search for all of India, like geoSearch() in web/app.js: Ola Maps or Google, through the places Edge Function
   (web/supabase/functions/places, which holds the Google key), or Photon over OpenStreetMap until that function is set
   up or when it can't be reached. A venue reads "Name, Locality, City"; an area "Area, City".
   A Google suggestion (`id`) has no position until it's picked: placeSpot() fetches it then. */
export type Place = { label: string; ll: [number, number]; kind: string; state: string };
export type Hit = { label: string; kind: string; state: string; ll?: [number, number]; id?: string; km?: number | null; by?: string };

/* One random id from the first letter typed until a pick, so Google bills the typing and the pick as one session. */
export const newSession = () => Crypto.randomUUID();

let googleOff = false;   // the function said it isn't set up: don't ask it again until the app restarts
async function google<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('places', { body });
  if (error) {
    let j: { error?: string; off?: boolean } | null = null;
    try { j = await (error as { context?: Response }).context?.json(); } catch {}
    if (j?.off || (error as { context?: Response }).context?.status === 404 || error.name === 'FunctionsFetchError') googleOff = true;   // not set up, not deployed, or unreachable
    throw new Error(j?.error || error.message);
  }
  return data as T;
}

/* The position of a picked Google suggestion. */
export async function placeSpot(id: string, session: string): Promise<[number, number]> {
  const d = await google<{ ll: [number, number] }>({ id, session });
  return d.ll;
}

export const inIndia = ([la, lo]: [number, number]) => la >= 6 && la <= 37.5 && lo >= 68 && lo <= 97.5;
const kindOf = (v?: string) => (v || 'place').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());

/* OpenStreetMap services ask apps to say who they are; requests with a generic client name can be refused. */
const HEADERS = { 'User-Agent': 'Overhere/1.0 (+https://overhere.social)' };

type Feature = { properties?: Record<string, string>; geometry?: { coordinates?: [number, number] } };

type Mode = 'area' | 'venue' | 'here';

function item(f: Feature, mode: Mode): Place | null {
  const p = f.properties || {}, [lo, la] = f.geometry?.coordinates || [];
  const town = p.city || p.county, areaT = ['locality', 'district', 'city', 'county', 'state'].includes(p.type);
  /* here: the area around a spot (from "Use my current location"), never a shop or street name */
  const parts = mode === 'venue' ? [p.name || p.street, p.locality || p.district || (p.name ? p.street : ''), town || p.state]
    : mode === 'here' ? [p.locality || p.district || (areaT ? p.name : ''), town, town ? '' : p.state]
    : [p.name, town, town ? '' : p.state];
  const seen = new Set<string>();
  const label = parts.flatMap(x => String(x || '').split(/\s*,\s*/))
    .filter(x => x && !seen.has(x.toLowerCase()) && seen.add(x.toLowerCase())).join(', ').slice(0, mode === 'venue' ? 120 : 80);
  if (!label || la == null || lo == null || !inIndia([la, lo])) return null;
  return { label, ll: [la, lo], kind: p.osm_key === 'boundary' ? 'Area' : kindOf(p.osm_value), state: p.state || '' };
}

export async function searchPlaces(q: string, mode: 'area' | 'venue', near?: [number, number] | null, session?: string): Promise<Hit[]> {
  if (!googleOff) {
    try {
      const d = await google<{ hits: Hit[]; via?: string }>({ q, mode, near: near ?? null, session });
      const by = d.via === 'ola' ? 'Ola Maps' : 'Google Maps';   // for the line under the list
      return (d.hits || []).map(x => ({ ...x, by }));
    } catch { /* Photon below */ }
  }
  return photon(q, mode, near);
}

async function photon(q: string, mode: 'area' | 'venue', near?: [number, number] | null): Promise<Place[]> {
  const u = new URL(GEO_URL.replace(/\/+$/, '') + '/api/');
  const params: [string, string][] = [['q', q], ['limit', '8'], ['lang', 'en'], ['bbox', '68,6,97.5,37.5']];
  if (near) params.push(['lat', near[0].toFixed(3)], ['lon', near[1].toFixed(3)]);
  if (mode === 'area') params.push(['osm_tag', 'place'], ['osm_tag', 'boundary:administrative']);
  params.forEach(([k, v]) => u.searchParams.append(k, v));
  const r = await fetch(u.toString(), { headers: HEADERS });
  if (!r.ok) throw new Error(String(r.status));
  const d = (await r.json()) as { features?: Feature[] };
  const seen = new Set<string>();
  return (d.features || [])
    .filter(f => f.properties?.countrycode === 'IN')
    .map(f => item(f, mode))
    .filter((x): x is Place => !!x && !seen.has(x.label) && !!seen.add(x.label));
}

/* The area around a spot, like myloc in web/app.js: Google's (or Photon's) reverse lookup, labelled "Area, City".
   Falls back to "Near 30.74, 76.78" when the lookup finds nothing or can't be reached. */
export async function placeHere(ll: [number, number]): Promise<string> {
  if (!googleOff) {
    try {
      const d = await google<{ label: string }>({ at: ll, mode: 'here' });
      if (d.label) return d.label;
    } catch { /* Photon below */ }
  }
  try {
    const u = new URL(GEO_URL.replace(/\/+$/, '') + '/reverse');
    [['lat', ll[0].toFixed(5)], ['lon', ll[1].toFixed(5)], ['lang', 'en'], ['limit', '1']].forEach(([k, v]) => u.searchParams.append(k, v));
    const r = await fetch(u.toString(), { headers: HEADERS });
    if (r.ok) {
      const d = (await r.json()) as { features?: Feature[] };
      const hit = (d.features || []).filter(f => f.properties?.countrycode === 'IN').map(f => item(f, 'here')).find(Boolean);
      if (hit) return hit.label;
    }
  } catch { /* fall back below */ }
  return `Near ${ll[0].toFixed(2)}, ${ll[1].toFixed(2)}`;
}

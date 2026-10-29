import { GEO_URL } from './supabase';

/* Place search over OpenStreetMap for all of India (Photon), like geoSearch() in web/app.js.
   A venue reads "Name, Locality, City"; an area "Area, City". */
export type Place = { label: string; ll: [number, number]; kind: string; state: string };

const inIndia = ([la, lo]: [number, number]) => la >= 6 && la <= 37.5 && lo >= 68 && lo <= 97.5;
const kindOf = (v?: string) => (v || 'place').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());

type Feature = { properties?: Record<string, string>; geometry?: { coordinates?: [number, number] } };

function item(f: Feature, mode: 'area' | 'venue'): Place | null {
  const p = f.properties || {}, [lo, la] = f.geometry?.coordinates || [];
  const town = p.city || p.county;
  const parts = mode === 'venue' ? [p.name || p.street, p.locality || p.district || (p.name ? p.street : ''), town || p.state] : [p.name, town, town ? '' : p.state];
  const seen = new Set<string>();
  const label = parts.flatMap(x => String(x || '').split(/\s*,\s*/))
    .filter(x => x && !seen.has(x.toLowerCase()) && seen.add(x.toLowerCase())).join(', ').slice(0, mode === 'venue' ? 120 : 80);
  if (!label || la == null || lo == null || !inIndia([la, lo])) return null;
  return { label, ll: [la, lo], kind: p.osm_key === 'boundary' ? 'Area' : kindOf(p.osm_value), state: p.state || '' };
}

export async function searchPlaces(q: string, mode: 'area' | 'venue', near?: [number, number] | null): Promise<Place[]> {
  const u = new URL(GEO_URL.replace(/\/+$/, '') + '/api/');
  const params: [string, string][] = [['q', q], ['limit', '8'], ['lang', 'en'], ['bbox', '68,6,97.5,37.5']];
  if (near) params.push(['lat', near[0].toFixed(3)], ['lon', near[1].toFixed(3)]);
  if (mode === 'area') params.push(['osm_tag', 'place'], ['osm_tag', 'boundary:administrative']);
  params.forEach(([k, v]) => u.searchParams.append(k, v));
  const r = await fetch(u.toString());
  if (!r.ok) throw new Error(String(r.status));
  const d = (await r.json()) as { features?: Feature[] };
  const seen = new Set<string>();
  return (d.features || [])
    .filter(f => f.properties?.countrycode === 'IN')
    .map(f => item(f, mode))
    .filter((x): x is Place => !!x && !seen.has(x.label) && !!seen.add(x.label));
}

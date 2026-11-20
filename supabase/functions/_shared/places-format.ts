// Turning Google's place results into what the venue and home-area boxes show. No Deno or network code here, so it
// can be tested on its own (tools/test-places-format.mjs).
//   A venue reads "Name, Locality, City", e.g. "Elante Mall, Industrial Area Phase I, Chandigarh".
//   An area reads "Area, City", e.g. "Koramangala, Bengaluru"; its state is shown separately under it.

/* ll: the spot, when the search already gives it (Ola does; Google needs a Place Details call once it's picked) */
export type Hit = { id: string; label: string; kind: string; state: string; km: number | null; ll?: [number, number] };

// The states and union territories, so the state can be taken out of an address and shown on its own.
const STATES = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
const STATE_KEY = new Map(STATES.map((s) => [s.toLowerCase(), s]));
STATE_KEY.set('new delhi', 'Delhi');   // Google sometimes writes the territory this way

// Google's place types, in the words the app already uses (the same words as tools/update-places.py).
const KINDS: Record<string, string> = {
  cafe: 'Café', coffee_shop: 'Coffee', tea_house: 'Tea shop', restaurant: 'Restaurant', fast_food_restaurant: 'Fast food',
  bar: 'Bar', pub: 'Pub', wine_bar: 'Bar', night_club: 'Nightclub', bakery: 'Bakery', dessert_shop: 'Desserts',
  ice_cream_shop: 'Ice cream', confectionery: 'Sweet shop', food_court: 'Food court', movie_theater: 'Cinema',
  performing_arts_theater: 'Theatre', concert_hall: 'Music venue', live_music_venue: 'Music venue',
  event_venue: 'Event venue', art_gallery: 'Gallery', museum: 'Museum', cultural_center: 'Arts centre',
  community_center: 'Community centre', library: 'Library', book_store: 'Bookshop', shopping_mall: 'Mall',
  market: 'Market', park: 'Park', garden: 'Garden', botanical_garden: 'Garden', national_park: 'Park',
  hiking_area: 'Hiking', tourist_attraction: 'Attraction', historical_landmark: 'Landmark', observation_deck: 'Viewpoint',
  zoo: 'Zoo', amusement_park: 'Theme park', amusement_center: 'Arcade', bowling_alley: 'Bowling', stadium: 'Stadium',
  sports_complex: 'Sports centre', gym: 'Gym', fitness_center: 'Gym', swimming_pool: 'Pool', university: 'University',
  school: 'School', hotel: 'Hotel', lodging: 'Hotel', resort_hotel: 'Hotel', place_of_worship: 'Place of worship',
  hindu_temple: 'Temple', church: 'Church', mosque: 'Mosque', gurudwara: 'Gurdwara', train_station: 'Station',
  transit_station: 'Station', bus_station: 'Bus station', airport: 'Airport',
  locality: 'City', sublocality: 'Area', sublocality_level_1: 'Area', sublocality_level_2: 'Area', neighborhood: 'Area',
  administrative_area_level_1: 'State', administrative_area_level_2: 'District', administrative_area_level_3: 'Area',
  postal_code: 'Area', route: 'Street', street_address: 'Address', premise: 'Building',
};
// Types that say nothing about what a place is.
const VAGUE = new Set(['point_of_interest', 'establishment', 'food', 'store', 'geocode', 'political']);

export function kindOf(types: string[] = []): string {
  for (const t of types) if (KINDS[t]) return KINDS[t];
  const t = types.find((x) => !VAGUE.has(x));
  return t ? t.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()) : 'Place';
}

const norm = (s: string) => s.trim().replace(/\s+/g, ' ');

/** Each piece once (ignoring case), so a name that already ends in its city doesn't repeat it. */
function join(parts: string[], max: number): string {
  const seen = new Set<string>();
  return parts.flatMap((x) => String(x || '').split(/\s*,\s*/)).map(norm)
    .filter((x) => x && !seen.has(x.toLowerCase()) && !!seen.add(x.toLowerCase())).join(', ').slice(0, max);
}

/** An address line split into its pieces, without the country, PIN codes, or the state (returned separately). */
export function splitAddress(text: string): { parts: string[]; state: string } {
  let state = '';
  const parts = String(text || '').split(',').map(norm).filter(Boolean)
    .filter((p) => !/^india$/i.test(p))
    .map((p) => p.replace(/\s*\b\d{6}\b\s*/g, ' ').trim()).filter(Boolean)   // "Chandigarh 160017" -> "Chandigarh"
    .filter((p) => {
      const s = STATE_KEY.get(p.toLowerCase());
      if (s && !state) state = s;
      // a state that is also the city (Chandigarh, Delhi) stays as the city
      return !s || s === 'Chandigarh' || s === 'Delhi';
    });
  return { parts, state };
}

type Prediction = {
  placeId?: string; types?: string[]; distanceMeters?: number;
  text?: { text?: string }; structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
};

/** One autocomplete suggestion as a list row, or null when it has no name. */
export function hitOf(p: Prediction, mode: 'venue' | 'area'): Hit | null {
  const id = p.placeId || '';
  const main = norm(p.structuredFormat?.mainText?.text || '');
  const rest = p.structuredFormat?.secondaryText?.text ?? (p.text?.text || '').split(',').slice(1).join(',');
  if (!id || !main) return null;
  const { parts, state } = splitAddress(rest);
  // a venue keeps its locality and city (the last two pieces); an area keeps its city
  const label = mode === 'venue' ? join([main, ...parts.slice(-2)], 120) : join([main, ...parts.slice(-1)], 80);
  if (!label) return null;
  const km = typeof p.distanceMeters === 'number' ? Math.round(p.distanceMeters / 100) / 10 : null;
  return { id, label, kind: kindOf(p.types), state, km };
}

/* ---------- Ola Maps (api.olamaps.io) ----------
   Its autocomplete answers like Google's older Places API: predictions[] with place_id, types, distance_meters,
   structured_formatting.main_text / secondary_text ("Industrial Area Phase I, Chandigarh, 160002") and the spot in
   geometry.location, so a pick needs no second call. */
type OlaPrediction = {
  place_id?: string; types?: string[]; distance_meters?: number; description?: string;
  structured_formatting?: { main_text?: string; secondary_text?: string };
  geometry?: { location?: { lat?: number; lng?: number } };
};
export function olaHit(p: OlaPrediction, mode: 'venue' | 'area'): Hit | null {
  const loc = p.geometry?.location;
  const h = hitOf({
    placeId: p.place_id, types: p.types, distanceMeters: p.distance_meters, text: { text: p.description },
    structuredFormat: { mainText: { text: p.structured_formatting?.main_text }, secondaryText: { text: p.structured_formatting?.secondary_text } },
  }, mode);
  if (!h) return null;
  if (mode === 'area' && /^(Address|Street)$/.test(h.kind)) h.kind = 'Area';   // see isAreaLike
  return typeof loc?.lat === 'number' && typeof loc?.lng === 'number' ? { ...h, ll: [loc.lat, loc.lng] } : h;
}
/* The cities with plans (_cities() in schema-app.sql), as [lat, lng]. */
const CITY_LL: [number, number][] = [[30.7333, 76.7794], [28.6139, 77.209], [19.076, 72.8777], [18.5204, 73.8567],
  [12.9716, 77.5946], [17.385, 78.4867], [13.0827, 80.2707], [23.0225, 72.5714]];
const kmBetween = ([a1, o1]: [number, number], [a2, o2]: [number, number]) => {
  const r = Math.PI / 180, x = Math.sin(((a2 - a1) * r) / 2) ** 2 + Math.cos(a1 * r) * Math.cos(a2 * r) * Math.sin(((o2 - o1) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
};
const inACity = (h: Hit) => !!h.ll && CITY_LL.some((c) => kmBetween(c, h.ll!) <= 50);

/** The list as shown: one row per place, at most 8. Two places can share a name and differ only by state
 *  ("Chandigarh" in Tripura and the city; Hyderabad in Uttar Pradesh and Telangana), so both stay. In the
 *  home-area box, places in the cities with plans come first; venues keep the provider's order (nearest first). */
export function tidyHits(hits: (Hit | null)[], mode: 'venue' | 'area'): Hit[] {
  const seen = new Set<string>();
  const list = hits.filter((h): h is Hit => {
    const k = (h?.label + '|' + h?.state).toLowerCase();
    return !!h && !seen.has(k) && !!seen.add(k);
  });
  if (mode === 'area') list.sort((a, b) => Number(inACity(b)) - Number(inACity(a)));   // stable: otherwise in the provider's order
  return list.slice(0, 8);
}

/* Types that are an area or a city: the home-area box lists those first. */
const AREA_TYPES = new Set(['locality', 'sublocality', 'sublocality_level_1', 'sublocality_level_2', 'sublocality_level_3', 'neighborhood',
  'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'administrative_area_level_4', 'colloquial_area',
  'political', 'postal_code', 'region', 'city', 'district']);
export const isArea = (types: string[] = []) => types.some((t) => AREA_TYPES.has(t));
/* Ola calls many areas an address ("IndiraNagar, Bengaluru" has the type street_address), so the home-area box takes
   those too, but never a venue (a bar, a metro station) or a building. */
const ADDRESS_TYPES = new Set(['street_address', 'address', 'route', 'geocode']);
export const isAreaLike = (types: string[] = []) => types.length > 0 && types.every((t) => AREA_TYPES.has(t) || ADDRESS_TYPES.has(t));

type Component = { long_name?: string; types?: string[] };

/** A reverse lookup (Geocoding API) as "Area, City", or for a venue "Place, Area, City". '' when nothing fits. */
export function hereLabel(results: { address_components?: Component[]; types?: string[] }[], mode: 'here' | 'venue'): string {
  const comps = results.flatMap((r) => r.address_components || []);
  const first = (...types: string[]) => {
    for (const t of types) {
      const c = comps.find((x) => (x.types || []).includes(t));
      if (c?.long_name) return norm(c.long_name);
    }
    return '';
  };
  const area = first('sublocality_level_1', 'sublocality', 'neighborhood', 'sublocality_level_2', 'administrative_area_level_3');
  const city = first('locality', 'administrative_area_level_2');
  const state = first('administrative_area_level_1');
  const place = mode === 'venue' ? first('point_of_interest', 'establishment', 'premise') : '';
  return join([place, area, city || state], mode === 'venue' ? 120 : 80);
}

/** The same from a plain address line, for answers without address parts: "Area, City" (a venue keeps one more). */
export const hereFromAddress = (address: string, mode: 'here' | 'venue') =>
  join(splitAddress(address).parts.slice(mode === 'venue' ? -3 : -2), mode === 'venue' ? 120 : 80);

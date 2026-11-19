// Checks how Google's place results are turned into list rows (supabase/functions/_shared/places-format.ts).
// Run from the web folder:  node --experimental-strip-types tools/test-places-format.mjs
import assert from 'node:assert/strict';
import { hereFromAddress, hereLabel, hitOf, isArea, isAreaLike, kindOf, olaHit, splitAddress } from '../supabase/functions/_shared/places-format.ts';

const pred = (main, secondary, types = [], distanceMeters) =>
  ({ placeId: 'ChIJ' + 'x'.repeat(20), types, distanceMeters, structuredFormat: { mainText: { text: main }, secondaryText: { text: secondary } } });

// venues: name, locality, city; no country, PIN code or state
assert.deepEqual(hitOf(pred('Elante Mall', 'Industrial Area Phase I, Chandigarh, 160002, India', ['shopping_mall', 'point_of_interest'], 4321), 'venue'),
  { id: 'ChIJ' + 'x'.repeat(20), label: 'Elante Mall, Industrial Area Phase I, Chandigarh', kind: 'Mall', state: 'Chandigarh', km: 4.3 });
assert.equal(hitOf(pred('Third Wave Coffee', 'SCO 12, Sector 35C, Chandigarh, India', ['cafe']), 'venue').label, 'Third Wave Coffee, Sector 35C, Chandigarh');
assert.equal(hitOf(pred('Toit', '100 Feet Road, Indiranagar, Bengaluru, Karnataka, India', ['pub']), 'venue').label, 'Toit, Indiranagar, Bengaluru');
assert.equal(hitOf(pred('Toit', '100 Feet Road, Indiranagar, Bengaluru, Karnataka, India', ['pub']), 'venue').state, 'Karnataka');
assert.equal(hitOf(pred('Toit', 'Bengaluru, Karnataka, India', ['pub']), 'venue').kind, 'Pub');
// areas: area and city, state on its own
const k = hitOf(pred('Koramangala', 'Bengaluru, Karnataka, India', ['sublocality_level_1', 'political']), 'area');
assert.equal(k.label, 'Koramangala, Bengaluru'); assert.equal(k.state, 'Karnataka'); assert.equal(k.kind, 'Area'); assert.equal(k.km, null);
assert.equal(hitOf(pred('Sector 17', 'Chandigarh, India', ['sublocality']), 'area').label, 'Sector 17, Chandigarh');
assert.equal(hitOf(pred('Bengaluru', 'Karnataka, India', ['locality']), 'area').label, 'Bengaluru');
// the city isn't repeated when the name already has it
assert.equal(hitOf(pred('Sector 17, Chandigarh', 'Chandigarh, India', ['sublocality']), 'area').label, 'Sector 17, Chandigarh');
// no name or id: no row
assert.equal(hitOf(pred('', 'Chandigarh, India'), 'venue'), null);
assert.equal(hitOf({ structuredFormat: { mainText: { text: 'X' } } }, 'venue'), null);
// kinds
assert.equal(kindOf(['point_of_interest', 'establishment']), 'Place');
assert.equal(kindOf(['establishment', 'escape_room']), 'Escape room');
assert.equal(splitAddress('Delhi, India').parts[0], 'Delhi');
// "use my current location"
const geo = [{ address_components: [
  { long_name: 'Sector 35C', types: ['sublocality_level_1', 'sublocality', 'political'] },
  { long_name: 'Chandigarh', types: ['locality', 'political'] },
  { long_name: 'Chandigarh', types: ['administrative_area_level_1', 'political'] }] }];
assert.equal(hereLabel(geo, 'here'), 'Sector 35C, Chandigarh');
assert.equal(hereLabel([{ address_components: [{ long_name: 'Kasauli', types: ['locality'] }] }], 'here'), 'Kasauli');
assert.equal(hereLabel([], 'here'), '');
// Ola Maps: the shape of a real answer (Elante Mall, 19 Nov 2026)
const olaPred = (main, secondary, types, lat, lng, d) => ({ place_id: 'ola-platform:5000206829294', types, distance_meters: d,
  description: main + ', ' + secondary, structured_formatting: { main_text: main, secondary_text: secondary }, geometry: { location: { lat, lng } } });
const e = olaHit(olaPred('Elante Mall', 'Industrial Area Phase I, Chandigarh, 160002', ['shopping_mall'], 30.70576, 76.80095, 3695), 'venue');
assert.deepEqual(e, { id: 'ola-platform:5000206829294', label: 'Elante Mall, Industrial Area Phase I, Chandigarh', kind: 'Mall', state: 'Chandigarh', km: 3.7, ll: [30.70576, 76.80095] });
assert.equal(olaHit(olaPred('Elante Mall', '178A, Phase-1, Phase - I, Industrial Area Phase I, Chandigarh, 160002, India', ['street_address'], 30.7012, 76.8004), 'venue').label,
  'Elante Mall, Industrial Area Phase I, Chandigarh');
assert.equal(olaHit({ place_id: 'ola-platform:1', structured_formatting: { main_text: 'X' } }, 'venue').ll, undefined);
assert.ok(isArea(['sublocality', 'political']) && !isArea(['shopping_mall']));
// the home-area box with Ola: an area filed as an address stays (and reads "Area"); a bar, a metro station, a building go
assert.ok(isAreaLike(['street_address']) && isAreaLike(['locality', 'political']));
assert.ok(!isAreaLike(['bar']) && !isAreaLike(['metro_station']) && !isAreaLike(['premise']) && !isAreaLike([]) && !isAreaLike(['street_address', 'bar']));
assert.equal(olaHit(olaPred('IndiraNagar', 'Bengaluru, Karnataka, India', ['street_address'], 12.97, 77.64), 'area').kind, 'Area');
assert.equal(olaHit(olaPred('IndiraNagar', 'Bengaluru, Karnataka, India', ['street_address'], 12.97, 77.64), 'venue').kind, 'Address');
assert.equal(hereFromAddress('SCO 12, Sector 35C, Chandigarh, 160022, India', 'here'), 'Sector 35C, Chandigarh');
console.log('places-format: all checks passed');

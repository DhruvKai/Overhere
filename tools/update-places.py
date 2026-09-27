"""Rebuilds places.json: the Chandigarh places the app's venue search offers.

Run it from the web folder whenever you want a fresher list (takes about a minute):
    python tools/update-places.py

It downloads named places and the sector boundaries from OpenStreetMap (Overpass API), works out which sector each
place is in, and writes places.json. The data is (c) OpenStreetMap contributors, under the ODbL (credits.html says so).
Uses curl, which comes with Windows 10 and later, macOS and Linux.
"""
import json, os, re, subprocess, sys, time, unicodedata

UA = 'OverhereBeta/1.0 (places list for the venue search)'
SERVERS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'places.json')
AREA = 'area["name"="Chandigarh"]["boundary"="administrative"]->.c;'

# OpenStreetMap tag -> what the app calls it. Only places people would meet at.
KINDS = {
    'amenity': {'restaurant': 'Restaurant', 'fast_food': 'Fast food', 'cafe': 'Café', 'bar': 'Bar', 'pub': 'Pub',
                'biergarten': 'Beer garden', 'cinema': 'Cinema', 'theatre': 'Theatre', 'arts_centre': 'Arts centre',
                'community_centre': 'Community centre', 'library': 'Library', 'ice_cream': 'Ice cream',
                'food_court': 'Food court', 'nightclub': 'Nightclub', 'events_venue': 'Event venue',
                'music_venue': 'Music venue', 'marketplace': 'Market', 'university': 'University'},
    'shop': {'bakery': 'Bakery', 'pastry': 'Bakery', 'confectionery': 'Sweet shop', 'coffee': 'Coffee', 'tea': 'Tea shop',
             'books': 'Bookshop', 'music': 'Music shop', 'mall': 'Mall', 'deli': 'Deli', 'ice_cream': 'Ice cream'},
    'leisure': {'park': 'Park', 'garden': 'Garden', 'stadium': 'Stadium', 'sports_centre': 'Sports centre',
                'bowling_alley': 'Bowling', 'amusement_arcade': 'Arcade', 'escape_game': 'Escape room'},
    'tourism': {'attraction': 'Attraction', 'museum': 'Museum', 'gallery': 'Gallery', 'viewpoint': 'Viewpoint',
                'theme_park': 'Theme park', 'zoo': 'Zoo', 'hotel': 'Hotel'},
}


def overpass(query):
    for url in SERVERS * 2:
        r = subprocess.run(['curl', '-s', '--max-time', '180', '-A', UA, url, '--data-urlencode', 'data=' + query],
                           capture_output=True)
        if r.returncode == 0 and r.stdout[:1] == b'{':
            return json.loads(r.stdout)['elements']
        print('  server busy, trying again...', file=sys.stderr)
        time.sleep(5)
    sys.exit('OpenStreetMap servers are busy. Please try again in a few minutes.')


def inside(lat, lon, edges):
    """Ray casting over all outer edges of a sector (its outline may be split across several ways)."""
    hit = False
    for (y1, x1), (y2, x2) in edges:
        if (y1 > lat) != (y2 > lat) and lon < x1 + (lat - y1) * (x2 - x1) / (y2 - y1):
            hit = not hit
    return hit


def clean(s):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', s)).strip()


print('Downloading sector boundaries...')
sectors = []
for e in overpass('[out:json][timeout:120];' + AREA + 'relation(area.c)["boundary"="administrative"]["name"~"^Sector[ -]?[0-9]+$"];out geom;'):
    n = int(re.sub(r'\D', '', e['tags']['name']))
    edges = []
    for m in e.get('members', []):
        if m.get('role') in ('outer', '') and m.get('geometry'):
            pts = [(p['lat'], p['lon']) for p in m['geometry']]
            edges += list(zip(pts, pts[1:]))
    if edges:
        sectors.append((n, edges))
print('  %d sectors' % len(sectors))

print('Downloading places...')
parts = ''.join('nwr(area.c)["name"]["%s"~"^(%s)$"];' % (k, '|'.join(v)) for k, v in KINDS.items())
elements = overpass('[out:json][timeout:120];' + AREA + '(' + parts + ');out center tags;')

places, seen = [], set()
for e in elements:
    t = e['tags']
    kind = next((KINDS[k][t[k]] for k in KINDS if t.get(k) in KINDS[k]), None)
    lat, lon = (e['lat'], e['lon']) if 'lat' in e else (e['center']['lat'], e['center']['lon'])
    name = clean(t.get('name:en') or t['name'])
    if not kind or len(name) < 2:
        continue
    sec = next((n for n, edges in sectors if inside(lat, lon, edges)), None)
    area = 'Sector %d' % sec if sec else clean(t.get('addr:suburb') or '') or 'Chandigarh'
    label = name if area.lower() in name.lower() else '%s, %s' % (name, area)
    if label.lower() in seen:
        continue
    seen.add(label.lower())
    places.append([label, kind, round(lat, 5), round(lon, 5)])

places.sort(key=lambda p: p[0].lower())
data = {'source': 'Places (c) OpenStreetMap contributors, ODbL 1.0, https://www.openstreetmap.org/copyright',
        'updated': time.strftime('%Y-%m-%d'), 'places': places}
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
print('Wrote %d places to %s (%d KB)' % (len(places), OUT, os.path.getsize(OUT) // 1024))

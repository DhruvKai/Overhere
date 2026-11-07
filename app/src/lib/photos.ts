import type { Plan } from './model';
import { BANK, PHOTOS, type BankPhoto } from './photoFiles';

/* Each category has a bank of freely licensed photos (web/img/plans/bank.json, generated into photoFiles.ts by
   web/tools/plan-photos.py: CC0, CC BY or CC BY-SA, no identifiable people). A plan gets the photo from its category's
   bank whose tags best match its description and venue, else the category's default photo. The host never picks it,
   and the plan screen says it's illustrative and credits it. photoFor in web/app.js does the same. */
const words = (s: string) => ' ' + String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim() + ' ';

export function photoFor(a: Pick<Plan, 'cat' | 'desc' | 'venue'>): BankPhoto {
  const d = words(a.desc), v = words(a.venue), has = (t: string, w: string) => t.includes(` ${w} `) || t.includes(` ${w}s `) || t.includes(` ${w}es `);
  let best: BankPhoto | null = null, bs = 0;
  for (const p of BANK) {
    if (!p.cats.includes(a.cat)) continue;
    /* whole words or phrases, plurals too ("momo" matches "momos", but "bar" doesn't match "barbecue"). The description
       decides first; the venue's name (which often just says "café") only breaks ties, then the more specific match wins
       ("board games" over "coffee"). */
    let n = 0, m = 0, l = 0;
    for (const g of new Set(p.tags.map(g => words(g).trim()))) { const hd = has(d, g), hv = has(v, g); n += +hd; m += +hv; if (hd || hv) l += g.length; }
    const sc = n * 1e6 + m * 1e3 + l;
    if (sc > bs) { bs = sc; best = p; }
  }
  return best ?? BANK.find(p => p.def.includes(a.cat)) ?? BANK.find(p => p.def.includes('cafe'))!;
}

export function photoOf(a: Pick<Plan, 'id' | 'cat' | 'desc' | 'venue'>) {
  return PHOTOS[photoFor(a).k];
}

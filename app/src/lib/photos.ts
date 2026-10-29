import type { Plan } from './model';
import { PHOTOS, type PhotoKey } from './photoFiles';

/* A plan gets, in order: a photo of what it clearly is (karaoke, ramen...), else of its place if that's a
   Chandigarh landmark, else a looser match within its category, else one of its category's photos (photoOf in web/app.js). */
const WHAT: [RegExp, PhotoKey][] = [[/outdoor movie|movie on the lawn/, 'outdoorfilm'], [/jazz/, 'jazz'], [/karaoke/, 'karaoke'], [/sufi|qawwali/, 'sufi'],
  [/carnatic|classical/, 'classical'], [/dhol|bhangra|folk/, 'dhol'], [/open.?mic|songwriting|poetry/, 'openmic'], [/techno|nightclub|\bdj\b|\bedm\b/, 'club'],
  [/vinyl|record store/, 'vinyl'], [/ramen/, 'ramen'], [/momo/, 'momos'], [/paratha|parantha/, 'parantha'], [/chole|bhature/, 'cholebhature'],
  [/dessert|sweets|mithai/, 'dessert'], [/cook.?along|cooking/, 'cooking'], [/tea (tasting|room|flight)/, 'tea'],
  [/board ?game|pictionary|catan/, 'boardgames'], [/book (swap|club|exchange)/, 'books'], [/maggi|dhaba/, 'dhaba'], [/crossword|filter coffee/, 'coffee']];
const PLACE: [RegExp, PhotoKey][] = [[/sukhna/, 'sukhna'], [/rock garden/, 'rockgarden'], [/rose garden/, 'rosegarden'], [/sector 17 (plaza|architecture)|plaza fountain/, 'plaza17'],
  [/capitol|le corbusier/, 'capitol'], [/leisure valley/, 'leisure'], [/museum/, 'museum'], [/panjab university/, 'pu'], [/elante/, 'elante']];
const LOOSE: Record<string, [RegExp, PhotoKey][]> = {
  cafe: [[/brunch|pancake|breakfast/, 'brunch'], [/chai/, 'chai'], [/picnic/, 'picnic']],
  concerts: [[/sitar|recital|raga/, 'classical'], [/band|gig|live music|acoustic|rock/, 'liveband']],
  movies: [[/classic|re-?run|re-?release|\b90s\b|matinee|satyajit|retro/, 'classicfilm']],
};
const BY_CAT: Record<string, PhotoKey[]> = { movies: ['cinema', 'classicfilm'], cafe: ['coffee', 'brunch', 'chai'], concerts: ['concert', 'liveband'] };

export function photoOf(a: Pick<Plan, 'id' | 'cat' | 'desc' | 'venue'>) {
  const t = (a.venue + ' ' + a.desc).toLowerCase();
  const hit = (l: [RegExp, PhotoKey][]) => l.find(([re]) => re.test(t))?.[1];
  const k = hit(WHAT) || hit(PLACE) || hit(LOOSE[a.cat] || []);
  if (k) return PHOTOS[k];
  const pool = BY_CAT[a.cat] || BY_CAT.cafe;
  let h = 0;
  for (const ch of String(a.id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PHOTOS[pool[h % pool.length]];
}

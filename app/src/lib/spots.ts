import places from '../../assets/places.json';
import type { Plan } from './model';

/* Where a plan's pin goes on the map, the same as geo() in web/app.js. Plans picked from the place list have exact
   coordinates (a.ll). Older ones (and the Chandigarh sample plans) are placed at a known place they name, else the
   sector or area they name, else their neighbourhood. Generated from web/app.js's tables; places.json is the same file
   as web/places.json (Chandigarh's named places from OpenStreetMap, ODbL). */
type LL = [number, number];

const SECTOR_LL: Record<number, LL> = {1:[30.76116,76.80215],2:[30.76379,76.79137],3:[30.75829,76.79616],4:[30.75186,76.80141],5:[30.74556,76.80678],6:[30.73903,76.81245],7:[30.73587,76.80428],8:[30.7417,76.79945],9:[30.7474,76.79393],10:[30.75419,76.78896],11:[30.75987,76.7845],12:[30.7644,76.77885],14:[30.75985,76.76683],15:[30.75299,76.77265],16:[30.74676,76.77752],17:[30.74007,76.78259],18:[30.7345,76.78825],19:[30.7283,76.79306],20:[30.72118,76.78158],21:[30.7269,76.77654],22:[30.73343,76.77135],23:[30.73992,76.7662],24:[30.74578,76.76173],25:[30.75165,76.75673],26:[30.73001,76.80911],27:[30.72275,76.79842],28:[30.71719,76.80372],29:[30.71026,76.79242],30:[30.71568,76.78697],31:[30.70288,76.78109],32:[30.70839,76.77529],33:[30.71413,76.77014],34:[30.71992,76.76521],35:[30.72612,76.75989],36:[30.73247,76.75491],37:[30.73853,76.75034],38:[30.74468,76.74577],39:[30.74374,76.73028],40:[30.73798,76.7354],41:[30.73254,76.7378],42:[30.72608,76.74315],43:[30.71909,76.74879],44:[30.7129,76.75411],45:[30.70659,76.75693],46:[30.7014,76.76423],47:[30.69581,76.76905],48:[30.68794,76.75732],49:[30.69403,76.75214],50:[30.7,76.74775],51:[30.70562,76.74276],52:[30.71217,76.73725],53:[30.71924,76.73215],54:[30.72608,76.72921],55:[30.73008,76.72283],56:[30.73665,76.7189],61:[30.70889,76.73076],63:[30.69297,76.73648]};
const PLACE_LL: [RegExp, LL][] = [
  [/sukhna/,[30.74198,76.81767]],
  [/rock garden/,[30.7532,76.80663]],
  [/rose garden/,[30.74582,76.78148]],
  [/capitol|le corbusier/,[30.76099,76.80322]],
  [/leisure valley/,[30.7536,76.7938]],
  [/museum/,[30.74895,76.78744]],
  [/panjab university/,[30.76024,76.76649]],
  [/elante/,[30.70544,76.80096]],
  [/tagore theatre/,[30.73323,76.78954]],
  [/kala bhawan/,[30.74676,76.77752]],
  [/piccadily/,[30.72352,76.76759]],
  [/indian coffee house/,[30.74022,76.7806]]];
const LOCALITY_LL: Record<string, LL> = {'Manimajra':[30.71275,76.83294],'Industrial Area Phase 1':[30.7054,76.80096],'Industrial Area Phase 2':[30.69813,76.78801],'IT Park':[30.72732,76.84352],'Daria':[30.69838,76.81428],'Dhanas':[30.769,76.75515],'Hallomajra':[30.6923,76.79997],'Kaimbwala':[30.75847,76.82606],'Khuda Lahora':[30.77582,76.77184],'Kishangarh':[30.73443,76.82821],'Maloya':[30.75315,76.71713],'Mauli Jagran':[30.69703,76.82901],'Sarangpur':[30.78087,76.7576]};

const PLACE_AT: Record<string, LL> = {};
Object.entries(SECTOR_LL).forEach(([n, ll]) => { PLACE_AT[`sector ${n}, chandigarh`] = ll; });
Object.entries(LOCALITY_LL).forEach(([n, ll]) => { PLACE_AT[n.toLowerCase() + ', chandigarh'] = ll; });
(places.places as [string, string, number, number][]).forEach(([label, , lat, lon]) => { PLACE_AT[label.toLowerCase()] = [lat, lon]; });

const hoodLL = (h: string): LL => SECTOR_LL[+((/\d+/.exec(h || '') || ['17'])[0])] || SECTOR_LL[17];
const spotOf = (t: string): LL | undefined => {
  t = (t || '').toLowerCase();
  const p = PLACE_LL.find(([re]) => re.test(t));
  if (p) return p[1];
  const s = /sector[\s-]*(\d{1,2})\b/.exec(t);
  if (s && SECTOR_LL[+s[1]]) return SECTOR_LL[+s[1]];
  const l = Object.keys(LOCALITY_LL).find(n => t.includes(n.toLowerCase()));
  return l ? LOCALITY_LL[l] : undefined;
};

export function geo(a: Plan): LL {
  const exact = a.ll || PLACE_AT[(a.venue || '').trim().toLowerCase()];
  const base = exact || spotOf(a.venue) || spotOf(a.desc) || hoodLL(a.hood);
  /* plans at the same spot are spread out a little (up to about 270 m, or 45 m at a known place) so their pins don't hide each other */
  let h = 2166136261;
  for (const c of a.id) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  h >>>= 0;
  const ang = (h % 360) * Math.PI / 180, r = (0.25 + ((h >>> 9) % 75) / 100) * (exact ? 0.0004 : 0.0025);
  return [base[0] + r * Math.sin(ang), base[1] + r * Math.cos(ang)];
}

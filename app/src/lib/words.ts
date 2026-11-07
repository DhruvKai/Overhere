/* Words a plan's description can't contain. The database decides (blocked_terms and _bad_word in web/schema-app.sql,
   where the team can add more); this copy of the starting list warns while you type. Same list and matching as
   BAD_TERMS / badWord in web/app.js. A trailing * also matches longer words. Matching ignores case, look-alike
   characters, letters stretched out or spaced out, and only matches whole words (so "Sussex" and "cocktail" are fine). */
const BAD_TERMS = [
  'fuck*', 'motherfuck*', 'fck', 'fuk', 'shit', 'shitty', 'bullshit', 'bitch*', 'bastard*', 'asshole*', 'ass', 'arse', 'dick', 'dickhead*',
  'cock', 'cunt*', 'pussy', 'wank*', 'slut*', 'whore*', 'boobs', 'tits', 'titties', 'cum', 'sex', 'sexy', 'horny', 'nudes', 'porn*', 'xxx',
  'nsfw', 'onlyfans', 'sexting', 'rape', 'rapist', 'escort', 'escorts', 'hooker', 'hookers', 'prostitute*', 'nigger*', 'nigga', 'niggas',
  'faggot*', 'retard', 'retarded', 'kys', 'hookup', 'hookups', 'fwb', 'cocaine', 'heroin', 'mdma', 'lsd', 'meth', 'ganja', 'charas',
  'chutiya', 'chutiye', 'chutia', 'chut', 'bhenchod', 'behenchod', 'bhanchod', 'benchod', 'madarchod', 'maderchod', 'madarjaat', 'bsdk',
  'bhosdi*', 'bhosda', 'gandu', 'gaand', 'lund', 'lauda', 'lavda', 'loda', 'lodu', 'jhatu', 'jhaant', 'chodu', 'randi', 'randwa', 'harami',
  'haramkhor', 'kutiya',
  'escort service', 'call girl', 'call girls', 'hook up', 'one night stand', 'friends with benefits', 'no strings attached', 'sugar daddy',
  'sugar baby', 'sugar mommy', 'casual sex', 'looking for girlfriend', 'looking for a girlfriend', 'looking for boyfriend',
  'looking for a boyfriend', 'body massage', 'kill yourself', 'ecstasy pills',
];
const LOOK: Record<string, string> = { '@': 'a', '4': 'a', '0': 'o', '1': 'i', '3': 'e', '5': 's', $: 's', '7': 't', '!': 'i', '|': 'l' };

export const normWords = (t: string) => ' ' + String(t || '').toLowerCase().replace(/[@40135$7!|]/g, c => LOOK[c])
  .replace(/[^a-z]+/g, ' ').replace(/([a-z])\1{2,}/g, '$1').replace(/\b([a-z]) (?=[a-z]\b)/g, '$1').trim() + ' ';

/** The first blocked word or phrase in a text, or '' when it's fine. */
export function badWord(t: string): string {
  const n = normWords(t);
  for (const term of BAD_TERMS) {
    const w = normWords(term.replace(/\*$/, '')).trim();
    if (w && n.includes(term.endsWith('*') ? ' ' + w : ' ' + w + ' ')) return w;
  }
  return '';
}

export const badWordMsg = (w: string) => `"${w}" isn't allowed in a plan. Please reword it so it's friendly for everyone.`;

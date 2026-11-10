/* Rules and strength for a new password, the same as pwScore / pwHint / pwProblem in web/app.js: at least 8 characters,
   a letter and a number, no part of your email, not a common password, and not something the strength score calls weak.
   Keep the two copies in step. */
const COMMON = new Set(['password', 'password1', 'password12', 'password123', 'passw0rd', '12345678', '123456789', '1234567890', '87654321',
  '11111111', '00000000', 'qwerty12', 'qwerty123', 'qwertyuiop', 'asdfghjkl', '1q2w3e4r', 'zaq12wsx', 'abc12345', 'abcd1234', 'iloveyou',
  'letmein1', 'welcome1', 'welcome123', 'admin123', 'sunshine', 'princess', 'football', 'baseball', 'superman', 'monkey123', 'india123',
  'india@123', 'overhere', 'overhere1']);
/* Words people build passwords around. Matched anywhere, after undoing look-alike swaps, so "P@ssw0rd" is still "password". */
const WEAK_WORDS = ['password', 'passwd', 'pass', 'welcome', 'qwerty', 'admin', 'india', 'bharat', 'love', 'letmein', 'hello', 'secret', 'monkey', 'dragon',
  'cricket', 'football', 'baseball', 'soccer', 'sunshine', 'princess', 'master', 'login', 'user', 'test', 'overhere', 'tagalong', 'angel', 'shadow', 'super',
  'batman', 'killer', 'computer', 'internet', 'google', 'facebook', 'summer', 'winter', 'flower', 'freedom', 'whatever', 'trustno', 'starwars', 'pokemon',
  'naruto', 'cheese', 'chocolate', 'money', 'family', 'friend', 'happy', 'lucky', 'apple', 'orange', 'banana', 'mother', 'father', 'baby', 'delhi', 'mumbai',
  'punjab', 'chandigarh', 'krishna', 'ganesh', 'sairam', 'hunter', 'charlie', 'michael', 'jordan', 'iloveyou', 'pakistan']
  .sort((a, b) => b.length - a.length);
const LEET: Record<string, string> = { '@': 'a', '4': 'a', '0': 'o', '1': 'i', '!': 'i', '|': 'l', '3': 'e', '5': 's', '$': 's', '7': 't' };
const KEYS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1qaz2wsx3edc4rfv'];

/* The checklist under the meter. The symbol one isn't required, it only makes the password stronger. */
export const PW_RULES: [string, (p: string) => boolean][] = [
  ['8+ characters', p => p.length >= 8], ['A letter', p => /[a-z]/i.test(p)], ['A number', p => /\d/.test(p)], ['A symbol (stronger)', p => /[^A-Za-z0-9]/.test(p)]];

export type PwWhy = 'common' | 'email' | 'word' | 'keys' | 'run' | 'year' | 'repeat';
export type PwScore = { s: 0 | 1 | 2 | 3 | 4; why?: PwWhy; hit?: string };

const unleet = (lo: string) => [...lo].map(c => LEET[c] || c).join('');
const mailUser = (email: string) => (email.trim().split('@')[0] || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/* 0 to 4, from a rough count of how many guesses the password would take. Each character you'd have to guess adds a lot;
   a common word, a year, a run like 123 or qwerty, or a repeat adds only a little, however it's dressed up with capitals
   and symbols. Also says what made it weak (why, and the part it found), for the tip under the meter. */
export function pwScore(p: string, email = ''): PwScore {
  const lo = p.toLowerCase(), n = unleet(lo), user = mailUser(email);
  if (COMMON.has(lo) || COMMON.has(n) || /^(.)\1+$/.test(p)) return { s: 0, why: 'common' };
  const used: boolean[] = Array(p.length).fill(false), found: { why: PwWhy; hit: string }[] = [];
  let bits = 0;
  /* claim p[i..j) for a weak part, if none of it is claimed yet */
  const take = (i: number, j: number, cost: number, why: PwWhy) => {
    for (let k = i; k < j; k++) if (used[k]) return;
    for (let k = i; k < j; k++) used[k] = true;
    bits += cost; found.push({ why, hit: p.slice(i, j) });
  };
  const each = (s: string, w: string, fn: (i: number) => void) => { for (let i = s.indexOf(w); i >= 0; i = s.indexOf(w, i + 1)) fn(i); };
  if (user.length >= 3) each(n, user, i => take(i, i + user.length, 6, 'email'));
  WEAK_WORDS.forEach(w => each(n, w, i => take(i, i + w.length, 10 + Number(/[A-Z]/.test(p.slice(i, i + w.length))) + Number(lo.slice(i, i + w.length) !== w), 'word')));
  KEYS.forEach(r => {
    for (let len = r.length; len >= 4; len--) for (let a = 0; a + len <= r.length; a++) {
      const w = r.slice(a, a + len);
      each(lo, w, i => take(i, i + len, 5, 'keys'));
      each(lo, [...w].reverse().join(''), i => take(i, i + len, 5, 'keys'));
    }
  });
  for (const m of p.matchAll(/(19|20)\d\d/g)) take(m.index!, m.index! + 4, 5, 'year');
  /* runs like abc, 123, 987: each step one letter or digit up, or down */
  for (let i = 0; i < lo.length - 2;) {
    const d = lo.charCodeAt(i + 1) - lo.charCodeAt(i);
    let j = i + 1;
    if (Math.abs(d) === 1 && /[a-z0-9]/.test(lo[i])) while (j < lo.length && lo.charCodeAt(j) - lo.charCodeAt(j - 1) === d && /[a-z0-9]/.test(lo[j])) j++;
    if (j - i >= 3) { take(i, j, 4, 'run'); i = j; } else i++;
  }
  for (const m of p.matchAll(/(.)\1{2,}/g)) take(m.index!, m.index! + m[0].length, 6, 'repeat');
  for (const m of p.matchAll(/(.{2,}?)\1+/g)) take(m.index! + m[1].length, m.index! + m[0].length, 2, 'repeat');
  const pool = (/[a-z]/.test(p) ? 26 : 0) + (/[A-Z]/.test(p) ? 26 : 0) + (/\d/.test(p) ? 10 : 0) + (/[^A-Za-z0-9]/.test(p) ? 33 : 0);
  bits += used.filter(u => !u).length * Math.log2(pool || 1);
  return { s: bits < 30 ? 1 : bits < 40 ? 2 : bits < 55 ? 3 : 4, ...(found[0] || {}) };
}

/* What to say about a weak password: names the part that gives it away. */
export function pwHint({ why, hit }: PwScore): string {
  return why === 'common' ? 'This is one of the first passwords attackers try. Pick something less common'
    : why === 'email' ? 'Leave your email name out of your password'
    : why === 'word' ? `Common words like "${hit}" are easy to guess, even with symbols swapped in`
    : why === 'keys' ? `Keyboard patterns like "${hit}" are easy to guess`
    : why === 'run' ? `Runs like "${hit}" are easy to guess`
    : why === 'year' ? `Years like ${hit} are easy to guess`
    : why === 'repeat' ? 'Repeated characters add little. Mix it up'
    : 'Longer is stronger: try three or four random words together';
}

/* Returns what's wrong with a new password, or '' when it's fine. */
export function pwProblem(p: string, email = ''): string {
  if (p.length < 8) return 'Use at least 8 characters';
  if (!/[a-z]/i.test(p) || !/\d/.test(p)) return 'Use at least one letter and one number';
  const lo = p.toLowerCase(), n = unleet(lo);
  const mail = email.trim().toLowerCase(), user = mailUser(email);
  if (mail && (lo.includes(mail) || (user.length >= 3 && (lo.replace(/[^a-z0-9]/g, '').includes(user) || n.includes(user)))))
    return 'Leave your email out of your password';
  const r = pwScore(p, email);
  return r.s < 2 ? pwHint(r) : '';
}

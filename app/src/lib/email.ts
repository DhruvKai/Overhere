/* Email checks for the sign-in forms, the same as EMAIL_RE / mailFix in web/app.js. */
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const emailProblem = (e: string) => (!e.trim() ? 'Enter your email' : !EMAIL_RE.test(e.trim()) ? 'Enter a valid email, like name@example.com' : '');

/* Typos in the big email providers ("gmial.com") get a "Did you mean" under the field. Short domains only match one letter off. */
const MAIL_DOMAINS = ['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'ymail.com', 'rediffmail.com', 'outlook.com', 'outlook.in', 'hotmail.com',
  'live.com', 'msn.com', 'icloud.com', 'me.com', 'mail.com', 'aol.com', 'proton.me', 'protonmail.com', 'zoho.com'];
function editDist(a: string, b: string) {
  const r = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let d = r[0]; r[0] = i;
    for (let j = 1; j <= b.length; j++) { const t = r[j]; r[j] = Math.min(r[j] + 1, r[j - 1] + 1, d + (a[i - 1] === b[j - 1] ? 0 : 1)); d = t; }
  }
  return r[b.length];
}
export function mailFix(email: string): string {
  const m = email.trim().toLowerCase().match(/^([^@\s]+)@([^@\s]+)$/);
  if (!m || MAIL_DOMAINS.includes(m[2])) return '';
  let best = '', bd = 9;
  for (const d of MAIL_DOMAINS) { const k = editDist(m[2], d); if (k < bd && k <= (d.length >= 9 ? 2 : 1)) { bd = k; best = d; } }
  if (!best && /\.(con|cmo|ocm|vom|xom|comm)$/.test(m[2])) best = m[2].replace(/\.[a-z]+$/, '.com');
  return best ? m[1] + '@' + best : '';
}

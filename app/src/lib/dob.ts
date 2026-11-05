/* "DD/MM/YYYY" -> "YYYY-MM-DD", or '' when it isn't a real date. */
export function isoDob(s: string) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s.trim());
  if (!m) return '';
  const [d, mo, y] = [+m[1], +m[2], +m[3]], dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d || y < 1900) return '';
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
/* Typed digits -> "DD/MM/YYYY", adding the slashes as you go ("02061999" -> "02/06/1999"). */
export function maskDob(s: string) {
  const d = s.replace(/\D/g, '').slice(0, 8);
  return d.slice(0, 2) + (d.length > 2 ? '/' + d.slice(2, 4) : '') + (d.length > 4 ? '/' + d.slice(4) : '');
}
/* "YYYY-MM-DD" -> "DD/MM/YYYY", for showing a saved date of birth */
export const showDob = (iso: string) => { const [y, mo, d] = (iso || '').slice(0, 10).split('-'); return y && mo && d ? `${d}/${mo}/${y}` : ''; };

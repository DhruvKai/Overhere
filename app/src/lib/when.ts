/* Times and dates typed into a poll ("8am", "20:30", "5 nov", "5/11") written the way the rest of the app shows them
   ("8:00 AM", "Thu, 5 Nov"), so a poll reads like the plan it's about. Anything else is left as typed. The same as
   tidyWhen() in web/app.js. Dates and times are each found in one pass, so nothing already rewritten is read again. */
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MON = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?';
const ORD = '(?:st|nd|rd|th)?';
/* a weekday written before the date is replaced by the right one ("Sun, Nov 8" stays one date) */
const WD = '(?:\\b(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\\.?,?\\s+)?';
/* 5 nov [2026] | nov 5[, 2026] | 5/11[/2026] (day first, as in India) */
const DATE = new RegExp(
  `${WD}\\b(\\d{1,2})${ORD}\\s+(${MON})(?:,?\\s+(\\d{4}))?\\b|${WD}\\b(${MON})\\s+(\\d{1,2})${ORD}\\b(?:,?\\s+(\\d{4}))?|${WD}\\b(\\d{1,2})[/-](\\d{1,2})(?:[/-](\\d{4}|\\d{2}))?\\b`, 'gi');
/* 8am, 8 pm, 8.30pm, 8:30 p.m. | 20:30 */
const TIME = /\b(\d{1,2})(?:[:.](\d{2}))?\s*([ap])\.?m\b\.?|\b([01]?\d|2[0-3]):([0-5]\d)\b/gi;

const time = (h: number, m: number) => new Date(2000, 0, 1, h, m).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const mon = (s: string) => MONTHS.indexOf(s.slice(0, 3).toLowerCase());
/* a day without a year is the next one from today */
function date(day: number, month: number, year: number | null, now: Date) {
  let y = year ?? now.getFullYear();
  if (y < 100) y += 2000;
  let d = new Date(y, month, day);
  if (month < 0 || d.getMonth() !== month || d.getDate() !== day) return null;
  if (year == null && d < new Date(now.getFullYear(), now.getMonth(), now.getDate())) d = new Date(y + 1, month, day);
  return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', ...(d.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}) });
}

export function tidyWhen(s: string, now = new Date()) {
  return s
    .replace(DATE, (all, d1, m1, y1, m2, d2, y2, d3, m3, y3) => {
      const r = d1 ? date(+d1, mon(m1), y1 ? +y1 : null, now) : m2 ? date(+d2, mon(m2), y2 ? +y2 : null, now) : date(+d3, +m3 - 1, y3 ? +y3 : null, now);
      return r ?? all;
    })
    .replace(TIME, (all, h, m, ap, h24, m24) => {
      if (h24 !== undefined) return time(+h24, +m24);
      const hh = +h, mm = +(m || 0);
      return hh < 1 || hh > 12 || mm > 59 ? all : time((hh % 12) + (ap.toLowerCase() === 'p' ? 12 : 0), mm);
    });
}

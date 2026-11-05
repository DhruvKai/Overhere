// Emails to the team (admin@overhere.social) through Resend, for things a person should look at: a face check that
// used up its tries, or a phone number paused after too many wrong codes. Needs the RESEND_API_KEY secret (a
// "Sending access" key for mail.overhere.social). Without it, or if Resend fails, nothing is sent and the check
// carries on: an alert must never break sign-in or the face check.
const TO = Deno.env.get('ALERT_TO') ?? 'admin@overhere.social';
const FROM = Deno.env.get('ALERT_FROM') ?? 'Overhere alerts <alerts@mail.overhere.social>';
export const ADMIN_URL = 'https://overhere.social/addmin/';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

/** Send one alert. `lines` are plain sentences; each becomes a paragraph. Returns whether Resend accepted it. */
export async function alertTeam(subject: string, lines: string[]): Promise<boolean> {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) { console.warn('alert skipped: no RESEND_API_KEY'); return false; }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM, to: [TO], subject,
        text: lines.join('\n\n'),
        html: `<div style="font:15px/1.5 system-ui,sans-serif;color:#1A1A1A">${lines.map((l) => `<p>${esc(l)}</p>`).join('')}</div>`,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) console.error('alert refused', r.status, (await r.text()).slice(0, 300));
    return r.ok;
  } catch (e) {
    console.error('alert failed', (e as Error).message);
    return false;
  }
}

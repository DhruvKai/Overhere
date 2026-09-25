# Overhere beta site

Static site: sign-up -> try the sample app -> feedback. No build step, no OTP, no face scan.

## Run locally
Open `index.html` in a browser. Until Supabase is connected, submissions are saved in that
browser only (the page shows a banner with a "Download saved data" link).

## Connect Supabase (free tier)
1. Create a project at supabase.com.
2. SQL Editor -> paste `schema.sql` -> Run. (Visitors can insert only; nobody can read via the public API.)
3. Project Settings -> API: copy the Project URL and the `anon` public key into `config.js`,
   and set `CONTACT_EMAIL` (shown in the consent text for deletion requests).
4. View and export responses in Table Editor -> `participants` and `feedback`.

## Usage events and the beta dashboard
The sample app records which features testers use (taps like "sent a request", never message text) in an
`events` table, and `dashboard.html` shows totals, charts and consented quotes.
1. Supabase -> SQL Editor -> paste the part of `schema.sql` under "Added later" -> Run.
2. Set the dashboard password (10+ characters): `insert into admin_secret (pass) values ('your-long-password');`
3. Open `dashboard.html` (also linked from the Admin tab) and enter that password. It is checked by the
   database, not stored in the page.
Until step 1 is done the app still works; it just can't save events.

## Publish
Follow GO-LIVE-GUIDE.md (step by step, written for beginners). Short version: upload to any static host (GitHub Pages, Netlify, Cloudflare Pages). Keep
all the files together (`index.html`, `demo.html`, `dashboard.html`, `config.js`, `sw.js`, `manifest.webmanifest` and the icons).

## Consent
- Sign-up: one required box (store details, contact about the beta, 18+, deletion on request).
- Feedback: required "store feedback", optional "quote anonymously", optional "contact me".
- Each row stores which consent text version was accepted (`consent_version`).
- Have someone review the consent wording against local privacy law before real users see it.

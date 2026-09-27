# Overhere beta site

Static site on GitHub Pages, with all data in Supabase. No build step.

- `index.html` + `site.js`: the front page (what Overhere is, try the app, leave feedback).
- `demo.html` + `app.js`: the app itself. People make an account, a profile, pass the face check, then post plans,
  ask to join other people's, chat, and rate meetups. Everyone shares the same plans.
- `addmin/`: the beta dashboard (totals, charts, quotes, and the human-review queue), behind a password checked by
  the database.
- `head.js`: runs first on every page (frame guard, theme). `sw.js`: offline support and installing as an app.
- `schema.sql`: sign-ups, feedback, usage events, dashboard. `schema-app.sql`: accounts, plans, requests, chats,
  notifications, checks.
- `supabase/functions/` and `face-widget/`: the real face scan (AWS Face Liveness), switched off until connected.

## Set up

1. Supabase: follow [GO-LIVE-GUIDE.md](GO-LIVE-GUIDE.md) for `schema.sql` and `config.js`, then
   [SETUP-APP.md](SETUP-APP.md) for `schema-app.sql`, sign-in settings and the demo accounts.
2. Dashboard password (10+ characters, 16+ recommended): `insert into admin_secret (pass) values ('your-long-password');`
3. Publish all the files together on GitHub Pages (or any static host).

The app needs the published https site: opened as a file, it only shows a note. For local testing, run
`python -m http.server 8000` in this folder and add `http://localhost:8000/**` to Supabase's Redirect URLs.

## Plans and guides

- [SETUP-APP.md](SETUP-APP.md): switching the app to Supabase, day-to-day use
- [SECURITY.md](SECURITY.md): how data is protected, the security review, known limits
- [auth.md](auth.md): Google sign-in
- [otp.md](otp.md): phone OTP in India
- [face-scan.md](face-scan.md): face scan and ID check in India, and connecting the real face scan

## Consent

- Profile (in the app): one required box (store details, contact about the beta, 18+, deletion on request),
  saved with its version and time.
- Face and ID checks: their own box, saved with each attempt.
- Feedback: required "store feedback", optional "quote anonymously", optional "contact me".
- Have someone review the consent wording against Indian privacy law (DPDP) before real users see it.

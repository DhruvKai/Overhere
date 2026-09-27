# Security

How Overhere protects people's data, what the September 2026 review found and fixed, and what is still open.

## How it is protected

**The database decides, not the browser.**
- Every table has row level security on and **no policies**, and the browser roles (`anon`, `authenticated`) have
  **no table rights at all**. The one exception is reading your own row in `pings`, for live updates.
- The app can only call the functions in `schema-app.sql`. Each one checks who is signed in (`auth.uid()`) and what
  they may do.
- Internal helper functions can't be called from the browser. The verification functions can only be called by the
  Edge Functions (service role). The admin functions check the dashboard password inside the database.

**Who sees what** (all enforced in `app_state()`):

| Data | Who can see it |
|---|---|
| A plan | Anyone it is open to, in the plan's audience. Audience-limited plans (e.g. women-only) are only shown to people whose **ID check passed**. Blocks hide plans in both directions. |
| Who is going | Only the host and accepted members. Everyone else sees a count. |
| Join requests and their notes | The person who asked, and the host. |
| Group chat | The host and accepted members. |
| Email, date of birth, private settings, trusted contact | Only the person themselves. Others see age, not date of birth. |
| Face and ID checks | Only the outcome is stored: no images, no ID numbers. |

**Checks can't be faked from the browser.** Face and ID results are written only by the database's own
functions: the simulated check while in `simulated` mode, and only the Edge Functions (which ask AWS) in `live`
mode. A live session must belong to the person, be under 30 minutes old, and can't be reused.

**The pages:**
- A **Content Security Policy** lets scripts run only from the site's own files and the pinned Supabase library.
  That library is loaded with an **integrity hash**, so a changed copy on the CDN is refused.
- Everything other people typed is escaped before it is shown.
- The pages refuse to run inside another site's frame (clickjacking).
- Profile photos never leave the person's device.

**Limits against abuse:**

| Action | Limit |
|---|---|
| Posting plans | 10 a day |
| Join requests | 50 a day |
| Chat messages | 20 a minute |
| Reports | 20 a day |
| Check attempts | 30 an hour (simulated), 10 an hour (live) |
| Plan dates | Within a year |

Sign-in, sign-up and email limits come from Supabase Auth.

**Consent is recorded:** the profile consent (version and time), and consent with every face or ID check attempt.

**Deleting a user** in Authentication → Users deletes their profile, plans, requests, notifications, ratings and
check results.

## What the review found and fixed

| # | Problem | Fix |
|---|---|---|
| 1 | The browser could mark its own face and ID checks as passed | Only server-side functions set `face` / `kyc`; `save_profile` ignores them |
| 2 | Names and plan text from other people would be shown as HTML in the chat member list (script injection) | Escaped; every insertion point was audited |
| 3 | One member could store a bad "muted" setting and break sending messages for the whole group chat | Settings are compared as text, never converted |
| 4 | Gender is self-declared, so anyone could set "Woman" and browse women-only plans | Audience-limited plans are only shown after the ID check; gender and date of birth are locked after it |
| 5 | Email sign-ups could claim someone else's email and see their old beta sign-up details | Prefill only for Google sign-ins, or when you turn it on after enabling "Confirm email" |
| 6 | Demo account passwords were in the website source | Demo accounts are real Supabase accounts; passwords live only in Supabase |
| 7 | Supabase's default grants would have let the browser call internal functions | All grants are taken away first, then given back one function at a time; tested |
| 8 | Inline scripts were allowed, weakening protection against injected scripts | All scripts moved to files; the page policy no longer allows inline scripts |
| 9 | The app could be framed by another site | Pages hide themselves when framed by another site |
| 10 | A live face check would create an AWS session before checking limits (running up costs) | Limits are checked first (`verify_precheck_service`) |
| 11 | No record of consent for profile data and face scans | Recorded with version and time |
| 12 | Deleting a user left their data behind | Deleting the login deletes their data |
| 13 | Loose ID checks, unlimited dates, helper functions without a fixed `search_path`, messages sent to `*` | Strict checks, 1-year limit, `search_path` set on every function, messages only to the site itself |

The fixes are covered by automated tests: 96 database checks and 28 browser checks. These include checking that
the browser gets "permission denied" on tables and internal functions.

## Settings to keep in Supabase

- **Confirm email** on, with your own SMTP (see SETUP-APP.md), before real testers join.
- **Minimum password length** 8 or more.
- **Redirect URLs** limited to your site (SETUP-APP.md step 3).
- Make the three demo accounts **before** sharing the link.
- A **long dashboard password** (16+ random characters) in `admin_secret`. Wrong guesses are slowed down but not
  locked out.
- Never put the `service_role` / `sb_secret_…` key or AWS keys in website files.

## Known limits

- **Checks are simulated for now.** Until `face_check` and `id_check` are `live`, anyone passes, so "verified"
  means nothing yet. That includes the women-only protection in point 4.
- GitHub Pages can't send security headers, so the page policy is set in the page itself. That covers scripts but
  not everything a server header could (for example `frame-ancestors`; the frame guard script covers that instead).
- The app keeps the login in the browser's storage (Supabase's default). Protection against injected scripts is
  therefore what keeps logins safe; keep escaping everything shown on screen.
- Reports and human review are handled by you. There are no automatic bans.
- Have a lawyer review the consent and privacy text before real users join (see face-scan.md, "Legal ground rules").

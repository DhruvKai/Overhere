# Login with Google (and email): plan

**Status:** the code is built. Only steps 1 and 2 (your Google and Supabase settings) are left.

Goal: let people sign in with Google or an email link instead of typing their details into an
anonymous form. It runs on Supabase Auth, which the site already uses, and costs nothing at beta scale.

## Cost

| Provider | Cost | Notes |
|---|---|---|
| **Google** | Free | Recommended. Almost everyone has an account. |
| **Email magic link** | Free | Recommended as the fallback. Supabase's built-in email is heavily rate-limited, so connect a free SMTP sender (Resend or Brevo). |
| Facebook, GitHub, Discord, Microsoft | Free | Each needs its own developer app. Not needed for now. |
| Apple | About $99/year | Needs a paid Apple Developer account. Only required for an iOS app that offers other logins. |
| Phone OTP (SMS) | Paid per SMS | Needs Twilio or MSG91. Skip for now. |

Supabase's free plan includes 50,000 monthly active users for auth. Google does not charge for basic sign-in
(`openid`, `email`, `profile`).

**Plan:** Google + email magic link.

## Step 1: Google Cloud Console (needs your Google account)

Go to <https://console.cloud.google.com>.

1. Create a project, for example "Overhere".
2. Go to **APIs & Services → OAuth consent screen**.
   - User type: **External**.
   - Fill in the app name, support email, home page and privacy policy link.
   - Scopes: only `openid`, `email`, `profile`. These are non-sensitive, so Google does not need to review the app.
   - Set the publishing status to **In production**. In "Testing" mode only 100 listed test users can sign in.
3. Go to **Credentials → Create credentials → OAuth client ID → Web application**.
   - Authorized JavaScript origins: the live site URL, and `http://localhost:8000` for testing.
   - Authorized redirect URI: `https://ctkfyxwtssmmeelslrig.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret**.

## Step 2: Supabase dashboard (needs your Supabase account)

1. Go to **Authentication → Sign In / Providers → Google**. Turn it on and paste the Client ID and Client Secret.
2. Go to **Authentication → Sign In / Providers → Email**. Keep it on and enable magic links.
3. Go to **Authentication → Emails → SMTP Settings**. Connect a free SMTP sender (Resend or Brevo) so magic
   links are not throttled.
4. Go to **Authentication → URL Configuration**.
   - Site URL: `https://dhruvkai.github.io/Overhere/demo.html`
   - Redirect URLs: `https://dhruvkai.github.io/Overhere/**` and `http://localhost:8000/**`
   (the same as [SETUP-APP.md](SETUP-APP.md) step 3; skip if already done)

## Steps 3 and 4: code and database (done)

Both are built. The app (`demo.html`, `app.js`) has sign-in with email and password, "Continue with Google",
and "Forgot password". The database side is in `schema-app.sql` (see [SETUP-APP.md](SETUP-APP.md)).
Once steps 1 and 2 are done, the Google button works with no code changes.

Someone who signed up with the old beta form and then signs in with Google using the same email gets their
profile filled in from that sign-up.

## Testing

- Login does **not** work from a file opened directly (`file://`). Run a local server from the `web` folder:
  `python -m http.server 8000`, then open `http://localhost:8000`.
- Try: Google sign-in → form prefilled → submit → row appears in `participants` with a `user_id`.
- Try: email link → click link in inbox → same result.
- Try: sign out → sign back in → the app recognises the existing profile instead of asking again.

## Things to know

- **The Google consent screen shows `ctkfyxwtssmmeelslrig.supabase.co`**, not your own domain. Fixing that
  needs a Supabase custom domain, which is paid. The free alternative is Google's own "Sign in with Google"
  button with `sb.auth.signInWithIdToken(...)`, which keeps people on your page. It is a bit more code.
- **Gender is still self-declared.** Google does not share gender, so login does not stop someone picking a
  different gender to see women-only plans. The ID check (KYC) is where that should be verified.
- **Login makes shared activities possible.** Today every demo account keeps its own activities in the
  browser, so an activity Kajal posts never reaches Arjun. With real user IDs, activities can live in a
  Supabase table, and the women-only rule can be enforced by the database, not just the page.

## Who does what

| Step | Who |
|---|---|
| 1. Google Cloud Console setup | You (needs your Google account) |
| 2. Supabase dashboard setup | You (needs your Supabase account) |
| 3. Login code in the app | Done |
| 4. Database changes | Done (`schema-app.sql`, you run it once: see SETUP-APP.md) |

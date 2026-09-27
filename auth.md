# Login with Google (and email): plan

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
   - Site URL: the live site, for example `https://your-site.example/`
   - Redirect URLs: the live site URL and `http://localhost:8000/**`

## Step 3: Code changes in `index.html`

Load the Supabase client from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

Create one client, using the project URL *without* `/rest/v1/`:

```js
const sb = supabase.createClient('https://ctkfyxwtssmmeelslrig.supabase.co', CFG.SUPABASE_ANON_KEY);
```

Add a "Continue with Google" button and an email field for the magic link:

```js
// Google
sb.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: location.origin + location.pathname }
});

// Email magic link
sb.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: location.origin + location.pathname }
});
```

When the person comes back from Google or the email link, the session is picked up automatically:

```js
sb.auth.onAuthStateChange((_event, session) => {
  if (!session) return;
  const u = session.user; // u.email, u.user_metadata.full_name, u.user_metadata.avatar_url
  // Prefill name + email, hide the email field, show the rest of the sign-up form.
});
```

Google only gives name, email and photo. The form still asks for **date of birth, gender, neighbourhood,
interests and availability**, and the consent box.

Replace the raw `fetch` inserts with the client, so the user's login token is sent along:

```js
await sb.from('participants').insert(row);
```

Also add a "Sign out" link (`sb.auth.signOut()`).

## Step 4: Database changes (`schema.sql`)

Link each row to the signed-in user, and only let people write their own rows:

```sql
alter table participants add column if not exists user_id uuid default auth.uid() references auth.users on delete cascade;
alter table feedback     add column if not exists user_id uuid default auth.uid() references auth.users on delete cascade;
alter table events       add column if not exists user_id uuid default auth.uid() references auth.users on delete cascade;

create unique index if not exists participants_user_uq on participants (user_id);

-- Replace the anon insert policies with signed-in ones
drop policy if exists "anyone can sign up"       on participants;
drop policy if exists "anyone can send feedback" on feedback;

create policy "sign up as yourself"   on participants for insert to authenticated with check (user_id = auth.uid());
create policy "read your own profile" on participants for select to authenticated using (user_id = auth.uid());
create policy "edit your own profile" on participants for update to authenticated using (user_id = auth.uid());
create policy "send your own feedback" on feedback    for insert to authenticated with check (user_id = auth.uid());
```

Existing rows keep `user_id = null` and stay readable only from the dashboard, as they are today.
Deleting a user in **Authentication → Users** then also removes their profile, feedback and events.

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
| 3. `index.html` login code | Claude |
| 4. `schema.sql` changes | Claude writes it, you run it in the Supabase SQL editor |

# Switching the app to Supabase (accounts and shared plans)

The app (`demo.html`) now keeps everything in Supabase: accounts, profiles, plans, join requests, group
chats and notifications. Everyone sees the same plans, so a women-only plan Kajal posts really is hidden
from Arjun. The website itself stays on GitHub Pages; Supabase can't host web pages.

**Time:** about 30 minutes. **Cost:** free (Supabase free plan).

> **Order matters.** Do steps 1 to 4 in Supabase **before** publishing the new files (step 5).
> The new app can't work until the database part exists.

---

## 1. Create the tables (paste one file)

1. Supabase → **SQL Editor** → **New query**.
2. Open `schema-app.sql` from this folder, copy all of it, paste, click **Run**.
3. You should see **Success. No rows returned.**
4. **Table Editor** now shows new tables: `profiles`, `activities`, `requests`, `messages`, `notifications`
   and a few more. `profiles` has 12 sample people and `activities` about 47 sample plans.

It is safe to run the file again later (for example after an update): it replaces the functions and never
adds the sample people and plans twice.

## 2. Email sign-in settings

1. **Authentication → Sign In / Providers → Email**:
   - **Enable Email provider**: on.
   - **Confirm email**: on. People must click a link in their email before they can sign in.
   - **Minimum password length**: 8 or more.
2. Connect an email sender (**Resend**, step 2a below). Without it, Supabase only sends emails to the members of
   your Supabase team, and only a few an hour, so testers would never get their confirmation link.

> Want to try the app before setting up SMTP? You can switch **Confirm email** off for a while. Anyone can then
> sign up with any email address, which is fine for a closed test. Switch it back on before real testers join.

> **Testing with no domain and no Twilio.** Resend needs a domain you buy, and SMS needs Twilio or MSG91. For a
> closed test you can skip both:
> 1. Do **2b (Google sign-in)**. It's free and sends no emails, so it needs no domain.
> 2. In step 2 above, switch **Confirm email** off, so email-and-password sign-ups work without any email being sent.
>    **Forgot password** emails still won't reach testers, so tell them to use Google.
> 3. Skip **2a** and leave phone sign-up off (`PHONE_LOGIN: false` in `config.js`, the default).
>
> Before real testers join: buy the domain, do 2a, and switch **Confirm email** back on.

## 2a. Send the emails through Resend

Supabase sends four kinds of email: the sign-up confirmation link, password reset, magic link and email change.
Resend delivers them from your own address (for example `no-reply@mail.overhere.in`) so they reach inboxes
instead of spam.

**Time:** about 20 minutes, plus up to a few hours waiting for DNS. **Cost:** Resend's free plan is 3,000 emails
a month and 100 a day, which is plenty for a beta. Check <https://resend.com/pricing> for current limits.

### You need your own domain

Resend only sends from a domain you own and have verified. Its test address `onboarding@resend.dev` can only
send to **your own** Resend login email, so testers would still get nothing. `dhruvkai.github.io` belongs to
GitHub, not you, so it can't be used.

If you don't have a domain yet, buy one (about ₹700–1,200 a year for `.in` or `.com`) from Cloudflare Registrar,
Namecheap, GoDaddy or similar. The website can stay on GitHub Pages; the domain is only used for email here.

### Step 1: Resend account and domain

1. Sign up at <https://resend.com> and confirm your email.
2. **Domains → Add Domain**. Use a subdomain just for email, for example `mail.overhere.in`. That keeps the app's
   emails separate from anything else you send from the main domain, so one can't hurt the other's reputation.
   Pick the region closest to India that Resend offers.
3. Resend shows 3 or 4 DNS records. Keep that page open.

### Step 2: Add the DNS records

Log in wherever the domain's DNS is managed (usually the place you bought it) and add **exactly** the records
Resend shows. They look like this, but copy the real values from Resend:

| Type | Name (host) | Value | Why |
|---|---|---|---|
| MX | `send.mail` | `feedback-smtp.<region>.amazonses.com`, priority `10` | Bounces come back to Resend |
| TXT | `send.mail` | `v=spf1 include:amazonses.com ~all` | SPF: Resend may send for this domain |
| TXT | `resend._domainkey.mail` | a long `p=MIIGfMA0…` key | DKIM: proves the email wasn't changed |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | DMARC: Gmail and Yahoo expect it. Add it yourself if Resend doesn't list it |

Things that commonly go wrong:
- Most DNS panels add your domain to the name for you. Type `send.mail`, **not** `send.mail.overhere.in`,
  or you end up with `send.mail.overhere.in.overhere.in`.
- On Cloudflare, leave these records as **DNS only** (grey cloud).
- Paste the DKIM value in one piece, without quotes or spaces added.

Back in Resend, click **Verify DNS records**. It usually turns **Verified** within minutes, sometimes a few hours.
Don't continue until it does: emails from an unverified domain are refused.

### Step 3: API key

1. Resend → **API Keys → Create API Key**.
2. Name `supabase-auth`, permission **Sending access**, domain: the one you just verified.
3. Copy the key (`re_…`). Resend shows it **only once**. It goes into Supabase next and nowhere else: never into
   `config.js`, the website, or GitHub.

### Step 4: Supabase SMTP settings

Supabase → **Authentication → Emails → SMTP Settings** → turn on **Enable custom SMTP**:

| Field | Value |
|---|---|
| Sender email | `no-reply@mail.overhere.in` (any name, but it must be **on the verified domain**) |
| Sender name | `Overhere` |
| Host | `smtp.resend.com` |
| Port | `465` (if it fails, try `587`) |
| Minimum interval per user | `60` seconds (stops one person triggering a flood of emails) |
| Username | `resend` (this exact word) |
| Password | the `re_…` API key from step 3 |

Click **Save**.

> **Shortcut:** Resend has a Supabase integration (Resend → **Settings → Integrations → Supabase**) that fills in
> these fields for you. Either way works, as long as you end up with the values above.

### Step 5: Raise the email limit

With custom SMTP on, Supabase allows 30 auth emails an hour to start with. For a beta launch day that can be too
few. **Authentication → Rate Limits → Rate limit for sending emails**: set it to about `100` an hour, and keep it
under Resend's daily limit.

### Step 6: Make the emails look like yours (optional)

**Authentication → Emails → Templates**. For **Confirm signup**, **Reset password**, **Magic link** and
**Change email address**, change the subject and text to mention Overhere, for example the subject
"Confirm your Overhere account". Keep the `{{ .ConfirmationURL }}` placeholder in each one: that's the link.

### Step 7: Test it

1. In a private window, **Create an account** in the app with an address that isn't on your Supabase team, such
   as a second Gmail.
2. The confirmation email should arrive within a minute, from `Overhere <no-reply@mail.overhere.in>`, in the
   inbox and not spam. Click the link: you land back in the app, signed in.
3. Try **Forgot password** too.
4. Resend → **Emails** lists every email with its status: *Delivered*, *Bounced* or *Complained*.
5. For a spam score, sign up once using the address shown at <https://www.mail-tester.com> and open its report.
   8/10 or more is fine.

| Problem | Fix |
|---|---|
| App says "Error sending confirmation email" | SMTP details are wrong. Check the username is `resend`, the password is the whole key, and try port `587`. |
| Resend says "domain is not verified" | The sender email isn't on the verified domain, or the DNS check hasn't finished. |
| Email arrives in spam | Add the DMARC record, fill in the templates with real text, and give new domains a few days to build a reputation. |
| Nothing arrives, and Resend lists no email | Supabase's rate limit was hit (step 5), or custom SMTP isn't switched on. |

## 2b. Google sign-in

The **Continue with Google** button is already in the app, on both the sign-in and sign-up screens. Tapping it the
first time creates the account, so it's sign-up and sign-in in one. It only needs switching on in Google and Supabase.

**Time:** about 15 minutes. **Cost:** free. **Needs:** a Google account. No domain, no emails.

### Step 1: Google Cloud project

1. Go to <https://console.cloud.google.com> and sign in with your Google account.
2. Project picker at the top → **New project** → name `Overhere` → **Create**. Make sure it's selected in the picker.

### Step 2: Consent screen (what people see when they pick their Google account)

1. Menu → **APIs & Services → OAuth consent screen**. This opens **Google Auth Platform**. Click **Get started**.
   (Older consoles show a single "OAuth consent screen" form instead; the fields are the same.)
2. **App information:** app name `Overhere`, user support email: your Gmail.
3. **Audience:** **External**.
4. **Contact information:** your email. Tick the agreement → **Create**.
5. **Don't upload a logo for now.** A logo means Google has to review the app, which takes days. Home page and
   privacy policy links are optional; leave them empty while testing.
6. **Data access / scopes:** add nothing. Supabase only asks for the basic ones (`openid`, email, profile), which
   need no review.

### Step 3: Let testers in

New apps start in **Testing** mode, where only Google accounts you list can sign in. Choose one:

- **Publish it (recommended):** **Audience → Publish app → Confirm**. The status becomes **In production** and
  anyone with a Google account can sign in. With only the basic scopes, Google doesn't review it first.
- **Keep it in Testing:** **Audience → Test users → Add users**, and add each tester's Gmail (up to 100).
  Anyone not on the list gets "Access blocked".

### Step 4: Client ID and secret

1. **Clients** (older consoles: **Credentials → Create credentials → OAuth client ID**) → **Create client**.
2. Application type: **Web application**. Name: `Overhere Supabase`.
3. **Authorized JavaScript origins:** `https://dhruvkai.github.io` and `http://localhost:8000`.
4. **Authorized redirect URIs:** `https://ctkfyxwtssmmeelslrig.supabase.co/auth/v1/callback`
   This must be exact. Supabase shows the same address on its Google page (next step) as **Callback URL**; copy it
   from there if in doubt.
5. **Create**. Copy the **Client ID** (ends in `.apps.googleusercontent.com`) and the **Client secret** (`GOCSPX-…`)
   now. Newer consoles show the secret only once; if you lose it, add a new secret on the same client.

The secret goes into Supabase only. Never put it in `config.js`, the website or GitHub.

### Step 5: Supabase

1. **Authentication → Sign In / Providers → Google** → switch **Enable Sign in with Google** on.
2. **Client IDs:** paste the Client ID. **Client Secret (for OAuth):** paste the secret. **Save**.
3. Do **step 3 (Web addresses)** below if you haven't yet. Google sends people back to Supabase, and Supabase sends
   them on to the site only if the site's address is in the Redirect URLs.

### Step 6: Test it

1. Open the site in a private window → **Try it** → **Continue with Google** → pick an account.
2. You come back to the site, signed in, at the profile form. If this Gmail filled in the old beta sign-up form,
   the form is already filled in from it.
3. Sign out, then **Continue with Google** again: you're back in the same account, straight past the profile form.
4. Supabase → **Authentication → Users** lists the person with **Google** as the provider.

Google's screen says "to continue to **ctkfyxwtssmmeelslrig.supabase.co**", not Overhere's address. That's normal on
the free plan, and fine for testing. [auth.md](auth.md) has the ways around it.

| Problem | Fix |
|---|---|
| Google says **Error 400: redirect_uri_mismatch** | The redirect URI in step 4 doesn't exactly match Supabase's Callback URL. Check for `http` vs `https`, a missing `/auth/v1/callback`, or a trailing slash. |
| **Access blocked** or **403 access_denied** | The app is still in Testing and this account isn't a test user. Publish it or add them (step 3). |
| The app says **provider is not enabled** | The Google switch in Supabase is off, or wasn't saved (step 5). |
| You come back to the sign-in screen, or to the wrong page | The site isn't in **Redirect URLs** (step 3 below), or **Site URL** is wrong. |
| It works on your computer but not for testers | Usually Testing mode (see above). |

## 3. Web addresses

**Authentication → URL Configuration**:

- **Site URL**: `https://dhruvkai.github.io/Overhere/demo.html`
- **Redirect URLs**: add `https://dhruvkai.github.io/Overhere/**` and `http://localhost:8000/**`

(Use your own address if the site lives somewhere else.) Email links and Google sign-in only ever send people
back to these addresses.

## 4. The demo accounts (Kajal, Arjun, Neha)

These are now real accounts. Make them **before** you share the link, so nobody else can take the addresses.

1. **Authentication → Users → Add user → Create new user**.
2. Email `kajal@overhere.test`, a long password you keep somewhere safe, tick **Auto Confirm User**, **Create user**.
3. Repeat for `arjun@overhere.test` and `neha@overhere.test`.

The first time each signs in, their profile is filled in automatically (Kajal and Arjun are ID-verified,
Neha is new). The page at `index.html#admin` lists these emails. The passwords are no longer in the website
code; they only exist in Supabase.

## 5. Publish

Put the new files on GitHub (commit and push, or upload them in the GitHub website). GitHub Pages updates
within a minute or two. Files to include: `demo.html`, `app.js`, `head.js`, `site.js`, `index.html`, `sw.js`,
the `addmin` folder, `schema-app.sql` and the `.md` guides. The `supabase` and `face-widget` folders are the
real face scan, for later (see [face-scan.md](face-scan.md)).

## 6. Test it (important)

Use two browsers, or one normal and one private window.

1. Window A: open the site, **Try it**, sign in as **kajal@overhere.test**. You land on Swipe with sample plans.
2. Post a plan: **Create Activity**, untick **Everyone**, tick **Woman**, fill it in, **Post activity**.
3. Window B: sign in as **arjun@overhere.test**. Kajal's plan must **not** appear, in Swipe or Discover.
4. Window B: sign out, then **Create an account** with your own email. Confirm the email, fill in the profile
   (pick Woman), do the face check. Discover says some plans are only open to certain groups: tap
   **Verify your ID** and do the (simulated) ID check. Kajal's plan now appears. Ask to join.
5. Window A: a notification says someone wants to join. Open the plan (**Activities**), **Accept**, open the
   group chat and say hi. Window B sees it within a few seconds.

If all of that works, the switch is done.

## What changed for testers

- They make an account inside the app: email and password, Google once step 2b is
  done, or a phone number once SMS is set up (next section). The old sign-up form on the front page is gone.
- The **face check and ID check are still simulated**: anyone passes. They are built so a real provider can be
  switched on later without changing the app (see [face-scan.md](face-scan.md)).
- The 12 sample hosts' plans keep moving forward so the app never runs empty. Sample hosts say yes to join
  requests straight away. Real people's plans work normally.
- Profile photos stay on the person's own device; other people see their emoji.
- The demo tools (time travel, "simulate a request") are gone, because other people are real now.

## Sign-up with a phone number (SMS codes)

**Status:** built in the app, but **switched off** until you set up SMS. Do one of the routes below, then
**Turn it on** at the end of this section. The cost comparison and India's SMS rules are in [otp.md](otp.md).

How it works for people: on the sign-in screen they tap **Continue with phone**, type their 10-digit mobile number,
and get a 6-digit code by SMS. Typing the code signs them in. If the number is new, that also creates the account,
so there is no separate sign-up form: after the code they go through the same profile and face check as everyone
else. There is no password. Each time they sign in on a new device they get a new code.

Supabase does the hard part: it makes the 6-digit code, stores it, checks it, and handles expiry and resending.
You only choose **who delivers the SMS**.

### Choose a route

| | **A. Twilio Verify** | **B. MSG91 (Indian provider)** |
|---|---|---|
| Cost per code | about ₹4–5 | about ₹0.15–0.25 + GST |
| Paperwork | None. Twilio handles India's DLT rules | DLT registration: needs a registered business (PAN + GST), ₹5,900 one-time, 3–7 days |
| Setup | 15 minutes, all in dashboards | About an hour, plus a small Edge Function |
| Good for | A closed beta, or starting now | Real launch, when cost matters |

**Recommendation:** start with **A** if the business isn't registered yet, and move to **B** once DLT is approved.
The app code is the same for both, so switching later only changes settings.

### Route A: Twilio Verify

1. **Twilio account.** Sign up at <https://www.twilio.com> and verify your own phone number. Then **upgrade** the
   account (add a card and some credit, $20 is plenty). A trial account only sends to numbers you verified yourself.
2. **Keys.** Twilio Console home → **Account Info**: copy the **Account SID** (`AC…`) and **Auth Token**.
3. **Verify service.** **Explore Products → Verify → Services → Create new**:
   - Friendly name: `Overhere` (this is what people see: "Your Overhere verification code is 123456").
   - Channel: **SMS** only.
   - Copy the **Service SID** (`VA…`).
4. **Block other countries.** **Messaging → Settings → Geo permissions** and the Verify service's **Geo
   permissions**: allow **India** only. That stops "SMS pumping", where bots ask for codes to expensive foreign
   numbers and you pay for them. Leave **Fraud Guard** on (it is by default).
5. **Supabase.** **Authentication → Sign In / Providers → Phone**:
   - **Enable Phone provider**: on.
   - **SMS provider**: **Twilio Verify**.
   - Paste the Account SID, Auth Token and Verify Service SID. **Save**.

With Twilio Verify, Twilio makes and checks the code, so the Supabase fields for code length, expiry and message
text don't apply.

### Route B: MSG91 through a Send SMS hook

Supabase makes the code, then calls a small Edge Function of yours with the phone number and the code. The function
sends it through MSG91.

**1. DLT registration (you, needs business papers).** Follow the DLT part of [otp.md](otp.md): register the business
(Principal Entity), a 6-letter sender header such as `OVRHRE`, and an OTP template such as:

```
{#var#} is your Overhere verification code. It expires in 5 minutes. Don't share it with anyone.
```

Then bind MSG91 as your telemarketer on the DLT portal.

**2. MSG91 (you).**
1. Sign up at <https://msg91.com> and finish their KYC.
2. Add your DLT **sender ID** and **template**: paste the DLT template ID, and write the text **exactly** as
   registered on DLT, with `##otp##` where DLT has `{#var#}`. A single changed character and the SMS is silently dropped.
3. Copy the MSG91 **template ID** and your **Auth key** (top-right menu → **Authkey**).

**3. Supabase phone settings.** **Authentication → Sign In / Providers → Phone**: turn it on, **SMS OTP expiry**
`300` seconds, **SMS OTP length** `6`. Once the hook (step 5) is on, Supabase uses it in place of the SMS provider
chosen there.

**4. The Edge Function.** Save this as `supabase/functions/send-sms/index.ts`:

```ts
// Sends the code that Supabase Auth made, by SMS through MSG91 (the "Send SMS" auth hook).
// Supabase makes, stores and checks the code; this only delivers it. Only Indian mobile numbers are sent to,
// which stops bots running up a bill by asking for codes to expensive foreign numbers.
import { Webhook } from 'npm:standardwebhooks@1.0.0';

const env = (k: string) => {
  const v = Deno.env.get(k);
  if (!v) throw new Error(`Missing secret ${k}`);
  return v;
};
const fail = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: { http_code: status, message } }), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  const payload = await req.text();
  let data: { user: { phone: string }; sms: { otp: string } };
  try {
    // Only Supabase knows the hook secret, so this proves the call came from your project.
    data = new Webhook(env('SEND_SMS_HOOK_SECRET').replace('v1,whsec_', ''))
      .verify(payload, Object.fromEntries(req.headers)) as typeof data;
  } catch {
    return fail('Not from Supabase', 401);
  }
  const phone = data.user.phone.replace(/\D/g, '');
  if (!/^91[6-9]\d{9}$/.test(phone)) return fail('Only Indian mobile numbers (+91) are supported');

  const r = await fetch('https://control.msg91.com/api/v5/flow', {
    method: 'POST',
    headers: { authkey: env('MSG91_AUTH_KEY'), 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ template_id: env('MSG91_TEMPLATE_ID'), short_url: '0', recipients: [{ mobiles: phone, otp: data.sms.otp }] }),
  });
  const out = await r.json().catch(() => ({}));
  if (!r.ok || out.type === 'error') {
    console.error('MSG91 refused', r.status, JSON.stringify(out));
    return fail('Could not send the SMS. Please try again.', 500);
  }
  return new Response('{}', { headers: { 'Content-Type': 'application/json' } });
});
```

The `otp` key in `recipients` must match the variable name in your MSG91 template (`##otp##` → `otp`). Check
it against MSG91's current API docs before going live. Their API changes now and then.

**5. Connect the hook.**
1. Supabase → **Authentication → Hooks → Add hook → Send SMS hook**.
2. Type: **HTTPS**. URL: `https://ctkfyxwtssmmeelslrig.supabase.co/functions/v1/send-sms`.
3. Click **Generate secret** and copy it (it starts with `v1,whsec_`). Don't save the hook yet.
4. Deploy from the `web` folder (same setup as [face-scan.md](face-scan.md) step 5):
   ```
   npx supabase login
   npx supabase link --project-ref ctkfyxwtssmmeelslrig
   npx supabase secrets set SEND_SMS_HOOK_SECRET='v1,whsec_...' MSG91_AUTH_KEY=... MSG91_TEMPLATE_ID=...
   npx supabase functions deploy send-sms --no-verify-jwt
   ```
   `--no-verify-jwt` is needed because Supabase Auth calls the function with the hook signature, not a signed-in
   person's login. The signature check in the code does the protecting.
5. Back in the hook form, **Create** / **Save**, and make sure the hook is switched on.

Supabase waits only a few seconds for the hook. If MSG91 is slow or down, the person sees an error and can tap
resend.

### For both routes

- **Test numbers (free).** **Authentication → Sign In / Providers → Phone → Test phone numbers and OTPs**: add lines
  like `919999900001=123456`. Those numbers never get a real SMS; the code is always the one you set. Use them for
  everyday testing so it costs nothing. Each test number is its own account; it isn't linked to the Kajal, Arjun or
  Neha email accounts.
- **Cap the cost.** **Authentication → Rate Limits → SMS messages sent per hour**: start at `30` for the whole
  project. Supabase also makes each person wait 60 seconds between codes.
- **CAPTCHA, later.** **Authentication → Attack Protection → CAPTCHA** (Cloudflare Turnstile, free) blocks bots
  that request codes. **Don't switch it on yet.** Once it's on, *every* sign-in, including email and password,
  must send a CAPTCHA token, and the app doesn't do that yet. Ask Claude to add Turnstile to the app first.
- **One account per number.** Supabase allows a phone number on only one account, so nothing extra is needed.

### Turn it on

The **Continue with phone** button is hidden until you switch it on, so testers never see a button that can't
send anything yet.

1. Finish Route A or Route B, and add at least one test number (above).
2. In `config.js`, change `PHONE_LOGIN: false` to `PHONE_LOGIN: true`.
3. Publish (commit and push). The button appears on the sign-in and sign-up screens, under **Continue with Google**.

To switch it off again, set it back to `false`. People who already signed up with a phone can't sign in while it's
off, so only do that briefly.

### What the app does

- The number box has a fixed `+91` in front and accepts only Indian mobile numbers: 10 digits, starting with 6–9.
  Spaces, a leading `0` or a typed `91` are removed.
- **Send code** calls `signInWithOtp({ phone })`. Supabase creates the account on the first code if the number is new.
- The code box works with SMS autofill (`autocomplete="one-time-code"`). Once 6 digits are in, it checks them by
  itself; **Verify** does the same. That calls `verifyOtp({ phone, token, type: 'sms' })`.
- **Resend code** counts down 60 seconds first, matching Supabase's limit. **Change number** goes back a step.
- If Supabase refuses, the person sees a plain message, not an error code (see the table below).

### Things to know about phone accounts

- **A phone account and an email account are two different accounts.** Someone who signed up with email and later
  taps **Continue with phone** gets a new, empty account; Supabase doesn't join them. Tell testers to keep using
  the way they signed up.
- **Phone accounts have no email or password,** so **Forgot password** doesn't apply to them: they just ask for a new code.
- **No pre-filled profile.** Details from the old beta sign-up form are matched by email, so phone sign-ups fill in
  the profile themselves.
- **Finding someone:** **Authentication → Users** shows the phone number in the list, in place of an email.
  Deleting a user works the same way as for email accounts.
- **Checking the phone of an email account** (the MVP scope's "email plus a verified phone") is a different feature
  and isn't built. It would use `updateUser({ phone })` and `verifyOtp({ type: 'phone_change' })`. Ask Claude if you want it.

### Test it

1. With `PHONE_LOGIN: true`, open the site in a private window: **Continue with phone** is under the Google button.
2. A test number from above: type the code you set. You land in the profile form as a new person, and no SMS is
   sent or paid for. Sign out and sign in with the same number and code: you're back in the same account.
3. Your real phone: the SMS arrives within about 10 seconds, and the code fills in and signs you in.
4. A wrong code is refused, and so is an old one (after 5 minutes on the MSG91 route; Twilio Verify sets its own expiry).
5. **Resend code** is greyed out with a countdown for the first 60 seconds.
6. A number that isn't Indian or isn't 10 digits is refused before anything is sent.
7. Twilio → **Monitor → Logs**, or MSG91 → **Reports**, shows each SMS and whether it was delivered.

| The app says | Likely cause and fix |
|---|---|
| "Phone sign-in isn't switched on yet" | The Phone provider is off in Supabase (**Authentication → Sign In / Providers → Phone**). |
| "We couldn't send the SMS" (Twilio) | Wrong Account SID, Auth Token or Service SID, the account is still a trial, or India isn't allowed in Geo permissions. |
| "We couldn't send the SMS" (MSG91) | Look at the Edge Function logs (**Edge Functions → send-sms → Logs**): a missing secret, a wrong hook secret (401), or MSG91's reply. |
| Code sent, but no SMS arrives (MSG91) | The text doesn't match the DLT template exactly, or the header isn't approved yet. Check MSG91's delivery report for the DLT error. |
| "That code is wrong or has expired" | A typo, or the code is too old. Tap **Resend code**. |
| "For security purposes, you can only request this after … seconds" | They asked again too soon. Wait for the countdown. |
| A rate-limit message for everyone | The project's hourly SMS cap was hit. Raise **SMS messages sent per hour**, or wait. |
| No **Continue with phone** button | `PHONE_LOGIN` is still `false` in `config.js`, or the new `config.js` isn't published yet. |

## People who signed up with the old form

Their details are still in `participants`. When one of them makes an account **with Google** using the same
email, the profile form is filled in from their sign-up. For email-and-password accounts this is off by
default, because without **Confirm email** anyone could type someone else's email and see their details. Once
**Confirm email** is on (step 2), you can switch it on:

```sql
update app_config set v = 'on' where k = 'prefill_email_signups';
```

## Settings you can change (SQL Editor)

| Setting | Values | What it does |
|---|---|---|
| `face_check` | `simulated` / `live` | `live` uses the real face scan (only after following [face-scan.md](face-scan.md)) |
| `id_check` | `simulated` / `live` | Same for the ID check (not connected yet) |
| `prefill_email_signups` | `off` / `on` | See above |

```sql
update app_config set v = 'live' where k = 'face_check';
```

## Everyday use

| I want to… | Do this |
|---|---|
| See people who failed a check 5 times | `/addmin`, **Needs human review** (Approve, or ask them to try again) |
| See reports | Table Editor → `reports` |
| Delete someone's account and data | Authentication → Users → the person → **Delete user**. Their profile, plans, requests and notifications go with it. Then delete their rows in `participants` and `feedback` as in GO-LIVE-GUIDE.md. |
| Back up | Free plan has no backups: export `profiles`, `activities`, `requests` and `messages` as CSV now and then |

## Free plan limits

A beta fits easily: 500 MB database (the app uses a few MB), 50,000 monthly users, 200 people with the app open
at the same moment for live updates. The project **pauses after a week with no activity**: open the Supabase
dashboard and click **Restore** if it happens.

## If something goes wrong

| Symptom | Likely cause and fix |
|---|---|
| App says "Open the live site" | It was opened as a file, or `config.js` is empty. Use the https address. |
| "Something there was not accepted" on every action | `schema-app.sql` wasn't run, or failed. Run it again (step 1). |
| Sign-up says to check email, but no email comes | SMTP isn't set up (step 2a), or look in spam. Resend → **Emails** shows whether it was sent. |
| "Please confirm your email first" | They haven't clicked the confirmation link yet. |
| Google sign-in comes back to the wrong page | Check the Redirect URLs (step 3). |
| Changes by others show up late | Live updates need Realtime: run `schema-app.sql` again; the app also re-checks every minute. |

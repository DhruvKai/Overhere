# Phone OTP in India: plan

Goal (from the MVP scope): at sign-up, the phone number is verified with a one-time code, alongside the email
link covered in [auth.md](auth.md). Researched September 2026. Prices change often, so re-check them
before paying for anything. US$ amounts are converted at about ₹88.

## Current prerequisites

Some of these depend on paperwork that takes days, so answer these first:

| Prerequisite | Needed for | Status |
|---|---|---|
| **A registered business** (PAN + GST, or at least a proprietorship with GST/Udyam) | SMS through your own DLT registration; WhatsApp business verification | ? |
| Supabase project (already have one) | All options | ✅ |
| Google login from [auth.md](auth.md) done first | So the phone number is attached to a signed-in user | ⬜ |
| A payment card on the provider account | All options except Truecaller | ? |
| A spare phone number not already on WhatsApp | WhatsApp OTP only | ? |

**Without a registered business**, the only practical options are Firebase Phone Auth or a provider that sends
from its own DLT-registered header. Both are listed below.

## India's rules for OTP SMS (TRAI DLT)

Every commercial SMS in India, OTPs included, has to go through the **DLT** (Distributed Ledger Technology)
registry that the telecom operators run. Messages that don't match a registered entity, header and template
are blocked.

| Item | What it is | Cost | Time |
|---|---|---|---|
| Principal Entity (PE) ID | Your business, verified with PAN/GST/incorporation papers, on one operator portal (Jio, Airtel, Vi or BSNL; valid across all) | About ₹5,900 incl. GST, one-time | 1–3 working days |
| Header (sender ID) | 6 letters, e.g. `OVRHRE`; OTP headers are transactional (`-T` suffix added automatically since May 2025) | Free on some operators, about ₹590/year on others | 1–3 working days |
| Template | The exact message text with `{#var#}` for the code; variables must be tagged by type (since Oct 2024) | Free | 1–3 working days |
| Telemarketer binding | Link your PE to your SMS provider (MSG91, etc.) on the portal | Free | Same day |

Other rules to know:
- Any link or phone number in the SMS must be whitelisted on DLT. Public shorteners (bit.ly etc.) are banned.
- The sent text must match the template exactly. A changed word or extra space gets the SMS silently dropped.
- Transactional OTP headers reach numbers on DND.

WhatsApp OTPs and Firebase Phone Auth **do not need your own DLT registration.**

## Options

| Option | Cost per OTP | Own DLT needed? | Prerequisites | Works with Supabase |
|---|---|---|---|---|
| **A. WhatsApp OTP** (Meta Cloud API) | ~₹0.12 (Meta's India authentication rate, US$0.0014); no markup if you use Meta directly | No | Meta Business account + business verification, a dedicated phone number, an approved authentication template, WhatsApp Business Account registered in India (otherwise the international rate of ~US$0.03 applies) | Yes, via the Send SMS hook |
| **B. MSG91 SMS** | ~₹0.15–0.25 + GST, cheaper with volume | Yes, unless MSG91 lets you use its own header (ask them) | DLT (above), MSG91 account, KYC with MSG91 | Yes, via the Send SMS hook |
| **C. Firebase Phone Auth** | US$0.01–0.07 per SMS depending on the source (≈₹1–6); check Google's current price list | No (Google sends it) | Google Cloud Blaze (pay-as-you-go) plan with a card, reCAPTCHA | Yes, as "third-party auth", but it is a second login system to maintain |
| **D. Truecaller SDK** | Free | No | Truecaller developer account, app key; mobile web SDK is Android only, and only users who have Truecaller | No, you verify the Truecaller token in an Edge Function |
| **E. Twilio Verify** | ~₹4–5 (US$0.05 per verification + ~₹0.45 per SMS) | Twilio handles it | Twilio account | Built in |

**Not recommended:** Twilio Verify. It is the easiest to switch on in Supabase, but costs about 20–30× more than
Indian providers.

## Recommendation

**If there is no registered business yet:** Firebase Phone Auth for the beta. There's no paperwork, and at ~1,000
sign-ups the bill is roughly ₹1,150–8,000, depending on Google's current India rate.

**Once the business is registered (preferred):**
1. **WhatsApp OTP first.** It is the cheapest, needs no DLT, and almost every Indian phone user has WhatsApp.
2. **SMS through MSG91 as the fallback** ("Didn't get it? Send by SMS"), once DLT is approved.
3. Optionally, **Truecaller** as a free one-tap option on Android.

### Rough monthly cost (1,000 new users, ~1.3 codes each)

| Setup | Cost |
|---|---|
| WhatsApp only | ~₹150 |
| WhatsApp + SMS fallback for 30% | ~₹230, plus ₹5,900 DLT one-time |
| MSG91 SMS only | ~₹260–390, plus ₹5,900 DLT one-time |
| Firebase only | ~₹1,150–8,000 |
| Twilio Verify | ~₹6,000 |

## How to build it (WhatsApp + MSG91 with Supabase)

Supabase makes the code, stores it, checks it and handles expiry. You only supply the delivery, through a
**Send SMS hook**: Supabase calls your Edge Function with the phone number and the code, and your function
sends it.

### 1. Provider setup (you)
- **WhatsApp:** at business.facebook.com, create a Business account and finish business verification. In the
  Meta developer dashboard, add the WhatsApp product, register the phone number, and create an **Authentication**
  template with a "Copy code" button. Generate a permanent access token (System User).
- **MSG91:** create an account, finish their KYC, register on DLT (PE → header → OTP template), and bind MSG91 as your
  telemarketer. Put the DLT template ID in MSG91.

### 2. Supabase (you)
- **Authentication → Sign In / Providers → Phone:** turn on.
- **Authentication → Hooks → Send SMS:** point it at the Edge Function below and copy the hook secret.
- **Authentication → Rate limits:** keep SMS per hour low (e.g. 30) to cap costs.
- **Authentication → Attack protection:** turn on CAPTCHA with Cloudflare Turnstile (free).

### 3. Edge Function `send-otp` (Claude)
- Verify the hook signature with the hook secret.
- Reject any number that doesn't start with `+91`. This blocks "SMS pumping" fraud, where bots trigger OTPs to
  expensive foreign numbers.
- Send the code on WhatsApp. If that fails (number not on WhatsApp), send it through MSG91 using the DLT template.
- Secrets (WhatsApp token, MSG91 key) are stored as Supabase secrets, never in the page.

### 4. Page code (Claude)
The person is already signed in with Google, so the phone is **added to their account**:

```js
// Send the code
await sb.auth.updateUser({ phone: '+91' + tenDigits });

// Check the code they type
await sb.auth.verifyOtp({ phone: '+91' + tenDigits, token: code, type: 'phone_change' });
```

UI: a +91 prefix, 10-digit input, a 6-box code input with `autocomplete="one-time-code"` (Android/iOS offer the code
from the SMS automatically), a 30-second resend timer, and a "Send by SMS instead" link.

### 5. Database (Claude)
- `participants.phone_verified_at timestamptz`, set once `verifyOtp` succeeds.
- One account per phone number: Supabase already enforces this for `auth.users.phone`.

## Testing
- Supabase lets you set **test phone numbers with fixed codes**, so tests don't cost anything.
- Check: WhatsApp delivery, SMS fallback on a number without WhatsApp, wrong code, expired code, resend limit,
  a non-+91 number being rejected.

## Who does what

| Step | Who |
|---|---|
| Decide: business registered? which option? | You |
| DLT, MSG91, Meta business verification | You (needs your documents) |
| Supabase settings | You |
| Edge Function, page code, database change | Claude |

## Sources
- [DLT registration guide 2026 (Message Central)](https://www.messagecentral.com/blog/a-complete-guide-on-dlt-registration)
- [India SMS rules & DLT (Message Central)](https://www.messagecentral.com/sms-guideline/india)
- [DLT registration guide (QuickAuth)](https://quickauth.in/blog/dlt-registration-guide-india)
- [MSG91 OTP pricing](https://msg91.com/in/pricing/otp)
- [SMS OTP pricing in India 2026 (Message Central)](https://www.messagecentral.com/blog/sms-otp-pricing-india)
- [WhatsApp API pricing 2026 (Authgear)](https://www.authgear.com/post/whatsapp-api-pricing/)
- [Firebase Auth pricing overview (Logto)](https://blog.logto.io/firebase-authentication-pricing)
- [Supabase phone login](https://supabase.com/docs/guides/auth/phone-login)
- [Supabase Send SMS hook with MSG91 (Medium)](https://medium.com/@shreebhagwat94/implementing-custom-sms-authentication-in-supabase-using-sms-hook-and-msg91-366d13acc81c)

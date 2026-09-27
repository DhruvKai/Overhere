# Face scan and ID check (KYC) in India: plan

Researched September 2026. Prices change often, so re-check them before signing up. US$ amounts are converted
at about ₹88. Indian KYC vendors don't publish rate cards, so their figures below are **estimates to confirm with
a quote**.

## What the MVP scope asks for

Two tiers of verification (from the Frozen MVP Scope document):

| Tier | When | What it proves | Unlocks |
|---|---|---|---|
| **1. Face scan** | Sign-up, after phone OTP | A real, live person, not a bot or a photo | Browsing (Swipe, Discover) |
| **2. ID check (KYC)** | First time someone posts or requests to join | Who they are: name, age 18+, gender on their ID, and that the ID photo matches the face scan | Posting and requesting |

In both tiers, 5 failed attempts send the account to **human review**, not a permanent block.

Tier 2 is also what makes the women-only filter trustworthy: today gender is self-declared.

## Current prerequisites

| Prerequisite | Needed for | Status |
|---|---|---|
| **A registered business** (PAN + GST; a Pvt Ltd or LLP makes vendor onboarding easiest) | Every KYC vendor, DigiLocker access, AWS business use | ? |
| A **privacy policy and consent text** covering face and ID data (below) | Before any real user scans their face | ⬜ |
| Supabase project | Storing results, Edge Functions | ✅ |
| Google login from [auth.md](auth.md) and phone OTP from [otp.md](otp.md) | Checks attach to a real account | ⬜ |
| AWS account with a card (Option A only) | Face liveness | ? |
| Someone to do **human review** (you, at first) | Failed checks, gender mismatches | ? |

## Legal ground rules (India)

- **Aadhaar can't be compulsory.** A private company may use it only with the person's voluntary consent, and must
  offer another way to verify (e.g. driving licence or passport through DigiLocker).
- **Never store the full Aadhaar number.** Keep only the masked form (`XXXX XXXX 1234`) or nothing.
- **Aadhaar online authentication (OTP or face via UIDAI's servers) isn't available to this app.** It is limited to
  licensed entities (banks, fintechs, telecoms, government). UIDAI's new Face Authentication SDK (Sept 2026) is also
  for those sectors. Use DigiLocker or offline verification instead.
- **DPDP Act 2023 + DPDP Rules 2025.** The Rules were notified 13 Nov 2025, and the main obligations apply from
  **13 May 2027**. Build for them now:
  - A clear notice and a separate, specific consent for the face scan and the ID check.
  - Collect only what the purpose needs, and delete it when done.
  - Reasonable security; report data breaches to the Data Protection Board and affected users.
  - A way for users to withdraw consent and get their data deleted.
- Until then, the **IT (SPDI) Rules 2011** apply: biometric data is "sensitive personal data" and needs written
  (click-through is fine) consent.
- **Aadhaar lists gender as Male, Female or Transgender.** A non-binary or trans user's ID may not match what they
  select in the app. Never auto-reject for this: send it to human review.

## Tier 1: face scan (liveness) options

| Option | Cost per check | Prerequisites | Notes |
|---|---|---|---|
| **A. AWS Rekognition Face Liveness** | US$0.015 (≈₹1.3) for the first 500k/month | AWS account, a small backend (Supabase Edge Function) to start sessions, and AWS Amplify's liveness widget, which is **React** | Strong anti-spoofing (screens, printed photos, masks). Returns a reference selfie to use in Tier 2. The site is plain JS, so the widget has to be bundled as a small separate React piece. |
| **B. Indian KYC vendor** (HyperVerge, IDfy, Bureau, Surepass, Digio…) | Quote-based; estimate ₹1–5 | Registered business, vendor onboarding (KYB), contract; some have minimum monthly commitments | One web SDK and one contract covering both tiers. Ask for startup plans. |
| **C. Free, in the browser** (MediaPipe / face-api.js) | Free | None | Only checks that *a face* is on camera. A printed photo passes. **Demo only**, not real verification. |

**Recommendation:** A. It is the cheapest real liveness check, and AWS has a Mumbai region (check that Face Liveness
is offered there; otherwise use the closest region and mention it in the privacy policy). Choose B instead if one
vendor gives a good bundled price for both tiers.

## Tier 2: ID check (KYC) options

| Option | Cost per user | Prerequisites | What you get | Notes |
|---|---|---|---|---|
| **A. DigiLocker through a vendor** (Setu, Cashfree, Surepass, Digio…) | Estimate ~₹5 (Setu's reported rate at low volume) | Registered business, vendor onboarding | Name, DOB, gender, photo, masked Aadhaar; or driving licence / PAN as alternatives | Best experience: the user logs into DigiLocker and taps consent. No uploads. |
| **B. Aadhaar Offline e-KYC (paperless XML)** | Free | Check with UIDAI whether you need to register as an **OVSE** to store the result (Aadhaar Amendment Regulations 2025) | Name, DOB, gender, photo, signed by UIDAI | Clunky: the user downloads a zip from myAadhaar and gives you the share code. You check UIDAI's signature yourself. |
| **C. New Aadhaar App credentials** (launched Jan 2026) | Not published | Registration as an OVSE with UIDAI | Only what the user chooses to share, e.g. photo + "over 18" + gender; face check happens on their phone | Best for privacy and a good long-term target. Onboarding currently focuses on sectors like hotels, events and finance. |
| **D. PAN verification** | ~₹1–2 | Vendor | Name, DOB only | No gender and no photo, so it **can't** support the women-only filter. Not enough on its own. |

Then **face match**: compare the ID photo with the Tier 1 reference selfie.
- With AWS: Rekognition **CompareFaces** at US$0.001 per image (≈₹0.09).
- A vendor bundle usually includes face match.

**Recommendation:** A (DigiLocker via one vendor) + CompareFaces. Offer B as a free fallback only if
the vendor route is blocked. Watch C for later.

## Rough cost

Per user who completes both tiers (options A + A):

| Item | Cost |
|---|---|
| Face liveness (AWS) | ~₹1.3 |
| DigiLocker fetch (vendor) | ~₹5 (estimate) |
| Face match (AWS) | ~₹0.1 |
| Retries (assume 30% retry liveness once) | ~₹0.4 |
| **Total** | **~₹7 per fully verified user** |

At 1,000 new users a month, with every one scanning and ~40% reaching KYC: about ₹1,700 + ₹2,000 ≈ **₹3,700/month**,
plus any vendor minimum commitment.

## How to build it

### 1. Accounts and contracts (you)
- Register the business if not done, and draft the privacy policy + consent text (have a lawyer review it).
- Create an AWS account; create an IAM user limited to Rekognition; pick the region.
- Get quotes from 2–3 DigiLocker vendors (Setu, Cashfree, Surepass). Ask about: startup pricing, minimum
  commitment, gender in the response, data retention, and whether they need you to be an OVSE.

### 2. Database (Claude)
A `verifications` table: one row per attempt.
- Columns: `user_id`, `tier` (`face`/`kyc`), `status` (`passed`/`failed`/`review`), `provider`, `score`, `created_at`.
- For KYC only: `id_gender`, `dob_verified`, `masked_id`.
- **No images, no full ID numbers.** Selfies stay in the provider or in a private Supabase storage bucket that is
  deleted automatically after KYC or 30 days, whichever is sooner.
- `participants` gets `face_verified_at`, `kyc_verified_at` and `needs_review`.
- Policies: users can read their own rows. **Only Edge Functions (service role) can write them**, so a user can't mark
  themself verified from the browser.
- After the 5th failure in a tier, set `needs_review` and list the account on the `/addmin` page.

### 3. Edge Functions (Claude)
- `face-start`: creates an AWS liveness session; `face-result`: reads the result, saves it, keeps the reference image.
- `kyc-start`: opens the vendor's DigiLocker flow; `kyc-callback`: receives the vendor's result, then:
  - checks age 18+;
  - compares the ID photo with the reference selfie (CompareFaces);
  - compares the ID gender with the profile gender (mismatch → human review, never auto-reject);
  - stores only the result.
- API keys live in Supabase secrets.

### 4. Page (Claude)
- Face scan screen after OTP: short explanation, consent checkbox, camera permission, the liveness widget, a retry
  count, and a "we'll review it" message after 5 failures.
- The existing demo "Verify ID" step (`openVerify('kyc', …)`) becomes the real DigiLocker flow.
- Browsing requires `face_verified_at`. Posting and requesting require `kyc_verified_at`. Enforce both in database
  policies too, not just in the page.

### 5. Human review (Claude builds it, you do it)
A queue in `/addmin`: account, which tier failed, attempt count, reason (e.g. gender mismatch), and
Approve / Reject buttons.

## Testing
- AWS and most vendors have sandbox or test modes. Use them until the consent text is final.
- Check: a real face passes; a photo on a phone screen fails; 5 failures reach human review; a DigiLocker
  consent refusal is handled; an ID gender mismatch goes to review; an under-18 DOB is blocked; deleting the account
  deletes the verification data.

## Who does what

| Step | Who |
|---|---|
| Business registration, privacy policy, lawyer review | You |
| AWS account, vendor quotes and contract | You |
| Database, Edge Functions, page screens, review queue | Claude |
| Human review of flagged accounts | You |

## Sources
- [AWS Rekognition pricing](https://aws.amazon.com/rekognition/pricing/)
- [AWS Rekognition Face Liveness](https://aws.amazon.com/rekognition/face-liveness/)
- [Face liveness providers and pricing (HyperVerge)](https://hyperverge.co/blog/face-liveness-detection-enterprise/)
- [Aadhaar verification API providers 2026 (Hypersign)](https://hypersign.id/resources/blog/best-aadhaar-verification-api-providers)
- [DigiLocker API (Cashfree)](https://www.cashfree.com/digilocker-api/)
- [DigiLocker integration (Setu)](https://docs.setu.co/data/digilocker/quickstart)
- [Aadhaar offline verification and OVSE (Gridlines)](https://gridlines.io/blogs/what-is-aadhaar-offline-verification/)
- [OVSE framework (Insights on India)](https://www.insightsonindia.com/2026/09/05/the-offline-verification-seeking-entity-ovse-framework/)
- [Aadhaar App FAQ (UIDAI)](https://uidai.gov.in/en/aadhaar-app-faq)
- [UIDAI Face Authentication SDK launch (DD India)](https://ddindia.co.in/2026/09/uidai-launches-aadhaar-face-authentication-sdk-and-sandbox-to-simplify-digital-onboarding/)
- [DPDP Rules 2025 (PIB)](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf)
- [DPDP Rules 2025 timeline (TCSA)](https://www.tcsa.in/resources/dpdp-rules-2025-implementation-roadmap)

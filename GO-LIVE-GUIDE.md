# Go-live guide (no technical knowledge needed)

**Goal:** get the Overhere beta site online so people can sign up, try the sample app, and leave feedback, with their answers saved where only you can see them.

**Time:** about 30 minutes. **Cost:** free.

## The pieces, in plain words

| Name | What it is | Why we need it |
|---|---|---|
| **The site** | The files in this folder (a web page) | What testers see |
| **Supabase** | A free online database, like a private spreadsheet that lives on the internet | Where sign-ups and feedback are saved |
| **GitHub** | A website that stores these files | Holds the site's files |
| **GitHub Pages** | A free GitHub feature that turns those files into a public website | Gives you the link to share |

You will do three things: (A) set up Supabase, (B) connect it to the site, (C) publish the site.

---

## Part A. Set up the database (Supabase)

### A1. Create an account
1. Go to **https://supabase.com** and click **Start your project**.
2. Sign up with GitHub or with your email. Confirm your email if asked.

### A2. Create a project
1. Click **New project**. If asked to create an organization first, give it any name (for example "Overhere") and choose the **Free** plan.
2. Fill in:
   - **Name:** `overhere-beta`
   - **Database password:** click **Generate a password**, then copy it somewhere safe (a notes app). You will not need it for the site, but keep it.
   - **Region:** pick the one closest to your testers.
3. Click **Create new project**. Wait 1 to 2 minutes until the dashboard appears.

### A3. Create the tables (paste one block of text)
1. In the left sidebar click **SQL Editor**, then **New query**.
2. Open the file `schema.sql` from this folder. Select everything in it and copy it.
3. Paste it into the big text box in Supabase and click **Run** (bottom right).
4. You should see **Success. No rows returned.**
5. Click **Table Editor** in the left sidebar. You should now see two tables: **participants** and **feedback**. They are empty for now. That is correct.

> If you see a red error, run the same text again. It is safe to repeat. If it still fails, take a screenshot and ask for help.

### A4. Copy your two connection details
1. Click the **gear icon (Project Settings)** at the bottom of the left sidebar, then **API Keys** (on some screens it is called **API** or **Data API**).
2. Copy these two things into a notes app:
   - **Project URL.** It looks like `https://abcdefghijk.supabase.co`
   - **The public key.** It is labelled **anon public** (older screens) or **Publishable key** (newer screens). It is a long piece of text.

> **Important:** Never use the key labelled **service_role** or **secret**. That one is like a master password. The public key is designed to be visible in the website and can only *add* rows, never read them, because of the rules in `schema.sql`.

---

## Part B. Connect the site to the database

You need to put the two things from A4 into the file `config.js`.

**Easiest way, from GitHub (after Part C step C2):**
1. On your repository page on GitHub, click the file **config.js**.
2. Click the **pencil icon** (Edit this file).
3. Paste your details between the quotes so it looks like this (with your own values):

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://abcdefghijk.supabase.co",
  SUPABASE_ANON_KEY: "paste-the-public-key-here",
  CONTACT_EMAIL: "you@example.com"
};
```

4. `CONTACT_EMAIL` is where testers should write to ask for their data to be deleted. Use a real address you check.
5. Click **Commit changes**, then **Commit changes** again in the popup.

**Or on your computer:** open `config.js` in Notepad, paste the same, save.

---

## Part C. Publish the site (GitHub Pages)

### C1. Make sure the files are on GitHub
The files are at **https://github.com/DhruvKai/Overhere**. You should see `index.html`, `demo.html`, `config.js`, `schema.sql` and this guide.

### C2. Turn on the website
1. On the repository page click **Settings** (top tab).
2. In the left menu click **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Under **Branch** choose **main** and folder **/ (root)**, then click **Save**.
5. Wait 1 to 2 minutes and refresh the page. A box appears saying **Your site is live at** with a link, likely `https://dhruvkai.github.io/Overhere/`.

> GitHub Pages is free for **public** repositories. If your repository is private, either make it public (Settings, scroll to the bottom, **Change visibility**) or use the alternative below. The repository contains no passwords. The public key is safe to expose.

### Alternative: Netlify (works with private repos)
1. Go to **https://app.netlify.com/drop**.
2. Drag the whole folder onto the page. You get a live link in seconds.
3. To update later, drag the folder again.

---

## Part D. Test it yourself (important, do not skip)

1. Open your live link. Click **Join the beta**.
2. Fill the form with **your own real details**, tick consent, and submit.
3. The sample app should appear. Click around, then click **I have tried it, leave feedback** and send a rating with consent ticked.
4. Go to Supabase, **Table Editor**, and click **participants**. Your row should be there. Then click **feedback**. Your rating should be there.
5. Delete your test rows: click the row's checkbox, then **Delete**.

If the yellow banner "Backend not connected yet" still shows on the sign-up page, `config.js` was not saved correctly. Re-check Part B and hard-refresh the page (Ctrl+Shift+R).

---

## Part E. Everyday use

| I want to… | Do this |
|---|---|
| See who signed up | Supabase, **Table Editor**, **participants** |
| See feedback | Supabase, **Table Editor**, **feedback** |
| Download everything | In Table Editor, click a table, then the **Export** button, choose **CSV**. Opens in Excel or Google Sheets. |
| See who agreed to be quoted | In **feedback**, filter `consent_quote = true`. Only quote these people, and never with their name or email. |
| See who agreed to be contacted | In **feedback**, filter `consent_contact = true`. Everyone in **participants** agreed to be contacted about the beta at sign-up. |
| Delete someone's data (they asked) | Find their row in **participants** by email, note its `id`, delete the row. Then in **feedback** delete rows with that `participant_id`. |

## Good to know

- **Free plan pause:** Supabase pauses free projects after about a week with no activity. Data is kept. Open the project dashboard and click **Restore** if it happens. Log in once a week during the beta.
- **No backups on the free plan.** Export a CSV regularly.
- **Have someone check the consent wording** before you invite real people. Laws about collecting personal data differ by country. Sign-up asks for a name, email, date of birth and gender identity, which is personal data.
- **Only invite people who should be there.** Anyone with the link can sign up. Share it privately during the test.
- **Never post the `service_role` or `secret` key anywhere.**

## If something goes wrong

| Symptom | Likely cause and fix |
|---|---|
| Yellow "Backend not connected" banner | `config.js` is empty or not saved. Redo Part B. |
| "Could not save (401)" or "(403)" | Wrong key, or `schema.sql` was not run. Redo A3 and A4. |
| "Could not save (404)" | Project URL is wrong. Copy it again in A4. It must start with `https://` and end with `.supabase.co`. |
| Site shows old content after an edit | Wait 1 to 2 minutes, then hard-refresh with Ctrl+Shift+R. |
| Sample app is blank inside the page | `demo.html` is missing from the repository. It must be next to `index.html`. |

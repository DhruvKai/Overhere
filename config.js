// Fill these in after creating a Supabase project (see README.md).
// Leave SUPABASE_URL empty to run in local-only mode (data stays in the browser).
// The anon key is safe to expose: every table is locked; the app can only call the database functions in schema-app.sql.
window.APP_CONFIG = {
  SUPABASE_URL: "https://ctkfyxwtssmmeelslrig.supabase.co/rest/v1/",
  SUPABASE_ANON_KEY: "sb_publishable_1XecJ_qlquD514OVKF_GNQ_QGYaPX-8",
  CONTACT_EMAIL: "overhere.temp@gmail.com", // where people email to request deletion, shown in the consent text
  // Cloudflare Turnstile site key (CAPTCHA on sign-in, sign-up, codes and password resets). Leave "" to keep it off.
  // Set it only together with Supabase -> Authentication -> Attack Protection -> CAPTCHA (Turnstile, with the secret key).
  TURNSTILE_SITE_KEY: "",
  PHONE_LOGIN: true,  // true shows "Continue with phone" on the sign-in screen. Only after SMS is set up (SETUP-APP.md)
};

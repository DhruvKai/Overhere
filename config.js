// Fill these in after creating a Supabase project (see README.md).
// Leave SUPABASE_URL empty to run in local-only mode (data stays in the browser).
// The anon key is safe to expose: every table is locked; the app can only call the database functions in schema-app.sql.
window.APP_CONFIG = {
  SUPABASE_URL: "https://ctkfyxwtssmmeelslrig.supabase.co/rest/v1/",
  SUPABASE_ANON_KEY: "sb_publishable_1XecJ_qlquD514OVKF_GNQ_QGYaPX-8",
  CONTACT_EMAIL: "admin@overhere.social", // where people email to request deletion, shown in the consent text
  // Cloudflare Turnstile site key (CAPTCHA on sign-in, sign-up, codes and password resets). Leave "" to keep it off.
  // Set it only together with Supabase -> Authentication -> Attack Protection -> CAPTCHA (Turnstile, with the secret key).
  TURNSTILE_SITE_KEY: "0x4AAAAAAFG3dLojvYus1RSv",
  // Place search for all of India (venues and home areas): a Photon server (https://github.com/komoot/photon).
  // The public one is free for light use; for real traffic, run your own or use a paid host, and put its address here
  // and in app.html's Content-Security-Policy (connect-src).
  GEO_URL: "https://photon.komoot.io",
  PHONE_LOGIN: true,  // true shows "Continue with phone" on the sign-in screen. Only after SMS is set up (SETUP-APP.md)
};
// On your own computer (localhost or 127.0.0.1) the site uses the TEST database (Supabase project overhere-test), so
// trying out changes never touches real accounts. Open any page with ?live once to use the live database in this tab.
// The test project has no SMS (email sign-in only) and no CAPTCHA; Cloudflare's test key always passes.
(function () {
  if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  try { if (/[?&]live(&|$)/.test(location.search)) sessionStorage.setItem('overhere_live', '1'); if (sessionStorage.getItem('overhere_live')) return; } catch (e) {}
  Object.assign(window.APP_CONFIG, {
    SUPABASE_URL: "https://tzjdikyijtsyoqzdsbxk.supabase.co/rest/v1/",
    SUPABASE_ANON_KEY: "sb_publishable__M6G_AlyxAfi-UDqGzbasA_aPKwUN4C",
    TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
    PHONE_LOGIN: false,
    TEST_DB: true,
  });
  // a small label, so a test page is never mistaken for the real site
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('div');
    b.textContent = 'Test database';
    b.setAttribute('aria-hidden', 'true');
    b.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:9999;background:#B45309;color:#fff;font:600 11px/1 system-ui,sans-serif;padding:5px 8px;border-radius:6px;pointer-events:none;opacity:.9';
    document.body.appendChild(b);
  });
})();

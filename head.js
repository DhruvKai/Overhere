/* Runs first on every page: refuses to be shown inside another site's frame (clickjacking),
   applies the saved light/dark choice before anything is drawn, and links the app manifest. */
(function () {
  var framed = false;
  try { framed = window.top !== window && window.top.location.origin !== location.origin; } catch (e) { framed = true; }
  if (framed) {
    document.documentElement.style.display = 'none';
    try { window.top.location = location.href; } catch (e) {}
    return;
  }
  var me = document.currentScript;
  /* The landing page (data-skip-landing) is for the first visit. Anyone who has opened the app, is signed in or filled
     in the old beta form goes straight to the app. A #feedback, #admin or ?home link still shows the page. */
  if (me && me.hasAttribute('data-skip-landing') && !location.hash && !location.search) {
    try {
      var back = localStorage.getItem('overhere_seen') || localStorage.getItem('overhere_participant');
      for (var i = 0; !back && i < localStorage.length; i++) back = /^sb-.+-auth-token$/.test(localStorage.key(i));
      if (back) {
        document.documentElement.style.visibility = 'hidden';
        location.replace('app.html');
        return;
      }
    } catch (e) {}
  }
  try {
    var t = localStorage.getItem('overhere_theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
  var mf = me && me.getAttribute('data-manifest');
  if (mf && location.protocol !== 'file:') {
    var l = document.createElement('link'); l.rel = 'manifest'; l.href = mf; document.head.appendChild(l);
  }
})();

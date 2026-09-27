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
  try {
    var t = localStorage.getItem('overhere_theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
  var me = document.currentScript, mf = me && me.getAttribute('data-manifest');
  if (mf && location.protocol !== 'file:') {
    var l = document.createElement('link'); l.rel = 'manifest'; l.href = mf; document.head.appendChild(l);
  }
})();

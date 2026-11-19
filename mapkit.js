/* The map engine behind Discover's map, on the website (drawMap in app.js) and in the app (components/PlanMap.tsx,
   whose WebView loads this file from the site). Google Maps when a browser key is given, otherwise Leaflet over
   OpenStreetMap, as before. Both give the same few calls, so the pins, bubbles and preview code is written once:

     MapKit.load(key)                -> Promise of 'google' or 'leaflet' (Leaflet when there's no key, or Google fails)
     MapKit.create(el, {center, zoom, zoomControl}) -> a map:
       .point(ll)                    pixel position at this zoom, to group pins that would overlap
       .pin(ll, {html, size, title, z, onClick})   an HTML marker; .clearPins() removes them (not the "you" dot)
       .dot(ll, {html, size})        a marker that stays and can't be tapped (the blue "you are here" dot)
       .fit(lls, {maxZoom, fly})     show all these points
       .flyTo(ll, zoom) .zoom() .view() -> {c:[lat,lng], z} .on('zoom'|'move'|'click', fn) .remove()
     MapKit.meters(a, b)             distance between two points

   Google's terms say places found with Google's search must be shown on a Google map, which is why the map moved
   with the search. If the key is refused (wrong key, or the site isn't on its list), Google calls gm_authFailure and
   the map is redrawn with Leaflet, so Discover never ends up blank. */
(function () {
  var engine = null, loading = null, failed = false, onFail = [];
  var R = 6371000, rad = function (d) { return d * Math.PI / 180; };
  function meters(a, b) {
    var dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function script(src) {
    return new Promise(function (ok, bad) {
      var s = document.createElement('script'); s.src = src; s.async = true; s.onload = ok; s.onerror = bad; document.head.appendChild(s);
    });
  }
  function leaflet() {
    if (window.L) return Promise.resolve('leaflet');
    var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'vendor/leaflet/leaflet.css'; document.head.appendChild(css);
    return script('vendor/leaflet/leaflet.js').then(function () { return 'leaflet'; });
  }
  function loadGoogle(key) {
    return new Promise(function (ok, bad) {
      window.gm_authFailure = function () {
        failed = true; engine = null; loading = null;
        onFail.splice(0).forEach(function (f) { try { f(); } catch (e) { /* keep going */ } });
      };
      window.__mapkitReady = function () { ok('google'); };
      script('https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(key)
        + '&v=weekly&language=en&region=IN&callback=__mapkitReady').catch(bad);
      setTimeout(function () { if (!(window.google && google.maps && google.maps.Map)) bad(new Error('timeout')); }, 15000);
    });
  }
  function load(key) {
    if (engine) return Promise.resolve(engine);
    return loading || (loading = (key && !failed ? loadGoogle(key).catch(function () { failed = true; return leaflet(); }) : leaflet())
      .then(function (e) { engine = e; return e; }, function (err) { loading = null; throw err; }));
  }

  /* ---------- Leaflet ---------- */
  function leafletMap(el, o) {
    var m = L.map(el, { zoomControl: o.zoomControl !== false }).setView(o.center, o.zoom);
    m.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' }).addTo(m);
    var pins = L.layerGroup().addTo(m);
    var icon = function (x) { return L.divIcon({ className: '', iconSize: [x.size, x.size], iconAnchor: [x.size / 2, x.size / 2], html: x.html }); };
    return {
      engine: 'leaflet',
      point: function (ll) { return m.latLngToLayerPoint(ll); },
      pin: function (ll, x) {
        L.marker(ll, { title: x.title || '', keyboard: true, riseOnHover: true, zIndexOffset: x.z || 0, icon: icon(x) })
          .addTo(pins).on('click', function () { x.onClick && x.onClick(); });
      },
      dot: function (ll, x) { L.marker(ll, { zIndexOffset: 1000, keyboard: false, interactive: false, icon: icon(x) }).addTo(m); },
      clearPins: function () { pins.clearLayers(); },
      fit: function (lls, x) {
        if (lls.length < 2) { m.setView(lls[0], x.single || 13); return; }
        var b = L.latLngBounds(lls).pad(x.pad == null ? 0.12 : x.pad);
        if (x.fly) m.flyToBounds(b, { maxZoom: x.maxZoom, duration: .5 }); else m.fitBounds(b, { maxZoom: x.maxZoom });
      },
      flyTo: function (ll, z) { m.flyTo(ll, z, { duration: .5 }); },
      zoom: function () { return m.getZoom(); },
      view: function () { var c = m.getCenter(); return { c: [c.lat, c.lng], z: m.getZoom() }; },
      on: function (ev, f) { m.on({ zoom: 'zoomend', move: 'moveend', click: 'click' }[ev], f); },
      remove: function () { m.remove(); },
    };
  }

  /* ---------- Google ---------- */
  var Pin = null;   // an HTML marker drawn over the map, made once Google has loaded
  function pinClass() {
    if (Pin) return Pin;
    Pin = function (ll, x) { this.ll = new google.maps.LatLng(ll[0], ll[1]); this.x = x; this.div = null; };
    Pin.prototype = new google.maps.OverlayView();
    Pin.prototype.onAdd = function () {
      var d = document.createElement('div'), x = this.x;
      d.style.cssText = 'position:absolute;width:' + x.size + 'px;height:' + x.size + 'px;z-index:' + (x.z || 0);
      d.innerHTML = x.html;
      if (x.onClick) {
        d.style.cursor = 'pointer'; d.tabIndex = 0; d.setAttribute('role', 'button');
        if (x.title) { d.title = x.title; d.setAttribute('aria-label', x.title); }
        d.addEventListener('click', function (e) { e.stopPropagation(); x.onClick(); });
        d.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); x.onClick(); } });
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(d);
        this.getPanes().overlayMouseTarget.appendChild(d);
      } else {
        d.style.pointerEvents = 'none';
        this.getPanes().overlayLayer.appendChild(d);
      }
      this.div = d;
    };
    Pin.prototype.draw = function () {
      var p = this.getProjection().fromLatLngToDivPixel(this.ll); if (!p || !this.div) return;
      this.div.style.left = (p.x - this.x.size / 2) + 'px'; this.div.style.top = (p.y - this.x.size / 2) + 'px';
    };
    Pin.prototype.onRemove = function () { if (this.div) { this.div.remove(); this.div = null; } };
    return Pin;
  }
  /* quieter than Google's default: no shop and business labels competing with the plan pins */
  var STYLE = [
    { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  ];
  function googleMap(el, o) {
    var g = google.maps, P = pinClass(), pins = [];
    var m = new g.Map(el, {
      center: { lat: o.center[0], lng: o.center[1] }, zoom: o.zoom, styles: STYLE, clickableIcons: false,
      disableDefaultUI: true, zoomControl: o.zoomControl !== false, gestureHandling: 'greedy', maxZoom: 19,
    });
    var cap = function (z) { var once = g.event.addListenerOnce(m, 'idle', function () { if (m.getZoom() > z) m.setZoom(z); }); return once; };
    var bounds = function (lls) { var b = new g.LatLngBounds(); lls.forEach(function (ll) { b.extend({ lat: ll[0], lng: ll[1] }); }); return b; };
    return {
      engine: 'google',
      point: function (ll) {
        var pr = m.getProjection(), s = Math.pow(2, m.getZoom() || 0);
        if (!pr) return { x: ll[1] * s, y: -ll[0] * s, distanceTo: dist };
        var w = pr.fromLatLngToPoint(new g.LatLng(ll[0], ll[1]));
        return { x: w.x * s, y: w.y * s, distanceTo: dist };
      },
      pin: function (ll, x) { var p = new P(ll, x); p.setMap(m); pins.push(p); },
      dot: function (ll, x) { new P(ll, { html: x.html, size: x.size, z: 1000 }).setMap(m); },
      clearPins: function () { pins.splice(0).forEach(function (p) { p.setMap(null); }); },
      fit: function (lls, x) {
        if (lls.length < 2) { m.setCenter({ lat: lls[0][0], lng: lls[0][1] }); m.setZoom(x.single || 13); return; }
        cap(x.maxZoom); m.fitBounds(bounds(lls), (x.pad || 0) >= 0.3 ? 60 : 32);
      },
      flyTo: function (ll, z) { m.panTo({ lat: ll[0], lng: ll[1] }); m.setZoom(z); },
      zoom: function () { return m.getZoom(); },
      view: function () { var c = m.getCenter(); return { c: [c.lat(), c.lng()], z: m.getZoom() }; },
      on: function (ev, f) { m.addListener({ zoom: 'zoom_changed', move: 'idle', click: 'click' }[ev], function () { f(); }); },
      remove: function () { this.clearPins(); g.event.clearInstanceListeners(m); el.innerHTML = ''; },
    };
  }
  function dist(o) { var dx = this.x - o.x, dy = this.y - o.y; return Math.sqrt(dx * dx + dy * dy); }

  window.MapKit = {
    load: load,
    meters: meters,
    /** Called once if Google refuses the key after the map is drawn, so the page can redraw it with Leaflet. */
    onFail: function (f) { onFail.push(f); },
    create: function (el, o) {
      return engine === 'google' && !failed ? googleMap(el, o) : leafletMap(el, o);
    },
  };
})();

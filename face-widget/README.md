# Face check widget

The camera part of the live face check. It is only needed once `face_check` is set to `live`
(see [face-scan.md](../face-scan.md), "Connecting the face scan").

Build it once, on a computer with Node.js installed:

```
cd face-widget
npm install
npm run build
```

This makes `face-widget.js` and `face-widget.css` next to `demo.html`. Commit those two files.
The app loads them only when someone starts a live face check.

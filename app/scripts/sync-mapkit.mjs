/* Copies web/mapkit.js (the map engine the website loads) into the app as src/lib/mapkit-source.ts, so the app's
   map page (components/PlanMap.tsx) carries its own copy and never depends on which version the live site has.
   Run after changing web/mapkit.js: npm run sync:mapkit. The Android build (build-android.mjs) runs it too. */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(ROOT, '..', 'mapkit.js'), 'utf8');
const out = `/* Generated from web/mapkit.js by scripts/sync-mapkit.mjs. Don't edit: change web/mapkit.js, then run
   npm run sync:mapkit (the Android build does it too). */
export const MAPKIT_JS = ${JSON.stringify(src)};
`;
const file = join(ROOT, 'src', 'lib', 'mapkit-source.ts');
let old = '';
try { old = readFileSync(file, 'utf8'); } catch { /* first run */ }
if (old !== out) { writeFileSync(file, out); console.log('mapkit-source.ts updated from web/mapkit.js'); }

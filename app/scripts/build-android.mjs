/* Builds the Android app on this computer instead of on EAS's servers (see LOCAL-BUILDS.md).

   node scripts/build-android.mjs [profile] [--emulator] [--install] [--offline]

   profile    a build profile in eas.json: preview (default, the live APK), test (Overhere Test, the test database),
              production (an .aab for the Play Store) or development (a dev client, debug).
   --emulator also builds for x86_64, so it runs natively on the Android emulator.
   --install  installs the result on the phone or emulator adb sees.
   --offline  doesn't ask EAS for the current versionCode.

   It uses the same EXPO_PUBLIC_* values as the cloud build (from eas.json), the upload key from credentials.json
   when it's there, and regenerates android/ only when the profile or app config changed. */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WIN = process.platform === 'win32';
const args = process.argv.slice(2);
const flag = f => args.includes(f);
const profileName = args.find(a => !a.startsWith('--')) || 'preview';

const say = msg => console.log(`\n▸ ${msg}`);
const fail = msg => { console.error(`\n✖ ${msg}`); process.exit(1); };
function run(cmd, cmdArgs, opts = {}) {
  const r = spawnSync(cmd, cmdArgs, { cwd: ROOT, stdio: 'inherit', shell: WIN, env: process.env, ...opts });
  if (r.status !== 0) fail(`${cmd} ${cmdArgs.join(' ')} failed (exit ${r.status ?? r.error?.message}).`);
  return r;
}

/* ---------- toolchain: JDK 17 and the Android SDK ---------- */
const local = process.env.LOCALAPPDATA || '';
const home = process.env.HOME || process.env.USERPROFILE || '';
const firstDir = (...dirs) => dirs.find(d => d && existsSync(d));
/* a JDK from 17 to 21 (what this Gradle and React Native take); a JAVA_HOME pointing at another or a removed one is skipped */
const jdkOk = d => { try { const v = /JAVA_VERSION="(\d+)/.exec(readFileSync(join(d, 'release'), 'utf8'))?.[1]; return +v >= 17 && +v <= 21; } catch { return false; } };
process.env.JAVA_HOME = [process.env.JAVA_HOME, join(local, 'Android', 'jdk17'), '/usr/lib/jvm/java-17-openjdk-amd64'].find(d => d && jdkOk(d)) || '';
process.env.ANDROID_HOME ||= process.env.ANDROID_SDK_ROOT || firstDir(join(local, 'Android', 'Sdk'), join(home, 'Library', 'Android', 'sdk'), join(home, 'Android', 'Sdk')) || '';
if (!process.env.JAVA_HOME) fail('No JDK 17 found. Set JAVA_HOME (LOCAL-BUILDS.md, step 1).');
if (!process.env.ANDROID_HOME || !existsSync(process.env.ANDROID_HOME)) fail('No Android SDK found. Set ANDROID_HOME (LOCAL-BUILDS.md, step 1).');
process.env.PATH = [join(process.env.JAVA_HOME, 'bin'), join(process.env.ANDROID_HOME, 'platform-tools'), process.env.PATH].join(WIN ? ';' : ':');

/* ---------- the profile's settings, from eas.json ---------- */
const eas = JSON.parse(readFileSync(join(ROOT, 'eas.json'), 'utf8'));
const profile = eas.build?.[profileName];
if (!profile) fail(`No build profile "${profileName}" in eas.json. Pick one of: ${Object.keys(eas.build).join(', ')}.`);
const dev = !!profile.developmentClient;
const bundle = profile.android?.buildType === 'app-bundle';
/* the values in eas.json win over .env.local, as on EAS */
Object.assign(process.env, profile.env || {});
process.env.NODE_ENV = dev ? 'development' : 'production';

/* ---------- versionCode: the one EAS has, so a local build never counts as a downgrade ---------- */
if (!flag('--offline')) {
  const r = spawnSync('npx', ['eas-cli', 'build:version:get', '-p', 'android', '-e', profileName, '--json', '--non-interactive'],
    { cwd: ROOT, shell: WIN, encoding: 'utf8', env: process.env, timeout: 90000 });
  const code = /"versionCode"\s*:\s*"?(\d+)/.exec(r.stdout || '')?.[1];
  if (code) { process.env.OVERHERE_VERSION_CODE = code; say(`versionCode ${code} (from EAS)`); }
  else say('Could not get the versionCode from EAS; using the one in app config.');
}

/* ---------- signing: the upload key from credentials.json (npx eas-cli credentials -p android, "Download") ---------- */
const credsFile = join(ROOT, 'credentials.json');
if (!dev && existsSync(credsFile)) {
  const k = JSON.parse(readFileSync(credsFile, 'utf8')).android?.keystore;
  if (!k?.keystorePath) fail('credentials.json has no android.keystore. Download it again (LOCAL-BUILDS.md, step 2).');
  Object.assign(process.env, {
    OVERHERE_UPLOAD_STORE_FILE: resolve(ROOT, k.keystorePath),
    OVERHERE_UPLOAD_STORE_PASSWORD: k.keystorePassword,
    OVERHERE_UPLOAD_KEY_ALIAS: k.keyAlias,
    OVERHERE_UPLOAD_KEY_PASSWORD: k.keyPassword ?? k.keystorePassword,
  });
  say('Signing with the upload key from credentials.json');
} else if (!dev) {
  say('No credentials.json, so this is signed with a debug key. It won\'t install over an EAS build (uninstall that first), and invite links won\'t open it. See LOCAL-BUILDS.md, step 2.');
}

/* ---------- android/: regenerate only when something that shapes it changed ---------- */
const stampFile = join(ROOT, 'android', '.overhere-prebuild');
const hash = createHash('sha256');
hash.update(profileName + JSON.stringify(profile.env || {}));
for (const f of ['app.json', 'app.config.js', 'package.json', 'package-lock.json']) if (existsSync(join(ROOT, f))) hash.update(readFileSync(join(ROOT, f)));
for (const f of readdirSync(join(ROOT, 'plugins'))) hash.update(readFileSync(join(ROOT, 'plugins', f)));
const stamp = hash.digest('hex');
if (!existsSync(stampFile) || readFileSync(stampFile, 'utf8') !== stamp) {
  say(`Generating android/ for "${profileName}"`);
  /* prebuild rewrites the "android"/"ios" scripts in package.json; keep the file as it was */
  const pkg = readFileSync(join(ROOT, 'package.json'));
  try { run('npx', ['expo', 'prebuild', '-p', 'android', '--clean', '--no-install'], { env: { ...process.env, CI: '1' } }); }
  finally { writeFileSync(join(ROOT, 'package.json'), pkg); }
  writeFileSync(stampFile, stamp);
} else say('android/ is up to date');

/* ---------- local.properties: the SDK, and a CMake whose ninja handles long Windows paths ----------
   The default CMake (3.22) ships ninja 1.10, which fails with "mkdir(...): No such file or directory" once a path
   passes 260 characters, even with Windows long paths on. CMake 3.28+ in the SDK ships ninja 1.12, which copes. */
const fwd = p => p.replace(/\\/g, '/');
const cmakeDir = (() => {
  const dir = join(process.env.ANDROID_HOME, 'cmake');
  if (!existsSync(dir)) return null;
  const v = s => s.split('.').map(Number);
  const newest = readdirSync(dir).filter(s => /^\d+\.\d+\.\d+$/.test(s) && (v(s)[0] > 3 || v(s)[1] >= 28))
    .sort((a, b) => { const [x, y] = [v(a), v(b)]; return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; }).pop();
  return newest ? join(dir, newest) : null;
})();
if (WIN && !cmakeDir) fail('Install a CMake of 3.28 or newer from the SDK (LOCAL-BUILDS.md, step 1): the default one fails on long paths.');
writeFileSync(join(ROOT, 'android', 'local.properties'),
  `sdk.dir=${fwd(process.env.ANDROID_HOME)}\n${cmakeDir ? `cmake.dir=${fwd(cmakeDir)}\n` : ''}`);

/* ---------- build ---------- */
const archs = ['arm64-v8a', 'armeabi-v7a', ...(flag('--emulator') ? ['x86_64'] : [])].join(',');
const task = dev ? 'assembleDebug' : bundle ? 'bundleRelease' : 'assembleRelease';
say(`gradle ${task} (${archs})`);
/* by full path: cmd doesn't look in the current folder when NoDefaultCurrentDirectoryInExePath is set */
run(`"${join(ROOT, 'android', WIN ? 'gradlew.bat' : 'gradlew')}"`, [task, `-PreactNativeArchitectures=${archs}`], { cwd: join(ROOT, 'android') });

const out = join(ROOT, 'android', 'app', 'build', 'outputs', bundle && !dev ? 'bundle' : 'apk', dev ? 'debug' : 'release', `app-${dev ? 'debug' : 'release'}.${bundle && !dev ? 'aab' : 'apk'}`);
if (!existsSync(out)) fail(`Build finished but ${out} isn't there.`);
const { version } = JSON.parse(readFileSync(join(ROOT, 'app.json'), 'utf8')).expo;
mkdirSync(join(ROOT, 'builds'), { recursive: true });
const dest = join(ROOT, 'builds', `overhere-${profileName}-${version}.${out.split('.').pop()}`);
copyFileSync(out, dest);
say(`Done: ${dest}`);

if (flag('--install')) {
  if (bundle && !dev) fail('An .aab can\'t be installed directly; build "preview" or "test" to get an APK.');
  say('Installing with adb');
  run('adb', ['install', '-r', dest]);
}

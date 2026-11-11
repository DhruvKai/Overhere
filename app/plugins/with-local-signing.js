/* Local release builds (scripts/build-android.mjs) sign with the app's real upload key when the OVERHERE_UPLOAD_*
   variables point at it, so a local APK installs over one from EAS and invite links (assetlinks.json) still open it.
   Without them, release builds keep Expo's debug key. EAS builds don't set these and use their own signing. */
const { withAppBuildGradle } = require('expo/config-plugins');

const RELEASE_CONFIG = `
        release {
            def ks = System.getenv('OVERHERE_UPLOAD_STORE_FILE')
            if (ks) {
                storeFile file(ks)
                storePassword System.getenv('OVERHERE_UPLOAD_STORE_PASSWORD')
                keyAlias System.getenv('OVERHERE_UPLOAD_KEY_ALIAS')
                keyPassword System.getenv('OVERHERE_UPLOAD_KEY_PASSWORD')
            }
        }`;

module.exports = function withLocalSigning(config) {
  return withAppBuildGradle(config, c => {
    let g = c.modResults.contents;
    if (g.includes('OVERHERE_UPLOAD_STORE_FILE')) return c;
    const before = g;
    g = g.replace(/signingConfigs \{/, m => m + RELEASE_CONFIG);
    /* the second "signingConfig signingConfigs.debug" in buildTypes is the release one */
    g = g.replace(/(buildTypes \{[\s\S]*?release \{[\s\S]*?)signingConfig signingConfigs\.debug/,
      "$1signingConfig System.getenv('OVERHERE_UPLOAD_STORE_FILE') ? signingConfigs.release : signingConfigs.debug");
    if (g === before || !g.includes('signingConfigs.release :')) {
      throw new Error('with-local-signing: android/app/build.gradle has changed shape; update the plugin.');
    }
    c.modResults.contents = g;
    return c;
  });
};

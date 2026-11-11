/* app.json holds the app's settings. This file adds two things on top:
   - Local builds (scripts/build-android.mjs): the upload-key signing plugin, and the versionCode EAS has
     (OVERHERE_VERSION_CODE), so a local APK installs over a cloud one. Both do nothing on EAS.
   - The TEST build (eas.json profile "test", APP_VARIANT=test): its own name and app id, so "Overhere Test" installs
     next to the real app, and it talks to the test database (the EXPO_PUBLIC_* values in that profile). It doesn't
     claim overhere.social links: those are live plans. */
module.exports = ({ config }) => {
  const code = Number(process.env.OVERHERE_VERSION_CODE);
  config = {
    ...config,
    android: { ...config.android, ...(code > 0 ? { versionCode: code } : {}) },
    plugins: [...(config.plugins || []), './plugins/with-local-signing'],
  };
  if (process.env.APP_VARIANT !== 'test') return config;
  return {
    ...config,
    name: 'Overhere Test',
    scheme: 'overhere-test',
    ios: { ...config.ios, bundleIdentifier: 'social.overhere.app.test' },
    android: { ...config.android, package: 'social.overhere.app.test', intentFilters: [] },
  };
};

/* app.json holds the app's settings. This file only changes them for the TEST build (eas.json profile "test",
   APP_VARIANT=test): its own name and app id, so "Overhere Test" installs next to the real app, and it talks to the
   test database (the EXPO_PUBLIC_* values in that profile). It doesn't claim overhere.social links: those are live plans. */
module.exports = ({ config }) => {
  if (process.env.APP_VARIANT !== 'test') return config;
  return {
    ...config,
    name: 'Overhere Test',
    scheme: 'overhere-test',
    ios: { ...config.ios, bundleIdentifier: 'social.overhere.app.test' },
    android: { ...config.android, package: 'social.overhere.app.test', intentFilters: [] },
  };
};

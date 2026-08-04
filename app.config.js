const appJson = require('./app.json');

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    android: {
      ...appJson.expo.android,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? appJson.expo.android.googleServicesFile,
    },
  },
};

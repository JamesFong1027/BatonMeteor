App.info({
  name: 'Baton',
  description: 'Teaching smart',
  version: '0.0.1'
});

App.icons({
  'android_ldpi': 'public/logo.png',
  'android_mdpi': 'public/logo.png',
  'android_hdpi': 'public/logo.png',
  'android_xhdpi': 'public/logo.png'
});

App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');
App.accessRule('*');
App.accessRule("https://s3.amazonaws.com/*");

// App.setPreference('StatusBarOverlaysWebView', 'true');
// App.setPreference('StatusBarStyle', 'lightcontent');

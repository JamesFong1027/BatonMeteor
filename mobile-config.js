App.info({
  name: 'Baton',
  description: 'Teaching smart',
  version: '0.0.1'
});

App.icons({
  'android_ldpi': 'logo.png',
  'android_mdpi': 'logo.png',
  'android_hdpi': 'logo.png',
  'android_xhdpi': 'logo.png'
});

App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');
App.accessRule('*');
App.accessRule("https://s3.amazonaws.com/*");


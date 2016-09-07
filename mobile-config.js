App.info({
  id:"com.batonmobile.android.meteor",
  name: 'Baton',
  description: 'Making participation smarter',
  version: '0.2.2',
  author: 'Victor Chen',
  email: 'info@batonmobile.com',
  website: 'http://batonmobile.com'
});

App.icons({
  // Android
  'android_mdpi': 'resources/icons/icon-48x48.png',
  'android_hdpi': 'resources/icons/icon-36x36@2x.png',
  'android_xhdpi': 'resources/icons/icon-48x48@2x.png',
  'android_xxhdpi': 'resources/icons/icon-36x36@3x.png',
  'android_xxxhdpi': 'resources/icons/icon-48x48@3x.png',

  // iOS
  'iphone_2x': 'resources/icons/icon-60x60@2x.png',
  'iphone_3x': 'resources/icons/icon-60x60@3x.png',
  'ipad': 'resources/icons/icon-76x76.png',
  'ipad_2x': 'resources/icons/icon-76x76@2x.png',
  'ipad_pro': 'resources/icons/icon-167x167.png',
  'ios_settings': 'resources/icons/icon-29x29.png',
  'ios_settings_2x': 'resources/icons/icon-29x29@2x.png',
  'ios_settings_3x': 'resources/icons/icon-29x29@3x.png',
  'ios_spotlight': 'resources/icons/icon-40x40.png',
  'ios_spotlight_2x': 'resources/icons/icon-40x40@2x.png',
});

App.launchScreens({
  // iOS
  'iphone_2x': 'resources/splash/splash-320x480@2x.png',
  'iphone5': 'resources/splash/splash-320x568@2x.png',
  'iphone6': 'resources/splash/splash-375x667@2x.png',
  'iphone6p_portrait': 'resources/splash/splash-414x736@3x.png',
  'iphone6p_landscape': 'resources/splash/splash-736x414@3x.png',

  'ipad_portrait': 'resources/splash/splash-768x1024.png',
  'ipad_portrait_2x': 'resources/splash/splash-768x1024@2x.png',
  'ipad_landscape': 'resources/splash/splash-1024x768.png',
  'ipad_landscape_2x': 'resources/splash/splash-1024x768@2x.png',

  // Android
  'android_mdpi_portrait': 'resources/splash/splash-mdpi.png',
  'android_mdpi_landscape': 'resources/splash/splash-mdpi.png',
  'android_hdpi_portrait': 'resources/splash/splash-hdpi.png',
  'android_hdpi_landscape': 'resources/splash/splash-hdpi.png',
  'android_xhdpi_portrait': 'resources/splash/splash-xhdpi.png',
  'android_xhdpi_landscape': 'resources/splash/splash-xhdpi.png',
  'android_xxhdpi_portrait': 'resources/splash/splash-xxhdpi.png',
  'android_xxhdpi_landscape': 'resources/splash/splash-xxhdpi.png',
});

App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');
App.accessRule('www.google-analytics.com');
App.accessRule('cdn.mxpnl.com');
App.accessRule('*');
App.accessRule("https://s3.amazonaws.com/*");

App.setPreference('SplashShowOnlyFirstTime', 'false');
App.setPreference('SplashMaintainAspectRatio', 'true');

// App.setPreference('StatusBarOverlaysWebView', 'true');
// App.setPreference('StatusBarStyle', 'lightcontent');

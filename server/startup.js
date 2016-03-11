Meteor.startup(function() {
  // scheduleReminder(new Date(Date.now()+1*60*1000));
  // BrowserPolicy.content.allowOriginForAll("http://meteor.local");
  WebApp.connectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  });

  // Add Facebook configuration entry
  ServiceConfiguration.configurations.update({
    "service": "google"
  }, {
    $set: {
      "clientId": "553157495789-7v8oh686td1u7du0hdd2jdp9t6fflqgm.apps.googleusercontent.com",
      "secret": "Ikpp_WkPQDDirxjU-_TZj6wV",
      "redirectUrl": "http://localhost:3000/_oauth/google"
    }
  }, {
    upsert: true
  });

  Accounts.onCreateUser(function(options, user) {
    console.log("options", options);
    console.log("user", user);
    if (options.profile)
      user.profile = options.profile;
    if (user.services.google != undefined) {
      user.profile.firstName = user.services.google.given_name;
      user.profile.lastName = user.services.google.family_name;
      user.emails = [{
        "address": user.services.google.email,
        "verified": user.services.google.verified_email
      }];
      // work around before we implement google api and take their profile
      var nameMatch = user.services.google.email.match(/^([^@]*)@/);
      var emailUserName = nameMatch ? nameMatch[1] : null;
      var isnum = /^\d+$/.test(emailUserName);
      user.profile.userType = isnum ? Schemas.userType.student : Schemas.userType.teacher;
    }
    return user;
  });
});
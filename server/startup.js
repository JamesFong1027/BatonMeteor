Meteor.startup(function() {
  // scheduleReminder(new Date(Date.now()+1*60*1000));
  // BrowserPolicy.content.allowOriginForAll("http://meteor.local");
  WebApp.connectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  });

  smtp = {
    username: 'info@batonmobile.com',
    password: 'ummchzwemyquhgxs',
    server:   'smtp.gmail.com',  // eg: mail.gandi.net
    port: 465
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;


  // Add Facebook configuration entry
  ServiceConfiguration.configurations.update({
    "service": "google"
  }, {
    $set: {
      "clientId": "553157495789-7v8oh686td1u7du0hdd2jdp9t6fflqgm.apps.googleusercontent.com",
      "secret": "Ikpp_WkPQDDirxjU-_TZj6wV",
      "redirectUrl": "http://app.batonmobile.com/_oauth/google"
    }
  }, {
    upsert: true
  });

  Accounts.onCreateUser(function(options, user) {
    // console.log("options", options);
    // console.log("user", user);
    if (options.profile)
      user.profile = options.profile;

    if (user.services.google != undefined) {
      var isRegister= Meteor.users.find({"emails.address":user.services.google.email}).count() > 0;
      
      //TODO do we really allow user to login when them have the gmail account
      if(isRegister){
        var userProfile = Meteor.users.find({"emails.address":user.services.google.email}).fetch()[0];
        // add goole service credential to the account profile
        userProfile.services.google = user.services.google;
        // remove the existing user
        Meteor.users.remove({"_id":userProfile._id});
        
        //create the new user
        return userProfile;
      } else {
        // setup user profile by using google account profile info
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
    }
    return user;
  });
});
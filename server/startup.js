import GitHubAPI from 'github';

Meteor.startup(function() {
  var GitHubApi = require("github");
  GlobalVar.github = new GitHubApi({
    version: "3.0.0", // required
    timeout: 5000 // optional
  });

  var githubSettings = Meteor.settings.private.github;

  // github.authenticate({
  //   type: "oauth",
  //   key: "aa60e659ab63ad7cae23",
  //   secret: "896cfe17d05f518a5a89e2bd140410d143d66868"
  // });

  GlobalVar.github.authenticate({
    type: "token",
    token: githubSettings.userToken
  });


  SyncedCron.add({
    name: 'Sync up the github Issue state',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('at 7:00am also at 7:00pm');
    },
    job: function() {
      return ServerJobBoss.syncUpGithubIssue();
    }
  });
  SyncedCron.start();

  WebApp.connectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  });

  smtp = {
    username: 'info@batonmobile.com',
    password: Meteor.settings.private.smtp.password,
    server: 'smtp.gmail.com', // eg: mail.gandi.net
    port: 465
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;


  // Add Google configuration entry
  ServiceConfiguration.configurations.upsert({
    "service": "google"
  }, {
    $set: {
      "clientId": Meteor.settings.private.google.clientId,
      "secret": Meteor.settings.private.google.secret,
      "redirectUrl": "http://app.batonmobile.com/_oauth/google?close",
    }
  });

  Accounts.onCreateUser(function(options, user) {
    // console.log("options", options);
    console.log("user", user);
    if (options.profile)
      user.profile = options.profile;

    if (user.services.google != undefined) {
      var isRegister = Meteor.users.find({
        "emails.address": user.services.google.email
      }).count() > 0;

      //TODO do we really allow user to login when them have the gmail account
      if (isRegister) {
        var userProfile = Meteor.users.find({
          "emails.address": user.services.google.email
        }).fetch()[0];
        // add goole service credential to the account profile
        userProfile.services.google = user.services.google;
        // remove the existing user
        Meteor.users.remove({
          "_id": userProfile._id
        });

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
    user.profile.firstTimeLogin = true;
    return user;
  });
});
import GitHubAPI from 'github';
var GitHubApi = require("github");
var github = new GitHubApi({
  version: "3.0.0", // required
  timeout: 5000 // optional
});

var githubSettings = Meteor.settings.private.github;

// github.authenticate({
//   type: "oauth",
//   key: "aa60e659ab63ad7cae23",
//   secret: "896cfe17d05f518a5a89e2bd140410d143d66868"
// });

github.authenticate({
  type: "token",
  token: githubSettings.userToken
});

// Meteor Method at server sides
Meteor.methods({
  setUserAsTeacher:function(userId){
    if(isAdminAccount(Meteor.userId()))
    {
      Meteor.users.update({_id:userId},{$set:{userType:Schemas.userType.teacher}})
    }
  },
  removeFistTimeFlag:function(){
    var updateFlagSync = Meteor.wrapAsync(Meteor.users.update, Meteor.users);
    var res = updateFlagSync({_id:Meteor.userId(),"profile.firstTimeLogin":true},{$set:{"profile.firstTimeLogin":false}});
    return res;
  },
  resetClassroom:function(classroomId){
    console.log(classroomId);
    if(isClassroomBlongTo(Meteor.userId(),classroomId))
    {
      console.log("teacher reset");
      TicketsInfo.update({cid:classroomId},{$set:{status:Schemas.ticketStatus.dismissed}});
    }
  },
  isEmailExist:function(email){
    return !!Meteor.users.findOne({"emails.address":email});
  },
  cancelTicket:function(ticketId){
    if(isTicketBelongTo(Meteor.userId(),ticketId)){
      return TicketsInfo.remove({_id:ticketId});  
    }
    return 0;
  },
  checkClassroomShortcode:function(shortCode){
    console.log(shortCode);
    return ClassroomsInfo.findOne({"shortcode.shortcode":shortCode});
  },
  getClassroomShortcode:function(classroomId){
    if(isClassroomBlongTo(Meteor.userId(),classroomId)){
      return ClassroomsInfo.findOne({_id:classroomId}).shortcode.shortcode;
    } else {
      return "";
    }
  },
  switchRole:function(userType){
    if(!_.contains([Schemas.userType.teacher, Schemas.userType.student],userType)) return false;
    Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.userType":userType}});
  },
  removeAchievement:function(achievementId){
    if(Achievement.findOne({_id:achievementId}).uid === Meteor.userId()){
      return Achievement.remove({_id:achievementId});
    }
    return 0;
  },
  updateUserDefaultLangCode:function(langCode){
    if(!!Meteor.user()){
      Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.defaultLangCode":langCode}});
    }
  },
  insertMessage: function(message) {
    message.owner = Meteor.userId();
    if(isSysAdminAccount(Meteor.userId())) message.owner = GlobalVar.feedbackAdminID;

    if (message.destination !== message.owner) {
      if (message.isDirect) {
        message.to = message.destination;
      } else {
        message.channel = message.destination;
      }
      delete message.destination;
      delete message.isDirect;
      Message.insert(message);
    }
  },
  markMsgAsRead:function(message){
    // only receiver can view
    if(message.to === Meteor.userId() || isSysAdminAccount(Meteor.userId())){
      Message.update({_id:message._id},{$set:{isRead:true}});
      return true;
    } else {
      return false;
    }
  },
  insertIssue: function(issue) {
    if(!isSysAdminAccount(Meteor.userId())) return false;

    var createIssue = Meteor.wrapAsync(github.issues.create);
    var res = createIssue({
      owner: githubSettings.ownerName,
      repo: githubSettings.repo,
      title: issue.description,
      labels: ["feedback"]
    });

    issue.giid = res.data.number;
    issue.gitRepoOwnerName = githubSettings.ownerName;
    issue.gitRepo = githubSettings.repo;

    // issue.giid = "0";
    Issue.insert(issue);
    return true;
  },
  // For now we store duplicate issue data to represent association
  // in the future, we should separate issue and association
  associateIssue: function(userId, issueID){
    var issue = Issue.findOne({_id:issueID});
    if( !!!issue 
      || userId === issue.uid 
      || issue.state === Schemas.IssueState.closed
      || !!Issue.findOne({giid:issue.giid, uid:userId}) ) return false; 

    issue.uid = userId;
    delete issue._id;
    Issue.insert(issue);

    return true;
  },
  createGitHubIssue: function(issue){
    var createIssue = Meteor.wrapAsync(github.issues.create);
    return createIssue({
      owner: githubSettings.ownerName,
      repo: githubSettings.repo,
      title: issue.description,
      labels: ["feedback"]
    });

    // github.issues.create({
    //   owner: "VictorChenLi",
    //   repo: "BatonMeteor",
    //   title: issue.description,
    //   labels: ["feedback"]
    // }, function(err, res) {
    //   if (err) {
    //     console.log(err.toJSON());
    //   } else {
    //     // _.each(res.data, function(issue){
    //     //   console.log(issue.body);
    //     // })
    //     console.log(res);
    //   }
    // });
  },
  getAllGitHubIssue: function() {
    // console.log(github);

    // github.issues.getForRepo({
    //   owner: "victorchenli",
    //   repo: "BatonMeteor",
    //   labels: "feedback"
    // }, function(err, res) {
    //   if (err) {
    //     console.log(err.toJSON());
    //   } else {
    //     _.each(res.data, function(issue){
    //       console.log(issue.body);
    //     })
    //   }
    // });
    var SyncFun = Meteor.wrapAsync(github.issues.getForRepo);
    return SyncFun({
      owner: "victorchenli",
      repo: "BatonMeteor",
      labels: "feedback"
    });

    // github.user.getFollowingFromUser({
    //     user: "ndhoule"
    // }, function(err, res) {
    //     console.log(JSON.stringify(res));
    // });

    // github.issues.getMilestones({
    //   owner: "mikedeboer",
    //   repo: "node-github"
    // }, function(err, res) {
    //   if (err) {
    //     console.log(err.toJSON());
    //   } else {
    //     console.log(res);
    //   }
    // });
  }
});
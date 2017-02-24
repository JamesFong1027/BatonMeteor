ServerJobBoss = {
  syncUpGithubIssue: function() {
    var issueList = DBUtil.distinctMulti(Issue, "giid", ["uid", "giid", "gitRepo", "gitRepoOwnerName", "description"], {
      state: Schemas.IssueState.open
    });

    for (var i = issueList.length - 1; i >= 0; i--) {
      var retreiveIssue = Meteor.wrapAsync(GlobalVar.github.issues.get);
      var updateIssueState = Meteor.wrapAsync(Issue.update, Issue);
      try {
        var res = retreiveIssue({
          owner: issueList[i].gitRepoOwnerName,
          repo: issueList[i].gitRepo,
          number: issueList[i].giid
        });
        if (res.data.state === Schemas.IssueState.closed) {
          var notifiedUidList = DBUtil.distinct(Issue, "uid", {
            giid: res.data.number + "",
            state: Schemas.IssueState.open
          });
          for (var j = notifiedUidList.length - 1; j >= 0; j--) {
            // insert the resolve reply message
            var resolveMsg = {
              to: notifiedUidList[j],
              owner: GlobalVar.feedbackAdminID,
              message: TAPi18n.__("issue_resolve_message", {
                userName: Meteor.users.findOne({_id: notifiedUidList[j]}).profile.firstName,
                issueDesc: issueList[i].description
              }),
              isRead: false
            };
            Message.insert(resolveMsg);
          }

          updateIssueState({
            giid: res.data.number + ""
          }, {
            $set: {
              state: Schemas.IssueState.closed
            }
          }, {
            multi: true
          });
        }
      } catch (err) {
        console.log(err);
        return false;
      }
    }

    return true;
  }
}
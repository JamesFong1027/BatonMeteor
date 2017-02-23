ServerJobBoss = {
  syncUpGithubIssue: function() {
    var issueList = DBUtil.distinctMulti(Issue, "giid", ["giid", "gitRepo", "gitRepoOwnerName"], {
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
        console.log(res.data.state);
        if (res.data.state === Schemas.IssueState.closed) {
          console.log(res.data.number, " need update");
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
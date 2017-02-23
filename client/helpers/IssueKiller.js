IssueKiller = {
	InsertIssue: function(uid, state, description, callback) {
		var issue = {
			uid: uid,
			state: state,
			description: description
		};

		Meteor.call('insertIssue', issue, callback);
	},
	associateIssue:function(uid, issueID, callback){
		Meteor.call('associateIssue', uid, issueID, callback);
	},
	getIssueListing: function(userId) {
		if (!!userId) {
			return Issue.find({
				uid: userId
			});
		} else {
			return Issue.find();
		}
	}
}
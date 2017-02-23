ChatCat = {
	InsertMsg: function(destination, isDirect, content, onsuccess, onfailure) {
		var message = {
			destination: destination,
    		isDirect: isDirect,
    		message: content.replace(/#/g, '&#35;').replace(/(!\[.*?\]\()(.*?)(\))+/g, '&#33;&#91;&#93;&#40;&#41;'),
    		isRead: false
		};
		console.log(message);
		Meteor.call('insertMessage', message, function(error) {
			if (error) {
				onfailure();
			} else {
				onsuccess();
			}
		});
	},
	MarkMsgAsRead: function(message){
		// only when message is not read and it's sent to me
		if(!!!message.isRead) {
			Meteor.call("markMsgAsRead", message);
		}
	},
	getChatListingPeople: function(curUserId, withIssueNum){
		if(!!!curUserId) curUserId = Meteor.userId();

		var listingPeople = new Array();
		var groupData = DBUtil.groupBy(Message, "owner", { owner: { $ne: curUserId } });
		for (var i = groupData.length - 1; i >= 0; i--) {
			var msgOwnerUserId = groupData[i][0];
			var people = new Object();
			people.userObj = Meteor.users.findOne({_id:msgOwnerUserId});
			people.latestMsg = Message.findOne({owner:msgOwnerUserId},{sort:{timestamp:-1}});
			people.unreadNum = Message.find({owner:msgOwnerUserId,isRead:false}).count();
			// TODO use github or something to track the issue
			if(withIssueNum){
				people.issueNum = Issue.find({uid:msgOwnerUserId, state: Schemas.IssueState.open}).count();
				people.solvedNum = Issue.find({uid:msgOwnerUserId, state: Schemas.IssueState.closed}).count();
			}
			listingPeople.push(people);
		}

		return listingPeople;
	}
}
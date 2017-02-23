Template.feedbackChat.helpers({
	chatRoomArg:function(){
		return {
			channel: GlobalVar.feedbackAdminID,
			isDirect: true,
			curUserId: Meteor.userId()
		};
	},
});
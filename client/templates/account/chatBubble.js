Template.chatBubble.helpers({
	userName:function(userId){
		if(Meteor.userId() === userId){
			return "me";
		} else {
			return "Feedback Admin";
		}
	},
	isMe: function(userId){
		return Meteor.userId() === userId;
	}
});
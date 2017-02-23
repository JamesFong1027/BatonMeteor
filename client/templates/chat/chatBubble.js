Template.chatBubble.helpers({
	userName:function(userId){
		if(Meteor.userId() === userId){
			return "me";
		} else {
			return "Feedback Admin";
		}
	},
	isMe: function(userId){
		return this.curUserId === userId;
	},
	messageTimestamp: function(timestamp) {
		if (timestamp) {
			var today = moment().format('YYYY-MM-DD'),
				datestamp = moment(timestamp).format('YYYY-MM-DD'),
				isBeforeToday = moment(today).isAfter(datestamp),
				format = isBeforeToday ? 'MMMM Do, YYYY hh:mm a' : 'hh:mm a';
			return moment(timestamp).format(format);
		}
	}
});
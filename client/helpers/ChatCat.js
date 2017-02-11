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
		if(!!!message.isRead && message.to === Meteor.userId()) {
			Meteor.call("markMsgAsRead", message);
		}
	}
}
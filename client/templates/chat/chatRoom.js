Template.chatRoom.onCreated(function() {

});

Template.chatRoom.onRendered(function(){
	var msgBox = Template.instance().$(".msgInputBox");
	new autoExpandableTextarea(msgBox);
	
	this.autorun(function(){
		var dataContext = Template.currentData();
		if(!!!dataContext) return;

		// console.log(dataContext);
		Template.instance().subscribe('channel', dataContext.isDirect, dataContext.channel);
		setTimeout(function(){
			$('#messages').animate({scrollTop: $("#messages")[0].scrollHeight}, 1000, "swing");
		}, 0);
	});
});

Template.chatRoom.helpers({
	hasData:function(){
		var dataContext = Template.currentData();
		return !!dataContext && !!dataContext.channel;
	},
	messages: function() {
		if(!!!this.channel || !!!this.isDirect) return [];
		
		var messages = [];
		if (this.isDirect) {
			var toUserId = this.channel;
			messages = Message.find({
				$or: [{ to: toUserId }, { owner: toUserId }]
			});
		} else {
			var selectedChannel = Channels.findOne({ name: this.channel });
			messages = Message.find({ channel: selectedChannel._id });
		}

		var previousMessage;
		return messages.map(function(message) {
			if (!!previousMessage) {
				var previous = moment(previousMessage.timestamp),
					current = moment(message.timestamp);
				message.showHeader = moment(current).diff(previous, 'minutes') >= 60;
			} else {
				message.showHeader = true;
			}
			previousMessage = message;
			// mark message as read
			ChatCat.MarkMsgAsRead(message);
			return message;
		});
	},
	toChannel: function(){
		if(this.isDirect){
			var toUserId = this.channel;
			var toUser = Meteor.users.findOne({_id:toUserId});
			if(!!toUser)  return toUser.profile.firstName + " " + toUser.profile.lastName;
		} else {
			var selectedChannel = Channels.findOne({ name: this.channel });
			return selectedChannel.name;
		}
	},
	chatBubbleArg: function(message){
		return {
			curUserId: Template.instance().data.curUserId,
			message: message
		};
	}
});

Template.chatRoom.events({
	'keydown .msgInputBox': function(event, template) {
		if(event.keyCode === 13){
			event.preventDefault();
			postFeedBack(event.currentTarget, this.channel, this.isDirect);
		}
	},
	'keyup .msgInputBox':function(event,template){
		$(".send").toggleClass("ready",!!event.currentTarget.value);
	},
	'click .send':function(event, template){
		postFeedBack(template.$(".msgInputBox")[0], this.channel, this.isDirect);
		return false;
	}
});

function postFeedBack(msgBox, channel, isDirect){
	if(!!!msgBox) return;

	var feedbackStr = msgBox.value.trim();
	if(feedbackStr !== ''){
		ChatCat.InsertMsg(channel, isDirect, feedbackStr, function() {
			$(msgBox).val('').trigger('change');
			$('#messages').animate({scrollTop: $("#messages")[0].scrollHeight}, 1000, "swing");
		});
	}
	msgBox.focus();
}

function autoExpandableTextarea() {
	var $placeholder;
	var $textarea;
	var $textareaRows;
	
	function constructor($aTextarea) {
		$placeholder = $('<div class="' + $aTextarea[0].classList + '"></div>');
		
		$placeholder.css({
			'word-wrap' : 'break-word',
			'white-space' : 'pre-wrap',
			'opacity' : '0',
			'pointer-events' : 'none',
			'position' : 'absolute',
			'overflow': 'hidden'
		});
		
		$textarea = $aTextarea;
		$textareaRows = $textarea.attr('rows');

		insertPlaceholder();
		setEvents();
	}
	
	function insertPlaceholder() {
		$placeholder.insertAfter($textarea);
	}
	
	function autoExpand() {
		var input = $textarea.val().replace(/\n/g, "<br>");
		
		input = fixLinebreaks(input);
	
		$placeholder.html(input);
	
		var height = $placeholder.height();
		var lineHeight = window.getComputedStyle($placeholder[0]).lineHeight.match(/[0-9]+/)[0]|0;
		var rows = Math.min(5, Math.max($textareaRows, Math.round(height / lineHeight)));
		$textarea.attr('rows', rows);
		// prevent placeholder expand higher than textarea
		if(rows === 5){
			$placeholder.height($textarea.height());
		}
	}
	
	function fixLinebreaks(input) {
		if(input.slice(-4) === "<br>")
			input += "_"
		
		return input;
	}
	
	function setEvents() {
		$textarea.on('input change', function(){
			autoExpand();
		});
	}
	
	constructor.apply(this, arguments);
}
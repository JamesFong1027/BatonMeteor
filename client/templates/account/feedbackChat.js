Template.feedbackChat.onCreated(function() {
	Template.instance().subscribe('channel', true, GlobalVar.feedbackAdminID, function(){
		$('#messages').animate({scrollTop: $("#messages")[0].scrollHeight}, 1000, "swing");
	});
});

Template.feedbackChat.onRendered(function(){
	var msgBox = Template.instance().$(".msgInputBox");
	console.log(new autoExpandableTextarea(msgBox));
});

Template.feedbackChat.helpers({
	username: function() {
		return "Feedback Admin";
	},
	messages: function() {
		var messages = Message.find({}, {
			sort: {
				timestamp: 1
			}
		});
		var previousMessage;
		return messages.map(function(message) {
			if (!!previousMessage && previousMessage.owner === message.owner) {
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
	userName:function(userId){
		if(Meteor.userId() === userId){
			return "me";
		} else {
			return GlobalVar.feedbackAdminID;
		}
	}
});

Template.feedbackChat.events({
	'keyup .msgInputBox': function(event, template) {
		if(event.keyCode === 13){
			postFeedBack(event.currentTarget);
		}
	},
	'click .send':function(event, template){
		postFeedBack(template.$(".msgInputBox")[0]);
		return false;
	}
});

function postFeedBack(msgBox){
	if(!!!msgBox) return;

	var feedbackStr = msgBox.value.trim();
	if(feedbackStr !== ''){
		ChatCat.InsertMsg(GlobalVar.feedbackAdminID, true, feedbackStr, function() {
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
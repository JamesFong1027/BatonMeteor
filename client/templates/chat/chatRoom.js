Template.chatRoom.onCreated(function() {
	console.log(this.data);
	if(!!!this.data) this.data = new Object();

	Template.instance().subscribe('channel', this.data.isDirect, this.data.channel);
});

Template.chatRoom.onRendered(function(){
	$('#messages').animate({scrollTop: $("#messages")[0].scrollHeight}, 1000, "swing");
	var msgBox = Template.instance().$(".msgInputBox");
	new autoExpandableTextarea(msgBox);
	// $msgBox.on('change', function(){
	// 	if(!!event.target.value){

	// 	}
	// });
});

Template.chatRoom.helpers({
	messages: function() {
		var messages = Message.find({}, {
			sort: {
				timestamp: 1
			}
		});
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
	userName:function(userId){
		if(Meteor.userId() === userId){
			return "me";
		} else {
			return GlobalVar.feedbackAdminID;
		}
	}
});

Template.chatRoom.events({
	'keydown .msgInputBox': function(event, template) {
		if(event.keyCode === 13){
			event.preventDefault();
			postFeedBack(event.currentTarget);
		}
	},
	'keyup .msgInputBox':function(event,template){
		$(".send").toggleClass("ready",!!event.currentTarget.value);
		// console.log(!!event.currentTarget.value);
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
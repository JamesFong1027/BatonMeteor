Template.studentTalk.onCreated(function() {
	console.log("in onCreated");
	var template = this;
	template.sender = new ReactiveVar(new TicketSenderPanel(template));
	template.curClassroomInfo = new ReactiveVar(null);
});

Template.studentTalk.onRendered(function() {
	Session.set('ionTab.current', "studentTalk");
	var template = this;
	template.curClassroomInfo.set(ClassroomKicker.checkCurrentClassBySessionType(Meteor.userId,Schemas.sessionType.attending));
	if(!!template.curClassroomInfo.get())
		Meteor.subscribe('ticketsInfoDetail', template.curClassroomInfo.get()._id);
});

Template.studentTalk.helpers({
	"hasCurClassroom": function() {
		return !!Template.instance().curClassroomInfo.get();
	},
	classroom: function() {
		return Template.instance().curClassroomInfo.get();
	},
	"ticketList": function() {
		console.log("in ticketList helper");
		return TicketShutter.getClassroomBuddyList(Schemas.ticketType.talkTicket, Template.instance().curClassroomInfo.get()._id);
	},
	"afterHasClassroomTrigger": function() {
		var template = Template.instance();
		var curClassroomId = template.curClassroomInfo.get()._id;
		if (!!!template.curClassroomInfo.get())
			return;

		// template.sender.get().removeClassroomWatcher();
		template.sender.get().addClassroomWatcher(Schemas.ticketType.talkTicket, curClassroomId);
		// template.sender.get().runWhenViewReady(ClassroomKicker.showFirstTimeGuide);
		ClassroomKicker.showFirstTimeGuide();
	}
});

Template.studentTalk.onDestroyed(function() {
	this.sender.get().removeClassroomWatcher();
});

Template.studentTalk.events({
	"click #build.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.buildOn,Template.instance().curClassroomInfo.get()._id);
	},
	"click #new_idea.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.newIdea,Template.instance().curClassroomInfo.get()._id);
	},
	"click #question.active": function() {
		console.log("click on question");
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.question,Template.instance().curClassroomInfo.get()._id);
	},
	"click #challenge.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.challenge,Template.instance().curClassroomInfo.get()._id);
	},
	"click .flipCircle-container.active": function(event, template) {
		if(!document.getElementById('menu-toggler').checked) return;

		console.log("click on back");
		$(".flipCircle-container.active .check_icon").toggleClass("active");
		Meteor.setTimeout(function(){
			document.getElementById('menu-toggler').checked = !document.getElementById('menu-toggler').checked;
			template.sender.get().togglePanel(!document.getElementById('menu-toggler').checked);
			$(".flipCircle-container.active .check_icon").toggleClass("active",false);
		}, 1000);
	},
	"click #menu-toggler": function(event) {
		console.log("click on menu toggler");
		$(".flipCircle-container").toggleClass('active',false);
		Template.instance().sender.get().togglePanel(!event.target.checked);
	},
	"click .menu-toggler-circle": function(event) {
		console.log("click on menu toggler circle");
		$(".flipCircle-container").toggleClass('active',false);
		var curCheckStatus = document.getElementById('menu-toggler').checked;
		document.getElementById('menu-toggler').checked = !curCheckStatus;
		Template.instance().sender.get().togglePanel(curCheckStatus);
	},
	"click .flipCircle-container .front":function(event){
		if(!document.getElementById('menu-toggler').checked) return;

		console.log("click on front");
		// var curState = $(event.currentTarget).hasClass("active");
		$(".flipCircle-container").toggleClass('active',false);
		$(event.currentTarget).closest(".flipCircle-container").toggleClass('active',true);
	}
});
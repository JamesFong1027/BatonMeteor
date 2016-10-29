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
	"click #build": function() {
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.buildOn,Template.instance().curClassroomInfo.get()._id);
	},
	"click #new_idea": function() {
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.newIdea,Template.instance().curClassroomInfo.get()._id);
	},
	"click #question": function() {
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.question,Template.instance().curClassroomInfo.get()._id);
	},
	"click #challenge": function() {
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.challenge,Template.instance().curClassroomInfo.get()._id);
	},
	"click #add-circle": function() {
		// Template.instance().sender.addCircle();
	},
	"click .talktab-menu-item": function() {
		console.log("click on menu");
		document.getElementById('menu-toggler').checked = !document.getElementById('menu-toggler').checked;
		Template.instance().sender.get().togglePanel(!document.getElementById('menu-toggler').checked);
	},
	"click #menu-toggler": function(event) {
		console.log("click on menu toggler");
		Template.instance().sender.get().togglePanel(!event.target.checked);
	},
	"click .menu-toggler-circle": function(event) {
		console.log("click on menu toggler circle");
		document.getElementById('menu-toggler').checked = !document.getElementById('menu-toggler').checked;
		Template.instance().sender.get().togglePanel(!event.target.checked);
	}
});
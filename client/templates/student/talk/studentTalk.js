Template.studentTalk.onCreated(function() {
	console.log("in onCreated");
	var template = this;
	template.sender = new ReactiveVar(new TicketSenderPanel(template));
});

Template.studentTalk.onRendered(function() {
	console.log("in studentTalk onRendered");
	Session.set('ionTab.current', "studentTalk");
	Session.set("curMode", Schemas.ticketType.talkTicket);
});

Template.studentTalk.helpers({
	"hasCurClassroom": function() {
		return !!Template.instance().data;
	},
	classroom: function() {
		return ClassroomKicker.getClassroomInfo(Template.instance().data);
	},
	"ticketList": function() {
		console.log("in ticketList helper");
		return TicketShutter.getClassroomBuddyList(Session.get("curMode"), Session.get("curClassroomId"));
	},
	"afterHasClassroomTrigger": function() {
		var template = Template.instance();
		var curClassroomId = template.data;
		if (!!!curClassroomId || !!!ClassroomKicker.getCurrentAttendingClassroom())
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
		TicketShutter.sendTicketAuto(Schemas.talkTicketValue.buildOn);
	},
	"click #new_idea": function() {
		TicketShutter.sendTicketAuto(Schemas.talkTicketValue.newIdea);
	},
	"click #question": function() {
		TicketShutter.sendTicketAuto(Schemas.talkTicketValue.question);
	},
	"click #challenge": function() {
		TicketShutter.sendTicketAuto(Schemas.talkTicketValue.challenge);
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
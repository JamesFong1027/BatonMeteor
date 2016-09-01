Template.studentWork.onCreated(function() {
	var template = this;
	template.sender = new ReactiveVar(new TicketSenderPanel(template));
	console.log("on Create");
});

Template.studentWork.onRendered(function() {
	console.log("in studentWork onRendered");
	Session.set('ionTab.current', "studentWork");
	Session.set("curMode", Schemas.ticketType.workTicket);
});

Template.studentWork.helpers({
	"hasCurClassroom": function() {
		return !!Template.instance().data;
	},
	classroom: function() {
		return ClassroomKicker.getClassroomInfo(Session.get("curClassroomId"));
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

		template.sender.get().addClassroomWatcher(Schemas.ticketType.workTicket, curClassroomId);
	}
});

Template.studentWork.onDestroyed(function() {
	this.sender.get().removeClassroomWatcher();
});

Template.studentWork.events({
	"click #numOne": function() {
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.one);
	},
	"click #numTwo": function() {
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.two);
	},
	"click #numThree": function() {
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.three);
	},
	"click #numFour": function() {
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.four);
	},
	"click #numFive": function() {
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.five);
	},
	"click #numSix": function() {
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.six);
	},
	"click #numSeven": function() {
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.seven);
	},
	"click #numEight": function() {
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.eight);
	},
	"click #numNine": function() {
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.nine);
	},
	"click #numTen": function() {
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.ten);
	},
	"click .worktab-menu-item": function() {
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
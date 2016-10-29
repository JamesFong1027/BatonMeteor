Template.studentWork.onCreated(function() {
	var template = this;
	template.sender = new ReactiveVar(new TicketSenderPanel(template));
	template.curClassroomInfo = new ReactiveVar(null);
});

Template.studentWork.onRendered(function() {
	Session.set('ionTab.current', "studentWork");
	var template = this;
	template.curClassroomInfo.set(ClassroomKicker.checkCurrentClassBySessionType(Meteor.userId,Schemas.sessionType.attending));
	if(!!template.curClassroomInfo.get())
		Meteor.subscribe('ticketsInfoDetail', template.curClassroomInfo.get()._id);
});

Template.studentWork.helpers({
	"hasCurClassroom": function() {
		return !!Template.instance().curClassroomInfo.get();
	},
	classroom: function() {
		return Template.instance().curClassroomInfo.get();
	},
	"ticketList": function() {
		console.log("in ticketList helper");
		return TicketShutter.getClassroomBuddyList(Schemas.ticketType.workTicket, Template.instance().curClassroomInfo.get()._id);
	},
	"afterHasClassroomTrigger": function() {
		var template = Template.instance();
		var curClassroomId = template.curClassroomInfo.get()._id;
		if (!!!template.curClassroomInfo.get())
			return;

		template.sender.get().addClassroomWatcher(Schemas.ticketType.workTicket, curClassroomId);
	}
});

Template.studentWork.onDestroyed(function() {
	this.sender.get().removeClassroomWatcher();
});

Template.studentWork.events({
	"click #numOne": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.one,Template.instance().curClassroomInfo.get()._id);
	},
	"click #numTwo": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.two,Template.instance().curClassroomInfo.get()._id);
	},
	"click #numThree": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.three,Template.instance().curClassroomInfo.get()._id);
	},
	"click #numFour": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.four,Template.instance().curClassroomInfo.get()._id);
	},
	"click #numFive": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.five,Template.instance().curClassroomInfo.get()._id);
	},
	"click #numSix": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.six,Template.instance().curClassroomInfo.get()._id);
	},
	"click #numSeven": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.seven,Template.instance().curClassroomInfo.get()._id);
	},
	"click #numEight": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.eight,Template.instance().curClassroomInfo.get()._id);
	},
	"click #numNine": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.nine,Template.instance().curClassroomInfo.get()._id);
	},
	"click #numTen": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.ten,Template.instance().curClassroomInfo.get()._id);
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
Template.ticketPanel.onCreated(function() {
	console.log("ticketPanel onCreated");
	var template = this;
	template.sender = new ReactiveVar(new TicketSenderPanel(template));
});

Template.ticketPanel.onRendered(function() {
	console.log(this.data);
	var template = this;
	if (!!!template.data.classroomInfo)
			return;
	
	// template.sender.get().removeClassroomWatcher();
	template.sender.get().addClassroomWatcher(template.data.classMode, template.data.classroomInfo._id);
	// template.sender.get().runWhenViewReady(ClassroomKicker.showFirstTimeGuide);
	// ClassroomKicker.showFirstTimeGuide();
});

Template.ticketPanel.events({
	"click #build.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.buildOn,Template.instance().data.classroomInfo._id);
	},
	"click #new_idea.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.newIdea,Template.instance().data.classroomInfo._id);
	},
	"click #question.active": function() {
		console.log("click on question");
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.question,Template.instance().data.classroomInfo._id);
	},
	"click #challenge.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.talkTicket,Schemas.talkTicketValue.challenge,Template.instance().data.classroomInfo._id);
	},
	"click #numOne.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.one,Template.instance().data.classroomInfo._id);
	},
	"click #numTwo.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.two,Template.instance().data.classroomInfo._id);
	},
	"click #numThree.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.three,Template.instance().data.classroomInfo._id);
	},
	"click #numFour.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.four,Template.instance().data.classroomInfo._id);
	},
	"click #numFive.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.five,Template.instance().data.classroomInfo._id);
	},
	"click #numSix.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.six,Template.instance().data.classroomInfo._id);
	},
	"click #numSeven.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.seven,Template.instance().data.classroomInfo._id);
	},
	"click #numEight.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.eight,Template.instance().data.classroomInfo._id);
	},
	"click #numNine.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.nine,Template.instance().data.classroomInfo._id);
	},
	"click #numTen.active": function() {
		TicketShutter.sendTicket(Schemas.ticketType.workTicket,Schemas.workTicketValue.ten,Template.instance().data.classroomInfo._id);
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

Template.ticketPanel.helpers({
	"isTalkMode": function() {
		return !!Template.instance().data && Template.instance().data.classMode === Schemas.ticketType.talkTicket;
	},
});

Template.ticketPanel.onDestroyed(function() {
	this.sender.get().removeClassroomWatcher();
});
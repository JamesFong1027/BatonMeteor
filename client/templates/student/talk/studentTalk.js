Template.studentTalk.onCreated(function() {
	console.log("in onCreated");
	var template = this;
	template.sender = new ReactiveVar(new TicketSenderPanel(template));
	// template.sender.get().init();
});

Template.studentTalk.onRendered(function() {
	console.log("in studentTalk onRendered");
	Session.set('ionTab.current', "studentTalk");

	var template = Template.instance();
	// auto close the classroom
	Tracker.autorun(function(c) {
		var curClassroomId = Router.current().state.get('studentTalkClassId');
		if(!curClassroomId)
			return;

		var curClassroom = ClassroomKicker.getClassroomInfo(curClassroomId);
		console.log(curClassroomId);
		console.log(curClassroom);
		if (!curClassroom)
			return;

		if (curClassroom.status !== Schemas.classroomStatus.close) {
			//if status is open, set the cur classroom
			Session.set("curClassroomId", curClassroomId);
			Session.set("curMode", Schemas.ticketType.talkTicket);

			console.log("create buddyListWatcher");
			template.buddyList = TicketShutter.getClassroomBuddyList(Session.get("curMode"), Session.get("curClassroomId"));
			
			template.sender.get().init();
			var buddyListWatcher = template.buddyList.observeChanges({
				added: function(id, ticketInfo) {
					console.log(ticketInfo);
					template.sender.get().addCircle(id, ticketInfo, ticketInfo.uid === Meteor.userId());
					if (template.$(".menu-toggler:checked").size() === 0) {
						template.sender.get().setPosition();
					}
				},
				removed: function(id) {
					console.log(id);
					template.sender.get().removeCircle(id);
				},
				changed: function(id, fields) {
					console.log(fields);
					if (isTicketBelongTo(Meteor.userId(), id)) {
						template.sender.get().removeCircle(id);
						var ticketInfo = TicketShutter.getTicketInfoByID(id);
						template.sender.get().addCircle(id, ticketInfo, ticketInfo.uid === Meteor.userId());
					}
				}
			});

		} else {
			//if status is close, reset cur classroom
			// and stop autorun
			Session.set("curClassroomId", undefined);
			Session.set("curMode", undefined);
			Router.go("studentTalk");
		}
	});
});

Template.studentTalk.helpers({
	"hasCurClassroom": function() {
		return Session.get("curClassroomId") !== undefined;
	},
	classroom: function() {
		return ClassroomKicker.getClassroomInfo(Session.get("curClassroomId"));
	},
	"ticketList": function() {
		console.log("in ticketList helper");
		return TicketShutter.getClassroomBuddyList(Session.get("curMode"), Session.get("curClassroomId"));
	},
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
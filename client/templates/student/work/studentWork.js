Template.studentWork.onCreated(function(){
	var template = this;
	template.sender = new ReactiveVar(new TicketSenderPanel(template));
	// template.sender.get().init();
	console.log("on Create");
});

Template.studentWork.onRendered(function(){
	console.log("in studentWork onRendered");
	Session.set('ionTab.current', "studentWork");

	var template = Template.instance();
	// auto close the classroom
	Tracker.autorun(function(c) {
		var curClassroomId = Router.current().state.get('studentWorkClassId');
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
			Session.set("curMode", Schemas.ticketType.workTicket);

			console.log("create buddyListWatcher");
			template.buddyList = TicketShutter.getClassroomBuddyList(Session.get("curMode"), Session.get("curClassroomId"));
			
			template.sender.get().init();
			template.buddyListWatcher = template.buddyList.observeChanges({
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

Template.studentWork.helpers({
  "hasCurClassroom":function(){
  	return Session.get("curClassroomId")!==undefined;
  },
  classroom:function(){
  	return ClassroomKicker.getClassroomInfo(Session.get("curClassroomId"));
  },
  "ticketList":function(){
  	console.log("in ticketList helper");
  	return TicketShutter.getClassroomBuddyList(Session.get("curMode"),Session.get("curClassroomId"));
  },
  doneTrigger: function() {
  	var template = Template.instance();
    Meteor.defer(function() {
    	template.sender.get().init();
    	console.log(template.sender.get().circles.length);
    });
    return null;
  }
});

Template.studentWork.events({
	"click #numOne":function(){
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.one);
	},
	"click #numTwo":function(){
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.two);	
	},
	"click #numThree":function(){
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.three);
	},
	"click #numFour":function(){
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.four);
	},
	"click #numFive":function(){
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.five);
	},
	"click #numSix":function(){
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.six);
	},
	"click #numSeven":function(){
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.seven);
	},
	"click #numEight":function(){
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.eight);
	},
	"click #numNine":function(){
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.nine);
	},
	"click #numTen":function(){
		TicketShutter.sendTicketAuto(Schemas.workTicketValue.ten);
	},
	"click .worktab-menu-item":function(){
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


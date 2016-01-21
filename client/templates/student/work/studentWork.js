Template.studentWork.onCreated(function(){
	console.log("in onCreated");
	var template = this;
	template.sender = new ReactiveVar(new TicketSenderPanel(template));
	// template.sender.get().init();
});

Template.studentWork.rendered = function () {
	console.log("in rendered"); 
};

Template.studentWork.onRendered(function(){
	console.log("in onRendered");
	// add a observer on getbuddylist cursor
	var buddyList = TicketShutter.getClassroomBuddyList(Session.get("curMode"),Session.get("curClassroomId"));
	var template = Template.instance();
	template.sender.get().init();
	// first initial the existing tickets
	// _.each(buddyListWatcher.fetch(),function(ticketInfo){
		// template.sender.get().addCircle();
	// });
	// second, have added callback function, to addcircle when it trigger
	var buddyListWatcher = buddyList.observeChanges({
	  added: function (id, ticketInfo) {
	  	console.log(ticketInfo);

	    template.sender.get().addCircle(id,ticketInfo,ticketInfo.uid===Meteor.userId());
	  },
	  removed: function (id) {
	    console.log(id);
	    template.sender.get().removeCircle(id);
	  },
	  changed:function(id,fields){
	  	console.log(fields);
	  	template.sender.get().removeCircle(id);
	  	var ticketInfo = TicketShutter.getTicketInfoByID(id);
	  	template.sender.get().addCircle(id,ticketInfo,ticketInfo.uid===Meteor.userId());
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
	"click #build":function(){
		TicketShutter.sendTicketAuto(Schemas.talkTicketValue.buildOn);
	},
	"click #new_idea":function(){
		TicketShutter.sendTicketAuto(Schemas.talkTicketValue.newIdea);	
	},
	"click #question":function(){
		TicketShutter.sendTicketAuto(Schemas.talkTicketValue.question);
	},
	"click #challenge":function(){
		TicketShutter.sendTicketAuto(Schemas.talkTicketValue.challenge);
	},
	"click #pickClassroom":function(){
		Router.go("classroomPickList");
	},
	"click #add-circle":function(){
		// Template.instance().sender.addCircle();
	}
});


Template.studentWork.onCreated(function(){
	Session.set("curMode",Schemas.ticketType.workTicket);
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
	console.log(buddyList.count());
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
	    if(template.$(".menu-toggler:checked").size()===0){
	    	template.sender.get().setPosition();
	    }
	  },
	  removed: function (id) {
	    console.log(id);
	    template.sender.get().removeCircle(id);
	  },
	  changed:function(id,fields){
	  	console.log(fields);
	  	if(isTicketBelongTo(Meteor.userId(),id)){
		  	template.sender.get().removeCircle(id);
		  	var ticketInfo = TicketShutter.getTicketInfoByID(id);
		  	template.sender.get().addCircle(id,ticketInfo,ticketInfo.uid===Meteor.userId());
	  	}
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
		Template.instance().$('.menu-toggler').trigger("click");
	},
	"click #menu-toggler":function(event){
		Template.instance().sender.get().togglePanel(!event.target.checked);
	}
});


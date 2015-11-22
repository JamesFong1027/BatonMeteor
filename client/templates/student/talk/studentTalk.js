Template.studentTalk.onCreated(function(){
	
});

Template.studentTalk.rendered = function () {
};

Template.studentTalk.helpers({
  "hasCurClassroom":function(){
  	return Session.get("curClassroomId")!==undefined;
  },
  classroomName:function(){
  	return ClassroomKicker.getClassroomInfo(Session.get("curClassroomId")).name;
  }
});

Template.studentTalk.events({
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
});
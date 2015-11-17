Template.studentTalk.onCreated(function(){
	
});

Template.studentTalk.rendered = function () {
};

Template.studentTalk.helpers({
  
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
});
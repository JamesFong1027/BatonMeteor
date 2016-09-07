Template.classRecord.onCreated(function(){
  	var template = this;
	template.SessionMode = new ReactiveVar(true);
});

Template.classRecord.onRendered(function(){
});


Template.classRecord.helpers({
	"modalTitle":function(){
		return Template.instance().SessionMode ? "Current session" : "Whole class";
	},
	"userRecords": function () {
		return TicketShutter.getCurClassroomStudentList(Session.get("curClassroomId"), Template.instance().SessionMode.get() ? ClassroomKicker.getCurrentClassSession(Session.get("curClassroomId")) : null);
	},
	"isTalkTicket":function(ticketInfo){
		return !!ticketInfo && ticketInfo.ticketType === Schemas.ticketType.talkTicket;
	}
});

Template.classRecord.events({
	"click .viewToggle":function(event){
		Template.instance().SessionMode.set(!event.target.checked);
	}
})
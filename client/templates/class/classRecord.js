Template.classRecord.onCreated(function(){
  
});

Template.classRecord.helpers({
	"userRecords": function () {
	    return TicketShutter.getCurClassroomStudentList(Session.get("curClassroomId"));
	},
	"isTalkTicket":function(ticketInfo){
		console.log(ticketInfo);
		return !!ticketInfo && ticketInfo.ticketType === Schemas.ticketType.talkTicket;
	}
});
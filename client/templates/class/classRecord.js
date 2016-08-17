Template.classRecord.onCreated(function(){
  
});

Template.classRecord.helpers({
	"ticketRecords": function () {
	    return TicketShutter.getClassroomTicketRecordList(Session.get("curClassroomId"));
	},
	"isTalkTicket":function(ticketType){
		return ticketType === Schemas.ticketType.talkTicket;
	}
});
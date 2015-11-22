Template.teacherTalk.onCreated(function(){
  Session.set("curMode",Schemas.ticketType.talkTicket);
});

Template.teacherTalk.helpers({
  tickets: function () {
    return TicketShutter.getClassroomTicketList(Session.get("curMode"),Session.get("curClassroomId"));
  },
  "classroomName":function(){
  	 return ClassroomKicker.getCurrentClassroom().name;
  },
  "hasCurClassroom":function(){
  	return ClassroomKicker.getCurrentClassroom();
  },
});

Template.teacherTalk.events({
  "click #createClassroom": function(){
    
  },
});

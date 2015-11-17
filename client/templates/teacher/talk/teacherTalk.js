Template.teacherTalk.onCreated(function(){
  Session.set("curMode",Schemas.ticketType.talkTicket);
});

Template.teacherTalk.helpers({
  tickets: function () {
    return TicketShutter.getClassroomTicketList(Session.get("curMode"),Session.get("curClassroomId"));
  },
});

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
  longHoldGesture:{
    'press .avatar': function (event, templateInstance) {
      /* `event` is the Hammer.js event object */
      /* `templateInstance` is the `Blaze.TemplateInstance` */
      /* `this` is the data context of the element in your template */
      console.log(event);
      var ticketId = event.target.id;
      TicketShutter.selectTicket(ticketId);
    },
  }
});

Template.teacherTalk.events({
  "click #createClassroom": function(){
    
  },
});

Template.teacherWork.onCreated(function(){
  this.curClassroomInfo = new ReactiveVar(null);
});

Template.teacherWork.onRendered(function(){
  Session.set('ionTab.current', "teacherWork");
  this.curClassroomInfo.set(ClassroomKicker.checkCurrentClassBySessionType(Meteor.userId,Schemas.sessionType.hosting));
});


function getRGB(workTicketValue){
  var red;
  var green;
  var blue = 0;
  if(workTicketValue<=5){
    red = Math.round(workTicketValue*51);
    green=255;
  }
  if(workTicketValue>5){
    green = 255 - Math.round((workTicketValue-5)*51);
    red = 255;
  }

  return "background-color: rgba("+red+","+green+","+blue+",0.8);"
}

Template.teacherWork.helpers({
  "afterRenderTrigger":function(){
  },
  "tickets": function () {
    return TicketShutter.getClassroomTicketList(Schemas.ticketType.workTicket,Template.instance().curClassroomInfo.get()._id, ClassroomKicker.getCurrentClassSession(Template.instance().curClassroomInfo.get()._id));
  },
  "changeColor":function(ticketValue){
    return getRGB(ticketValue);
  },
  "getIntentIconClass":function(intent){
    var iconClass="icon ";
    switch(intent){
        case Schemas.talkTicketValue.buildOn:
          iconClass+= GlobalVar.intentIcon.buildOn;
          break;
        case Schemas.talkTicketValue.newIdea:
          iconClass+= GlobalVar.intentIcon.newIdea;
          break;
        case Schemas.talkTicketValue.challenge:
          iconClass+= GlobalVar.intentIcon.challenge;
          break;
        case Schemas.talkTicketValue.question:
          iconClass+= GlobalVar.intentIcon.question;
          break;
      }
      return iconClass;
  },
  "classroomName":function(){
  	 return Template.instance().curClassroomInfo.get().name;
  },
  "hasCurClassroom":function(){
  	return !!Template.instance().curClassroomInfo.get();
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

Template.teacherWork.events({
  "click #createClassroom": function(){
    
  },
});
